import React from "react";
import Highlight, { Prism, themes } from "prism-react-renderer";

// Используем тему nightOwl (или другую доступную)
const theme = themes.nightOwl;

const CodeBlock = ({ code, language }) => {
  return (
    <Highlight Prism={Prism} code={code} language={language} theme={theme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, padding: "20px", borderRadius: "5px" }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default CodeBlock;
