# AlgoHar V2 — business model

Status: prelaunch hypothesis, not a revenue claim.

## 1. Product thesis

AlgoHar should not sell "animations of algorithms". Animation count is easy to copy and many educational visualizers are free. The paid product is the complete learning loop:

**mental model -> controlled execution -> invariant -> complexity -> code -> practice -> progress**.

The visualizer is the acquisition wedge. Structured progression, practice, feedback and measurable mastery are the monetizable product.

### Current market anchors — checked 2026-08

Russian self-serve algorithm courses already support materially higher prices than a toy visualization product:

- Stepik "Алгоритмы и структуры данных: полный курс" — 3,990 RUB, 94 lessons and 48 interactive tasks.
- Stepik "Поколение Python: алгоритмы и структуры данных" — 7,900 RUB, 120 lessons, 1,179 tests and 625 interactive tasks plus teacher support.
- Stepik professional algorithms course — 9,790 RUB, 22+ hours of video and 106 interactive tasks.
- Yandex Practicum PRO algorithms course — about 91,500 RUB one-payment price at the observed 2026 offer; the value bundle includes 100+ coding tasks, expert-reviewed work, workshops and an interview simulation.
- NeetCode Pro currently positions structured guides, browser practice and interview preparation at $119/year or $297 lifetime.

Sources checked during the 2026-08-14 product pass: https://stepik.org/course/227630/, https://stepik.org/course/100575/promo, https://stepik.org/course/184350, https://practicum.yandex.ru/algorithms/, https://neetcode.io/pro.

Interpretation: AlgoHar should initially price below high-touch programs because it is self-serve and does not yet have hundreds of tasks or expert review. It should **not** permanently anchor the whole product at 2–5k RUB. As practice depth and outcome evidence grow, price discrimination through higher-value tracks is the main ARPU lever.

## 2. Primary ICP

First wedge:

- Russian-speaking CS students, roughly first through third year;
- junior developers preparing for data-structures/algorithms interviews;
- learners who know syntax but cannot "see" state transitions in trees, graphs and dynamic patterns.

Do not start by positioning to everybody from schoolchildren to senior engineers. The first message is: **"understand the algorithm instead of memorizing the implementation."**

The initial product is not a replacement for a four-month mentored program. It should win on immediate clarity, visual depth, speed, price and self-paced use.

## 3. Offer ladder

### Free — 0 RUB

Purpose: prove the learning method, acquire SEO traffic and create shareable content.

- 7 fully functional visualizations;
- step/pause/speed controls;
- custom array input where applicable;
- local progress;
- public indexable lesson pages;
- enough real value that the learner can decide whether the visual method works for them.

### AlgoHar Full Early Access — 2,990 RUB lifetime

Launch hypothesis for a bounded first cohort, not a fake countdown.

- all 27 current simulations;
- six structured modules;
- future V2 algorithm lessons during the early-access validation period;
- founder feedback channel while the product is being validated.

This price intentionally reduces purchase friction while the course has no verified buyer evidence, task bank or established brand.

### AlgoHar Full — initial standard hypothesis: 4,990 RUB lifetime

Test only after at least ten verified paid early users and repeat-use evidence. Optimize **gross contribution per qualified visitor**, not conversion rate by itself.

### AlgoHar Full+ — target hypothesis: 6,990–7,990 RUB lifetime

Do not launch this tier until the product has roughly 40+ correctness-reviewed lessons plus a meaningful practice layer. The Russian market already demonstrates willingness to pay around this band when a course contains substantial exercises and support.

Potential scope:

- 40–50 visual lessons;
- structured quizzes and spaced review;
- coding exercises with automatic checks;
- server-side progress and mastery map;
- curated study plans for university and interview preparation.

### Interview Track — target hypothesis: 9,990–14,900 RUB

Do not sell before the value exists.

Potential scope:

- 100+ curated interview problems;
- browser code runner;
- solution hints and complexity review;
- mock interview mode;
- company/topic roadmaps;
- optional bounded founder/manual review at a separately priced high-touch tier.

This is the strongest consumer ARPU expansion because it ties learning to a concrete career outcome while staying materially below high-touch bootcamp pricing.

### Competitive Programming Track

Separate add-on rather than bloating the base course:

- range queries;
- advanced strings;
- graph algorithms;
- dynamic programming;
- contest drills and timed sets.

### University / teacher license

Potential B2B/B2Edu expansion after the consumer product is stable:

- cohort dashboard;
- presentation mode;
- embeddable visualizations;
- assignments and progress export;
- seats or annual institutional license.

Do not set institutional pricing until there are interviews with real teachers/universities and the required administration features exist.

### English product

Localize only after the Russian funnel proves activation and willingness to pay. Translation should reuse the same simulation engine and lesson schema rather than fork the product.

### Subscription

A recurring subscription is defensible only when AlgoHar continuously creates value: new problem sets, spaced repetition, AI/code review, live cohorts, interview drills or continuously updated tracks. Early validation should favor understandable one-time pricing instead of manufacturing recurring revenue with no recurring value.

## 4. Profit model

The product has low marginal delivery cost, so profit is primarily controlled by acquisition efficiency, ARPU and founder/support time.

Optimize in this order:

1. organic acquisition before paid traffic;
2. high free-to-activated conversion through immediate demo value;
3. one-time early-access cash to finance content depth;
4. price expansion when product depth and evidence justify it;
5. add-on tracks instead of giving every future feature to the cheapest tier;
6. institutional licensing after the course has a stable teaching workflow;
7. referrals/creator partnerships before fixed paid-media spend;
8. paid acquisition only after verified conversion establishes a rational CAC ceiling.

Track real costs:

- hosting and databases;
- payment commission;
- taxes and receipt/fiscalization costs;
- video/content production tools;
- creator/referral payouts;
- support time;
- manual review time;
- refunds and payment failures.

Do not model founder time as zero once paid support or manual review is promised.

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

The code implements the top-of-funnel event boundary and a server-side entitlement mechanism. Payment verification remains provider-dependent and must not be simulated.

### Core business metrics

- free algorithm open -> visualization completion;
- first visualization -> second lesson;
- activated learner -> pricing view;
- qualified pricing view -> verified purchase;
- revenue per qualified visitor;
- refund rate;
- 7-day and 30-day learner retention;
- paid learner module completion;
- referral activation rate;
- support minutes per paid learner;
- gross contribution after provider/referral/support costs.

Vanity metrics such as raw page views, GitHub stars or waitlist count must not substitute for these.

## 6. Launch experiments

### E1 — learning-method activation

Traffic: founder-owned channels, university/student communities where posting is allowed, and search traffic to algorithm pages.

Success signal: at least 25% of attributed first-time visitors who open a free algorithm reach the final visualization step.

Kill/rework rule: if fewer than 10% complete after 100 qualified algorithm opens, redesign lesson/visualizer interaction before monetization.

### E2 — second-lesson intent

Measure how many visualization completers voluntarily open another lesson.

Initial hypothesis: 30%+ is promising enough to continue improving the curriculum loop. Treat this as a product signal, not a universal benchmark.

### E3 — early-access demand

Offer: 2,990 RUB lifetime to a bounded early cohort after legal/payment readiness.

Success signal: at least 10 verified purchases without paid acquisition and at least 5 buyers returning for another learning session.

Rule: do not infer product-market fit from likes, waitlist count or GitHub stars.

### E4 — standard price

After E3, expose 4,990 RUB to a new cohort. Compare paid conversion and gross revenue/contribution per qualified visitor against the early cohort.

### E5 — product-depth price expansion

Only after exercises and 40+ reviewed lessons exist, test 6,990–7,990 RUB. A higher price is justified by a larger outcome surface, not an artificial crossed-out discount.

### E6 — Interview Track

Before building the full track, validate with a narrow problem pack and real interviews. Build the 100+ problem system only if users pay or strongly engage with the smaller wedge.

## 7. Distribution engine

Every verified algorithm lesson is both product content and a distribution asset:

1. indexable Russian intent page;
2. 20–45 second visual clip of the key state transition;
3. static invariant diagram/carousel;
4. short founder explanation;
5. free playground deep link with attribution;
6. later: matching practice problem.

Priority:

1. intent SEO;
2. founder-owned Telegram/VK/short-video content;
3. administrator-approved university/student communities;
4. teacher/creator referral partnerships;
5. paid search only when conversion data makes CAC limits measurable.

The moat should become the growing **simulation engine + curriculum graph + exercise graph + learner data/feedback loop**, not a pile of marketing pages.

## 8. Profit expansion sequence

1. Russian visual DSA course — prove willingness to pay.
2. Improve activation and lesson-to-lesson progression.
3. Add practice and raise the core-course price.
4. Launch Interview Track — increase consumer ARPU.
5. Add Competitive Programming Track for a second high-intent segment.
6. Add English localization — enlarge TAM after product evidence.
7. Add teacher/university mode — B2B/B2Edu licensing.
8. Add creator/teacher referral program — scalable distribution with variable rather than fixed cost.
9. Use paid search only after organic funnel data establishes a CAC ceiling.

## 9. Non-negotiables

- No fake reviews, fake counters, fake urgency or invented outcome claims.
- No paid ads before payment/entitlement/analytics gates pass.
- No copied legacy implementation with unclear ownership in commercial V2.
- No "AI tutor" surcharge until it produces measurable learning value.
- No permanent lifetime promise for unrelated future product lines; early lifetime scope must be explicitly bounded to V2.
- Every new visualization must support a lesson outcome, not merely increase a marketing counter.
- Prices are experiments until supported by verified purchase and retention data.
