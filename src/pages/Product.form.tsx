import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getProductByID } from '../controllers/product.controller';
import { createOrder } from '../controllers/order.controller';
import { VITE_API_URL } from '../api/apiconfig';
import { z } from 'zod';
import { WILAYAS } from '../data/Wilayas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ProductImagesType } from '../data/product.type';

// ---- Schema ----
const formSchema = z.object({
  product_id: z
    .string()
    .min(1, 'Product ID is required')
    .max(50, 'Product ID must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Product ID can only contain letters, numbers, hyphens, and underscores')
    .trim(),
  variant_sku: z
    .string()
    .min(1, 'Please select size and color'),
  customer_name: z
    .string()
    .min(3, 'Customer name must be at least 3 characters')
    .max(255, 'Customer name must not exceed 255 characters')
    .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, 'Customer name can only contain letters and spaces (Arabic/Latin)')
    .trim(),
  customer_phone: z
    .string()
    .min(1, 'Customer phone is required')
    .regex(/^(\+213|0)(5|6|7)[0-9]{8}$/, 'Phone must be Algerian and start with 05/06/07 or +2135/6/7'),
  customer_city: z.string().nonempty('City is required'),
  customer_region: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ProductVariant {
  id: number;
  productId: string;
  size: string;
  color: string;
  quantity: number;
  sku: string;
  price: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = String(id);

  // State for carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // State for variant selection
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // Fetch products
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', productId],
    queryFn: () => getProductByID(productId),
  });

  const product = data?.product;

  // Get available variants (quantity > 0)
  const availableVariants = product?.productVariants?.filter((v: ProductVariant) => v.quantity > 0) || [];

  // Get unique sizes and colors from available variants
  const availableSizes = [...new Set(availableVariants.map((v: ProductVariant) => v.size))];
  const availableColors = [...new Set(availableVariants.map((v: ProductVariant) => v.color))];

  // Get colors available for selected size
  const colorsForSize = selectedSize
    ? [...new Set(availableVariants
      .filter((v: ProductVariant) => v.size === selectedSize)
      .map((v: ProductVariant) => v.color))]
    : availableColors;

  // Get sizes available for selected color
  const sizesForColor = selectedColor
    ? [...new Set(availableVariants
      .filter((v: ProductVariant) => v.color === selectedColor)
      .map((v: ProductVariant) => v.size))]
    : availableSizes;

  // Filter images based on selected color
  const filteredImages = selectedColor && product?.productImages
    ? product.productImages.filter((img: ProductImagesType) => img.color === selectedColor)
    : product?.productImages || [];

  // Use all images if no color-specific images found
  const displayImages = filteredImages.length > 0 ? filteredImages : product?.productImages || [];

  // Reset image index when color changes or filtered images change
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColor, filteredImages.length]);

  // Update selected variant when size and color are selected
  useEffect(() => {
    if (selectedSize && selectedColor) {
      const variant = availableVariants.find(
        (v: ProductVariant) => v.size === selectedSize && v.color === selectedColor
      );
      setSelectedVariant(variant || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedSize, selectedColor, availableVariants]);

  // ---- React Hook Form ----
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_id: productId,
      variant_sku: '',
      customer_name: '',
      customer_phone: '',
      customer_city: '',
      customer_region: '',
    },
  });

  // Update form when variant is selected
  useEffect(() => {
    if (selectedVariant) {
      setValue('variant_sku', selectedVariant.sku);
    } else {
      setValue('variant_sku', '');
    }
  }, [selectedVariant, setValue]);

  // ---- Mutation ----
  // ---- Mutation ----
  const mutation = useMutation({
    mutationKey: ['createOrder'],
    mutationFn: createOrder,
    onSuccess: (response, variables) => {
      // Get the main product image
      const mainImage = product?.productImages?.find((img: ProductImagesType) => img.isMain) || product?.productImages?.[0];
      const imageUrl = mainImage?.imageUrl ? `${VITE_API_URL}/products/uploads/${mainImage.imageUrl}` : undefined;

      // Navigate to thank you page with order data
      navigate('/thank-you', {
        state: {
          orderId: response?.data?.id || Math.random().toString(36).substring(2, 9).toUpperCase(),
          customerName: variables.customer_name,
          customerPhone: variables.customer_phone,
          customerCity: variables.customer_city,
          customerRegion: variables.customer_region,
          productName: product?.name,
          productImage: imageUrl,
          variantSize: selectedVariant?.size,
          variantColor: selectedVariant?.color,
          price: selectedVariant?.price,
          orderDate: new Date().toLocaleDateString()
        }
      });
    },
    onError: () => {
      alert('Error placing order. Please try again.');
    },
  });
  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  // Prevent right-click and drag
  const preventImageDownload = (e: React.MouseEvent<HTMLImageElement> | React.DragEvent<HTMLImageElement>) => {
    e.preventDefault();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl text-muted-foreground">Loading product...</h2>
      </div>
    );
  }

  // Error state
  if (isError || !product) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl text-destructive">Product not found!</h2>
      </div>
    );
  }

  // Get current image URL from filtered/display images
  const currentImage = displayImages[currentImageIndex];
  const currentImageUrl = currentImage?.imageUrl
    ? `${VITE_API_URL}/products/uploads/${currentImage.imageUrl}`
    : '';

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-10 pb-24 sm:pb-6">
      <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-10">
        {/* Left Side - Product Info & Order Form */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{product.name}</h1>
            <p className="text-xl sm:text-2xl text-primary font-bold">
              {selectedVariant ? `DZD ${selectedVariant.price}` : `From DZD ${product.price}`}
            </p>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Order Form - Modern Design */}
          <div className="bg-card p-6 sm:p-8 rounded-2xl shadow-lg border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-primary rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-card-foreground">Quick Order</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} id="order-form" className="space-y-5">
              {/* Hidden variant SKU field */}
              <input type="hidden" {...register('variant_sku')} />

              {/* Variant Selection Error */}
              {errors.variant_sku && (
                <div className="p-4 bg-destructive/10 border-l-4 border-destructive rounded-r-lg">
                  <p className="text-destructive text-sm font-medium">{errors.variant_sku.message}</p>
                </div>
              )}

              {/* Name */}
              <div className="group">
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    {...register('customer_name')}
                    className={`w-full px-4 py-3.5 border-2 rounded-xl bg-background text-foreground transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20 ${errors.customer_name
                      ? 'border-destructive focus:border-destructive'
                      : 'border-input focus:border-primary hover:border-primary/50'
                      }`}
                  />
                </div>
                {errors.customer_name && (
                  <p className="text-destructive text-xs mt-1.5 ml-1">{errors.customer_name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="group">
                <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="EX : 05XXXXXXXX"
                    {...register('customer_phone')}
                    className={`w-full px-4 py-3.5 border-2 rounded-xl bg-background text-foreground transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20 ${errors.customer_phone
                      ? 'border-destructive focus:border-destructive'
                      : 'border-input focus:border-primary hover:border-primary/50'
                      }`}
                  />
                </div>
                {errors.customer_phone && (
                  <p className="text-destructive text-xs mt-1.5 ml-1">{errors.customer_phone.message}</p>
                )}
              </div>

              {/* City & Region Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* City */}
                <div className="group">
                  <label className="block text-sm font-semibold text-foreground mb-2">Wilaya</label>
                  <div className="relative">
                    <select
                      {...register('customer_city')}
                      className={`w-full px-4 py-3.5 border-2 rounded-xl bg-background text-foreground transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20 appearance-none cursor-pointer ${errors.customer_city
                        ? 'border-destructive focus:border-destructive'
                        : 'border-input focus:border-primary hover:border-primary/50'
                        }`}
                    >
                      <option value="">Select wilaya</option>
                      {WILAYAS.map((wilaya) => (
                        <option key={wilaya.code} value={wilaya.name}>
                          {wilaya.nameEn}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.customer_city && (
                    <p className="text-destructive text-xs mt-1.5 ml-1">{errors.customer_city.message}</p>
                  )}
                </div>

                {/* Region */}
                <div className="group">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Region <span className="text-muted-foreground text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g., Bab Ezzouar"
                      {...register('customer_region')}
                      className={`w-full px-4 py-3.5 border-2 rounded-xl bg-background text-foreground transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20 ${errors.customer_region
                        ? 'border-destructive focus:border-destructive'
                        : 'border-input focus:border-primary hover:border-primary/50'
                        }`}
                    />
                  </div>
                  {errors.customer_region && (
                    <p className="text-destructive text-xs mt-1.5 ml-1">{errors.customer_region.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button - Hidden on mobile (sticky version below) */}
              <button
                type="submit"
                disabled={isSubmitting || mutation.isPending || !selectedVariant}
                className="hidden sm:flex w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl transition-all duration-200 font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:shadow-none mt-6 transform hover:scale-[1.02] active:scale-[0.98] items-center justify-center"
              >
                {isSubmitting || mutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Order Now
                  </span>
                )}
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Secure checkout · Your data is protected</span>
              </div>
            </form>
          </div>
        </div>

        {/* Sticky Order Button for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-background border-t-2 border-border shadow-2xl p-4">
          <button
            type="submit"
            form="order-form"
            disabled={isSubmitting || mutation.isPending || !selectedVariant}
            className="w-full bg-primary active:bg-primary/90 text-primary-foreground py-4 rounded-xl transition-all duration-200 font-bold text-lg shadow-lg shadow-primary/20 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:shadow-none transform active:scale-[0.98] flex items-center justify-center"
          >
            {isSubmitting || mutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Now
              </span>
            )}
          </button>
        </div>

        {/* Right Side (Carousel with Thumbnails) */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="bg-card rounded-2xl shadow-lg overflow-hidden w-full border border-border">
            {displayImages && displayImages.length > 0 ? (
              <div className="flex flex-col">
                {/* Main Image */}
                <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] group bg-muted">
                  {currentImageUrl ? (
                    <img
                      src={currentImageUrl}
                      alt={`${product.name} - Image ${currentImageIndex + 1}`}
                      className="h-full w-full object-cover select-none"
                      onContextMenu={preventImageDownload}
                      onDragStart={preventImageDownload}
                      onError={(e) => {
                        console.error('Image failed to load:', currentImageUrl);
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage Not Found%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted">
                      <span className="text-muted-foreground">No Image Available</span>
                    </div>
                  )}
                  <div className="absolute inset-0" onContextMenu={(e) => e.preventDefault()}></div>


                </div>
                {/* Thumbnails */}
                <div className="flex justify-center gap-2 p-3 sm:p-4 overflow-x-auto bg-muted/50">
                  {displayImages.map((image: ProductImagesType, index: number) => {
                    const thumbnailUrl = `${VITE_API_URL}/products/uploads/${image.imageUrl}`;
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`cursor-pointer w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-1 transition-all duration-200 ${index === currentImageIndex
                          ? 'border-primary ring-2 ring-primary/20 scale-110'
                          : 'border-border hover:border-primary hover:scale-105'
                          } flex-shrink-0`}
                      >
                        <img
                          src={thumbnailUrl}
                          alt={`${product.name} - Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover select-none"
                          onContextMenu={preventImageDownload}
                          onDragStart={preventImageDownload}
                          onError={(e) => {
                            console.error('Thumbnail failed to load:', thumbnailUrl);
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3C/svg%3E';
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full flex items-center justify-center bg-muted">
                <span className="text-muted-foreground">No Images Available</span>
              </div>
            )}
          </div>

          {/* Variant Selection */}
          <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
            <h3 className="text-lg font-bold text-card-foreground mb-5 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Select Options
            </h3>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Size {selectedSize && <span className="text-primary font-bold ml-1">· {selectedSize}</span>}
              </label>
              <div className="flex flex-wrap gap-2.5">
                {availableSizes.map((size) => {
                  const isAvailable = sizesForColor.includes(size);
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size as string}
                      type="button"
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedSize(size as string);
                          if (selectedColor && !colorsForSize.includes(selectedColor)) {
                            setSelectedColor('');
                          }
                        }
                      }}
                      disabled={!isAvailable}
                      className={`px-5 py-2.5 border-1 rounded-xl font-bold transition-all duration-200 uppercase text-sm ${isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105'
                        : isAvailable
                          ? 'bg-card text-foreground border-border hover:border-primary hover:shadow-md hover:scale-105'
                          : 'bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50'
                        }`}
                    >
                      {size as string}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Color {selectedColor && <span className="text-primary font-bold ml-1">· {selectedColor}</span>}
              </label>
              <div className="flex flex-wrap gap-2.5">
                {availableColors.map((color) => {
                  const isAvailable = colorsForSize.includes(color);
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color as string}
                      type="button"
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedColor(color as string);
                          if (selectedSize && !sizesForColor.includes(selectedSize)) {
                            setSelectedSize('');
                          }
                        }
                      }}
                      disabled={!isAvailable}
                      className={`px-5 py-2.5 border-1 rounded-xl font-bold transition-all duration-200 text-sm ${isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105'
                        : isAvailable
                          ? 'bg-card text-foreground border-border hover:border-primary hover:shadow-md hover:scale-105'
                          : 'bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50'
                        }`}
                    >
                      {color as string}
                    </button>
                  );
                })}
              </div>
            </div>

            {!selectedVariant && (selectedSize || selectedColor) && (
              <div className="mt-5 p-4 bg-accent/10 border-l-4 border-accent rounded-r-xl">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-accent-foreground font-medium">
                    {!selectedSize ? 'Please select a size' : 'Please select a color'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;