# AlgoHar V2 — durable payment and entitlement contract

Status: architecture and executable reference contract. This document does **not** claim that a production database or payment provider is provisioned.

## Objective

Turn an authoritative provider event into exactly one durable order-state transition and, when required, exactly one entitlement grant/revoke command without relying on browser redirects or best-effort side effects.

## Authority boundary

Accepted payment truth sources:

- verified provider webhook;
- provider reconciliation initiated by the server/operator runtime.

Never authoritative:

- browser return URL;
- query parameter such as `success=true`;
- client-local state;
- checkout button click;
- an analytics event.

The provider adapter must authenticate/verify the provider message before creating `AuthoritativePaymentEvent`.

## Durable identities

The current V2 contract assumes:

- provider event identity is unique by `(provider, event_id)`;
- provider payment identity is unique by `(provider, payment_id)`;
- one `(provider, order_id)` is bound to one payment identity in the current launch model;
- one payment identity is permanently bound to one internal order, learner subject and SKU;
- entitlement outbox command IDs are deterministic and unique.

If a future provider flow needs multiple payment attempts for one checkout/order, extend the model explicitly with an `order_attempt_id` before relaxing the one-order/one-payment invariant. Do not silently permit two successful payment IDs to grant the same order twice.

## Transactional write path

One authoritative event must be handled in one database transaction:

1. normalize and validate provider/event/payment/order/subject/SKU identity;
2. insert `(provider,event_id)` into the event ledger with a durable UNIQUE constraint;
3. if the insert conflicts, return the previously processed result/no-op;
4. lock/load the existing payment identity and order binding;
5. reject identity rebinding;
6. apply the pure payment transition (success/refund/cancel/stale/terminal rules);
7. persist the new payment/order state;
8. if transition produces `grant` or `revoke`, insert one deterministic command into the entitlement outbox using a durable UNIQUE key;
9. commit;
10. only after commit, deliver pending outbox commands idempotently.

A network call to the entitlement subsystem must **not** occur in the middle of the payment transaction. Otherwise a process crash can create `side effect succeeded / database rolled back` or `database committed / side effect lost` split-brain states.

## Reference relational shape

Provider-neutral example; actual SQL depends on the selected database/provider adapter.

```text
payment_events
  provider
  event_id
  payment_id
  order_id
  status
  occurred_at
  recorded_at
  raw_reference/sanitized evidence ref
  UNIQUE(provider, event_id)

payment_orders
  provider
  payment_id
  order_id
  subject
  sku
  status
  last_occurred_at
  entitlement_granted
  UNIQUE(provider, payment_id)
  UNIQUE(provider, order_id)

entitlement_outbox
  command_id
  command_type
  subject
  sku
  order_id
  payment_id
  created_at
  delivered_at nullable
  UNIQUE(command_id)
```

The production migration must express uniqueness in the database. Application-level `SELECT` followed by `INSERT` without UNIQUE constraints is not sufficient under concurrency.

## Reconciliation

Webhook delivery is not guaranteed to be the only source of truth. A bounded reconciliation job should periodically query unsettled/recent provider payments and feed verified results through the exact same authoritative transition + ledger path.

This means webhook and reconciliation are two authenticated inputs to one state machine, not two independent implementations.

## Refund and revocation caveat

The current signed HTTP-only cookie is a delivery/session token, not yet a durable entitlement authority. A refund can enqueue a correct `revoke` command while an already issued stateless cookie remains cryptographically valid until expiration.

Therefore production commercial readiness additionally requires one of these fail-closed authority models:

- server-side session/entitlement lookup on each paid trace request;
- short-lived signed session backed by authoritative entitlement version/status;
- revocation/version check against a durable account record.

Do not claim end-to-end refund revocation until a refunded entitlement blocks an already active learner session in an integration test.

## Executable reference contract

`v2/src/lib/payment-ledger.ts` provides a storage interface and transactional outbox orchestration. `InMemoryPaymentLedgerStore` is intentionally test/local-only and supplies rollback/serialized-concurrency semantics for contract verification.

CI verifies:

- event replay is idempotent;
- concurrent success events create one grant command;
- distinct provider event IDs remain auditable;
- order/payment rebinding is rejected;
- rejected transitions roll back event/order/outbox mutations;
- stale state cannot regress the current order;
- refund produces one revoke command;
- outbox acknowledgement is idempotent;
- event IDs are scoped by provider.

## Production done condition

This architecture gate is complete only when:

1. an owner-approved provider adapter verifies real/test-provider signatures;
2. a durable DB adapter implements the transaction contract with database UNIQUE constraints;
3. provider webhook and reconciliation both use the same handler;
4. outbox delivery is retryable and idempotent;
5. a verified success grants immediately usable access;
6. duplicate/reordered events do not duplicate or regress access;
7. refund/revocation invalidates already active access according to published terms;
8. receipts/fiscalization are handled by the verified seller/provider setup;
9. evidence is captured from the actual integration, not inferred from the in-memory contract.
