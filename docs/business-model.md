# AlgoHar V2 — business model

Status: prelaunch hypothesis, not a revenue claim.

## 1. Product thesis

AlgoHar should not sell "animations of algorithms". Free products can already provide many algorithm animations, so animation count alone is a weak moat. The paid product is the complete learning loop:

**mental model -> controlled execution -> invariant -> complexity -> code -> practice -> progress**.

The visualizer is the acquisition wedge and the course structure is the monetizable product.

Current market benchmark (checked 2026-08): NeetCode Pro sells structured video + written guides + browser practice for $119/year or $297 lifetime; AlgoExpert sells a curated interview-prep system with 160+ questions, video explanations, multi-language solutions and an in-browser workspace. VisuAlgo demonstrates that visualization itself is commonly expected to be free. Sources: https://neetcode.io/pro, https://www.algoexpert.io/, https://visualgo.net/ (or the current official VisuAlgo surface).

## 2. Primary ICP

First wedge:

- Russian-speaking CS students, roughly first through third year;
- junior developers preparing for data-structures/algorithms interviews;
- learners who know syntax but cannot "see" state transitions in trees, graphs and dynamic patterns.

Do not start by positioning to everybody from schoolchildren to senior engineers. The first message is: **"understand the algorithm instead of memorizing the implementation."**

## 3. Offer ladder

### Free — 0 RUB

Purpose: prove the learning method, acquire SEO traffic and create shareable content.

- 7 fully functional visualizations;
- step/pause/speed controls;
- custom array input where applicable;
- local progress;
- public indexable lesson pages.

### AlgoHar Full Early Access — 2,990 RUB lifetime

Launch hypothesis, limited to the first validated cohort rather than a fake countdown.

- all 27 current simulations;
- six structured modules;
- future V2 algorithm lessons during the early-access period;
- founder feedback channel while the product is being validated.

### Standard target — 4,990 RUB lifetime

Raise only after at least ten verified paid users and evidence that the course is completing its promise. If demand is weak, change offer/ICP before increasing price.

### Later expansion

Do not sell these before they exist:

- Interview Track add-on: curated tasks, browser runner, solution review.
- Competitive Programming Track: range queries, strings, graphs, DP and contest drills.
- University/teacher license: cohort progress and embeddable presentation mode.
- English localization once Russian activation/conversion is proven.

A recurring subscription becomes more defensible only when the product has ongoing value: new tasks, spaced repetition, AI review, live cohorts or regular interview content. Early validation should favor simple one-time pricing.

## 4. Unit economics

The course is software/content with low marginal delivery cost. Optimize for:

1. organic acquisition before paid traffic;
2. high free-to-activated conversion through immediate demo value;
3. one-time early-access cash to finance content depth;
4. later expansion revenue from tracks and institutional licenses;
5. no support-heavy promises until support capacity is measured.

Track real costs: hosting, payment commission, taxes/receipts, production tools, creator distribution and support time. Do not model founder time as zero once sales begin.

## 5. Funnel

Canonical funnel:

1. `attributed_session`
2. `algorithm_open`
3. `visualization_complete`
4. `second_lesson_open`
5. `pricing_view`
6. `checkout_click`
7. `payment_verified`
8. `entitlement_activated`
9. `return_session_7d`
10. `referral_session`

The present code implements the top of this funnel and webhook boundaries. Payment and entitlement are blockers, not simulated events.

## 6. Launch experiments

### E1 — learning-method activation

Traffic: founder-owned channels, HSE/student communities where posting is allowed, search traffic to algorithm pages.

Success signal: at least 25% of attributed first-time visitors who open a free algorithm reach the final visualization step.

Kill/rework rule: if fewer than 10% complete after 100 qualified algorithm opens, redesign lesson/visualizer interaction before monetization.

### E2 — early-access demand

Offer: 2,990 RUB lifetime to a bounded early cohort after legal/payment readiness.

Success signal: at least 10 verified purchases without paid acquisition and at least 5 buyers returning for another learning session.

Rule: do not infer product-market fit from likes, waitlist count or GitHub stars.

### E3 — price step

After E2: show 4,990 RUB to a new cohort. Compare paid conversion and gross revenue per qualified visitor. Keep the price that maximizes verified gross contribution, not conversion percentage alone.

## 7. Profit expansion sequence

1. Russian DSA course — prove willingness to pay.
2. Problem practice + interview track — increase ARPU.
3. English localization — enlarge TAM after product evidence.
4. Teacher/university mode — B2B seats and cohort licensing.
5. Creator/teacher referral program — distribution without fixed ad spend.
6. Paid search only after organic funnel data makes CAC limits measurable.

## 8. Non-negotiables

- No fake reviews, fake counters or invented outcome claims.
- No paid ads before payment/entitlement/analytics gates pass.
- No copied legacy implementation with unclear ownership in the commercial V2.
- No "AI tutor" surcharge until it produces measurable learning value.
- Every new visualization must support a lesson outcome, not merely increase a marketing counter.
