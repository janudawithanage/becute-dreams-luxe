import { useState, useEffect, useMemo } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shared/components/ui/sheet";
import { Plus, Search, Edit, Trash2, Star, X, Package, Loader2 } from "lucide-react";
import { useCategoriesStore, type Category } from "@/features/categories";
import { useProductsStore } from "@/features/products";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { formatLKR } from "@/shared/utils/format";

// ─── Category Products Sheet ──────────────────────────────────────────────────

interface CategoryProductsSheetProps {
  category: Category | null;
  open: boolean;
  onClose: () => void;
}

function CategoryProductsSheet({ category, open, onClose }: CategoryProductsSheetProps) {
  const navigate = useNavigate();
  const { products, fetchProducts, isLoading: productsLoading } = useProductsStore();
  const [search, setSearch] = useState("");
  const [addSearch, setAddSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [unassignId, setUnassignId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchProducts();
      setSearch("");
      setAddSearch("");
      setSelected([]);
    }
  }, [open, fetchProducts]);

  // Products belonging to this category
  const categoryProducts = useMemo(() => {
    if (!category) return [];
    return products.filter((p) => p.category_id === category.id);
  }, [products, category]);

  // Products NOT in this category
  const availableProducts = useMemo(() => {
    if (!category) return [];
    return products.filter((p) => p.category_id !== category.id);
  }, [products, category]);

  const filteredCategoryProducts = categoryProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAvailable = availableProducts.filter((p) =>
    p.name.toLowerCase().includes(addSearch.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Assign selected products to this category
  const handleAddProducts = async () => {
    if (!category || selected.length === 0) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({ category_id: category.id, updated_at: new Date().toISOString() })
        .in("id", selected);

      if (error) throw error;

      await fetchProducts();
      setSelected([]);
      setAddSearch("");
      toast.success(
        `${selected.length} product${selected.length > 1 ? "s" : ""} added to category`
      );
    } catch {
      toast.error("Failed to add products");
    } finally {
      setSaving(false);
    }
  };

  // Unassign a product from this category (set category_id to null)
  const handleUnassignProduct = async () => {
    if (!unassignId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({ category_id: null, updated_at: new Date().toISOString() })
        .eq("id", unassignId);

      if (error) throw error;

      await fetchProducts();
      toast.success("Product removed from category");
    } catch {
      toast.error("Failed to remove product");
    } finally {
      setSaving(false);
      setUnassignId(null);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto border-foreground/10 bg-background p-0"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="px-6 py-5 border-b border-foreground/10 bg-background sticky top-0 z-10">
              <div className="flex items-start justify-between gap-3 pr-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                    ✦ Category
                  </p>
                  <SheetTitle className="font-display text-2xl tracking-tight">
                    {category?.name}
                  </SheetTitle>
                  <SheetDescription className="mt-1 text-xs text-muted-foreground">
                    Manage which products belong to this category
                  </SheetDescription>
                </div>
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider shrink-0 mt-1">
                  {categoryProducts.length} product{categoryProducts.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto">
              {/* Current Products */}
              <div className="px-6 pt-6 pb-4">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
                  Products in this category
                </p>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9 rounded-full border-foreground/10 text-sm"
                  />
                </div>

                {productsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredCategoryProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Package className="h-8 w-8 text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {search ? "No matching products" : "No products in this category yet"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Assign products from the section below
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredCategoryProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 rounded-xl p-2 hover:bg-foreground/[0.03] transition group"
                      >
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-foreground/5 shrink-0">
                          <img
                            src={getOptimizedImageUrl(product.image_url, {
                              width: 80,
                              format: "auto",
                            })}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatLKR(product.price)}
                            {product.tags && product.tags.length > 0 && (
                              <span className="ml-2 opacity-60">· {product.tags[0]}</span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-foreground/5"
                            onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                            title="Edit product"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-red-50"
                            onClick={() => setUnassignId(product.id)}
                            title="Remove from category"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="mx-6 border-t border-foreground/10" />

              {/* Assign Products Section */}
              <div className="px-6 pt-4 pb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Assign products
                  </p>
                  {selected.length > 0 && (
                    <Button
                      size="sm"
                      disabled={saving}
                      onClick={handleAddProducts}
                      className="h-8 rounded-full bg-gradient-ink px-4 text-[10px] uppercase tracking-wider text-background shadow-soft"
                    >
                      {saving ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Plus className="h-3 w-3 mr-1" />
                          Assign {selected.length} selected
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={addSearch}
                    onChange={(e) => setAddSearch(e.target.value)}
                    className="pl-9 h-9 rounded-full border-foreground/10 text-sm"
                  />
                </div>

                {filteredAvailable.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    {addSearch ? "No matching products" : "All products are already in this category"}
                  </p>
                ) : (
                  <div className="space-y-1">
                    {filteredAvailable.map((product) => {
                      const isSelected = selected.includes(product.id);
                      return (
                        <label
                          key={product.id}
                          htmlFor={`assign-${product.id}`}
                          className="flex items-center gap-3 rounded-xl p-2 hover:bg-foreground/[0.03] transition cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            id={`assign-${product.id}`}
                            checked={isSelected}
                            onChange={() => toggleSelect(product.id)}
                            className="h-4 w-4 rounded border-foreground/20 accent-foreground"
                          />
                          <div className="h-10 w-10 rounded-lg overflow-hidden bg-foreground/5 shrink-0">
                            <img
                              src={getOptimizedImageUrl(product.image_url, {
                                width: 80,
                                format: "auto",
                              })}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatLKR(product.price)}
                              {product.category && (
                                <span className="ml-2 opacity-60">
                                  · currently in {product.category.name}
                                </span>
                              )}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Unassign product confirm */}
      <AlertDialog open={!!unassignId} onOpenChange={() => setUnassignId(null)}>
        <AlertDialogContent className="glass border-foreground/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl">Remove Product</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Remove this product from the category? It will become uncategorized but won't be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-11 rounded-full px-6 text-xs uppercase tracking-[0.15em] border-foreground/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnassignProduct}
              className="h-11 rounded-full bg-red-600 px-6 text-xs uppercase tracking-[0.15em] text-white hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── AdminCategories ──────────────────────────────────────────────────────────

export function AdminCategories() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [productsSheet, setProductsSheet] = useState<Category | null>(null);

  const categories = useCategoriesStore((s) => s.categories);
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);
  const deleteCategory = useCategoriesStore((s) => s.deleteCategory);

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
      } catch {
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
                                <span className="text-[10px] text-muted-foreground">No img</span>
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
                              size="sm"
                              onClick={() => setProductsSheet(category)}
                              className="h-9 rounded-lg px-3 hover:bg-foreground/5 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                              title="Manage products"
                            >
                              <Package className="h-3.5 w-3.5 mr-1.5" />
                              Products
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
                              className="h-9 w-9 rounded-lg hover:bg-foreground/5"
                              title="Edit category"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(category.id)}
                              className="h-9 w-9 rounded-lg hover:bg-red-50"
                              title="Delete category"
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

      {/* Delete Category Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass border-foreground/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl">Delete Category</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this category? Products in this category will become
              uncategorized.
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

      {/* Products Sheet */}
      <CategoryProductsSheet
        category={productsSheet}
        open={!!productsSheet}
        onClose={() => setProductsSheet(null)}
      />
    </>
  );
}
