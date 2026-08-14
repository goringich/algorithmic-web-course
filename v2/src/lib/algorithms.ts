import { arrayAlgorithms } from "./arrayAlgorithms";
import { graphAlgorithms } from "./graphAlgorithms";
import { stringAlgorithms } from "./stringAlgorithms";
import { structureAlgorithms } from "./structureAlgorithms";
import type { AlgorithmDefinition } from "./types";

export const algorithms: AlgorithmDefinition[] = [
  ...arrayAlgorithms,
  ...structureAlgorithms,
  ...graphAlgorithms,
  ...stringAlgorithms,
];

export const algorithmBySlug = new Map(algorithms.map((algorithm) => [algorithm.slug, algorithm]));

export const categories = Array.from(new Set(algorithms.map((algorithm) => algorithm.category)));

export const freeAlgorithms = algorithms.filter((algorithm) => algorithm.tier === "free");
export const proAlgorithms = algorithms.filter((algorithm) => algorithm.tier === "pro");
