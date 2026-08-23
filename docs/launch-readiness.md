# AlgoHar V2 — launch readiness

## Product gate

- [x] More than 20 step-driven visualizations exist in V2.
- [x] Free playground and structured curriculum exist.
- [x] Lesson pages include intuition, pseudocode and complexity.
- [x] Visual engine supports arrays, linear structures, graphs and trees.
- [x] Responsive visual system exists.
- [x] Automated catalog/practice verification and advanced semantic checks exist.
- [x] Learning progress distinguishes `visualized`, `practicePassed`, `mastered` and due review instead of treating the last animation frame as mastery.
- [x] Legacy browser `completed` state migrates conservatively to `visualized`, never silently to mastery.
- [x] Wrong checkpoint answers can be retried after explanatory feedback.
- [x] A bounded 1/3/7/14/30-day spaced-review heuristic exists and is explicitly documented as a product hypothesis, not an outcome claim.
- [x] Automated production-build browser smoke QA is wired for desktop and mobile Chromium profiles.
- [x] Current master browser QA is source-backed by AlgoHar V2 CI run #51 on exact PR head `05900fd5ec1b1f13dcbab9af7a3db9c4c7120a66`; its tree `2c5aceb3dffc594dd8109951b4b96f2b822023da` is identical to merged master `dfb8dfc0f0f68389256a1fb9e5d24051ada8a9aa`.
- [ ] Live production QA on representative desktop and mobile devices after owned HTTPS deployment.
- [ ] Human/independent correctness review for every advanced algorithm trace.

## Commercial gate

- [ ] Seller identity/support details published.
- [ ] Public offer/refund terms reviewed for the actual seller/payment model.
- [ ] Privacy page lists real processors and retention periods.
- [ ] Approved Russian payment/receipt path provisioned.
- [x] Server-side signed HTTP-only token protects paid lesson traces from unauthenticated delivery.
- [x] Provider-neutral authoritative payment transition rejects browser-return truth and verifies idempotent grant, duplicate success, stale events, refund revocation and terminal-state protection.
- [x] Payment identity additionally rejects binding one provider `orderId` to multiple `paymentId` values in the current launch model.
- [x] Transactional event/order/outbox reference contract exists with deterministic command identity, rollback semantics and serialized concurrency verification.
- [ ] Implement the payment ledger contract against a durable production database with database-enforced UNIQUE constraints; the in-memory adapter is test/reference only.
- [ ] Connect an owner-approved authenticated provider webhook and reconciliation source to the same durable transition boundary.
- [ ] Replace stateless cookie-only entitlement authority with durable active entitlement/version status so refund/revoke invalidates an already active paid session.
- [ ] Verify one test-provider happy path from authoritative final payment to immediately usable access and one refund path to already-active access revocation.
- [ ] Persistent authenticated progress/recovery exists for paid learners.
- [ ] Lead and analytics sinks are durable, abuse-controlled and monitored.
- [ ] Owned domain + HTTPS + production deployment verified.

See `payment-entitlement-durability.md` for the required transaction/outbox and revocation model.

## Analytics / funnel gate

- [x] Configured analytics delivery fails closed on timeout/non-2xx instead of reporting false success.
- [x] Analytics event IDs, receive/occur times and schema version support downstream dedupe/audit.
- [x] Mastery/review events are distinct from raw visualization completion.
- [x] First-touch attribution preserves landing path, referrer hostname and whitelisted UTM fields without copying arbitrary query parameters/referrer URLs.
- [x] Public analytics/lead bodies are bounded and cross-origin browser submissions are rejected.
- [ ] Durable analytics/lead persistence and monitoring provisioned.
- [ ] Source-backed attributed visit -> mastery/pricing -> verified payment -> entitlement funnel verified end-to-end.

## Security / operations gate

- [x] V2 clean-room CI prevents commercial implementation from silently importing legacy student source/assets.
- [x] Baseline response hardening includes `nosniff`, frame denial, strict-origin referrer policy and disabled camera/microphone/geolocation permissions.
- [x] Critical runtime versions are pinned rather than floating across framework minor releases.
- [ ] Dependency lockfile/reproducible full dependency graph established and maintained for release builds.
- [ ] Production rate/abuse control selected for public lead/analytics endpoints at the actual hosting boundary.
- [ ] Production secret/config validation and rollback/recovery drill verified.

## Evidence gate

- [ ] 10 problem/learning interviews or equivalent observed learner sessions.
- [ ] 100 qualified free-algorithm opens before judging early funnel.
- [ ] First 10 verified paid early-access buyers before claiming demand validation.
- [ ] Retention measured from real learner sessions.
- [ ] Learning/mastery improvement measured from real recall/return evidence rather than inferred from quiz completion.
- [ ] Any testimonial has explicit consent and a traceable source.

## Marketing gate

Paid acquisition remains zero until commercial, payment and analytics gates pass. Organic founder/SEO distribution may begin once the public free surface is deployed and privacy/seller disclosures are adequate for the data actually collected.

## Evidence boundary

Checked code-level items above mean the implementation/contract exists. They do **not** prove that an external provider, durable database, live domain, buyer, receipt flow, learning outcome or production operational path exists. Those remain unchecked until source-backed external evidence is available.
