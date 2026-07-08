import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
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
import { Search, Star, Eye, EyeOff, MessageSquare, X } from "lucide-react";
import { reviewsService, type Review } from "@/features/reviews";
import { format } from "date-fns";
import { toast } from "sonner";
import { usePagination } from "@/shared/hooks";
import { PaginationControls } from "@/shared/components/ui/PaginationControls";

export function AdminReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayFilter, setDisplayFilter] = useState<"all" | "shown" | "hidden">("all");

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

  const handleToggleDisplay = async (e: React.MouseEvent, review: Review) => {
    e.stopPropagation();
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

  const hasActiveFilters = displayFilter !== "all";

  const clearFilters = () => {
    setDisplayFilter("all");
    setSearchQuery("");
  };

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDisplay =
      displayFilter === "all" ||
      (displayFilter === "shown" && r.display_on_home) ||
      (displayFilter === "hidden" && !r.display_on_home);
    return matchesSearch && matchesDisplay;
  });

  const pagination = usePagination(filtered, { pageSize: 10 });

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
          View and manage customer reviews
        </p>
      </div>

      {/* Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
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
                value={displayFilter}
                onValueChange={(v) => setDisplayFilter(v as "all" | "shown" | "hidden")}
              >
                <SelectTrigger className="h-12 w-full rounded-full border-foreground/10 bg-background/50 sm:w-[160px] text-xs uppercase tracking-wider">
                  <SelectValue placeholder="Home Page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="shown">On Home Page</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
              {(hasActiveFilters || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-12 rounded-full px-4 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  <X className="mr-1 h-3 w-3" />
                  Clear
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-foreground/5">
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Customer
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Rating
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Review
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Home
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.paginatedItems.map((review) => (
                  <TableRow
                    key={review.id}
                    onClick={() => navigate(`/admin/reviews/${review.id}`)}
                    className="border-foreground/5 hover:bg-foreground/[0.02] transition cursor-pointer"
                  >
                    {/* Customer */}
                    <TableCell className="font-medium">
                      <p>{review.customer_name}</p>
                      {review.customer_location && (
                        <p className="text-xs text-muted-foreground">{review.customer_location}</p>
                      )}
                    </TableCell>

                    {/* Rating */}
                    <TableCell>
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
                      <p className="line-clamp-2 text-sm">{review.body}</p>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-sm">
                      {format(new Date(review.created_at), "MMM dd, yyyy")}
                    </TableCell>

                    {/* Display on home */}
                    <TableCell>
                      <button
                        onClick={(e) => handleToggleDisplay(e, review)}
                        title={
                          review.display_on_home ? "Hide from home page" : "Show on home page"
                        }
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
  );
}
