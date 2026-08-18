import assert from "node:assert/strict";
import { algorithms } from "../src/lib/algorithms";
import type { AlgorithmStep, VisualItem } from "../src/lib/types";

function requireAlgorithm(slug: string) {
  const algorithm = algorithms.find((item) => item.slug === slug);
  assert(algorithm, `missing required algorithm ${slug}`);
  return algorithm;
}

function finalStep(slug: string): AlgorithmStep {
  const step = requireAlgorithm(slug).buildSteps().at(-1);
  assert(step, `${slug} produced no final step`);
  return step;
}

const segmentFinal = finalStep("segment-tree");
const segmentActive = segmentFinal.items.filter((item) => item.state === "active");
assert.equal(segmentActive.length, 3, "segment-tree canonical query must use three canonical segments");
const parsedSegments = segmentActive
  .map((item) => {
    const match = item.secondary?.match(/^\[(\d+),(\d+)\)$/);
    assert(match, `segment-tree active node ${item.id} must expose a canonical [l,r) range`);
    return {
      left: Number(match[1]),
      right: Number(match[2]),
      sum: Number(item.label),
    };
  })
  .sort((a, b) => a.left - b.left);

assert.deepEqual(
  parsedSegments.map(({ left, right }) => [left, right]),
  [[1, 3], [3, 4], [4, 6]],
  "segment-tree query [1,6) must use the exact canonical decomposition",
);
for (let index = 1; index < parsedSegments.length; index += 1) {
  assert.equal(
    parsedSegments[index - 1].right,
    parsedSegments[index].left,
    "segment-tree canonical segments must be contiguous and non-overlapping",
  );
}
assert.equal(parsedSegments[0].left, 1, "segment-tree canonical coverage must start at query left boundary");
assert.equal(parsedSegments.at(-1)?.right, 6, "segment-tree canonical coverage must end at query right boundary");
assert.equal(
  parsedSegments.reduce((total, segment) => total + segment.sum, 0),
  19,
  "segment-tree canonical query sum for [1,6) must equal 19",
);

const fenwickSteps = requireAlgorithm("fenwick-tree").buildSteps();
const fenwickQuerySteps = fenwickSteps.filter((step) => step.title === "prefix query");
assert.deepEqual(
  fenwickQuerySteps.map((step) => Number(step.metrics?.bitIndex)),
  [7, 6, 4],
  "Fenwick prefix(7) must follow i -= lowbit(i): 7 -> 6 -> 4 -> 0",
);
assert.deepEqual(
  fenwickQuerySteps.map((step) => Number(step.metrics?.sum)),
  [2, 12, 23],
  "Fenwick prefix trace must accumulate the independent canonical block sums",
);

const unionFindSteps = requireAlgorithm("union-find").buildSteps();
const unionFindFinal = unionFindSteps.at(-1);
assert(unionFindFinal, "Union-Find must produce a final path-compression step");
assert.equal(
  unionFindFinal.title,
  "path compression",
  "Union-Find canonical trace must finish by demonstrating path compression",
);
assert.equal(
  unionFindFinal.metrics?.components,
  2,
  "Union-Find canonical sequence must end with two components",
);

const rootByNode = new Map(
  unionFindFinal.items.map((item: VisualItem) => {
    const match = item.secondary?.match(/^root (\d+)$/);
    assert(match, `Union-Find node ${item.id} must expose its root`);
    return [Number(item.label), Number(match[1])] as const;
  }),
);

assert.deepEqual(
  [0, 1, 2, 3].map((node) => rootByNode.get(node)),
  [0, 0, 0, 0],
  "Union-Find canonical unions must put 0,1,2,3 in one component",
);
assert.deepEqual(
  [4, 5].map((node) => rootByNode.get(node)),
  [4, 4],
  "Union-Find canonical unions must keep 4,5 in the second component",
);
assert.equal(rootByNode.get(3), 0, "Union-Find find(3) must compress node 3 directly to root 0");
assert.deepEqual(
  [...new Set(rootByNode.values())].sort((a, b) => a - b),
  [0, 4],
  "Union-Find rendered roots must match the two independent canonical components",
);

console.log("AlgoHar independent range/DSU oracles passed: Segment Tree decomposition, Fenwick jumps, Union-Find components/path compression.\n");
