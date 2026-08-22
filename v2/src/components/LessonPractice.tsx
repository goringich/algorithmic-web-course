"use client";

import { useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import { practiceBySlug, type PracticeQuestion } from "@/lib/practice";
import { dueReviewSlugs, markPracticePassed, readProgress } from "@/lib/progress";

function complexityQuestion(slug: string, correct: string): PracticeQuestion {
  const pool = [correct, "O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)"];
  const unique = Array.from(new Set(pool));
  const offset = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0) % unique.length;
  const rotated = [...unique.slice(offset), ...unique.slice(0, offset)];
  const options = [correct, ...rotated.filter((item) => item !== correct)].slice(0, 4) as [string, string, string, string];
  const shift = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4;
  const shifted = [...options.slice(shift), ...options.slice(0, shift)] as [string, string, string, string];
  return {
    prompt: "Какая временная сложность указана для основной реализации этого урока?",
    options: shifted,
    correctIndex: shifted.indexOf(correct),
    explanation: `В уроке зафиксирована сложность: ${correct}. Важно уметь связать её с количеством состояний/операций, а не просто запомнить запись.`,
  };
}

export function LessonPractice({ slug, timeComplexity }: { slug: string; timeComplexity: string }) {
  const concept = practiceBySlug[slug];
  const questions = useMemo(
    () => concept ? [concept, complexityQuestion(slug, timeComplexity)] : [],
    [concept, slug, timeComplexity],
  );
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [passed, setPassed] = useState<Record<number, boolean>>({});

  if (!questions.length) return null;

  function choose(questionIndex: number, optionIndex: number) {
    if (passed[questionIndex]) return;
    const question = questions[questionIndex];
    const correct = optionIndex === question.correctIndex;
    const nextPassed = correct ? { ...passed, [questionIndex]: true } : passed;
    setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }));
    if (correct) setPassed(nextPassed);
    track("practice_attempt", { slug, question: questionIndex + 1, correct });
    if (correct) track("practice_correct", { slug, question: questionIndex + 1 });

    if (correct && questions.every((_, index) => nextPassed[index])) {
      const before = readProgress();
      const wasMastered = before.mastered.includes(slug);
      const wasDue = dueReviewSlugs(before).includes(slug);
      const after = markPracticePassed(slug);
      if (!wasMastered && after.mastered.includes(slug)) {
        track("lesson_mastered", { slug });
      } else if (wasMastered && wasDue) {
        track("review_completed", { slug, streak: after.review[slug]?.streak ?? 1 });
      } else {
        track("practice_set_passed", { slug, visualized: after.visualized.includes(slug) });
      }
    }
  }

  function retry(questionIndex: number) {
    setAnswers((current) => {
      const next = { ...current };
      delete next[questionIndex];
      return next;
    });
  }

  return (
    <section className="lesson-practice panel">
      <div className="practice-heading">
        <div>
          <span className="eyebrow">ЗАКРЕПИ МОДЕЛЬ</span>
          <h2>Два коротких checkpoint-вопроса</h2>
        </div>
        <p>Урок считается освоенным только после полного trace и двух верных checkpoint-ответов. Ошибка — повод ещё раз восстановить инвариант, а не просто посмотреть процент.</p>
      </div>
      <div className="practice-grid">
        {questions.map((question, questionIndex) => {
          const selected = answers[questionIndex];
          const revealed = selected !== undefined;
          const correct = selected === question.correctIndex;
          const questionPassed = Boolean(passed[questionIndex]);
          return (
            <article className="practice-question" key={question.prompt}>
              <span className="practice-number">0{questionIndex + 1}</span>
              <h3>{question.prompt}</h3>
              <div className="practice-options">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selected === optionIndex;
                  const isCorrect = revealed && optionIndex === question.correctIndex;
                  const className = [
                    "practice-option",
                    isSelected ? "practice-selected" : "",
                    isCorrect ? "practice-correct" : "",
                    revealed && isSelected && !correct ? "practice-wrong" : "",
                  ].filter(Boolean).join(" ");
                  return (
                    <button
                      className={className}
                      disabled={revealed || questionPassed}
                      key={option}
                      onClick={() => choose(questionIndex, optionIndex)}
                      type="button"
                    >
                      <span>{String.fromCharCode(65 + optionIndex)}</span>
                      {option}
                    </button>
                  );
                })}
              </div>
              {revealed ? (
                <div className={`practice-feedback ${correct ? "practice-feedback-correct" : "practice-feedback-wrong"}`} role="status">
                  <strong>{correct ? "Верно." : "Не совсем."}</strong> {question.explanation}
                  {!correct ? <button className="button button-ghost" type="button" onClick={() => retry(questionIndex)}>Попробовать ещё раз</button> : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
