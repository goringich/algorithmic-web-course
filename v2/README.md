# AlgoHar V2

Commercial-course rebuild of the original student project. V2 is intentionally isolated from the legacy frontend so product development, ownership review and deployment can progress without silently republishing old contributors' code.

## What exists now

- Next.js App Router application with Russian-first product copy.
- 27 step-driven algorithm/data-structure simulations on one typed visual engine.
- Six-module curriculum, free playground, dynamic lesson pages, visible local progress and previous/next lesson flow.
- Two practice checkpoints on every lesson: a hand-authored concept/invariant question and a complexity recall check with explanations.
- Array, stack/queue/string, graph and tree renderers with playback, manual stepping, speed control and custom array inputs where appropriate.
- Signed HTTP-only server-side entitlement boundary for PRO traces plus server-side simulation routes.
- Pricing/waitlist surface with provider-neutral checkout URLs.
- Funnel events for landing, lesson opens, second unique lesson, visualization completion, practice attempts/correct answers, pricing and checkout clicks.
- Lead and analytics webhook boundaries that fail visibly when unconfigured.
- Sitemap, robots, accessibility/focus support and launch legal placeholders.
- Automated verification for catalog/curriculum/practice coverage, sorting results and canonical advanced-algorithm outcomes before typecheck, lint and production build.

## Run

```bash
npm install
npm run dev
```

Quality gate:

```bash
npm run check
```

## Configuration

Copy `.env.example` to `.env.local` and fill only integrations that are actually provisioned. Never commit production credentials.

- `NEXT_PUBLIC_SITE_URL` — canonical public origin.
- `NEXT_PUBLIC_CHECKOUT_CORE_URL` — approved checkout/payment link for Full access.
- `ENTITLEMENT_SECRET` — at least 32 characters; signs server-side entitlement tokens.
- `LEAD_WEBHOOK_URL` / `LEAD_WEBHOOK_TOKEN` — owner-controlled lead sink.
- `ANALYTICS_WEBHOOK_URL` / `ANALYTICS_WEBHOOK_TOKEN` — aggregate event sink.

## Commercial boundary

The product remains **prelaunch**, not commercial-ready. The entitlement mechanism exists, but a verified payment-provider event is not yet connected to entitlement issuance. Real seller/support identity, public offer/refund/privacy/receipt handling, durable analytics/lead storage, production domain/TLS, live desktop/mobile browser QA and the legacy-IP provenance gate are still explicit blockers in `../docs/product-manifest.json` and `../docs/launch-readiness.md`.

Do not add an open-source license to the legacy repository until the ownership boundary of historical contributions is resolved.
