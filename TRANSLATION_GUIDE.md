# Translation Implementation Guide

## Summary
All translation keys have been added to the three translation files (EN, AR, FR).
The following components need to be updated to use these translation keys.

## Translation Keys Added

### Product Details Page (`product_details`)
- quick_order
- full_name
- enter_name
- phone_number
- wilaya
- select_wilaya
- region
- optional
- region_placeholder
- processing
- order_now
- secure_checkout
- select_options
- size
- color
- select_size
- select_color
- loading_product
- product_not_found
- no_image
- no_images
- from

### Products List Page (`products`)
- browse_collection
- search_placeholder
- loading
- error_fetching
- showing
- of
- products_text
- for
- in
- no_products
- clear_filters

### Categories (`categories`)
- all
- electronics
- clothing
- home_garden
- books
- sports

### About Page (`about`)
- subtitle

### Contact Page (`contact`)
- subtitle

## Components to Update

### 1. Product.form.tsx
Add at top:
```typescript
import { useTranslation } from 'react-i18next';
```

Add in component:
```typescript
const { t } = useTranslation();
```

Replace hardcoded text with:
- Line 167: `{t('product_details.loading_product')}`
- Line 176: `{t('product_details.product_not_found')}`
- Line 195: `{t('product_details.from')} DZD ${product.price}`
- Line 204: `{t('product_details.quick_order')}`
- Line 220: `{t('product_details.full_name')}`
- Line 224: `placeholder={t('product_details.enter_name')}`
- Line 239: `{t('product_details.phone_number')}`
- Line 260: `{t('product_details.wilaya')}`
- Line 269: `{t('product_details.select_wilaya')}`
- Line 290: `{t('product_details.region')} <span className="text-muted-foreground text-xs">({t('product_details.optional')})</span>`
- Line 295: `placeholder={t('product_details.region_placeholder')}`
- Line 321: `{t('product_details.processing')}`
- Line 328: `{t('product_details.order_now')}`
- Line 338: `{t('product_details.secure_checkout')}`
- Line 358: `{t('product_details.processing')}`
- Line 365: `{t('product_details.order_now')}`
- Line 392: `{t('product_details.no_image')}`
- Line 430: `{t('product_details.no_images')}`
- Line 439: `{t('product_details.select_options')}`
- Line 445: `{t('product_details.size')}`
- Line 481: `{t('product_details.color')}`
- Line 521: `{!selectedSize ? t('product_details.select_size') : t('product_details.select_color')}`

### 2. Products.list.tsx
Add at top:
```typescript
import { useTranslation } from 'react-i18next';
```

Add in component:
```typescript
const { t } = useTranslation();
```

Replace hardcoded text with:
- Line 12: Use `t('categories.all')`, `t('categories.electronics')`, etc.
- Line 42: `{t('products.loading')}`
- Line 43: `{t('products.error_fetching')}`
- Line 47: `{t('products.title')}`
- Line 48: `{t('products.browse_collection')}`
- Line 54: `placeholder={t('products.search_placeholder')}`
- Line 76-78: `{t('products.showing')} {filteredProducts.length} {t('products.of')} {data?.data?.length || 0} {t('products.products_text')}`
- Line 85: `{t('products.no_products')}`
- Line 95: `{t('products.clear_filters')}`
- Line 132: `{t('products.add_to_cart')}`

### 3. About.tsx
Add at top:
```typescript
import { useTranslation } from 'react-i18next';
```

Add in component:
```typescript
const { t } = useTranslation();
```

Replace:
- Line 4: `{t('about.title')}`
- Line 5: `{t('about.subtitle')}`

### 4. Contact.tsx
Add at top:
```typescript
import { useTranslation } from 'react-i18next';
```

Add in component:
```typescript
const { t } = useTranslation();
```

Replace:
- Line 4: `{t('contact.title')}`
- Line 5: `{t('contact.subtitle')}`

## Status
✅ Translation files updated (EN, AR, FR)
⏳ Components need to be updated to use translation keys
