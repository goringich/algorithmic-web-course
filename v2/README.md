# AlgoHar V2

Commercial-course rebuild of the original student project. V2 is intentionally isolated from the legacy frontend so product development, ownership review and deployment can progress without silently republishing old contributors' code.

## What exists now

- Next.js App Router application with Russian-first product copy.
- 27 step-driven algorithm/data-structure simulations on one typed visual engine.
- Six-module curriculum, free playground, dynamic lesson pages and previous/next lesson flow.
- Two retrieval checkpoints on every lesson with explanations and retry after an incorrect answer.
- Truthful local learning states: opened -> visualized -> practice passed -> mastered -> spaced review due.
- Lightweight review scheduling with a testable 1/3/7/14/30-day heuristic; early repetition does not advance the streak.
- Array, stack/queue/string, graph and tree renderers with playback, manual stepping, speed control and custom array inputs where appropriate.
- Signed HTTP-only server-side session/entitlement boundary for PRO traces plus server-side simulation routes.
- Provider-neutral authoritative payment transition contract plus a transactional event/order/outbox reference contract with rollback/concurrency verification.
- Pricing/waitlist surface with provider-neutral checkout URLs.
- Funnel events for landing, lesson opens, visualization completion, practice, mastery/review, pricing and checkout clicks.
- Privacy-bounded first-touch attribution using landing path, referrer hostname and whitelisted UTM fields.
- Lead and analytics webhook boundaries that fail visibly when configured delivery fails; public intake is body-bounded and rejects cross-origin browser submissions.
- Sitemap, robots, accessibility/focus support and launch legal placeholders.
- Browser response hardening headers (nosniff, frame denial, strict referrer policy and disabled sensitive browser permissions).
- Automated verification for clean-room, catalog/curriculum/practice coverage, semantic algorithm outcomes, payment/ledger contracts, learning mastery/review, typecheck, lint and production build.
- Playwright production-build smoke QA for representative desktop and mobile Chromium profiles.

## Run

```bash
npm install
npm run dev
```

Code-level quality gate:

```bash
npm run check
```

Browser QA after a production build and Chromium installation:

```bash
npm run build
npx playwright install chromium
npm run test:e2e
```

GitHub Actions installs the browser/runtime dependencies and runs the same browser suite automatically.

## Configuration

Copy `.env.example` to `.env.local` and fill only integrations that are actually provisioned. Never commit production credentials.

- `NEXT_PUBLIC_SITE_URL` — canonical public origin.
- `NEXT_PUBLIC_CHECKOUT_CORE_URL` — approved checkout/payment link for Full access.
- `ENTITLEMENT_SECRET` — at least 32 characters; signs server-side entitlement session tokens.
- `LEAD_WEBHOOK_URL` / `LEAD_WEBHOOK_TOKEN` — owner-controlled lead sink.
- `ANALYTICS_WEBHOOK_URL` / `ANALYTICS_WEBHOOK_TOKEN` — aggregate event sink.

## Important authority boundary

The signed cookie protects delivery of paid traces, but it is **not yet the production source of entitlement truth**. An already issued stateless cookie cannot currently be invalidated immediately by a later refund/revoke command. Commercial launch therefore still requires durable account/entitlement authority and an active-status/version check. See `../docs/payment-entitlement-durability.md`.

The in-memory payment ledger is also a contract-test/reference adapter only. Production must bind the same interface to a durable database transaction with real UNIQUE constraints and then connect an owner-approved authenticated provider webhook/reconciliation adapter.

## Commercial boundary

The product remains **prelaunch**, not commercial-ready. Real seller/support identity, public offer/refund/privacy/receipt handling, a verified provider + durable payment/entitlement authority, durable analytics/lead storage, persistent paid-user progress/recovery, production domain/TLS, live desktop/mobile browser QA and the legacy-IP provenance gate remain explicit blockers in `../docs/product-manifest.json` and `../docs/launch-readiness.md`.

Automated local browser QA reduces regressions but does not prove the future production domain/network/provider integration.

Do not add an open-source license to the legacy repository until the ownership boundary of historical contributions is resolved.
