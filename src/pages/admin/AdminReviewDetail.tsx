import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, MessageSquare } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { reviewsService, type Review } from "@/features/reviews";
import { format } from "date-fns";
import { toast } from "sonner";

const ease = [0.22, 1, 0.36, 1] as const;

export function AdminReviewDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) loadReview(id);
  }, [id]);

  const loadReview = async (reviewId: string) => {
    try {
      const all = await reviewsService.getAllReviews();
      const found = all.find((r) => r.id === reviewId) ?? null;
      setReview(found);
    } catch {
      toast.error("Failed to load review.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDisplay = async () => {
    if (!review) return;
    try {
      const updated = await reviewsService.updateReview(review.id, {
        display_on_home: !review.display_on_home,
      });
      setReview(updated);
      toast.success(
        updated.display_on_home
          ? "Review is now displayed on the home page."
          : "Review hidden from home page.",
      );
    } catch {
      toast.error("Failed to update display status.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Button variant="ghost" onClick={() => navigate("/admin/reviews")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Reviews
        </Button>
        <Card className="glass border-foreground/10 shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading review…</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="space-y-8">
        <Button variant="ghost" onClick={() => navigate("/admin/reviews")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Reviews
        </Button>
        <Card className="glass border-foreground/10 shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 font-display text-2xl">Review not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back + header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/reviews")}
          className="gap-2 mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reviews
        </Button>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease }}
          className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
        >
          ✦ Customer Feedback
        </motion.p>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="mt-2 font-display text-4xl tracking-tight"
        >
          Review Detail
        </motion.h2>
      </div>

      {/* Meta row */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease }}
        className="flex flex-wrap items-center gap-3"
      >
        <span className="text-xs text-muted-foreground uppercase tracking-widest">
          {format(new Date(review.created_at), "MMMM dd, yyyy")}
        </span>
        {review.display_on_home && (
          <span className="flex items-center gap-1 text-xs text-green-600 uppercase tracking-widest">
            <Eye className="h-3.5 w-3.5" />
            Showing on home
          </span>
        )}
      </motion.div>

      {/* Review card — styled like customer Testimonials */}
      <motion.figure
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease }}
        className="glass rounded-3xl p-8 shadow-soft"
      >
        {/* Stars */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`text-sm ${i < review.rating ? "text-gold" : "text-foreground/10"}`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Quote */}
        <span className="mt-4 block font-display text-6xl leading-none text-foreground/20">"</span>
        <blockquote className="-mt-4 font-display text-2xl leading-snug text-balance">
          {review.body}
        </blockquote>

        {/* Author */}
        <figcaption className="mt-8 flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center text-background text-sm font-medium shrink-0"
            style={{ background: "var(--gradient-ink)" }}
          >
            {review.customer_name[0]}
          </div>
          <div>
            <p className="font-medium">{review.customer_name}</p>
            {review.customer_location && (
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {review.customer_location}
              </p>
            )}
          </div>
        </figcaption>
      </motion.figure>

      {/* Display on home toggle */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease }}
      >
        <Button
          variant="outline"
          onClick={handleToggleDisplay}
          className="gap-2 rounded-full border-foreground/10 h-12 px-6 text-xs uppercase tracking-wider"
        >
          {review.display_on_home ? (
            <>
              <EyeOff className="h-4 w-4" />
              Hide from Home Page
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Show on Home Page
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
