# Gallery Feature Documentation

## Overview
The Gallery feature allows administrators to manage the Instagram gallery section displayed on the landing page. Each image can have its own Instagram URL, making it easy to drive traffic to specific posts, reels, or your profile.

## Feature Highlights

✨ **Upload Custom Images** - Add your best product photos or lifestyle shots  
🔗 **Individual Instagram Links** - Each image links to different Instagram content  
📊 **Display Order Control** - Choose exactly which images appear and in what order  
👁️ **Active/Inactive Toggle** - Show or hide images without deleting  
🎨 **Beautiful Grid Layout** - Professional masonry-style gallery with hover effects  
⚡ **Instant Updates** - Changes appear on site immediately  
📱 **Responsive Design** - Looks perfect on all devices  

## Architecture

### Database Schema
```sql
gallery_images (
  id              UUID PRIMARY KEY
  image_url       TEXT NOT NULL          -- Cloudinary URL
  instagram_url   TEXT NOT NULL          -- Instagram destination
  display_order   INTEGER DEFAULT 0      -- Sort order
  is_active       BOOLEAN DEFAULT TRUE   -- Visibility
  created_at      TIMESTAMPTZ
  updated_at      TIMESTAMPTZ
)
```

### Service Layer
Located in `src/features/gallery/`
```typescript
// Key methods
getActiveGalleryImages()      // Public - site display
getAllGalleryImages()         // Admin - management
createGalleryImage(input)     // Create new
updateGalleryImage(id, input) // Update existing
deleteGalleryImage(id)        // Delete
toggleActiveStatus(id, bool)  // Quick toggle
```

### Admin Pages
1. **Gallery List** (`/admin/gallery`)
   - Table view of all images
   - Search and filter
   - Quick actions (edit, delete, toggle)
   - Stats dashboard

2. **Gallery Form** (`/admin/gallery/new` or `/admin/gallery/:id/edit`)
   - Image upload with preview
   - Instagram URL input
   - Display order control
   - Active/inactive toggle

### Frontend Display
Located in `src/pages/home/components/Gallery.tsx`
- Fetches active images on page load
- Displays first 8 images
- Grid layout with varying heights
- Hover effect with Instagram icon
- Click redirects to Instagram URL

## User Flows

### Admin: Adding a Gallery Image
1. Navigate to `/admin/gallery`
2. Click "Add Image" button
3. Upload image (recommended: 800x800px)
4. Enter Instagram URL (pre-filled with default)
5. Set display order (e.g., 0, 10, 20...)
6. Ensure "Active" is toggled on
7. Click "Save Image"
8. Image appears in list and on site

### Admin: Managing Gallery
- **Edit:** Click pencil icon → Modify → Save
- **Delete:** Click trash icon → Confirm → Deleted
- **Reorder:** Edit images, change display_order values
- **Toggle:** Click Active/Inactive badge
- **Search:** Use search bar to filter by URL

### Visitor: Viewing Gallery
1. Visit homepage
2. Scroll to "@becute_dreams" section
3. See 8 images in grid layout
4. Hover image → Instagram icon appears
5. Click image → Redirected to Instagram URL

## Technical Implementation

### Image Upload Flow
```
User selects file
    ↓
File validated (size, format)
    ↓
Preview generated (FileReader)
    ↓
On submit: Upload to Cloudinary
    ↓
Cloudinary returns secure_url
    ↓
URL saved to database
    ↓
Image displayed on site
```

### Display Flow
```
Gallery component mounts
    ↓
Fetch active images (galleryService)
    ↓
Sort by display_order (ascending)
    ↓
Take first 8 images
    ↓
Map to grid with sizes
    ↓
Render with animations
```

### Security
- **Row Level Security (RLS)** enabled
- Public can only SELECT active images
- Admins can INSERT, UPDATE, DELETE
- Authentication required for admin pages
- Protected routes with `ProtectedRoute` component

## API Reference

### Gallery Service Methods

#### `getActiveGalleryImages(): Promise<GalleryImage[]>`
Returns all active images ordered by display_order. Used by the public site.

#### `getAllGalleryImages(): Promise<GalleryImage[]>`
Returns all images (active and inactive) ordered by display_order. Admin only.

#### `getGalleryImageById(id: string): Promise<GalleryImage | null>`
Returns a single gallery image by ID. Used for editing.

#### `createGalleryImage(input: CreateGalleryImageInput): Promise<GalleryImage>`
Creates a new gallery image.
```typescript
interface CreateGalleryImageInput {
  image_url: string;
  instagram_url: string;
  display_order?: number;  // Default: 0
  is_active?: boolean;     // Default: true
}
```

#### `updateGalleryImage(id: string, input: UpdateGalleryImageInput): Promise<GalleryImage>`
Updates an existing gallery image.
```typescript
interface UpdateGalleryImageInput {
  image_url?: string;
  instagram_url?: string;
  display_order?: number;
  is_active?: boolean;
}
```

#### `deleteGalleryImage(id: string): Promise<void>`
Deletes a gallery image permanently.

#### `toggleActiveStatus(id: string, isActive: boolean): Promise<GalleryImage>`
Convenience method to toggle active/inactive status.

## UI Components

### AdminGallery Component
**Purpose:** Main gallery management page

**Features:**
- Stats cards (Total, Active, Filtered)
- Search functionality
- Data table with images
- Action buttons (Edit, Delete)
- Active/Inactive badges (clickable)

**State:**
- `galleryImages`: Array of all gallery images
- `searchQuery`: Current search filter
- `isLoading`: Loading state
- `deletingId`: ID of image being deleted

### GalleryForm Component
**Purpose:** Create/edit gallery image form

**Features:**
- Image upload with drag-drop
- Image preview with remove button
- Instagram URL input (pre-filled)
- Display order numeric input
- Active/Inactive toggle
- Form validation (Zod schema)
- Loading states

**Validation:**
```typescript
{
  instagram_url: z.string().url("Must be a valid URL"),
  display_order: z.number().min(0, "Must be 0 or greater"),
  is_active: z.boolean()
}
```

### Gallery Component (Public)
**Purpose:** Display gallery on homepage

**Features:**
- Fetches active images
- Grid layout (2 cols mobile, 4 cols desktop)
- Varying heights (some row-span-2)
- Hover effect (Instagram icon overlay)
- Click navigation to Instagram
- Animation on scroll

**Layout Pattern:**
```
Positions: [0, 1, 2, 3, 4, 5, 6, 7]
Heights:   [2, 1, 1, 2, 1, 1, 2, 1]
(2 = tall, 1 = regular)
```

## Configuration

### Environment Variables
Required in `.env.local`:
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### Cloudinary Setup
1. Create unsigned upload preset
2. Set folder to: `becute-dreams-luxe/gallery`
3. Enable transformations (optional)
4. Set max file size: 10MB

### Supabase Setup
1. Run migration: `004_add_gallery_images.sql`
2. Verify RLS policies are enabled
3. Test with admin and anonymous users

## Best Practices

### Image Guidelines
- **Dimensions:** 800x800px (1:1 aspect ratio)
- **Format:** JPG or PNG
- **File Size:** < 2MB for optimal performance
- **Quality:** High resolution (Cloudinary will optimize)
- **Content:** Lifestyle, products, or brand-related

### Display Order Strategy
Use increments of 10 for flexibility:
```
Good: 0, 10, 20, 30, 40, 50, 60, 70
Bad:  0, 1, 2, 3, 4, 5, 6, 7

Benefit: Can insert images between existing ones
Example: Insert at 15 (between 10 and 20)
```

### Instagram URL Types
```
✅ Profile:     https://www.instagram.com/becute_dreams
✅ Post:        https://www.instagram.com/p/ABC123xyz/
✅ Reel:        https://www.instagram.com/reel/ABC123xyz/
✅ Highlights:  https://www.instagram.com/stories/highlights/123456789/
❌ Stories:     Stories expire, avoid direct links
```

### Performance Tips
- Upload optimized images (Cloudinary helps)
- Keep active image count to 8 or less
- Use lazy loading (already implemented)
- Leverage Cloudinary CDN
- Cache images in browser

## Testing

### Manual Testing Checklist
- [ ] Create gallery image
- [ ] Upload image successfully
- [ ] Edit gallery image
- [ ] Change Instagram URL
- [ ] Update display order
- [ ] Toggle active/inactive
- [ ] Delete gallery image
- [ ] Search/filter images
- [ ] View on homepage
- [ ] Click image → Instagram redirect
- [ ] Test responsive layout
- [ ] Test with 0 images (section hidden)
- [ ] Test with 10+ images (only 8 show)

### Edge Cases
- **No images:** Section doesn't display
- **One image:** Section displays with one item
- **Inactive images:** Don't appear on site
- **Large images:** Cloudinary optimizes
- **Invalid URL:** Form validation catches
- **Duplicate order:** Works fine (sorts by id)

## Troubleshooting

### Images not appearing on site
1. Check if images are marked "Active"
2. Verify migration was run
3. Check browser console for errors
4. Test Supabase RLS policies
5. Confirm at least one active image exists

### Upload failures
1. Verify Cloudinary config in .env.local
2. Check image file size (< 10MB)
3. Confirm valid image format
4. Test Cloudinary upload preset
5. Check browser network tab for errors

### Instagram links not working
1. Verify URL format (starts with https://)
2. Test URL directly in browser
3. Check for typos
4. Ensure Instagram page is public
5. Try a different Instagram URL

### Ordering issues
1. Check display_order values
2. Lower numbers appear first
3. Edit and save to refresh order
4. Verify no negative numbers
5. Use consistent increments

## Future Enhancements

### Potential Features
1. **Drag-and-drop reordering** - Visual reorder interface
2. **Bulk upload** - Upload multiple images at once
3. **Image editing** - Crop, resize, filters
4. **Analytics** - Track clicks per image
5. **Scheduled publishing** - Start/end dates
6. **Categories/tags** - Organize by theme
7. **Alternative layouts** - Masonry, carousel, slider
8. **A/B testing** - Test different images
9. **Auto-sync** - Pull from Instagram API
10. **Video support** - Gallery videos with posters

### Technical Improvements
1. **Image compression** - Pre-upload optimization
2. **WebP format** - Smaller file sizes
3. **Lazy loading** - Defer below-fold images
4. **Caching strategy** - Redis or in-memory cache
5. **CDN integration** - Faster global delivery
6. **Progressive loading** - Blur-up technique
7. **Error boundaries** - Graceful error handling
8. **Skeleton loaders** - Better loading UX

## Related Documentation
- [GALLERY_QUICKSTART.md](../../GALLERY_QUICKSTART.md) - Quick setup guide
- [GALLERY_ADMIN_FEATURE.md](../../GALLERY_ADMIN_FEATURE.md) - Feature details
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Support
For issues or questions:
1. Check console for error messages
2. Review migration in Supabase
3. Verify environment variables
4. Test RLS policies
5. Confirm Cloudinary integration
