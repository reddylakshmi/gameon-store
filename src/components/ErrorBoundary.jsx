import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#070b11] px-4">
          <div className="w-full max-w-lg rounded-[2rem] border border-red-500/30 bg-red-500/5 p-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-red-400">Terminal Error</p>
            <h1 className="mt-3 text-2xl font-black uppercase tracking-[0.08em] text-white">
              Something went wrong
            </h1>
            <p className="mt-4 text-sm text-white/60">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              type="button"
              className="mt-6 h-12 rounded-2xl bg-gradient-to-r from-red-700 to-red-500 px-6 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:brightness-110"
              onClick={() => window.location.reload()}
            >
              Reload Terminal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
