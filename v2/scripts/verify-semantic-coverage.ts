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

const dfsFinal = finalStep("dfs");
assert.equal(dfsFinal.items.length, 6, "DFS canonical graph must keep all six vertices");
assert(dfsFinal.items.every((item) => item.state === "visited" || item.state === "active"), "DFS must visit every canonical vertex");
assert.equal(dfsFinal.metrics?.visited, 6, "DFS must report six visited vertices");

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

const segmentFinal = finalStep("segment-tree");
assert.equal(segmentFinal.items.filter((item) => item.state === "active").length, 3, "segment-tree canonical query must use three canonical segments");

const fenwickFinal = finalStep("fenwick-tree");
assert.equal(fenwickFinal.metrics?.sum, 23, "Fenwick canonical prefix(7) must equal 23");

const unionFindFinal = finalStep("union-find");
assert.equal(unionFindFinal.metrics?.components, 2, "Union-Find canonical sequence must end with two components");
const roots = new Set(unionFindFinal.items.map((item: VisualItem) => item.secondary));
assert(roots.size <= 2, "Union-Find rendered roots must agree with the component count");

console.log("AlgoHar semantic coverage passed: search/patterns, linear structures, heap/BST, DFS/topological order, MST and range structures.");
