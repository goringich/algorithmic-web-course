import assert from "node:assert/strict";
import { algorithms, freeAlgorithms } from "../src/lib/algorithms";
import { curriculum } from "../src/lib/curriculum";
import { practiceBySlug } from "../src/lib/practice";
import type { AlgorithmStep } from "../src/lib/types";

function assertFinite(value: unknown, context: string) {
  if (typeof value === "number") assert(Number.isFinite(value), `${context} must be finite`);
}

function validateStep(slug: string, step: AlgorithmStep, index: number) {
  assert(step.title.trim().length > 0, `${slug} step ${index} has no title`);
  assert(step.description.trim().length > 0, `${slug} step ${index} has no description`);
  assert(Array.isArray(step.items), `${slug} step ${index} has no items array`);

  const ids = step.items.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length, `${slug} step ${index} contains duplicate item ids`);
  const idSet = new Set(ids);

  step.items.forEach((item) => {
    assert(item.id.length > 0, `${slug} step ${index} has an empty item id`);
    assert(item.label.length > 0, `${slug} step ${index} has an empty item label`);
    assertFinite(item.value, `${slug} step ${index} item ${item.id} value`);
    assertFinite(item.x, `${slug} step ${index} item ${item.id} x`);
    assertFinite(item.y, `${slug} step ${index} item ${item.id} y`);
  });

  for (const edge of step.edges ?? []) {
    assert(idSet.has(edge.from), `${slug} step ${index} edge ${edge.id} references missing from node ${edge.from}`);
    assert(idSet.has(edge.to), `${slug} step ${index} edge ${edge.id} references missing to node ${edge.to}`);
    assertFinite(edge.weight, `${slug} step ${index} edge ${edge.id} weight`);
  }

  Object.entries(step.metrics ?? {}).forEach(([key, value]) => assertFinite(value, `${slug} step ${index} metric ${key}`));
}

function requireAlgorithm(slug: string) {
  const algorithm = algorithms.find((item) => item.slug === slug);
  assert(algorithm, `missing required algorithm ${slug}`);
  return algorithm;
}

assert(algorithms.length >= 20, `expected at least 20 algorithms, got ${algorithms.length}`);
assert(freeAlgorithms.length >= 5, `free playground is too small: ${freeAlgorithms.length}`);

const slugs = algorithms.map((algorithm) => algorithm.slug);
assert.equal(new Set(slugs).size, slugs.length, "algorithm slugs must be unique");

const curriculumSlugs = curriculum.flatMap((module) => module.slugs);
assert.equal(new Set(curriculumSlugs).size, curriculumSlugs.length, "curriculum contains duplicate lessons");
assert.deepEqual([...curriculumSlugs].sort(), [...slugs].sort(), "curriculum must cover every algorithm exactly once");
assert.deepEqual(Object.keys(practiceBySlug).sort(), [...slugs].sort(), "every algorithm must have a concept checkpoint");

for (const algorithm of algorithms) {
  assert(algorithm.summary.trim().length >= 20, `${algorithm.slug} summary is too shallow`);
  assert(algorithm.intuition.trim().length >= 20, `${algorithm.slug} intuition is too shallow`);
  assert(algorithm.lessonGoal.trim().length >= 20, `${algorithm.slug} lesson goal is too shallow`);
  assert(algorithm.pseudocode.length >= 3, `${algorithm.slug} pseudocode is too short`);
  assert(algorithm.complexity.time.trim().length > 0, `${algorithm.slug} has no time complexity`);
  assert(algorithm.complexity.space.trim().length > 0, `${algorithm.slug} has no space complexity`);

  const practice = practiceBySlug[algorithm.slug];
  assert(practice.prompt.trim().length >= 20, `${algorithm.slug} practice prompt is too shallow`);
  assert.equal(practice.options.length, 4, `${algorithm.slug} practice must have four options`);
  assert(practice.correctIndex >= 0 && practice.correctIndex < practice.options.length, `${algorithm.slug} practice answer is invalid`);
  assert(practice.explanation.trim().length >= 20, `${algorithm.slug} practice explanation is too shallow`);

  const steps = algorithm.buildSteps(algorithm.defaultInput);
  assert(steps.length >= 2, `${algorithm.slug} must produce multiple visual states`);
  steps.forEach((step, index) => validateStep(algorithm.slug, step, index));

  if (algorithm.acceptsArrayInput) {
    const customSteps = algorithm.buildSteps([9, 1, 5, 3, 7, 2]);
    assert(customSteps.length >= 2, `${algorithm.slug} does not support a valid custom input trace`);
    customSteps.forEach((step, index) => validateStep(`${algorithm.slug}:custom`, step, index));
  }
}

const sortSlugs = ["bubble-sort", "selection-sort", "insertion-sort", "merge-sort", "quick-sort", "heap-sort"];
for (const slug of sortSlugs) {
  const algorithm = requireAlgorithm(slug);
  const source = [8, 3, 6, 1, 7, 2, 5, 4];
  const final = algorithm.buildSteps(source).at(-1);
  assert(final, `${slug} produced no final step`);
  const values = final.items.map((item) => item.value ?? Number(item.label));
  assert.deepEqual(values, [...source].sort((a, b) => a - b), `${slug} final state is not sorted`);
}

const dijkstraFinal = requireAlgorithm("dijkstra").buildSteps().at(-1);
assert.equal(dijkstraFinal?.metrics?.distance, 13, "dijkstra must find A->F distance 13 in the canonical graph");
assert.equal(dijkstraFinal?.items.find((item) => item.id === "F")?.state, "success", "dijkstra must finish by fixing F");

const bfsFinal = requireAlgorithm("bfs").buildSteps().at(-1);
assert.equal(bfsFinal?.items.length, 6, "bfs canonical graph must keep all six vertices");
assert(bfsFinal?.items.every((item) => item.state === "visited" || item.state === "active"), "bfs must visit every canonical vertex");

const fenwickFinal = requireAlgorithm("fenwick-tree").buildSteps().at(-1);
assert.equal(fenwickFinal?.metrics?.sum, 23, "fenwick canonical prefix(7) must equal 23");

const unionFindFinal = requireAlgorithm("union-find").buildSteps().at(-1);
assert.equal(unionFindFinal?.metrics?.components, 2, "union-find canonical sequence must end with two components");

const kruskalFinal = requireAlgorithm("kruskal").buildSteps().at(-1);
assert.equal(kruskalFinal?.metrics?.selected, 5, "kruskal MST over six vertices must select five edges");

const aStarFinal = requireAlgorithm("a-star").buildSteps().at(-1);
assert.equal(aStarFinal?.items.find((item) => item.id === "F")?.state, "success", "A* must reach canonical target F");

const kmpFinal = requireAlgorithm("kmp").buildSteps().at(-1);
assert.equal(kmpFinal?.metrics?.start, 0, "KMP canonical pattern must match at index 0");

const segmentFinal = requireAlgorithm("segment-tree").buildSteps().at(-1);
assert.equal(segmentFinal?.items.filter((item) => item.state === "active").length, 3, "segment-tree canonical query must decompose into three active segments");

console.log(`AlgoHar verification passed: ${algorithms.length} algorithms, ${curriculum.length} modules, ${freeAlgorithms.length} free simulations, ${Object.keys(practiceBySlug).length} concept checkpoints, advanced semantic checks.`);
