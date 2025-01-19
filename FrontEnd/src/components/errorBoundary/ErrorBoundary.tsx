import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo; 
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Обновляем состояние для отображения резервного UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Логируем ошибку в консоль или отправляем в службу мониторинга
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo }); // Сохраняем информацию о стеке вызовов
  }

  render() {
    if (this.state.hasError) {
      // Резервный UI с информацией об ошибке
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>Что-то пошло не так.</h1>
          <p>Попробуйте обновить страницу или вернитесь позже.</p>
          <details style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
            {this.state.error && (
              <p>
                <strong>Ошибка:</strong> {this.state.error.toString()}
              </p>
            )}
            {this.state.errorInfo && (
              <p>
                <strong>Стек вызовов:</strong>
                <br />
                {this.state.errorInfo.componentStack}
              </p>
            )}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
