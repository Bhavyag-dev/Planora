import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const { hasError, error } = this.state;
    const { children } = (this as any).props;

    if (hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-bold text-zinc-900">Something went wrong</h2>
          <p className="mt-2 text-zinc-500">We've encountered an unexpected error. Please try refreshing the page.</p>
          <button
            className="mt-6 rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
          {(import.meta as any).env?.DEV && (
            <pre className="mt-8 max-w-full overflow-auto rounded bg-zinc-100 p-4 text-left text-xs text-red-600">
              {error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return children;
  }
}
