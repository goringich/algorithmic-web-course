import assert from "node:assert/strict";
import { algorithms } from "../src/lib/algorithms";
import type { AlgorithmStep, VisualItem } from "../src/lib/types";

function requireAlgorithm(slug: string) {
  const algorithm = algorithms.find((item) => item.slug === slug);
  assert(algorithm, `missing required algorithm ${slug}`);
  return algorithm;
}

function finalStep(slug: string) {
  const step = requireAlgorithm(slug).buildSteps().at(-1);
  assert(step, `${slug} produced no final step`);
  return step;
}

function numericLabels(step: AlgorithmStep) {
  return step.items.map((item) => Number(item.label));
}

function successfulItems(step: AlgorithmStep) {
  return step.items.filter((item) => item.state === "success");
}

const linearFinal = finalStep("linear-search");
assert.equal(successfulItems(linearFinal).length, 1, "linear search must finish on exactly one found target");
assert(Number(linearFinal.metrics?.comparisons) >= 1, "linear search must report at least one comparison");

const binaryFinal = finalStep("binary-search");
assert.equal(successfulItems(binaryFinal).length, 1, "binary search must finish on exactly one found target");
assert(Number(binaryFinal.metrics?.comparisons) >= 1, "binary search must report comparisons");

const twoPointersFinal = finalStep("two-pointers");
assert.equal(successfulItems(twoPointersFinal).length, 2, "two pointers must finish on a pair");
assert.equal(twoPointersFinal.metrics?.sum, twoPointersFinal.metrics?.target, "two pointers final pair must satisfy the target sum");

const slidingWindowFinal = finalStep("sliding-window");
assert.equal(slidingWindowFinal.metrics?.best, 17, "sliding window canonical max 3-window sum must equal 17");

const prefixFinal = finalStep("prefix-sums");
assert.equal(prefixFinal.metrics?.answer, 11, "prefix sums canonical [1,4] query must equal 11");

const kadaneFinal = finalStep("kadane");
assert.equal(kadaneFinal.metrics?.best, 7, "Kadane canonical maximum subarray sum must equal 7");

const stackFinal = finalStep("stack");
assert.deepEqual(numericLabels(stackFinal), [4, 7, 9], "stack canonical push/pop sequence must preserve LIFO semantics");
assert.equal(stackFinal.metrics?.size, 3, "stack canonical final size must equal 3");

const queueFinal = finalStep("queue");
assert.deepEqual(numericLabels(queueFinal), [8, 5, 1], "queue canonical dequeue must remove the oldest item");
assert.equal(queueFinal.metrics?.size, 3, "queue canonical final size must equal 3");

const listFinal = finalStep("linked-list");
assert.deepEqual(numericLabels(listFinal), [2, 6, 8], "linked list canonical insert/delete sequence must end as 2 -> 6 -> 8");
assert.equal(listFinal.edges?.length, 2, "linked list with three nodes must have two links");

const heapFinal = finalStep("binary-heap");
const heapValues = numericLabels(heapFinal);
heapValues.forEach((value, index) => {
  const left = index * 2 + 1;
  const right = left + 1;
  if (left < heapValues.length) assert(value <= heapValues[left], `binary heap violates min-heap invariant at ${index}->${left}`);
  if (right < heapValues.length) assert(value <= heapValues[right], `binary heap violates min-heap invariant at ${index}->${right}`);
});
assert.equal(heapValues[0], 1, "binary heap canonical minimum must reach the root");

const bstFinal = finalStep("binary-search-tree");
assert.equal(bstFinal.items.length, 9, "BST canonical build must contain nine nodes");
assert.equal(bstFinal.edges?.length, 8, "BST canonical build must remain a tree");
const bstById = new Map(bstFinal.items.map((item) => [item.id, item]));
for (const edge of bstFinal.edges ?? []) {
  const parent = bstById.get(edge.from);
  const child = bstById.get(edge.to);
  assert(parent && child, `BST edge ${edge.id} must reference existing nodes`);
  const parentValue = Number(parent.label);
  const childValue = Number(child.label);
  if ((child.x ?? 0) < (parent.x ?? 0)) {
    assert(childValue < parentValue, `BST left child ${childValue} must be smaller than parent ${parentValue}`);
  } else {
    assert(childValue > parentValue, `BST right child ${childValue} must be greater than parent ${parentValue}`);
  }
}

const bfsSteps = requireAlgorithm("bfs").buildSteps();
const bfsOrder = bfsSteps
  .filter((step) => step.title === "Извлекаем вершину")
  .map((step) => step.items.find((item) => item.state === "active")?.id);
assert.deepEqual(bfsOrder, ["A", "B", "C", "D", "E", "F"], "BFS canonical trace must preserve layer/FIFO order");

const dfsFinal = finalStep("dfs");
assert.equal(dfsFinal.items.length, 6, "DFS canonical graph must keep all six vertices");
assert(dfsFinal.items.every((item) => item.state === "visited" || item.state === "active"), "DFS must visit every canonical vertex");
assert.equal(dfsFinal.metrics?.visited, 6, "DFS must report six visited vertices");

const dijkstraSteps = requireAlgorithm("dijkstra").buildSteps();
const dijkstraFixed = dijkstraSteps.filter((step) => step.title === "Фиксируем вершину");
const dijkstraOrder = dijkstraFixed.map((step) => step.items.find((item) => item.state === "success")?.id);
const dijkstraDistances = dijkstraFixed.map((step) => Number(step.metrics?.distance));
assert.deepEqual(dijkstraOrder, ["A", "C", "B", "D", "E", "F"], "Dijkstra must fix vertices in canonical shortest-distance order");
assert.deepEqual(dijkstraDistances, [0, 2, 3, 8, 10, 13], "Dijkstra canonical fixed distances must match the independent shortest-path oracle");

const topo = requireAlgorithm("topological-sort").buildSteps();
const topoOrder = topo.slice(1).map((step) => step.items.find((item) => item.state === "success")?.id).filter((id): id is string => Boolean(id));
assert.equal(topoOrder.length, 6, "topological sort must emit every canonical vertex exactly once");
assert.equal(new Set(topoOrder).size, 6, "topological sort must not duplicate vertices");
const topoIndex = new Map(topoOrder.map((id, index) => [id, index]));
for (const edge of topo.at(-1)?.edges ?? []) {
  assert(edge.directed, `topological graph edge ${edge.id} must remain directed`);
  assert((topoIndex.get(edge.from) ?? Number.POSITIVE_INFINITY) < (topoIndex.get(edge.to) ?? -1), `topological order violates dependency ${edge.from}->${edge.to}`);
}

const kruskalFinal = finalStep("kruskal");
const mstEdges = (kruskalFinal.edges ?? []).filter((edge) => edge.state === "success");
assert.equal(mstEdges.length, 5, "Kruskal canonical MST must have V-1 edges");
assert.equal(mstEdges.reduce((sum, edge) => sum + (edge.weight ?? 0), 0), 13, "Kruskal canonical MST total weight must equal 13");
const mstParent = new Map(kruskalFinal.items.map((item) => [item.id, item.id]));
const mstFind = (id: string): string => {
  const parent = mstParent.get(id);
  assert(parent, `Kruskal node ${id} must exist in the DSU oracle`);
  if (parent === id) return id;
  const root = mstFind(parent);
  mstParent.set(id, root);
  return root;
};
for (const edge of mstEdges) {
  const fromRoot = mstFind(edge.from);
  const toRoot = mstFind(edge.to);
  assert.notEqual(fromRoot, toRoot, `Kruskal selected edge ${edge.id} must not create a cycle`);
  mstParent.set(toRoot, fromRoot);
}
assert.equal(new Set(kruskalFinal.items.map((item) => mstFind(item.id))).size, 1, "Kruskal selected edges must connect every canonical vertex");

const aStarSteps = requireAlgorithm("a-star").buildSteps();
const aStarSelections = aStarSteps.filter((step) => step.title === "Выбираем min f");
const aStarOrder = aStarSelections.map((step) => step.items.find((item) => item.state === "active" || item.state === "success")?.id);
assert.deepEqual(aStarOrder, ["A", "C", "B", "D", "E", "F"], "A* must follow the canonical admissible-heuristic expansion order");
assert.match(aStarSelections.at(-1)?.description ?? "", /F: g=13, h=0, f=13\./, "A* must reach F with the optimal canonical cost 13");

const kmpSteps = requireAlgorithm("kmp").buildSteps();
const prefixSteps = kmpSteps.filter((step) => step.title === "Префикс-функция");
assert.deepEqual(prefixSteps.map((step) => step.metrics?.i), [1, 2, 3, 4, 5], "KMP must build every non-zero-index prefix-function entry");
assert.deepEqual(prefixSteps.map((step) => step.metrics?.pi), [0, 1, 2, 3, 0], "KMP prefix-function values for ABABAC must match the independent oracle");
const mismatchSteps = kmpSteps.filter((step) => step.title === "Несовпадение");
assert(mismatchSteps.length >= 1, "KMP canonical trace must visibly exercise fallback after a mismatch");
assert.equal(mismatchSteps[0]?.metrics?.textIndex, 5, "KMP first fallback must happen at canonical text index 5");
const kmpFinal = kmpSteps.at(-1);
assert.equal(kmpFinal?.metrics?.start, 4, "KMP canonical match must begin at index 4 after fallback");
assert.equal(kmpFinal?.items.filter((item) => item.state === "success").map((item) => item.label).join(""), "ABABAC", "KMP success range must spell the full pattern");

const segmentFinal = finalStep("segment-tree");
assert.equal(segmentFinal.items.filter((item) => item.state === "active").length, 3, "segment-tree canonical query must use three canonical segments");

const fenwickFinal = finalStep("fenwick-tree");
assert.equal(fenwickFinal.metrics?.sum, 23, "Fenwick canonical prefix(7) must equal 23");

const unionFindFinal = finalStep("union-find");
assert.equal(unionFindFinal.metrics?.components, 2, "Union-Find canonical sequence must end with two components");
const roots = new Set(unionFindFinal.items.map((item: VisualItem) => item.secondary));
assert(roots.size <= 2, "Union-Find rendered roots must agree with the component count");

console.log("AlgoHar semantic coverage passed: search/patterns, linear structures, heap/BST, BFS/DFS, shortest paths, topological order, MST, KMP and range structures.");
