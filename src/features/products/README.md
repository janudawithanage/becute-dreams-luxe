# Products Feature

Product catalog data and utilities.

## Data

- **products**: Array of all available products
- **categories**: Array of product categories

## Utilities

- **getProduct(slug)**: Find product by slug
- **getByCategory(slug)**: Filter products by category

## Usage

```tsx
import { products, getProduct, getByCategory, type Product } from '@/features/products';

function ProductPage({ slug }: { slug: string }) {
  const product = getProduct(slug);
  
  if (!product) return <NotFound />;
  
  return <ProductDetail product={product} />;
}
```

## Types

- `Product`: Product interface
- `Category`: Category interface
