import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorData {
  error: Error;
  errorInfo: ErrorInfo | null;
  stack: string;
  fileLine: string;
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errors: ErrorData[];
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errors: [] };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const stack = error.stack || "Stack trace unavailable";
    const fileLineRegex = /(?:at\s+.*\()?(.*\.(?:ts|js)x?):(\d+):(\d+)/;
    let fileLineMatch = stack.match(fileLineRegex) || error.message.match(fileLineRegex);
    const fileLine = fileLineMatch ? `${fileLineMatch[1]}:${fileLineMatch[2]}:${fileLineMatch[3]}` : "";
    const errorDetails = fileLineMatch
      ? `${fileLineMatch[1]} at line ${fileLineMatch[2]}, column ${fileLineMatch[3]}`
      : "File and line number not found";


    this.setState((prevState) => ({
      hasError: true,
      errors: [
        ...prevState.errors,
        {
          error,
          errorInfo,
          stack,
          fileLine,
          errorDetails
        }
      ]
    }));
    // console.error("Uncaught error:\n", stack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>Что-то пошло не так.</h1>
          <p>Попробуйте обновить страницу или вернитесь позже.</p>
          <details style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
            {this.state.errors.map((err, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                {err.error && (
                  <p>
                    <strong>Ошибка {index + 1}:</strong> {err.error.message}
                  </p>
                )}
                {(
                  <p>
                    <strong>Файл с ошибкой:</strong> {err.fileLine}
                  </p>
                )}
                {err.stack && (
                  <p>
                    <strong>Стек вызовов:</strong>
                    <br />
                    {err.stack}
                  </p>
                )}
                {err.errorInfo && (
                  <p>
                    <strong>React-компоненты:</strong>
                    <br />
                    {err.errorInfo.componentStack}
                  </p>
                )}
              </div>
            ))}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
