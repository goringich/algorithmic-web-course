import assert from "node:assert/strict";
import {
  applyAuthoritativePaymentEvent,
  emptyPaymentEntitlementState,
  type AuthoritativePaymentEvent,
} from "../src/lib/payment-entitlement";

const base: AuthoritativePaymentEvent = {
  source: "provider_webhook",
  provider: "test-provider",
  eventId: "evt-success-1",
  paymentId: "pay-1",
  orderId: "order-1",
  subject: "learner-1",
  sku: "algohar-full",
  status: "succeeded",
  occurredAt: "2026-08-21T05:00:00.000Z",
};

let transition = applyAuthoritativePaymentEvent(emptyPaymentEntitlementState(), base);
assert.equal(transition.command.type, "grant", "authoritative success must grant once");
assert.equal(transition.state.orders["test-provider:pay-1"].entitlementGranted, true);

const afterGrant = transition.state;
transition = applyAuthoritativePaymentEvent(afterGrant, base);
assert.deepEqual(
  transition.command,
  { type: "none", reason: "duplicate_event" },
  "replayed provider event must be a no-op",
);
assert.equal(transition.state, afterGrant, "duplicate event must not mutate persisted state");

transition = applyAuthoritativePaymentEvent(afterGrant, {
  ...base,
  eventId: "evt-success-retry",
  occurredAt: "2026-08-21T05:00:01.000Z",
});
assert.deepEqual(
  transition.command,
  { type: "none", reason: "duplicate_state" },
  "a second success event for the same payment must not grant twice",
);

const afterRepeatedSuccess = transition.state;
transition = applyAuthoritativePaymentEvent(afterRepeatedSuccess, {
  ...base,
  eventId: "evt-refund-1",
  status: "refunded",
  occurredAt: "2026-08-21T06:00:00.000Z",
});
assert.equal(transition.command.type, "revoke", "refund after grant must revoke access once");
assert.equal(transition.state.orders["test-provider:pay-1"].entitlementGranted, false);
assert.equal(transition.state.orders["test-provider:pay-1"].status, "refunded");

const afterRefund = transition.state;
transition = applyAuthoritativePaymentEvent(afterRefund, {
  ...base,
  eventId: "evt-late-success",
  status: "succeeded",
  occurredAt: "2026-08-21T07:00:00.000Z",
});
assert.deepEqual(
  transition.command,
  { type: "none", reason: "terminal_payment" },
  "terminal refunded payment must never be resurrected by a later success event",
);
assert.equal(transition.state.orders["test-provider:pay-1"].entitlementGranted, false);

transition = applyAuthoritativePaymentEvent(afterGrant, {
  ...base,
  eventId: "evt-stale-refund",
  status: "refunded",
  occurredAt: "2026-08-21T04:59:59.000Z",
});
assert.deepEqual(
  transition.command,
  { type: "none", reason: "stale_event" },
  "out-of-order older provider state must not revoke newer entitlement state",
);
assert.equal(transition.state.orders["test-provider:pay-1"].entitlementGranted, true);

assert.throws(
  () => applyAuthoritativePaymentEvent(afterGrant, {
    ...base,
    eventId: "evt-conflict",
    subject: "different-learner",
    occurredAt: "2026-08-21T05:10:00.000Z",
  }),
  /payment identity does not match/,
  "a payment id must not be rebound to another learner or SKU",
);

assert.throws(
  () => applyAuthoritativePaymentEvent(emptyPaymentEntitlementState(), {
    ...base,
    source: "browser_return" as AuthoritativePaymentEvent["source"],
  }),
  /source must be authoritative/,
  "browser return must never be accepted as payment truth",
);

console.log("payment entitlement verification passed");
