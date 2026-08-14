# AlgoHar V2

Commercial-course rebuild of the original student project. V2 is intentionally isolated from the legacy frontend so product development, ownership review and deployment can progress without silently republishing old contributors' code.

## What exists now

- Next.js App Router application with Russian-first product copy.
- 27 step-driven algorithm/data-structure simulations on one typed visual engine.
- Course curriculum, free playground, dynamic lesson pages and local progress.
- Array, stack/queue/string, graph and tree renderers.
- Pricing/waitlist surface with provider-neutral checkout URLs.
- Lead and analytics webhook boundaries that fail visibly when unconfigured.
- Sitemap, robots and launch legal placeholders.

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

Copy `.env.example` to `.env.local` and fill only the integrations that are actually provisioned. Never commit production credentials.

- `NEXT_PUBLIC_SITE_URL` — canonical public origin.
- `NEXT_PUBLIC_CHECKOUT_CORE_URL` — approved checkout/payment link for Full access.
- `LEAD_WEBHOOK_URL` / `LEAD_WEBHOOK_TOKEN` — owner-controlled lead sink.
- `ANALYTICS_WEBHOOK_URL` / `ANALYTICS_WEBHOOK_TOKEN` — aggregate event sink.

## Commercial boundary

This branch is **prelaunch**, not commercial-ready. Seller identity, public offer/refund terms, payment receipts, server-side entitlements, durable analytics, real public domain/TLS and an IP provenance pass are explicit blockers in `../docs/product-manifest.json`.

Do not add an open-source license to the legacy repository until the ownership boundary of historical contributions is resolved.
