import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { mockAdminProducts } from "@/features/admin";
import { motion } from "framer-motion";

export function Products() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = mockAdminProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "success" | "warning" | "default"> = {
      active: "success",
      draft: "warning",
      archived: "default",
    };
    return variants[status] || "default";
  };

  return (
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
            ✦ Inventory
          </motion.p>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-2 font-display text-4xl tracking-tight"
          >
            Products
          </motion.h2>
          <p className="mt-2 text-sm text-muted-foreground">Manage your product inventory</p>
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button
            onClick={() => navigate("/admin/products/new")}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-ink px-6 text-xs uppercase tracking-[0.2em] text-background shadow-soft transition hover:shadow-luxe"
          >
            <Plus className="h-4 w-4" />
            Add Product
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
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 rounded-full border-foreground/10 bg-background/50"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-foreground/5">
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Product
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    SKU
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Category
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Price
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Stock
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
                {filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-foreground/5 hover:bg-foreground/[0.02] transition"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl overflow-hidden bg-foreground/5">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {product.tag && (
                            <Badge
                              variant="secondary"
                              className="mt-1 text-[10px] uppercase tracking-wider"
                            >
                              {product.tag}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {product.sku}
                    </TableCell>
                    <TableCell className="capitalize text-sm">
                      {product.category.replace("-", " ")}
                    </TableCell>
                    <TableCell className="font-display text-lg">${product.price}</TableCell>
                    <TableCell>
                      <span className={product.stock < 20 ? "text-red-600 font-medium" : ""}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(product.status)} className="capitalize">
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg hover:bg-foreground/5"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                          className="h-9 w-9 rounded-lg hover:bg-foreground/5"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
