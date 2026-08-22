import {
  applyAuthoritativePaymentEvent,
  normalizeAuthoritativePaymentEvent,
  paymentIdentityKey,
  providerEventIdentityKey,
  type AuthoritativePaymentEvent,
  type EntitlementCommand,
  type PaymentEntitlementState,
  type PaymentOrderState,
} from "./payment-entitlement";

type ExecutableEntitlementCommand = Exclude<EntitlementCommand, { type: "none" }>;

export type RecordedPaymentEvent = {
  key: string;
  event: AuthoritativePaymentEvent;
  recordedAt: string;
};

export type EntitlementOutboxItem = {
  id: string;
  provider: string;
  command: ExecutableEntitlementCommand;
  createdAt: string;
  deliveredAt?: string;
};

export type PaymentLedgerSnapshot = {
  events: Record<string, RecordedPaymentEvent>;
  orders: Record<string, PaymentOrderState>;
  outbox: Record<string, EntitlementOutboxItem>;
};

export type PaymentLedgerProcessResult = {
  outcome: "applied" | "duplicate_event" | "no_change";
  command: EntitlementCommand;
  eventKey: string;
  order?: PaymentOrderState;
  outboxItem?: EntitlementOutboxItem;
};

/**
 * A production adapter must implement every callback invocation as one database
 * transaction. Event insertion and outbox insertion must use durable UNIQUE
 * constraints rather than a read-then-write convention alone.
 */
export interface PaymentLedgerTransaction {
  hasEvent(key: string): Promise<boolean> | boolean;
  insertEvent(record: RecordedPaymentEvent): Promise<boolean> | boolean;
  getPayment(provider: string, paymentId: string): Promise<PaymentOrderState | undefined> | PaymentOrderState | undefined;
  getOrderBinding(provider: string, orderId: string): Promise<PaymentOrderState | undefined> | PaymentOrderState | undefined;
  putPayment(order: PaymentOrderState): Promise<void> | void;
  getOutbox(id: string): Promise<EntitlementOutboxItem | undefined> | EntitlementOutboxItem | undefined;
  insertOutbox(item: EntitlementOutboxItem): Promise<boolean> | boolean;
  putOutbox(item: EntitlementOutboxItem): Promise<void> | void;
}

export interface PaymentLedgerStore {
  transaction<T>(work: (transaction: PaymentLedgerTransaction) => Promise<T> | T): Promise<T>;
}

export function emptyPaymentLedgerSnapshot(): PaymentLedgerSnapshot {
  return { events: {}, orders: {}, outbox: {} };
}

function cloneSnapshot(snapshot: PaymentLedgerSnapshot): PaymentLedgerSnapshot {
  return {
    events: Object.fromEntries(
      Object.entries(snapshot.events).map(([key, record]) => [key, { ...record, event: { ...record.event } }]),
    ),
    orders: Object.fromEntries(
      Object.entries(snapshot.orders).map(([key, order]) => [key, { ...order }]),
    ),
    outbox: Object.fromEntries(
      Object.entries(snapshot.outbox).map(([key, item]) => [key, { ...item, command: { ...item.command } }]),
    ),
  };
}

function outboxId(provider: string, command: ExecutableEntitlementCommand) {
  const parts = [provider, command.orderId, command.paymentId, command.type].map(encodeURIComponent);
  return parts.join("/");
}

function isExecutable(command: EntitlementCommand): command is ExecutableEntitlementCommand {
  return command.type === "grant" || command.type === "revoke";
}

function transitionState(
  previousPayment: PaymentOrderState | undefined,
  orderBinding: PaymentOrderState | undefined,
): PaymentEntitlementState {
  const orders: Record<string, PaymentOrderState> = {};
  for (const order of [previousPayment, orderBinding]) {
    if (!order) continue;
    orders[paymentIdentityKey(order.provider, order.paymentId)] = { ...order };
  }
  return { processedEventKeys: [], orders };
}

/**
 * Convert one authoritative provider event into durable payment/order state and
 * an entitlement outbox command. Nothing is sent to the entitlement system in
 * this function: commit first, then deliver the outbox idempotently.
 */
export async function processAuthoritativePaymentEvent(
  store: PaymentLedgerStore,
  input: AuthoritativePaymentEvent,
  recordedAt = new Date().toISOString(),
): Promise<PaymentLedgerProcessResult> {
  const event = normalizeAuthoritativePaymentEvent(input);
  const key = providerEventIdentityKey(event.provider, event.eventId);

  return store.transaction(async (transaction) => {
    if (await transaction.hasEvent(key)) {
      return {
        outcome: "duplicate_event",
        command: { type: "none", reason: "duplicate_event" },
        eventKey: key,
      };
    }

    const previousPayment = await transaction.getPayment(event.provider, event.paymentId);
    const orderBinding = await transaction.getOrderBinding(event.provider, event.orderId);
    const transition = applyAuthoritativePaymentEvent(
      transitionState(previousPayment, orderBinding),
      event,
    );

    const inserted = await transaction.insertEvent({ key, event, recordedAt });
    if (!inserted) {
      return {
        outcome: "duplicate_event",
        command: { type: "none", reason: "duplicate_event" },
        eventKey: key,
      };
    }

    const orderKey = paymentIdentityKey(event.provider, event.paymentId);
    const order = transition.state.orders[orderKey];
    if (order) await transaction.putPayment(order);

    if (!isExecutable(transition.command)) {
      return {
        outcome: "no_change",
        command: transition.command,
        eventKey: key,
        order,
      };
    }

    const id = outboxId(event.provider, transition.command);
    const existing = await transaction.getOutbox(id);
    if (existing) {
      return {
        outcome: "no_change",
        command: { type: "none", reason: "duplicate_state" },
        eventKey: key,
        order,
        outboxItem: existing,
      };
    }

    const item: EntitlementOutboxItem = {
      id,
      provider: event.provider,
      command: transition.command,
      createdAt: recordedAt,
    };
    const outboxInserted = await transaction.insertOutbox(item);
    if (!outboxInserted) {
      const concurrent = await transaction.getOutbox(id);
      return {
        outcome: "no_change",
        command: { type: "none", reason: "duplicate_state" },
        eventKey: key,
        order,
        outboxItem: concurrent,
      };
    }

    return {
      outcome: "applied",
      command: transition.command,
      eventKey: key,
      order,
      outboxItem: item,
    };
  });
}

export async function acknowledgeEntitlementOutbox(
  store: PaymentLedgerStore,
  id: string,
  deliveredAt = new Date().toISOString(),
) {
  return store.transaction(async (transaction) => {
    const item = await transaction.getOutbox(id);
    if (!item) return false;
    if (item.deliveredAt) return true;
    await transaction.putOutbox({ ...item, deliveredAt });
    return true;
  });
}

export function pendingEntitlementOutbox(snapshot: PaymentLedgerSnapshot) {
  return Object.values(snapshot.outbox)
    .filter((item) => !item.deliveredAt)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

/**
 * Reference adapter for contract tests and local development only. It serializes
 * transactions and commits a cloned snapshot only when the callback succeeds,
 * giving tests rollback semantics similar to a relational transaction.
 */
export class InMemoryPaymentLedgerStore implements PaymentLedgerStore {
  private state: PaymentLedgerSnapshot;
  private queue: Promise<void> = Promise.resolve();

  constructor(initial = emptyPaymentLedgerSnapshot()) {
    this.state = cloneSnapshot(initial);
  }

  async transaction<T>(work: (transaction: PaymentLedgerTransaction) => Promise<T> | T): Promise<T> {
    const run = this.queue.then(async () => {
      const draft = cloneSnapshot(this.state);
      const transaction: PaymentLedgerTransaction = {
        hasEvent: (key) => Boolean(draft.events[key]),
        insertEvent: (record) => {
          if (draft.events[record.key]) return false;
          draft.events[record.key] = { ...record, event: { ...record.event } };
          return true;
        },
        getPayment: (provider, paymentId) => {
          const order = draft.orders[paymentIdentityKey(provider, paymentId)];
          return order ? { ...order } : undefined;
        },
        getOrderBinding: (provider, orderId) => {
          const order = Object.values(draft.orders).find(
            (candidate) => candidate.provider === provider && candidate.orderId === orderId,
          );
          return order ? { ...order } : undefined;
        },
        putPayment: (order) => {
          draft.orders[paymentIdentityKey(order.provider, order.paymentId)] = { ...order };
        },
        getOutbox: (id) => {
          const item = draft.outbox[id];
          return item ? { ...item, command: { ...item.command } } : undefined;
        },
        insertOutbox: (item) => {
          if (draft.outbox[item.id]) return false;
          draft.outbox[item.id] = { ...item, command: { ...item.command } };
          return true;
        },
        putOutbox: (item) => {
          draft.outbox[item.id] = { ...item, command: { ...item.command } };
        },
      };
      const result = await work(transaction);
      this.state = draft;
      return result;
    });

    this.queue = run.then(() => undefined, () => undefined);
    return run;
  }

  snapshot() {
    return cloneSnapshot(this.state);
  }
}
