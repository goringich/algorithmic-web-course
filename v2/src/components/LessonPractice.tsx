"use client";

import { useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import { practiceBySlug, type PracticeQuestion } from "@/lib/practice";

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

  if (!questions.length) return null;

  function choose(questionIndex: number, optionIndex: number) {
    if (answers[questionIndex] !== undefined) return;
    const question = questions[questionIndex];
    const correct = optionIndex === question.correctIndex;
    setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }));
    track("practice_attempt", { slug, question: questionIndex + 1, correct });
    if (correct) track("practice_correct", { slug, question: questionIndex + 1 });
  }

  return (
    <section className="lesson-practice panel">
      <div className="practice-heading">
        <div>
          <span className="eyebrow">ЗАКРЕПИ МОДЕЛЬ</span>
          <h2>Два коротких checkpoint-вопроса</h2>
        </div>
        <p>Если ответ не получается объяснить своими словами, вернись к симуляции и найди шаг, который доказывает инвариант.</p>
      </div>
      <div className="practice-grid">
        {questions.map((question, questionIndex) => {
          const selected = answers[questionIndex];
          const revealed = selected !== undefined;
          const correct = selected === question.correctIndex;
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
                    revealed && isSelected && !isCorrect ? "practice-wrong" : "",
                  ].filter(Boolean).join(" ");
                  return (
                    <button
                      className={className}
                      disabled={revealed}
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
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
