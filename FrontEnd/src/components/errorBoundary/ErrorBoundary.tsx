import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errors: { error: Error; errorInfo: ErrorInfo | null }[]; // Список всех ошибок
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errors: [] };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Устанавливаем флаг hasError
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Добавляем ошибку в список ошибок
    this.setState((prevState) => ({
      errors: [...prevState.errors, { error, errorInfo }],
    }));

    // Логируем ошибку в консоль
    console.error("Uncaught error:", error, errorInfo);
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
                    <strong>Ошибка {index + 1}:</strong> {err.error.toString()}
                  </p>
                )}
                {err.errorInfo && (
                  <p>
                    <strong>Стек вызовов:</strong>
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

export default ErrorBoundary;
