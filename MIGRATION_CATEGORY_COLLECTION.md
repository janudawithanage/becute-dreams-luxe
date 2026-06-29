# Category & Collection System Migration Guide

## Overview
This migration implements a comprehensive refactoring of the Category & Collection system with the following major changes:

1. **Products can belong to multiple collections** (many-to-many relationship)
2. **Categories and collections both appear as filter chips** on the Shop page
3. **Homepage shows a curated mix** of featured categories and collections
4. **Categories now support featured status** like collections

## ⚠️ IMPORTANT: Database Migration Required

### Step 1: Run SQL Migration

**Before running the application**, you must execute the SQL migration in your Supabase SQL Editor:

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `migrations/001_add_product_collections_join.sql`
4. Execute the migration

The migration will:
- Add `featured` and `sort_order` columns to the `categories` table
- Create a new `product_collections` join table for many-to-many relationships
- **Migrate existing `collection_id` data** from products to the join table automatically
- Drop the old `collection_id` column from products
- Set up appropriate RLS policies

**No data loss is expected**, but make sure to back up your database before running migrations.

### Step 2: Verify Migration

After running the migration, verify:
```sql
-- Check that product_collections table exists
SELECT * FROM product_collections LIMIT 5;

-- Check that categories has new columns
SELECT id, name, featured, sort_order FROM categories LIMIT 5;

-- Verify products no longer has collection_id column
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'collection_id';
-- Should return no rows
```

## Changes Summary

### New Features
- **Multi-collection support**: Products can now belong to multiple collections
- **Featured categories**: Categories can be marked as featured and appear on homepage
- **Unified homepage display**: Homepage shows both featured categories and collections
- **Enhanced filtering**: Shop page shows both category and collection chips simultaneously

### Files Created (6)
- `migrations/001_add_product_collections_join.sql` - Database migration script
- `src/features/categories/categories.service.ts` - Full CRUD service for categories
- `src/features/categories/categories.store.ts` - Zustand store for categories
- `src/features/categories/index.ts` - Barrel export
- `src/pages/admin/AdminCategories.tsx` - Admin category management page
- `src/pages/admin/CategoryForm.tsx` - Category create/edit form

### Files Modified (13)
- `src/lib/database.types.ts` - Added product_collections, updated categories type
- `src/features/products/products.service.ts` - Updated to support multi-collections
- `src/features/products/products.store.ts` - Removed categories, added collection helpers
- `src/features/products/index.ts` - Updated exports
- `src/pages/admin/AdminLayout.tsx` - Added "Categories" to sidebar
- `src/App.tsx` - Added category routes
- `src/pages/admin/ProductForm.tsx` - Multi-select collections with checkboxes
- `src/pages/home/components/Categories.tsx` - Fetches from Supabase, shows curated mix
- `src/pages/home/components/Trending.tsx` - Fetches from Supabase instead of hardcoded data
- `src/pages/Shop.tsx` - Fixed filtering, shows both category and collection chips

### Files No Longer Needed
- `src/features/products/products.types.ts` - Types now come from service files
- `src/features/products/products.data.ts` - All data now comes from Supabase

## Admin Usage

### Managing Categories
1. Navigate to Admin → Categories
2. Click "Add Category" to create new categories
3. Set featured status to show on homepage
4. Use sort_order to control display order (lower numbers appear first)

### Managing Products
1. When creating/editing products, you can now select **multiple collections**
2. Use checkboxes to select which collections the product belongs to
3. Category remains a single-select dropdown

## Testing Checklist

After migration, verify:

- [ ] Homepage displays featured categories and collections
- [ ] Homepage Trending section shows actual products from Supabase
- [ ] Shop page shows both category and collection filter chips
- [ ] Category filtering works correctly
- [ ] Collection filtering works correctly (products can be in multiple collections)
- [ ] Admin → Categories page works (CRUD operations)
- [ ] Admin → Collections page still works
- [ ] Admin → Products form allows multi-select collections
- [ ] Product detail page shows which collections a product belongs to

## API Changes

### products.service.ts
- `getAll()` now accepts `categorySlug` and `collectionId` filters
- Added `getProductCollections(productId)` method
- Added `updateProductCollections(productId, collectionIds)` method
- Product type now includes `collections?: Collection[]` instead of `collection_id`

### products.store.ts
- Removed `categories` state (moved to categories store)
- Removed `fetchCategories()` action (moved to categories store)
- `addProduct()` now accepts `collectionIds` array
- `updateProduct()` now accepts `collectionIds` array as second parameter

### New: categories.service.ts
- Full CRUD operations: `getAll()`, `getBySlug()`, `getById()`, `create()`, `update()`, `delete()`
- Supports `featured` filter
- Auto-generates slugs from names

### New: categories.store.ts
- Zustand store mirroring collections.store.ts pattern
- All CRUD actions available

## Breaking Changes

⚠️ **WARNING**: The following are breaking changes:

1. **`products.collection_id` no longer exists**
   - Use `products.collections` array instead
   - Access via `product.collections?.map(c => c.id)`

2. **Category data moved from products to categories feature**
   - Import from `@/features/categories` instead of `@/features/products`
   - Use `useCategoriesStore()` instead of `useProductsStore()` for categories

3. **Hardcoded data removed**
   - `products` and `categories` arrays no longer exported from `@/features/products`
   - All data must come from Supabase

## Rollback Procedure

If you need to rollback this migration:

1. Restore your database from backup
2. Revert to the previous commit: `git revert HEAD`
3. Reinstall dependencies if needed

## Support

If you encounter issues:
1. Check the database migration ran successfully
2. Verify RLS policies are correctly set up
3. Check browser console for errors
4. Ensure all Supabase environment variables are configured

## Next Steps

After successful migration:
1. Add some featured categories in Admin → Categories
2. Mark some collections as featured in Admin → Collections  
3. Assign products to multiple collections as needed
4. Test the homepage and shop page filtering

---

Migration completed successfully! 🎉
