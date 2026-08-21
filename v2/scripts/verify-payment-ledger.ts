import assert from "node:assert/strict";
import {
  InMemoryPaymentLedgerStore,
  acknowledgeEntitlementOutbox,
  pendingEntitlementOutbox,
  processAuthoritativePaymentEvent,
} from "../src/lib/payment-ledger";
import type { AuthoritativePaymentEvent } from "../src/lib/payment-entitlement";

const event = (
  overrides: Partial<AuthoritativePaymentEvent> = {},
): AuthoritativePaymentEvent => ({
  source: "provider_webhook",
  provider: "test-provider",
  eventId: "evt-success-1",
  paymentId: "pay-1",
  orderId: "order-1",
  subject: "learner-1",
  sku: "algohar-full",
  status: "succeeded",
  occurredAt: "2026-08-21T05:00:00.000Z",
  ...overrides,
});

const store = new InMemoryPaymentLedgerStore();
const first = await processAuthoritativePaymentEvent(store, event(), "2026-08-21T05:00:01.000Z");
assert.equal(first.outcome, "applied");
assert.equal(first.command.type, "grant");
let snapshot = store.snapshot();
assert.equal(Object.keys(snapshot.events).length, 1, "authoritative event must be recorded once");
assert.equal(Object.keys(snapshot.orders).length, 1, "payment state must be persisted");
assert.equal(pendingEntitlementOutbox(snapshot).length, 1, "grant must be committed to the outbox");

const replay = await processAuthoritativePaymentEvent(store, event());
assert.equal(replay.outcome, "duplicate_event");
snapshot = store.snapshot();
assert.equal(Object.keys(snapshot.events).length, 1);
assert.equal(pendingEntitlementOutbox(snapshot).length, 1, "replay must not duplicate the grant command");

const concurrentStore = new InMemoryPaymentLedgerStore();
const concurrent = await Promise.all([
  processAuthoritativePaymentEvent(concurrentStore, event({ eventId: "evt-race-a" })),
  processAuthoritativePaymentEvent(concurrentStore, event({ eventId: "evt-race-b", occurredAt: "2026-08-21T05:00:01.000Z" })),
]);
assert.equal(concurrent.filter((result) => result.command.type === "grant").length, 1, "concurrent success events must produce one grant");
assert.equal(Object.keys(concurrentStore.snapshot().events).length, 2, "both distinct provider events remain auditable");
assert.equal(pendingEntitlementOutbox(concurrentStore.snapshot()).length, 1, "outbox command must remain exactly-once");

const refund = await processAuthoritativePaymentEvent(store, event({
  eventId: "evt-refund-1",
  status: "refunded",
  occurredAt: "2026-08-21T06:00:00.000Z",
}));
assert.equal(refund.command.type, "revoke");
snapshot = store.snapshot();
assert.equal(pendingEntitlementOutbox(snapshot).length, 2, "refund must create one revoke after the grant");

const refundReplay = await processAuthoritativePaymentEvent(store, event({
  eventId: "evt-refund-1",
  status: "refunded",
  occurredAt: "2026-08-21T06:00:00.000Z",
}));
assert.equal(refundReplay.outcome, "duplicate_event");
assert.equal(pendingEntitlementOutbox(store.snapshot()).length, 2, "refund replay must not duplicate revoke");

const rollbackStore = new InMemoryPaymentLedgerStore();
await processAuthoritativePaymentEvent(rollbackStore, event());
const beforeConflict = rollbackStore.snapshot();
await assert.rejects(
  processAuthoritativePaymentEvent(rollbackStore, event({
    eventId: "evt-conflicting-order-payment",
    paymentId: "pay-2",
    occurredAt: "2026-08-21T05:10:00.000Z",
  })),
  /orderId is already bound/,
);
assert.deepEqual(
  rollbackStore.snapshot(),
  beforeConflict,
  "failed identity validation must roll back event/order/outbox writes atomically",
);

const staleStore = new InMemoryPaymentLedgerStore();
await processAuthoritativePaymentEvent(staleStore, event({ occurredAt: "2026-08-21T06:00:00.000Z" }));
const stale = await processAuthoritativePaymentEvent(staleStore, event({
  eventId: "evt-stale-refund",
  status: "refunded",
  occurredAt: "2026-08-21T05:59:00.000Z",
}));
assert.deepEqual(stale.command, { type: "none", reason: "stale_event" });
assert.equal(Object.keys(staleStore.snapshot().events).length, 2, "stale provider truth is still recorded for dedupe/audit");
assert.equal(staleStore.snapshot().orders["test-provider:pay-1"].status, "succeeded", "stale event must not regress order state");
assert.equal(pendingEntitlementOutbox(staleStore.snapshot()).length, 1);

const providerScoped = new InMemoryPaymentLedgerStore();
await processAuthoritativePaymentEvent(providerScoped, event());
const secondProvider = await processAuthoritativePaymentEvent(providerScoped, event({
  provider: "second-provider",
  paymentId: "pay-2",
  orderId: "order-2",
  subject: "learner-2",
}));
assert.equal(secondProvider.command.type, "grant", "event IDs are unique within provider scope, not globally");
assert.equal(Object.keys(providerScoped.snapshot().events).length, 2);

const pending = pendingEntitlementOutbox(store.snapshot());
assert.equal(await acknowledgeEntitlementOutbox(store, pending[0].id, "2026-08-21T06:05:00.000Z"), true);
assert.equal(pendingEntitlementOutbox(store.snapshot()).length, 1, "acknowledged outbox items leave the pending queue");
assert.equal(await acknowledgeEntitlementOutbox(store, pending[0].id, "2026-08-21T06:06:00.000Z"), true, "outbox acknowledgement is idempotent");

console.log("transactional payment ledger verification passed");
