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
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Switch } from "@/shared/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ArrowLeft, Upload, X, Loader2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useProductsStore } from "@/features/products";
import { useCategoriesStore } from "@/features/categories";
import { useCollectionsStore } from "@/features/collections";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stockQuantity: z.number().int().min(0, "Stock quantity must be 0 or greater"),
  category: z.string().min(1, "Category is required"),
  tag: z.string().optional(),
  collections: z.array(z.string()),
  featured: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [image, setImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(isEditing);

  const getProductById = useProductsStore((s) => s.getProductById);
  const addProduct = useProductsStore((s) => s.addProduct);
  const updateProduct = useProductsStore((s) => s.updateProduct);
  
  const categories = useCategoriesStore((s) => s.categories);
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);

  const collections = useCollectionsStore((s) => s.collections);
  const fetchCollections = useCollectionsStore((s) => s.fetchCollections);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      collections: [],
      featured: false,
    },
  });

  // Fetch categories and collections on mount
  useEffect(() => {
    fetchCategories();
    fetchCollections();
  }, [fetchCategories, fetchCollections]);

  // Load existing product if editing
  useEffect(() => {
    if (isEditing && id) {
      setIsLoadingProduct(true);
      getProductById(id).then((product) => {
        if (product) {
          reset({
            name: product.name,
            slug: product.slug,
            description: product.description || '',
            price: product.price,
            stockQuantity: product.stock_quantity || 0,
            category: product.category_id || '',
            collections: product.collections?.map((c) => c.id) || [],
            tag: product.tags?.[0] || '',
            featured: product.featured || false,
          });
          setImage(product.image_url);
        }
        setIsLoadingProduct(false);
      });
    }
  }, [id, isEditing, getProductById, reset]);

  // Auto-generate slug from name
  const name = watch("name");
  useEffect(() => {
    if (!isEditing && name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
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

  const onSubmit = async (data: ProductFormData) => {
    if (!image && !isEditing) {
      toast.error("Please upload a product image");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = image;

      // Upload new image to Cloudinary if a file was selected
      if (imageFile) {
        toast.info("Uploading image to Cloudinary...");
        const uploadResult = await uploadToCloudinary(imageFile, {
          folder: 'becute-dreams-luxe/products'
        });
        imageUrl = uploadResult.secure_url;
        toast.success("Image uploaded successfully!");
      }

      const productData = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        stock_quantity: data.stockQuantity,
        category_id: data.category,
        image_url: imageUrl,
        tags: data.tag ? [data.tag] : [],
        featured: data.featured,
        in_stock: data.stockQuantity > 0,
        collectionIds: data.collections,
      };

      if (isEditing && id) {
        // Pass collections as the separate third argument, never inside the updates object
        const { collectionIds: _, ...updateFields } = productData;
        await updateProduct(id, updateFields, data.collections);
        toast.success("Product updated successfully!");
      } else {
        await addProduct(productData);
        toast.success("Product created successfully!");
      }

      navigate("/admin/products");
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProduct) {
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
            {isEditing ? "Edit Product" : "Add New Product"}
          </motion.h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEditing ? "Update product details" : "Create a new product for your store"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Product Information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-2xl tracking-tight">
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter product name"
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
                    placeholder="product-url-slug"
                    className="h-12 rounded-xl border-foreground/10"
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
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    rows={5}
                    className="rounded-xl border-foreground/10"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="price"
                      className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      Price *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="h-12 rounded-xl border-foreground/10"
                      {...register("price", { valueAsNumber: true })}
                    />
                    {errors.price && <p className="text-xs text-red-600">{errors.price.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="stockQuantity"
                      className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      Stock Quantity *
                    </Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      step="1"
                      placeholder="0"
                      className="h-12 rounded-xl border-foreground/10"
                      {...register("stockQuantity", { valueAsNumber: true })}
                    />
                    {errors.stockQuantity && <p className="text-xs text-red-600">{errors.stockQuantity.message}</p>}
                    <p className="text-xs text-muted-foreground">
                      Available stock (not visible to customers)
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      Category *
                    </Label>
                    <Select
                      onValueChange={(value) => setValue("category", value)}
                      defaultValue={watch("category")}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-foreground/10">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs text-red-600">{errors.category.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="tag"
                      className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      Tag (Optional)
                    </Label>
                    <Select
                      onValueChange={(value) => setValue("tag", value === "none" ? "" : value)}
                      defaultValue={watch("tag") || "none"}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-foreground/10">
                        <SelectValue placeholder="Select tag (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No tag</SelectItem>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Bestseller">Bestseller</SelectItem>
                        <SelectItem value="Limited">Limited</SelectItem>
                        <SelectItem value="Sale">Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Collections (Optional)
                  </Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto p-4 rounded-xl border border-foreground/10 bg-background/50">
                    {collections.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No collections available</p>
                    ) : (
                      collections.map((collection) => {
                        const isChecked = watch("collections")?.includes(collection.id) || false;
                        return (
                          <div key={collection.id} className="flex items-center gap-3">
                            <Checkbox
                              id={`collection-${collection.id}`}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const current = watch("collections") || [];
                                if (checked) {
                                  setValue("collections", [...current, collection.id]);
                                } else {
                                  setValue("collections", current.filter((id) => id !== collection.id));
                                }
                              }}
                            />
                            <Label
                              htmlFor={`collection-${collection.id}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {collection.name}
                            </Label>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Products can belong to multiple collections
                  </p>
                </div>

                {/* Trending / Featured toggle */}
                <div className="rounded-xl border border-foreground/10 bg-background/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blush/10">
                        <TrendingUp className="h-4 w-4 text-blush" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Show in Trending Section</p>
                        <p className="text-xs text-muted-foreground">
                          Displays this product in the "Currently adored" section on the homepage
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="featured"
                      checked={watch("featured")}
                      onCheckedChange={(checked) => setValue("featured", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Product Image */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-2xl tracking-tight">
                  Product Image *
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {image ? (
                  <div className="relative aspect-[4/5] max-w-md group">
                    <img
                      src={image}
                      alt="Product"
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
                    className="aspect-[4/5] max-w-md border-2 border-dashed border-foreground/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-foreground hover:bg-foreground/5 transition-all"
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">
                      Upload Image
                    </span>
                    <span className="text-xs text-muted-foreground mt-2">
                      Recommended: 800x1000px
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
                    <>{isEditing ? "Update Product" : "Save Product"}</>
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
        </div>
      </div>
    </form>
  );
}
