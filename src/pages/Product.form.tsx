import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAllProducts, createOrder } from '../controllers/product.controller';
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

const ProductDetails = () => {
  const { id } = useParams();
  const productId = String(id);

  // State for carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch products
  const { data } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });

  const product = data?.find((p: { id: string }) => p.id === productId) as ProductType | undefined;

  // ---- React Hook Form ----
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_id: productId,
      customer_name: '',
      customer_phone: '',
      customer_city: '',
      customer_region: '',
    },
  });

  // ---- Mutation ----
  const mutation = useMutation({
    mutationKey: ['createOrder'],
    mutationFn: createOrder,
    onSuccess: () => {
      reset(); // reset form on success
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
    setCurrentImageIndex((prev) =>
      prev === 0 ? (product?.productImages?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (product?.productImages?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  // Prevent right-click and drag
  const preventImageDownload = (e: React.MouseEvent<HTMLImageElement> | React.DragEvent<HTMLImageElement>) => {
    e.preventDefault();
  };

  if (!product) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl text-red-500">Product not found!</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-center gap-10">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 space-y-6" style={{ minHeight: '400px' }}>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-2xl text-blue-600 font-semibold">DZD {product.price}</p>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Order Form */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm h-full flex flex-col justify-center">
            <h2 className="text-xl font-semibold mb-4">Place Your Order</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                disabled={isSubmitting || mutation.isPending}
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-semibold mt-6 disabled:bg-gray-400"
              >
                {isSubmitting || mutation.isPending ? 'Processing...' : 'Buy Now'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side (Carousel with Thumbnails) */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full max-w-md">
            {product.productImages && product.productImages.length > 0 ? (
              <div className="flex flex-col">
                {/* Main Image with Hover Effect for Buttons */}
                <div className="relative h-[400px] group">
                  <img
                    src={`${VITE_API_URL}/products/uploads/${product.productImages[currentImageIndex]?.imageUrl}`}
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    className="h-full w-full object-cover select-none"
                    onContextMenu={preventImageDownload}
                    onDragStart={preventImageDownload}
                  />
                  {/* Transparent Overlay to Intercept Clicks on Main Image */}
                  <div
                    className="absolute inset-0"
                    onContextMenu={(e) => e.preventDefault()}
                  ></div>
                  {/* Navigation Arrows (Visible on Hover) */}
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
                  {product.productImages.map((image: ProductImagesType, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`cursor-pointer w-16 h-16 rounded-md overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-blue-600' : 'border-gray-300'
                      } hover:border-blue-400 transition relative`}
                    >
                      <img
                        src={`${VITE_API_URL}/products/uploads/${image.imageUrl}`}
                        alt={`${product.name} - Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover select-none"
                        onContextMenu={preventImageDownload}
                        onDragStart={preventImageDownload}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[400px] w-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No Images Available</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;