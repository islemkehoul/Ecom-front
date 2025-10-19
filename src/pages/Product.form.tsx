import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAllProducts,getProductByID } from '../controllers/product.controller';
import { createOrder } from '../controllers/order.controller';
import { VITE_API_URL } from '../api/apiconfig';
import { z } from 'zod';
import { WILAYAS } from '../data/Wilayas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ProductType, ProductImagesType } from '../data/product.type';

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
  const mutation = useMutation({
    mutationKey: ['createOrder'],
    mutationFn: createOrder,
    onSuccess: () => {
      reset();
      setSelectedSize('');
      setSelectedColor('');
      setSelectedVariant(null);
      alert('Order placed successfully!');
    },
    onError: () => {
      alert('Error placing order. Please try again.');
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  // Carousel navigation
  const handlePrevImage = () => {
    const imageCount = product?.productImages?.length || 0;
    if (imageCount > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    const imageCount = product?.productImages?.length || 0;
    if (imageCount > 0) {
      setCurrentImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
    }
  };

  // Prevent right-click and drag
  const preventImageDownload = (e: React.MouseEvent<HTMLImageElement> | React.DragEvent<HTMLImageElement>) => {
    e.preventDefault();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl text-gray-600">Loading product...</h2>
      </div>
    );
  }

  // Error state
  if (isError || !product) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl text-red-500">Product not found!</h2>
      </div>
    );
  }

  // Get current image URL
  const currentImage = product.productImages?.[currentImageIndex];
  const currentImageUrl = currentImage?.imageUrl 
    ? `${VITE_API_URL}/products/uploads/${currentImage.imageUrl}`
    : '';

  return (
    <div className="container mx-auto p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row items-start gap-10">
        {/* Right Side (Carousel with Thumbnails) */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full">
            {product.productImages && product.productImages.length > 0 ? (
              <div className="flex flex-col">
                {/* Main Image with Hover Effect for Buttons */}
                <div className="relative h-[400px] group">
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
                    <div className="h-full w-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">No Image Available</span>
                    </div>
                  )}
                  <div className="absolute inset-0" onContextMenu={(e) => e.preventDefault()}></div>
                  {product.productImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                      >
                        &larr;
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                      >
                        &rarr;
                      </button>
                    </>
                  )}
                </div>
                {/* Thumbnails */}
                <div className="flex justify-center gap-2 p-4 overflow-x-auto">
                  {product.productImages.map((image: ProductImagesType, index: number) => {
                    const thumbnailUrl = `${VITE_API_URL}/products/uploads/${image.imageUrl}`;
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`cursor-pointer w-16 h-16 rounded-md overflow-hidden border-2 ${
                          index === currentImageIndex ? 'border-blue-600' : 'border-gray-300'
                        } hover:border-blue-400 transition relative flex-shrink-0`}
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
              <div className="h-[400px] w-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No Images Available</span>
              </div>
            )}
          </div>

          {/* Variant Selection */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Select Options</h3>
            
            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size {selectedSize && <span className="text-blue-600">({selectedSize})</span>}
              </label>
              <div className="flex flex-wrap gap-2">
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
                      className={`px-4 py-2 border rounded-md font-medium transition uppercase ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : isAvailable
                          ? 'bg-white text-gray-800 border-gray-300 hover:border-blue-600'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      {size as string}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color {selectedColor && <span className="text-blue-600">({selectedColor})</span>}
              </label>
              <div className="flex flex-wrap gap-2">
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
                      className={`px-4 py-2 border rounded-md font-medium transition ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : isAvailable
                          ? 'bg-white text-gray-800 border-gray-300 hover:border-blue-600'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      {color as string}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Variant Info */}
            {selectedVariant && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">In Stock:</span> {selectedVariant.quantity} units
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Price:</span> DZD {selectedVariant.price}
                </p>
              </div>
            )}

            {!selectedVariant && (selectedSize || selectedColor) && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-gray-600">
                  {!selectedSize ? 'Please select a size' : 'Please select a color'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Left Side - Product Info & Order Form */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-2xl text-blue-600 font-semibold">
              {selectedVariant ? `DZD ${selectedVariant.price}` : `From DZD ${product.price}`}
            </p>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Order Form */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Place Your Order</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Hidden variant SKU field */}
              <input type="hidden" {...register('variant_sku')} />
              
              {/* Variant Selection Error */}
              {errors.variant_sku && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{errors.variant_sku.message}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  {...register('customer_name')}
                  className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                    errors.customer_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.customer_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer_name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  {...register('customer_phone')}
                  className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                    errors.customer_phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.customer_phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer_phone.message}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select
                  {...register('customer_city')}
                  className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                    errors.customer_city ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a city</option>
                  {WILAYAS.map((wilaya) => (
                    <option key={wilaya.code} value={wilaya.name}>
                      {wilaya.nameEn}
                    </option>
                  ))}
                </select>
                {errors.customer_city && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer_city.message}</p>
                )}
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <input
                  type="text"
                  {...register('customer_region')}
                  className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                    errors.customer_region ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.customer_region && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer_region.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || mutation.isPending || !selectedVariant}
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-semibold mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting || mutation.isPending ? 'Processing...' : 'Buy Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;