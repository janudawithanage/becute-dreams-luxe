import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCollectionsStore } from "@/features/collections";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import { collectionsService } from "@/features/collections";

const collectionSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().optional(),
  featured: z.boolean(),
  sort_order: z.number().min(0, "Sort order must be 0 or greater"),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

export function CollectionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [image, setImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCollection, setIsLoadingCollection] = useState(isEditing);

  const getCollectionById = useCollectionsStore((s) => s.getCollectionById);
  const createCollection = useCollectionsStore((s) => s.createCollection);
  const updateCollection = useCollectionsStore((s) => s.updateCollection);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      featured: false,
      sort_order: 0,
    },
  });

  // Load existing collection if editing
  useEffect(() => {
    if (isEditing && id) {
      setIsLoadingCollection(true);
      getCollectionById(id).then((collection) => {
        if (collection) {
          reset({
            name: collection.name,
            slug: collection.slug,
            description: collection.description || '',
            featured: collection.featured,
            sort_order: collection.sort_order,
          });
          setImage(collection.image_url);
        }
        setIsLoadingCollection(false);
      });
    }
  }, [id, isEditing, getCollectionById, reset]);

  // Auto-generate slug from name
  const name = watch("name");
  useEffect(() => {
    if (!isEditing && name) {
      const slug = collectionsService.generateSlug(name);
      setValue("slug", slug);
    }
  }, [name, isEditing, setValue]);

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

  const onSubmit = async (data: CollectionFormData) => {
    if (!image) {
      toast.error("Please upload a collection image");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = image;

      // Upload new image to Cloudinary if a file was selected
      if (imageFile) {
        toast.info("Uploading image to Cloudinary...");
        const uploadResult = await uploadToCloudinary(imageFile, {
          folder: 'becute-dreams-luxe/collections'
        });
        imageUrl = uploadResult.secure_url;
        toast.success("Image uploaded successfully!");
      }

      const collectionData = {
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        image_url: imageUrl,
        featured: data.featured,
        sort_order: data.sort_order,
      };

      if (isEditing && id) {
        await updateCollection(id, collectionData);
        toast.success("Collection updated successfully!");
      } else {
        await createCollection(collectionData);
        toast.success("Collection created successfully!");
      }

      navigate("/admin/collections");
    } catch (error) {
      console.error('Error saving collection:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCollection) {
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
            {isEditing ? "Edit Collection" : "Add New Collection"}
          </motion.h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEditing ? "Update collection details" : "Create a new collection for your store"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Collection Information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-2xl tracking-tight">
                  Collection Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    Collection Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter collection name"
                    className="h-12 rounded-xl border-foreground/10"
                    {...register("name")}
                  />
                  {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="slug"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    URL Slug *
                  </Label>
                  <Input
                    id="slug"
                    placeholder="collection-url-slug"
                    className="h-12 rounded-xl border-foreground/10 font-mono text-sm"
                    {...register("slug")}
                    disabled={isEditing}
                  />
                  {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
                  <p className="text-xs text-muted-foreground">
                    Auto-generated from name. Can be customized before saving.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter collection description"
                    rows={5}
                    className="rounded-xl border-foreground/10 resize-none"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-600">{errors.description.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Optional. Describe what makes this collection special.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="sort_order"
                      className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      Sort Order
                    </Label>
                    <Input
                      id="sort_order"
                      type="number"
                      placeholder="0"
                      className="h-12 rounded-xl border-foreground/10"
                      {...register("sort_order", { valueAsNumber: true })}
                    />
                    {errors.sort_order && (
                      <p className="text-xs text-red-600">{errors.sort_order.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Lower numbers appear first
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="featured"
                      className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      Featured Collection
                    </Label>
                    <div className="flex items-center gap-3 pt-2">
                      <Switch
                        id="featured"
                        checked={watch("featured")}
                        onCheckedChange={(checked) => setValue("featured", checked)}
                      />
                      <span className="text-sm text-muted-foreground">
                        Show on homepage
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Collection Image */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-2xl tracking-tight">
                  Collection Image *
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {image ? (
                  <div className="relative aspect-[16/10] max-w-2xl group">
                    <img
                      src={image}
                      alt="Collection"
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
                    className="aspect-[16/10] max-w-2xl border-2 border-dashed border-foreground/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-foreground hover:bg-foreground/5 transition-all"
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">
                      Upload Image
                    </span>
                    <span className="text-xs text-muted-foreground mt-2">
                      Recommended: 1200x800px or larger
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
                    <>{isEditing ? "Update Collection" : "Save Collection"}</>
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
                  <p className="text-xs">Use high-quality images at least 1200x800px for best results.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Featured Collections</p>
                  <p className="text-xs">Featured collections appear prominently on the homepage.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Sort Order</p>
                  <p className="text-xs">Use increments of 10 (0, 10, 20) to easily reorder later.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </form>
  );
}
