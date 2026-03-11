import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error?.message || 'Unknown runtime error',
    };
  }

  componentDidCatch(error: Error) {
    // Keep stack in devtools while showing a visible fallback instead of blank screen.
    console.error('App runtime error:', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-bg-primary px-4 py-10 text-text-primary">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-bg-card p-6">
          <h1 className="text-xl font-semibold">Application Error</h1>
          <p className="mt-2 text-sm text-text-muted">
            A runtime error occurred. This fallback prevents a blank page.
          </p>
          <pre className="mt-4 overflow-auto rounded-xl bg-bg-input p-3 text-xs text-error">
            {this.state.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 min-h-11 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-bg-hover"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
