import assert from "node:assert/strict";
import { algorithms, freeAlgorithms } from "../src/lib/algorithms";
import { curriculum } from "../src/lib/curriculum";
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

assert(algorithms.length >= 20, `expected at least 20 algorithms, got ${algorithms.length}`);
assert(freeAlgorithms.length >= 5, `free playground is too small: ${freeAlgorithms.length}`);

const slugs = algorithms.map((algorithm) => algorithm.slug);
assert.equal(new Set(slugs).size, slugs.length, "algorithm slugs must be unique");

const curriculumSlugs = curriculum.flatMap((module) => module.slugs);
assert.equal(new Set(curriculumSlugs).size, curriculumSlugs.length, "curriculum contains duplicate lessons");
assert.deepEqual([...curriculumSlugs].sort(), [...slugs].sort(), "curriculum must cover every algorithm exactly once");

for (const algorithm of algorithms) {
  assert(algorithm.summary.trim().length >= 20, `${algorithm.slug} summary is too shallow`);
  assert(algorithm.intuition.trim().length >= 20, `${algorithm.slug} intuition is too shallow`);
  assert(algorithm.lessonGoal.trim().length >= 20, `${algorithm.slug} lesson goal is too shallow`);
  assert(algorithm.pseudocode.length >= 3, `${algorithm.slug} pseudocode is too short`);
  assert(algorithm.complexity.time.trim().length > 0, `${algorithm.slug} has no time complexity`);
  assert(algorithm.complexity.space.trim().length > 0, `${algorithm.slug} has no space complexity`);

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
  const algorithm = algorithms.find((item) => item.slug === slug);
  assert(algorithm, `missing required sort ${slug}`);
  const source = [8, 3, 6, 1, 7, 2, 5, 4];
  const final = algorithm.buildSteps(source).at(-1);
  assert(final, `${slug} produced no final step`);
  const values = final.items.map((item) => item.value ?? Number(item.label));
  assert.deepEqual(values, [...source].sort((a, b) => a - b), `${slug} final state is not sorted`);
}

console.log(`AlgoHar verification passed: ${algorithms.length} algorithms, ${curriculum.length} modules, ${freeAlgorithms.length} free simulations.`);
