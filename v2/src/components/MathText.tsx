import { isSupportedMathSource, splitMathText, tokenizeMathSource, type MathToken } from "@/lib/mathNotation";

function renderToken(token: MathToken, index: number) {
  const key = `${token.kind}-${index}-${token.value}`;

  if (token.kind === "identifier") {
    if (token.exponent) {
      return (
        <msup key={key}>
          <mi>{token.value}</mi>
          <mn>{token.exponent}</mn>
        </msup>
      );
    }
    return <mi key={key}>{token.value}</mi>;
  }

  if (token.kind === "number") return <mn key={key}>{token.value}</mn>;
  if (token.kind === "operator") return <mo key={key}>{token.value}</mo>;
  return <mspace key={key} width="0.22em" />;
}

export function MathExpression({ source, display = false }: { source: string; display?: boolean }) {
  if (!isSupportedMathSource(source)) return <span className="math-source-fallback">{source}</span>;

  return (
    <span
      aria-label={source}
      className={`math-expression ${display ? "math-expression-display" : "math-expression-inline"}`}
      role="math"
    >
      <math aria-hidden="true" display={display ? "block" : "inline"}>
        <mrow>{tokenizeMathSource(source).map(renderToken)}</mrow>
      </math>
    </span>
  );
}

export function MathText({ children }: { children: string }) {
  return (
    <>
      {splitMathText(children).map((segment, index) => {
        if (segment.kind === "text") return <span key={`text-${index}`}>{segment.value}</span>;
        return <MathExpression display={segment.display} key={`math-${index}`} source={segment.source} />;
      })}
    </>
  );
}
