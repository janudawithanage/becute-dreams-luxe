import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-dream px-4">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="mt-6 font-display text-4xl tracking-tight">
              Something went <em className="font-light">wrong</em>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              {this.state.error?.message || "An unexpected error occurred. Please try again."}
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button
                onClick={() => (window.location.href = "/")}
                className="rounded-full bg-gradient-ink px-8 text-xs uppercase tracking-[0.2em]"
              >
                Go Home
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="rounded-full px-8 text-xs uppercase tracking-[0.2em]"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
