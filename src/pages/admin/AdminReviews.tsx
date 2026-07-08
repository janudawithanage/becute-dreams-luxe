import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Search, Star, Trash2, Eye, EyeOff, Check, X, MessageSquare } from "lucide-react";
import { reviewsService, type Review, type ReviewStatus } from "@/features/reviews";
import { format } from "date-fns";
import { toast } from "sonner";
import { usePagination } from "@/shared/hooks";
import { PaginationControls } from "@/shared/components/ui/PaginationControls";

const statusVariant: Record<ReviewStatus, "success" | "warning" | "destructive"> = {
  approved: "success",
  pending: "warning",
  rejected: "destructive",
};

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReviewStatus>("all");
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await reviewsService.getAllReviews();
      setReviews(data);
    } catch {
      toast.error("Failed to load reviews.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (review: Review, status: ReviewStatus) => {
    try {
      const updated = await reviewsService.updateReview(review.id, { status });
      setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      toast.success(`Review ${status}.`);
    } catch {
      toast.error("Failed to update review status.");
    }
  };

  const handleToggleDisplay = async (review: Review) => {
    // Only approved reviews can be displayed
    if (review.status !== "approved" && !review.display_on_home) {
      toast.error("Approve the review first before displaying it on the home page.");
      return;
    }
    try {
      const updated = await reviewsService.updateReview(review.id, {
        display_on_home: !review.display_on_home,
      });
      setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      toast.success(
        updated.display_on_home
          ? "Review is now displayed on the home page."
          : "Review hidden from home page.",
      );
    } catch {
      toast.error("Failed to update display status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await reviewsService.deleteReview(deleteTarget.id);
      setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      toast.success("Review deleted.");
    } catch {
      toast.error("Failed to delete review.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pagination = usePagination(filtered, { pageSize: 10 });

  const displayCount = reviews.filter((r) => r.display_on_home).length;
  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">✦ Feedback</p>
          <h2 className="mt-2 font-display text-4xl tracking-tight">Reviews</h2>
        </div>
        <Card className="glass border-foreground/10 shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading reviews…</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">✦ Feedback</p>
          <h2 className="mt-2 font-display text-4xl tracking-tight">Reviews</h2>
        </div>
        <Card className="glass border-foreground/10 shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 font-display text-2xl">No reviews yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Reviews will appear here once customers submit them after delivery.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
          >
            ✦ Feedback
          </motion.p>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-2 font-display text-4xl tracking-tight"
          >
            Reviews
          </motion.h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Approve customer reviews and choose which ones show on the home page.
          </p>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          {[
            { label: "Total", value: reviews.length },
            { label: "Pending", value: pendingCount },
            { label: "On Home Page", value: displayCount },
          ].map((stat) => (
            <Card key={stat.label} className="glass border-foreground/10 shadow-soft">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 font-display text-4xl">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="glass border-foreground/10 shadow-soft">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 h-12 rounded-full border-foreground/10 bg-background/50"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(v) => setStatusFilter(v as "all" | ReviewStatus)}
                >
                  <SelectTrigger className="h-12 w-full rounded-full border-foreground/10 bg-background/50 sm:w-[160px] text-xs uppercase tracking-wider">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-foreground/5">
                    {["Customer", "Rating", "Review", "Date", "Status", "Home", "Actions"].map(
                      (h) => (
                        <TableHead
                          key={h}
                          className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                        >
                          {h}
                        </TableHead>
                      ),
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.paginatedItems.map((review) => (
                    <TableRow
                      key={review.id}
                      className="border-foreground/5 hover:bg-foreground/[0.02] transition align-top"
                    >
                      {/* Customer */}
                      <TableCell className="min-w-[130px]">
                        <p className="font-medium">{review.customer_name}</p>
                        {review.customer_location && (
                          <p className="text-xs text-muted-foreground">{review.customer_location}</p>
                        )}
                      </TableCell>

                      {/* Rating */}
                      <TableCell className="min-w-[90px]">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-foreground/10"
                              }`}
                            />
                          ))}
                        </div>
                      </TableCell>

                      {/* Review body */}
                      <TableCell className="max-w-xs">
                        <p className="line-clamp-3 text-sm">{review.body}</p>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="min-w-[100px] text-sm text-muted-foreground">
                        {format(new Date(review.created_at), "MMM dd, yyyy")}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge variant={statusVariant[review.status]} className="capitalize">
                          {review.status}
                        </Badge>
                      </TableCell>

                      {/* Display on home */}
                      <TableCell>
                        <button
                          onClick={() => handleToggleDisplay(review)}
                          title={review.display_on_home ? "Hide from home page" : "Show on home page"}
                          className={`transition-colors ${
                            review.display_on_home
                              ? "text-green-600 hover:text-red-500"
                              : "text-foreground/20 hover:text-green-600"
                          }`}
                        >
                          {review.display_on_home ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {review.status !== "approved" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Approve"
                              onClick={() => handleStatusChange(review, "approved")}
                              className="h-8 w-8 rounded-lg text-green-600 hover:bg-green-50 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          {review.status !== "rejected" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Reject"
                              onClick={() => handleStatusChange(review, "rejected")}
                              className="h-8 w-8 rounded-lg text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            onClick={() => setDeleteTarget(review)}
                            className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No reviews match your search.
                </div>
              )}

              {pagination.totalPages > 1 && (
                <div className="mt-6 flex flex-col items-center gap-2 border-t border-foreground/5 pt-6">
                  <PaginationControls
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    canGoPrev={pagination.canGoPrev}
                    canGoNext={pagination.canGoNext}
                    onPageChange={pagination.setPage}
                    getPageNumbers={pagination.getPageNumbers}
                  />
                  <p className="text-xs text-muted-foreground">
                    {filtered.length} review{filtered.length !== 1 ? "s" : ""} &middot; Page{" "}
                    {pagination.currentPage} of {pagination.totalPages}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete review?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the review from{" "}
              <strong>{deleteTarget?.customer_name}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
