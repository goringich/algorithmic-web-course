# AlgoHar V2 — learning design contract

Status: product-learning contract. The schedule below is a testable product heuristic, not a claim that AlgoHar has already improved learner outcomes.

## Why the course is not an animation library

A learner seeing the final frame is not evidence that the learner can retrieve the invariant later. AlgoHar therefore separates four states:

1. **opened** — the lesson was entered;
2. **visualized** — the learner reached the end of the execution trace;
3. **practice passed** — both lesson checkpoints were answered correctly;
4. **mastered** — both the trace and the checkpoints have been completed.

Only `mastered` counts toward the course mastery percentage. Historical browser state that used the old `completed` field is migrated to `visualized`, never silently upgraded to mastery.

## Retrieval practice

The concept checkpoint asks the learner to retrieve the invariant/decision rule instead of re-reading it. The complexity checkpoint asks for the stated complexity and then explains why that value follows from the algorithm's work.

A wrong answer is not terminal. The learner gets explanatory feedback and may retry. This deliberately optimizes learning rather than one-shot quiz scoring.

Research basis:

- Roediger & Butler (2011), *The critical role of retrieval practice in long-term retention*, DOI `10.1016/j.tics.2010.09.003`: retrieval practice can improve long-term retention and feedback can strengthen the effect.
- McDermott (2021), *Practicing Retrieval Facilitates Learning*, DOI `10.1146/annurev-psych-010419-051019`: review of retrieval-based learning across materials and learner groups.

These sources justify testing retrieval as part of the course. They do **not** prove AlgoHar's current checkpoints improve algorithm-learning outcomes; that requires learner evidence.

## Spaced review

After first mastery, the browser schedules a lightweight review. Successful due reviews advance through the initial heuristic:

`1 day -> 3 days -> 7 days -> 14 days -> 30 days`

An early repeat does not advance the streak or move the due date, which prevents the product from rewarding rapid clicking as if it were spaced retention.

Research basis:

- Cepeda et al. (2006), *Distributed practice in verbal recall tasks: A review and quantitative synthesis*, DOI `10.1037/0033-2909.132.3.354`.
- Mawson & Kang (2025), *The Distributed Practice Effect on Classroom Learning: A Meta-Analytic Review of Applied Research*, DOI `10.3390/bs15060771`.

The exact `1/3/7/14/30` schedule is intentionally a product heuristic. It should later be tuned using real learner return/recall evidence rather than presented as an optimal universal schedule.

## Product metrics

Keep learning states distinct in analytics:

- `visualization_complete` — reached the last trace state;
- `practice_set_passed` — checkpoints passed but mastery was not newly achieved;
- `lesson_mastered` — trace + checkpoints both exist for the first time;
- `review_completed` — a due mastered lesson was successfully retrieved again.

Never use raw opens, final-frame views or one correct click as a mastery proxy.

## Next evidence loop

Before adding elaborate adaptive scheduling:

1. measure free-lesson trace completion;
2. measure checkpoint success/retry behavior;
3. measure first mastery;
4. measure whether due-review learners return;
5. compare retention/recall in observed learner sessions;
6. only then tune intervals or add adaptive difficulty.

This keeps AlgoHar focused on verified learning value rather than gamification counters.
