import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-dream px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-[8rem] leading-none">404</h1>
        <p className="mt-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          This page is dreaming elsewhere
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
