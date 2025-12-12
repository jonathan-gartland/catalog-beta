# Bottle Image Sources Guide

## Recommended Sources for Finding Whiskey Bottle Images

### 1. Official Distillery Websites
- **Buffalo Trace**: https://www.buffalotracedistillery.com/
- **Heaven Hill**: https://heavenhilldistillery.com/
- **Ardbeg**: https://www.ardbeg.com/
- **Laphroaig**: https://www.laphroaig.com/

### 2. Retailer Websites (High Quality Product Images)
- **Total Wine**: https://www.totalwine.com/
- **The Whisky Exchange**: https://www.thewhiskyexchange.com/
- **Wine Searcher**: https://www.wine-searcher.com/
- **Drizly**: https://drizly.com/

### 3. Whiskey Database Sites
- **WhiskyBase**: https://www.whiskybase.com/ (User-submitted photos)
- **Distiller**: https://www.distiller.com/
- **Whisky.com**: https://www.whisky.com/

### 4. Image Search Tips

#### Google Images
1. Search: `"[Whiskey Name]" bottle official`
2. Use Tools → Size → Large
3. Use Tools → Usage Rights → Labeled for reuse with modification

#### Specific Search Terms
- `"[Whiskey Name]" product photo`
- `"[Whiskey Name]" official bottle image`
- `"[Distillery] [Whiskey Name]" bottle`

### 5. Image Requirements

- **Format**: PNG or JPG
- **Aspect Ratio**: 3:4 (portrait) recommended
- **Size**: Minimum 200x300px, ideally 400x600px or larger
- **Background**: White or transparent preferred
- **Quality**: High resolution, clear label text

### 6. Legal Considerations

- ✅ Use official product images from distillery websites
- ✅ Use images from retailer product pages
- ✅ Use images labeled for reuse
- ❌ Avoid copyrighted images without permission
- ❌ Avoid watermarked images

### 7. Current Image Status

Run the check script to see current status:
```bash
npx tsx scripts/check-bottle-images.ts
```

### 8. Adding New Images

1. Download image to `public/bottles/`
2. Use descriptive filename (e.g., `blantons-gold-700ml.png`)
3. Update `src/utils/bottleImages.ts` mapping:
   ```typescript
   "Blanton's Gold": "blantons-gold-700ml.png",
   ```

### 9. Batch Image Processing

For multiple images, consider:
- **ImageMagick** for resizing/formatting
- **TinyPNG** for compression
- **Batch renaming** tools for consistency

### 10. Alternative: Take Your Own Photos

If official images aren't available:
- Use consistent lighting (natural or soft white)
- White or neutral background
- Shoot from front angle showing label clearly
- Maintain consistent aspect ratio
- Edit for brightness/contrast consistency

