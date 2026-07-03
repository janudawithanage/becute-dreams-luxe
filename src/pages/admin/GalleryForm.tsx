import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { ArrowLeft, Upload, X, Loader2, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { galleryService } from "@/features/gallery";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";

const galleryImageSchema = z.object({
  instagram_url: z.string().url("Must be a valid URL"),
  display_order: z.number().min(0, "Display order must be 0 or greater"),
  is_active: z.boolean(),
});

type GalleryImageFormData = z.infer<typeof galleryImageSchema>;

export function GalleryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [image, setImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(isEditing);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<GalleryImageFormData>({
    resolver: zodResolver(galleryImageSchema),
    defaultValues: {
      instagram_url: "https://www.instagram.com/becute_dreams?igsh=cHExODhycW5obXo3",
      display_order: 0,
      is_active: true,
    },
  });

  // Load existing gallery image if editing
  useEffect(() => {
    if (isEditing && id) {
      setIsLoadingImage(true);
      galleryService
        .getGalleryImageById(id)
        .then((galleryImage) => {
          if (galleryImage) {
            reset({
              instagram_url: galleryImage.instagram_url,
              display_order: galleryImage.display_order,
              is_active: galleryImage.is_active,
            });
            if (galleryImage.image_url) {
              setImage(galleryImage.image_url);
            }
          }
          setIsLoadingImage(false);
        })
        .catch((error) => {
          console.error("Error loading gallery image:", error);
          toast.error("Failed to load gallery image");
          setIsLoadingImage(false);
        });
    }
  }, [id, isEditing, reset]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file for upload
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage("");
    setImageFile(null);
  };

  const onSubmit = async (data: GalleryImageFormData) => {
    // Validate image is provided
    if (!image && !imageFile) {
      toast.error("Please upload an image");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = image;

      // Upload new image to Cloudinary if a file was selected
      if (imageFile) {
        toast.info("Uploading image to Cloudinary...");
        const uploadResult = await uploadToCloudinary(imageFile, {
          folder: "becute-dreams-luxe/gallery",
        });
        imageUrl = uploadResult.secure_url;
        toast.success("Image uploaded successfully!");
      }

      const galleryImageData = {
        image_url: imageUrl,
        instagram_url: data.instagram_url,
        display_order: data.display_order,
        is_active: data.is_active,
      };

      if (isEditing && id) {
        await galleryService.updateGalleryImage(id, galleryImageData);
        toast.success("Gallery image updated successfully!");
      } else {
        await galleryService.createGalleryImage(galleryImageData);
        toast.success("Gallery image created successfully!");
      }

      navigate("/admin/gallery");
    } catch (error) {
      console.error("Error saving gallery image:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingImage) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full hover:bg-foreground/5"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
          >
            ✦ {isEditing ? "Edit" : "Create"}
          </motion.p>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-1 font-display text-4xl tracking-tight"
          >
            {isEditing ? "Edit Gallery Image" : "Add New Gallery Image"}
          </motion.h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEditing
              ? "Update gallery image details"
              : "Add a new image to the Instagram gallery section"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery Image Upload */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-2xl tracking-tight">
                  Gallery Image *
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {image ? (
                  <div className="relative aspect-square max-w-md group">
                    <img
                      src={image}
                      alt="Gallery"
                      className="rounded-2xl object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-soft"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="aspect-square max-w-md border-2 border-dashed border-foreground/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-foreground hover:bg-foreground/5 transition-all"
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">
                      Upload Image
                    </span>
                    <span className="text-xs text-muted-foreground mt-2">
                      Required: Recommended 800x800px square
                    </span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Instagram URL */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-2xl tracking-tight">
                  Instagram Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="instagram_url"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram URL *
                  </Label>
                  <Input
                    id="instagram_url"
                    placeholder="https://www.instagram.com/p/your-post/"
                    className="h-12 rounded-xl border-foreground/10"
                    {...register("instagram_url")}
                  />
                  {errors.instagram_url && (
                    <p className="text-xs text-red-600">{errors.instagram_url.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    The Instagram URL users will be redirected to when clicking this image
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="display_order"
                      className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      Display Order
                    </Label>
                    <Input
                      id="display_order"
                      type="number"
                      placeholder="0"
                      className="h-12 rounded-xl border-foreground/10"
                      {...register("display_order", { valueAsNumber: true })}
                    />
                    {errors.display_order && (
                      <p className="text-xs text-red-600">{errors.display_order.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Lower numbers appear first in the gallery
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="is_active"
                      className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      Status
                    </Label>
                    <div className="flex items-center gap-3 pt-2">
                      <Switch
                        id="is_active"
                        checked={watch("is_active")}
                        onCheckedChange={(checked) => setValue("is_active", checked)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {watch("is_active") ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Only active images are shown on the website
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          {/* Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-xl tracking-tight">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-full bg-gradient-ink text-xs uppercase tracking-[0.2em] shadow-soft hover:shadow-luxe"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{isEditing ? "Update Image" : "Save Image"}</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-12 rounded-full text-xs uppercase tracking-[0.2em] hover:bg-foreground/5"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-xl tracking-tight">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground mb-1">Image Guidelines</p>
                  <p className="text-xs">
                    Use square images (800x800px) for best display. Images will be automatically
                    optimized.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Instagram Links</p>
                  <p className="text-xs">
                    You can link to your profile, specific posts, or reels. Each image can have a
                    different link.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Display Order</p>
                  <p className="text-xs">
                    Use increments of 10 (0, 10, 20) to easily reorder images later. Up to 8 active
                    images are shown.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </form>
  );
}
