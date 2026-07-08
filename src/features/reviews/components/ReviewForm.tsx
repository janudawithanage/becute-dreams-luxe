import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star as _Star, Send, CheckCircle } from "lucide-react";
import { reviewsService } from "@/features/reviews";
import type { User } from "@/features/auth";
import { cn } from "@/shared/utils/cn";

const ease = [0.22, 1, 0.36, 1] as const;

interface ReviewFormProps {
  orderId: string;
  user: User;
}

export function ReviewForm({ orderId, user }: ReviewFormProps) {
  const [alreadyReviewed, setAlreadyReviewed] = useState<boolean | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [body, setBody] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    reviewsService.hasReviewedOrder(orderId, user.id).then(setAlreadyReviewed);
  }, [orderId, user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (body.trim().length < 10) {
      setError("Please write at least 10 characters.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await reviewsService.createReview({
        order_id: orderId,
        user_id: user.id,
        customer_name: user.name || user.email,
        customer_location: location.trim() || undefined,
        rating,
        body: body.trim(),
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Still checking
  if (alreadyReviewed === null) return null;

  // Already reviewed
  if (alreadyReviewed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="mt-6 rounded-3xl border bg-background p-8 shadow-soft"
      >
        <div className="flex items-center gap-3 text-green-600">
          <CheckCircle className="h-5 w-5" />
          <p className="font-display text-xl">Review submitted — thank you! 🩷</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Your review has been received. Thank you for your feedback!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease, delay: 0.35 }}
      className="mt-6 rounded-3xl border bg-background p-8 shadow-soft"
    >
      <h2 className="font-display text-2xl">Leave a review</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        How was your experience with this order?
      </p>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mt-6 flex flex-col items-center gap-3 py-6 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="h-7 w-7 text-green-600" />
            </div>
            <p className="font-display text-2xl">Thank you! 🩷</p>
            <p className="text-sm text-muted-foreground">
              Your review has been received. Thank you for your feedback!
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
            {/* Star rating */}
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Rating
              </label>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                    aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                  >
                    <span
                      className={cn(
                        "transition-colors",
                        (hoverRating || rating) >= star
                          ? "text-yellow-400"
                          : "text-foreground/20",
                      )}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Review body */}
            <div>
              <label
                htmlFor="review-body"
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                Your review
              </label>
              <textarea
                id="review-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                placeholder="Tell us about your experience with the packaging, quality, and delivery..."
                className="mt-2 w-full rounded-2xl border border-foreground/10 bg-background/50 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:outline-none resize-none transition"
              />
            </div>

            {/* Optional location */}
            <div>
              <label
                htmlFor="review-location"
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                Location <span className="normal-case tracking-normal opacity-50">(optional)</span>
              </label>
              <input
                id="review-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Colombo, Sri Lanka"
                className="mt-2 w-full rounded-2xl border border-foreground/10 bg-background/50 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:outline-none transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-xs uppercase tracking-[0.25em] text-background transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                  Submitting…
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Submit review
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
