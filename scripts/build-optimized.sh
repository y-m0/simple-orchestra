#!/bin/bash

echo "🚀 Starting optimized build process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist

# Run TypeScript check
echo "📝 Type checking..."
npx tsc --noEmit

# Build the application
echo "🔨 Building application..."
npm run build

# Generate bundle analysis
echo "📊 Analyzing bundle size..."
if [ -f "dist/bundle-analysis.html" ]; then
    echo "Bundle analysis available at: dist/bundle-analysis.html"
fi

# Calculate build size
echo "📏 Build statistics:"
echo "Total size: $(du -sh dist | cut -f1)"
echo "Assets: $(du -sh dist/assets | cut -f1)"

# Gzip size analysis
echo ""
echo "📦 Compressed sizes:"
find dist/assets -name "*.js" -o -name "*.css" | while read file; do
    original=$(wc -c < "$file" | xargs)
    gzipped=$(gzip -c "$file" | wc -c | xargs)
    ratio=$(echo "scale=2; ($original - $gzipped) * 100 / $original" | bc)
    echo "$(basename "$file"): $(numfmt --to=iec $original) → $(numfmt --to=iec $gzipped) (${ratio}% reduction)"
done | sort -k3 -h | tail -10

echo ""
echo "✅ Build completed successfully!"