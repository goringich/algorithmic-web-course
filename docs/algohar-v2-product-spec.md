# AlgoHar V2 — product specification

## Product promise

A learner should be able to answer four questions after each lesson:

1. What changes on every step?
2. What invariant remains true?
3. Why is the next action safe/correct?
4. Where does the stated time/space complexity come from?

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
- mobile presentation remains understandable.

## Product architecture

`AlgorithmDefinition` owns educational metadata and a pure `buildSteps` function. The renderer consumes only `AlgorithmStep` objects. This separates correctness of an algorithm trace from UI styling.

Visual kinds:

- array/bar state;
- graph/tree SVG state;
- stack/queue/string/list state.

The architecture is deliberately reusable. A new algorithm should normally require a definition and step generator, not a new page shell.

## Next content wave

Prioritize educational coverage rather than arbitrary count:

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

Target after validation: 40-50 high-quality lessons, but only if activation/retention data supports expanding the catalog.

## Missing for commercial-ready

- real account model and server-side paid entitlement;
- approved payment provider and receipt flow;
- persistent server-side progress for paid users;
- exercises/quiz layer and browser code runner;
- verified analytics sink and dashboards;
- real legal/seller pages;
- visual QA on deployed mobile/desktop builds;
- IP provenance gate for any legacy asset considered for reuse.
