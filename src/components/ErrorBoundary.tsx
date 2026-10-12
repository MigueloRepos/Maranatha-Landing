import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Ignore browser extension errors
    if (
      error.message?.includes("chrome: call method") ||
      error.stack?.includes("chrome-extension://")
    ) {
      this.setState({ hasError: false });
      return;
    }
    console.warn("Caught in ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-background text-foreground">
          <h2 className="font-display text-3xl text-foreground">Algo ha ocurrido al cargar la página</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Puedes intentar recargar la página para volver a disfrutar de la experiencia.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-105"
          >
            Recargar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
