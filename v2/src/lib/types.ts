export type AccessTier = "free" | "pro";
export type Difficulty = "starter" | "core" | "advanced";
export type VisualKind = "array" | "graph" | "tree" | "string" | "stack" | "queue" | "list";
export type VisualState =
  | "idle"
  | "active"
  | "compare"
  | "success"
  | "muted"
  | "frontier"
  | "visited"
  | "target";

export interface VisualItem {
  id: string;
  label: string;
  value?: number;
  x?: number;
  y?: number;
  state?: VisualState;
  secondary?: string;
}

export interface VisualEdge {
  id: string;
  from: string;
  to: string;
  weight?: number;
  directed?: boolean;
  state?: VisualState;
}

export interface AlgorithmStep {
  title: string;
  description: string;
  items: VisualItem[];
  edges?: VisualEdge[];
  codeLine?: number;
  metrics?: Record<string, string | number>;
  annotation?: string;
}

export interface Complexity {
  time: string;
  space: string;
  note: string;
}

export interface AlgorithmDefinition {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  difficulty: Difficulty;
  tier: AccessTier;
  kind: VisualKind;
  summary: string;
  intuition: string;
  complexity: Complexity;
  pseudocode: string[];
  defaultInput?: number[];
  acceptsArrayInput?: boolean;
  buildSteps: (input?: number[]) => AlgorithmStep[];
  tags: string[];
  lessonGoal: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  slugs: string[];
}
