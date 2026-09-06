import { readFile } from "node:fs/promises";

const SESSION_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{2,63}$/;
const CODE = /^[a-z0-9][a-z0-9._-]{1,63}$/;
const EXPERIMENT_ID = "algohar-learner-validation-001";

export class LearnerValidationError extends Error {}

function requireCondition(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new LearnerValidationError(message);
  }
}

function exactKeys(value: unknown, expected: string[], label: string): asserts value is Record<string, unknown> {
  requireCondition(value !== null && typeof value === "object" && !Array.isArray(value), `${label} must be an object`);
  const actual = Object.keys(value as Record<string, unknown>).sort();
  const wanted = [...expected].sort();
  requireCondition(JSON.stringify(actual) === JSON.stringify(wanted), `${label} has unexpected or missing fields`);
}

function text(value: unknown, label: string): string {
  requireCondition(typeof value === "string" && value.trim().length > 0, `${label} is required`);
  return value.trim();
}

function code(value: unknown, label: string): string {
  const normalized = text(value, label).toLowerCase();
  requireCondition(CODE.test(normalized), `${label} must be a short non-PII code`);
  requireCondition(!normalized.includes("@"), `${label} must not be an email address`);
  return normalized;
}

function bool(value: unknown, label: string): boolean {
  requireCondition(typeof value === "boolean", `${label} must be boolean`);
  return value;
}

function integer(value: unknown, label: string, min: number, max: number): number {
  requireCondition(Number.isInteger(value), `${label} must be an integer`);
  const number = value as number;
  requireCondition(number >= min && number <= max, `${label} must be within ${min}..${max}`);
  return number;
}

function nonnegative(value: unknown, label: string): number {
  requireCondition(typeof value === "number" && Number.isFinite(value) && value >= 0, `${label} must be a non-negative number`);
  return value;
}

export type LearnerValidationInput = {
  session_id: string;
  experiment_id: string;
  participant: {
    qualified: boolean;
    consent_confirmed: boolean;
    acquisition_source_code: string;
  };
  lesson: {
    lesson_id: string;
    free_access: boolean;
  };
  baseline: {
    current_substitute_code: string;
    confidence_before: number;
    checkpoint_total: number;
    checkpoint_correct_before: number;
  };
  observed: {
    lesson_completed: boolean;
    visualization_used: boolean;
    practice_completed: boolean;
    checkpoint_correct_after: number;
    confidence_after: number;
    distinct_value_reported: boolean;
    price_anchor_shown: boolean;
    early_access_intent_2990: boolean;
    lifetime_intent_4990: boolean;
    second_lesson_requested: boolean;
    second_lesson_completed: boolean;
    operator_minutes: number;
    support_minutes: number;
    time_to_first_value_minutes: number;
    dominant_objection_code: string;
  };
};

export function templatePayload(): LearnerValidationInput {
  return {
    session_id: "algohar-demo-001",
    experiment_id: EXPERIMENT_ID,
    participant: {
      qualified: true,
      consent_confirmed: true,
      acquisition_source_code: "consent_led_referral",
    },
    lesson: {
      lesson_id: "binary-search",
      free_access: true,
    },
    baseline: {
      current_substitute_code: "youtube",
      confidence_before: 2,
      checkpoint_total: 5,
      checkpoint_correct_before: 1,
    },
    observed: {
      lesson_completed: true,
      visualization_used: true,
      practice_completed: true,
      checkpoint_correct_after: 4,
      confidence_after: 4,
      distinct_value_reported: true,
      price_anchor_shown: true,
      early_access_intent_2990: true,
      lifetime_intent_4990: false,
      second_lesson_requested: true,
      second_lesson_completed: false,
      operator_minutes: 8,
      support_minutes: 2,
      time_to_first_value_minutes: 6,
      dominant_objection_code: "none",
    },
  };
}

export function buildReceipt(input: unknown) {
  exactKeys(input, ["session_id", "experiment_id", "participant", "lesson", "baseline", "observed"], "session");

  const sessionId = text(input.session_id, "session_id");
  requireCondition(SESSION_ID.test(sessionId) && !sessionId.includes("@"), "session_id must be pseudonymous");
  requireCondition(input.experiment_id === EXPERIMENT_ID, `experiment_id must be ${EXPERIMENT_ID}`);

  exactKeys(input.participant, ["qualified", "consent_confirmed", "acquisition_source_code"], "participant");
  requireCondition(bool(input.participant.qualified, "participant.qualified"), "participant must be qualified");
  requireCondition(bool(input.participant.consent_confirmed, "participant.consent_confirmed"), "explicit consent is required");
  const acquisitionSource = code(input.participant.acquisition_source_code, "participant.acquisition_source_code");

  exactKeys(input.lesson, ["lesson_id", "free_access"], "lesson");
  const lessonId = code(input.lesson.lesson_id, "lesson.lesson_id");
  requireCondition(bool(input.lesson.free_access, "lesson.free_access"), "first validation lesson must be free access");

  exactKeys(input.baseline, ["current_substitute_code", "confidence_before", "checkpoint_total", "checkpoint_correct_before"], "baseline");
  const substitute = code(input.baseline.current_substitute_code, "baseline.current_substitute_code");
  const confidenceBefore = integer(input.baseline.confidence_before, "baseline.confidence_before", 1, 5);
  const checkpointTotal = integer(input.baseline.checkpoint_total, "baseline.checkpoint_total", 3, 10);
  const correctBefore = integer(input.baseline.checkpoint_correct_before, "baseline.checkpoint_correct_before", 0, checkpointTotal);

  exactKeys(input.observed, [
    "lesson_completed",
    "visualization_used",
    "practice_completed",
    "checkpoint_correct_after",
    "confidence_after",
    "distinct_value_reported",
    "price_anchor_shown",
    "early_access_intent_2990",
    "lifetime_intent_4990",
    "second_lesson_requested",
    "second_lesson_completed",
    "operator_minutes",
    "support_minutes",
    "time_to_first_value_minutes",
    "dominant_objection_code",
  ], "observed");

  const lessonCompleted = bool(input.observed.lesson_completed, "observed.lesson_completed");
  const visualizationUsed = bool(input.observed.visualization_used, "observed.visualization_used");
  const practiceCompleted = bool(input.observed.practice_completed, "observed.practice_completed");
  const correctAfter = integer(input.observed.checkpoint_correct_after, "observed.checkpoint_correct_after", 0, checkpointTotal);
  const confidenceAfter = integer(input.observed.confidence_after, "observed.confidence_after", 1, 5);
  const distinctValue = bool(input.observed.distinct_value_reported, "observed.distinct_value_reported");
  const priceAnchorShown = bool(input.observed.price_anchor_shown, "observed.price_anchor_shown");
  const intent2990 = bool(input.observed.early_access_intent_2990, "observed.early_access_intent_2990");
  const intent4990 = bool(input.observed.lifetime_intent_4990, "observed.lifetime_intent_4990");
  const secondRequested = bool(input.observed.second_lesson_requested, "observed.second_lesson_requested");
  const secondCompleted = bool(input.observed.second_lesson_completed, "observed.second_lesson_completed");
  const operatorMinutes = nonnegative(input.observed.operator_minutes, "observed.operator_minutes");
  const supportMinutes = nonnegative(input.observed.support_minutes, "observed.support_minutes");
  const timeToValue = nonnegative(input.observed.time_to_first_value_minutes, "observed.time_to_first_value_minutes");
  const objection = code(input.observed.dominant_objection_code, "observed.dominant_objection_code");

  requireCondition(!visualizationUsed || lessonCompleted, "visualization use requires lesson completion");
  requireCondition(!practiceCompleted || lessonCompleted, "practice completion requires lesson completion");
  requireCondition(!distinctValue || lessonCompleted, "distinct value may be recorded only after lesson completion");
  requireCondition(!priceAnchorShown || lessonCompleted, "price anchor may be shown only after experienced lesson value");
  requireCondition(!(intent2990 || intent4990) || priceAnchorShown, "price intent requires price_anchor_shown=true");
  requireCondition(!secondRequested || lessonCompleted, "second lesson request requires first lesson completion");
  requireCondition(!secondCompleted || secondRequested, "second lesson completion requires a recorded repeat request");

  const checkpointDelta = correctAfter - correctBefore;
  const confidenceDelta = confidenceAfter - confidenceBefore;

  return {
    schema_version: 1,
    receipt_type: "algohar_learner_validation_session",
    experiment_id: EXPERIMENT_ID,
    session_id: sessionId,
    privacy: {
      contains_name: false,
      contains_email: false,
      contains_raw_answers: false,
      contains_free_text_feedback: false,
      pseudonymous_session_only: true,
    },
    participant: {
      qualified: true,
      consent_confirmed: true,
      acquisition_source_code: acquisitionSource,
    },
    lesson: {
      lesson_id: lessonId,
      free_access: true,
    },
    baseline: {
      current_substitute_code: substitute,
      confidence_before: confidenceBefore,
      checkpoint_total: checkpointTotal,
      checkpoint_correct_before: correctBefore,
    },
    observed: {
      lesson_completed: lessonCompleted,
      visualization_used: visualizationUsed,
      practice_completed: practiceCompleted,
      checkpoint_correct_after: correctAfter,
      checkpoint_delta: checkpointDelta,
      confidence_after: confidenceAfter,
      confidence_delta: confidenceDelta,
      distinct_value_reported: distinctValue,
      price_anchor_shown: priceAnchorShown,
      early_access_intent_2990: intent2990,
      lifetime_intent_4990: intent4990,
      second_lesson_requested: secondRequested,
      second_lesson_completed: secondCompleted,
      operator_minutes: operatorMinutes,
      support_minutes: supportMinutes,
      time_to_first_value_minutes: timeToValue,
      dominant_objection_code: objection,
    },
    evidence_effect: {
      activation_observed: lessonCompleted,
      checkpoint_signal_observed: lessonCompleted && checkpointTotal >= 3,
      positive_checkpoint_delta_observed: checkpointDelta > 0,
      distinct_value_observed: distinctValue,
      price_intent_observed: intent2990 || intent4990,
      repeat_request_observed: secondRequested,
      repeat_use_observed: secondCompleted,
      acquisition_source_observed: acquisitionSource,
      candidate_promotion_allowed: false,
    },
    claims: {
      payment_verified: false,
      learning_improvement_verified: false,
      retention_verified: false,
      build_admission: false,
      checkout_ready: false,
      product_market_fit_verified: false,
    },
  };
}

async function main() {
  const [command, inputPath] = process.argv.slice(2);
  if (command === "template") {
    process.stdout.write(`${JSON.stringify(templatePayload(), null, 2)}\n`);
    return;
  }
  if (command === "receipt" && inputPath) {
    const input = JSON.parse(await readFile(inputPath, "utf8"));
    process.stdout.write(`${JSON.stringify(buildReceipt(input), null, 2)}\n`);
    return;
  }
  throw new LearnerValidationError("usage: learner-validation-receipt.ts template | receipt <session.json>");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
