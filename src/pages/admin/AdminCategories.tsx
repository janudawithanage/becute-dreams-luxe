import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Badge } from "@/shared/components/ui/badge";
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
import { Plus, Search, Edit, Trash2, Star, X } from "lucide-react";
import { useCategoriesStore } from "@/features/categories";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

export function AdminCategories() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categories = useCategoriesStore((s) => s.categories);
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);
  const deleteCategory = useCategoriesStore((s) => s.deleteCategory);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "featured" && category.featured) ||
      (statusFilter === "regular" && !category.featured);
    return matchesSearch && matchesStatus;
  });

  const hasActiveFilters = statusFilter !== "all";

  const clearFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteCategory(deleteId);
        toast.success("Category deleted successfully");
      } catch (error) {
        toast.error("Failed to delete category");
      }
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
            >
              ✦ Organization
            </motion.p>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-2 font-display text-4xl tracking-tight"
            >
              Categories
            </motion.h2>
            <p className="mt-2 text-sm text-muted-foreground">Manage your product categories</p>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              onClick={() => navigate("/admin/categories/new")}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-ink px-6 text-xs uppercase tracking-[0.2em] text-background shadow-soft transition hover:shadow-luxe"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </motion.div>
        </div>

        {/* Content */}
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
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 h-12 rounded-full border-foreground/10 bg-background/50"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 w-full rounded-full border-foreground/10 bg-background/50 sm:w-[160px] text-xs uppercase tracking-wider">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
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
                      Category
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Slug
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Order
                    </TableHead>
                    <TableHead className="text-right text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow
                        key={category.id}
                        className="border-foreground/5 hover:bg-foreground/[0.02] transition"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {category.image_url ? (
                              <div className="h-12 w-12 rounded-xl overflow-hidden bg-foreground/5">
                                <img
                                  src={getOptimizedImageUrl(category.image_url, {
                                    width: 100,
                                    format: "auto",
                                  })}
                                  alt={category.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">No image</span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{category.name}</p>
                              {category.description && (
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                  {category.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="rounded-lg bg-foreground/5 px-2 py-1 text-xs text-muted-foreground">
                            {category.slug}
                          </code>
                        </TableCell>
                        <TableCell>
                          {category.featured ? (
                            <Badge
                              variant="secondary"
                              className="gap-1 text-[10px] uppercase tracking-wider"
                            >
                              <Star className="h-3 w-3 fill-current" />
                              Featured
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="text-[10px] uppercase tracking-wider"
                            >
                              Regular
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {category.sort_order}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
                              className="h-9 w-9 rounded-lg hover:bg-foreground/5"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(category.id)}
                              className="h-9 w-9 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass border-foreground/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl">Delete Category</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this category? This action cannot be undone.
              Products in this category will remain but will no longer be categorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-11 rounded-full px-6 text-xs uppercase tracking-[0.15em] border-foreground/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="h-11 rounded-full bg-red-600 px-6 text-xs uppercase tracking-[0.15em] text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
