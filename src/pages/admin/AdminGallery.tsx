import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Search, Plus, Edit, Trash2, Image as ImageIcon, Instagram, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { galleryService, type GalleryImage } from "@/features/gallery";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { toast } from "sonner";

export function AdminGallery() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery image?")) {
      return;
    }

    try {
      setDeletingId(id);
      await galleryService.deleteGalleryImage(id);
      toast.success("Gallery image deleted successfully");
      loadGalleryImages();
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      toast.error("Failed to delete gallery image");
    } finally {
      setDeletingId(null);
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
    return (
      image.instagram_url.toLowerCase().includes(searchLower) ||
      image.id.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          ✦ Instagram Gallery
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            <h2 className="font-display text-4xl tracking-tight lg:text-5xl">Gallery Images</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage images displayed in the Instagram gallery section on the homepage
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/gallery/new")}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-ink px-6 text-xs uppercase tracking-[0.2em] text-background shadow-soft transition hover:shadow-luxe"
          >
            <Plus className="h-4 w-4" />
            Add Image
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid gap-6 md:grid-cols-3"
      >
        <Card className="glass border-foreground/10 shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blush/20 to-lavender/20">
                <ImageIcon className="h-6 w-6 text-blush" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{galleryImages.length}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Total Images
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-foreground/10 shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                <ImageIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {galleryImages.filter((i) => i.is_active).length}
                </p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Active Images
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-foreground/10 shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Instagram className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{filteredImages.length}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Filtered Results
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass border-foreground/10 shadow-soft">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by Instagram URL or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-full border-foreground/10 pl-11 pr-4"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gallery Images Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="glass border-foreground/10 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-foreground/5 hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wider">Image</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Instagram URL</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Order</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredImages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-muted-foreground">No gallery images found</p>
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
                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted">
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
                      <TableCell>
                        <span className="text-sm">{image.display_order}</span>
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
                                ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                                : "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20"
                            }
                          >
                            {image.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
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
                            onClick={() => handleDelete(image.id)}
                            disabled={deletingId === image.id}
                            className="h-9 w-9 rounded-lg hover:bg-red-500/10 hover:text-red-600"
                          >
                            {deletingId === image.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
