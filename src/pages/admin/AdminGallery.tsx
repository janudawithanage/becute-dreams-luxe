import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
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
import { Search, Plus, Edit, Trash2, Image as ImageIcon, Instagram, Loader2, X } from "lucide-react";
import { motion } from "framer-motion";
import { galleryService, type GalleryImage } from "@/features/gallery";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { toast } from "sonner";

export function AdminGallery() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      setIsLoading(true);
      const images = await galleryService.getAllGalleryImages();
      setGalleryImages(images);
    } catch (error) {
      console.error("Error loading gallery images:", error);
      toast.error("Failed to load gallery images");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeletingId(deleteId);
      await galleryService.deleteGalleryImage(deleteId);
      toast.success("Gallery image deleted successfully");
      loadGalleryImages();
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      toast.error("Failed to delete gallery image");
    } finally {
      setDeletingId(null);
      setDeleteId(null);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await galleryService.toggleActiveStatus(id, !currentStatus);
      toast.success(`Gallery image ${!currentStatus ? "activated" : "deactivated"}`);
      loadGalleryImages();
    } catch (error) {
      console.error("Error toggling gallery image status:", error);
      toast.error("Failed to update gallery image status");
    }
  };

  const filteredImages = galleryImages.filter((image) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      image.instagram_url.toLowerCase().includes(searchLower) ||
      image.id.toLowerCase().includes(searchLower);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && image.is_active) ||
      (statusFilter === "inactive" && !image.is_active);
    return matchesSearch && matchesStatus;
  });

  const hasActiveFilters = statusFilter !== "all";

  const clearFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
              ✦ Instagram Gallery
            </motion.p>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-2 font-display text-4xl tracking-tight"
            >
              Gallery Images
            </motion.h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage images displayed in the Instagram gallery section on the homepage
            </p>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              onClick={() => navigate("/admin/gallery/new")}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-ink px-6 text-xs uppercase tracking-[0.2em] text-background shadow-soft transition hover:shadow-luxe"
            >
              <Plus className="h-4 w-4" />
              Add Image
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
                    placeholder="Search by Instagram URL or ID..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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
                      Image
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Instagram URL
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Order
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-right text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredImages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                        <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                        <p>No gallery images found</p>
                        <Button
                          variant="ghost"
                          onClick={() => navigate("/admin/gallery/new")}
                          className="mt-4 text-xs uppercase tracking-wider"
                        >
                          Add your first image
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredImages.map((image) => (
                      <TableRow
                        key={image.id}
                        className="border-foreground/5 hover:bg-foreground/[0.02] transition"
                      >
                        <TableCell>
                          <div className="h-12 w-12 rounded-xl overflow-hidden bg-foreground/5">
                            <img
                              src={getOptimizedImageUrl(image.image_url, {
                                width: 100,
                                format: "auto",
                                quality: 80,
                              })}
                              alt="Gallery"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <a
                            href={image.instagram_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blush hover:underline inline-flex items-center gap-1"
                          >
                            <Instagram className="h-3 w-3" />
                            {image.instagram_url.length > 40
                              ? `${image.instagram_url.substring(0, 40)}...`
                              : image.instagram_url}
                          </a>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {image.display_order}
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleToggleActive(image.id, image.is_active)}
                            className="cursor-pointer"
                          >
                            <Badge
                              variant={image.is_active ? "default" : "secondary"}
                              className={
                                image.is_active
                                  ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 text-[10px] uppercase tracking-wider"
                                  : "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 text-[10px] uppercase tracking-wider"
                              }
                            >
                              {image.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/admin/gallery/${image.id}/edit`)}
                              className="h-9 w-9 rounded-lg hover:bg-foreground/5"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(image.id)}
                              disabled={deletingId === image.id}
                              className="h-9 w-9 rounded-lg hover:bg-red-50"
                            >
                              {deletingId === image.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-red-600" />
                              )}
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
            <AlertDialogTitle className="font-display text-xl">Delete Gallery Image</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this gallery image? This action cannot be undone.
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
