import { Loader2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <Loader2 className={cn("animate-spin text-muted-foreground", sizeClasses[size], className)} />
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="glass rounded-3xl p-8 shadow-luxe">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = "Loading..." }: PageLoadingProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-2xl bg-muted"></div>
      <div className="mt-4 flex items-baseline justify-between">
        <div className="h-5 w-32 rounded bg-muted"></div>
        <div className="h-4 w-12 rounded bg-muted"></div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-foreground/5">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-muted animate-pulse"></div>
            <div className="h-3 w-20 rounded bg-muted animate-pulse"></div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="h-4 w-24 rounded bg-muted animate-pulse"></div>
      </td>
      <td className="p-4">
        <div className="h-4 w-16 rounded bg-muted animate-pulse"></div>
      </td>
      <td className="p-4">
        <div className="flex justify-end gap-2">
          <div className="h-9 w-9 rounded-lg bg-muted animate-pulse"></div>
          <div className="h-9 w-9 rounded-lg bg-muted animate-pulse"></div>
          <div className="h-9 w-9 rounded-lg bg-muted animate-pulse"></div>
        </div>
      </td>
    </tr>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-3xl p-6 shadow-soft animate-pulse">
      <div className="h-4 w-24 rounded bg-muted mb-4"></div>
      <div className="h-8 w-32 rounded bg-muted mb-2"></div>
      <div className="h-3 w-48 rounded bg-muted"></div>
    </div>
  );
}
