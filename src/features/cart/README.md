# Cart Feature

Shopping cart functionality with localStorage persistence.

## Components

- **CartDrawer**: Slide-out cart panel with item management

## State Management

- **useCart**: Zustand store for cart state
  - Persists to localStorage
  - Handles add/remove/update operations
  - Calculates totals and item counts

## Usage

```tsx
import { useCart, CartDrawer } from '@/features/cart';

function MyComponent() {
  const { add, items, total } = useCart();
  
  const handleAddToCart = () => {
    add(product, quantity);
  };
  
  return (
    <>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <CartDrawer />
    </>
  );
}
```

## Types

- `CartItem`: Product with quantity
- `CartState`: Full cart state interface
