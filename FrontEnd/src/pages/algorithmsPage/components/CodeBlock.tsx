import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { styled } from "@mui/system";
import { Theme } from "@mui/material/styles";
import { Grid2 } from "@mui/material";

const Code = styled(Grid2)<{ theme: Theme }>(({ theme }) => ({
  width: "90%",
  boxShadow: theme.shadows[3],
  margin: "auto",
  marginBottom: theme.spacing(4)
}));

const CodeBlock = ({ code, language = "cpp" }) => {
  return (
    <Code>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        wrapLongLines={true}
        customStyle={{
          wordBreak: "break-word",
          overflowX: "hidden",
        }}
        codeTagProps={{
          style: {
            wordBreak: "break-word",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </Code>
  );
};

export default CodeBlock;
