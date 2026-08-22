# AlgoHar V2 — product specification

## Product promise

A learner should be able to answer four questions after each lesson:

1. What changes on every step?
2. What invariant remains true?
3. Why is the next action safe/correct?
4. Where does the stated time/space complexity come from?

A learner reaching the final animation frame is **not** treated as mastery. V2 separately tracks trace completion, retrieval checkpoints, mastery and due review; see `learning-design.md`.

## Current V2 surface

The V2 code contains 27 simulations on one typed step engine.

### Search and arrays

Linear Search, Binary Search, Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort, Two Pointers, Sliding Window, Prefix Sums, Kadane.

### Data structures and trees

Stack, Queue, Linked List, Binary Heap, Binary Search Tree, Segment Tree, Fenwick Tree, Union-Find.

### Graphs

BFS, DFS, Dijkstra, Topological Sort, Kruskal MST, A*.

### Strings

KMP.

## Definition of a real visualization

A lesson does not count toward the catalog merely because a card exists. It counts only when:

- its algorithm definition creates multiple state transitions;
- the visual renderer changes from those state transitions;
- the user can step forward/back and pause auto-play;
- the lesson exposes intuition, pseudocode and complexity;
- custom input is supported where it is meaningful and safe;
- the final state is deterministic for the provided input;
- semantic verification exists for core/canonical algorithm outcomes;
- mobile presentation remains understandable.

## Learning state contract

The browser learning model distinguishes:

- `opened`;
- `visualized`;
- `practicePassed`;
- `mastered` = trace + both checkpoints;
- `review` = next due retrieval and streak.

Initial review heuristic: `1 -> 3 -> 7 -> 14 -> 30` days. Early repetition does not advance the spaced-review streak. The schedule is a product hypothesis, not a claim of optimality.

Server-side authenticated progress remains a commercial launch requirement; local browser state is a useful free-product implementation, not durable account evidence.

## Product architecture

`AlgorithmDefinition` owns educational metadata and a pure `buildSteps` function. The renderer consumes only `AlgorithmStep` objects. This separates correctness of an algorithm trace from UI styling.

Visual kinds:

- array/bar state;
- graph/tree SVG state;
- stack/queue/string/list state.

The architecture is deliberately reusable. A new algorithm should normally require a definition and step generator, not a new page shell.

## Commerce architecture

Paid traces remain server-gated. Browser redirects are never payment truth.

V2 now has three distinct contracts:

1. pure authoritative provider event -> order/entitlement transition;
2. transactional event/order/outbox orchestration with rollback and concurrency verification;
3. signed HTTP-only session token used to deliver paid traces.

The third item is not yet durable entitlement authority: an already issued stateless token cannot currently be invalidated immediately after a refund. Production must add an authoritative account/entitlement status/version check before end-to-end refund revocation is considered complete. See `payment-entitlement-durability.md`.

## Quality gates

Required code-level checks include:

- commercial V2 clean-room boundary;
- catalog/curriculum/practice coverage;
- semantic algorithm oracles;
- payment transition + transactional ledger/outbox contracts;
- learning mastery/review contract;
- TypeScript;
- ESLint;
- production build;
- production-build browser smoke QA on representative desktop and mobile Chromium profiles.

Passing local/CI browser smoke tests does not replace a final live-domain QA pass after real HTTPS/deployment is provisioned.

## Attribution and funnel truth

Browser analytics preserves a privacy-bounded session first touch:

- landing path;
- referrer hostname only;
- whitelisted `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.

Arbitrary query parameters/referrer URLs are not copied into analytics properties. Mastery events are distinct from visualization completion so funnel reporting cannot silently equate viewing with learning.

## Next content wave

Content breadth is deliberately **not** the current bottleneck. Candidates remain:

- AVL rotations;
- Trie;
- Bellman-Ford;
- Floyd-Warshall;
- Prim MST;
- strongly connected components;
- bridges/articulation points;
- Z-function;
- rolling hash;
- longest increasing subsequence;
- 0/1 knapsack;
- longest common subsequence;
- edit distance;
- monotonic stack/queue;
- sparse table;
- lazy propagation;
- suffix array introduction;
- max flow.

Target after validation: 40–50 high-quality lessons, but only if activation/retention evidence shows that catalog expansion is a stronger bottleneck than account/progress/payment/product depth.

## Missing for commercial-ready

- real account/identity model and durable server-side entitlement authority;
- durable database adapter for payment events/orders/outbox with database UNIQUE constraints;
- approved payment provider, reconciliation and receipt/fiscalization flow;
- persistent server-side progress and self-service recovery for paid users;
- browser code runner and deeper exercise bank only after the current learning loop is validated;
- durable monitored analytics/lead storage and source-backed dashboard;
- real legal/seller pages;
- live visual QA on the deployed HTTPS mobile/desktop surface;
- IP provenance gate for any legacy asset considered for reuse;
- real learner/payment/retention evidence.
