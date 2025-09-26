import { useParams } from 'react-router-dom';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAllProducts, createOrder } from '../controllers/controller';
import { VITE_API_URL } from '../api/apiconfig';

interface FormData {
  product_id: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_region: string;
}

interface ValidationErrors {
  [key: string]: string; // field name -> error message
}

const ProductDetails = () => {
  // State for validation errors
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Fetch products
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  // Mutation for creating order
  const mutation = useMutation({
    mutationKey: ['createOrder'],
    mutationFn: createOrder,
    onSuccess: () => {
      setValidationErrors({});
      setFormData(initialFormData); // Reset form
      alert('Order placed successfully!');
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        console.log('Backend validation errors:', error.response.data.errors);
        const errorMap: ValidationErrors = {};
        error.response.data.errors.forEach((err: any) => {
          errorMap[err.path] = err.msg;
        });
        setValidationErrors(errorMap);
      } else {
        setValidationErrors({});
        alert('Error placing order. Please try again.');
      }
    },
  });

  const { id } = useParams();
  const productId = String(id);
  const product = data?.find((p: { id: string }) => p.id === productId);
 const initialFormData: FormData = {
    product_id: productId,
    customer_name: '',
    customer_phone: '',
    customer_city: '',
    customer_region: '',
  };
  const [formData, setFormData] = useState<FormData>({
    product_id: productId,
    customer_name: '',
    customer_phone: '',
    customer_city: '',
    customer_region: '',
  });

  // Front-end validation function
  const validateForm = (data: FormData, field?: string): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Validate only the specified field (for real-time validation) or all fields
    if (!field || field === 'customer_name') {
      if (!data.customer_name.trim()) {
        errors.customer_name = 'Name is required';
      } else if (data.customer_name.length < 4) {
        errors.customer_name = 'Name must be at least 2 characters';
      }
    }

    if (!field || field === 'customer_phone') {
      const phoneRegex = /^(\+213|0)(5|6|7)[0-9]{8}$/; // Basic phone number validation
      if (!data.customer_phone.trim()) {
        errors.customer_phone = 'Phone number is required';
      } else if (!phoneRegex.test(data.customer_phone)) {
        errors.customer_phone = 'Invalid phone number format';
      }
    }

    if (!field || field === 'customer_city') {
      if (!data.customer_city.trim()) {
        errors.customer_city = 'City is required';
      } else if (data.customer_city.length < 2) {
        errors.customer_city = 'City must be at least 2 characters';
      }
    }

    if (!field || field === 'customer_region') {
      if (!data.customer_region.trim()) {
        errors.customer_region = 'Region is required';
      } else if (data.customer_region.length < 2) {
        errors.customer_region = 'Region must be at least 2 characters';
      }
    }

    return errors;
  };

  // Handle input changes with real-time validation
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate only the changed field
    const fieldErrors = validateForm({ ...formData, [name]: value }, name);
    
    // Update validation errors, preserving backend errors for other fields
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      if (fieldErrors[name]) {
        newErrors[name] = fieldErrors[name];
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate entire form
    const errors = validateForm(formData);
    setValidationErrors(errors);

    // If there are front-end validation errors, stop submission
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Submit to backend if front-end validation passes
    mutation.mutate(formData);
  };

  // Helper function to get error message for a field
  const getFieldError = (fieldName: string): string => {
    return validationErrors[fieldName] || '';
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
        <div className="w-full lg:w-1/2 space-y-6" style={{ minHeight: '400px' }}>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-2xl text-blue-600 font-semibold">${product.price}</p>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm h-full flex flex-col justify-center">
            <h2 className="text-xl font-semibold mb-4">Place Your Order</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                    getFieldError('customer_name')
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {getFieldError('customer_name') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('customer_name')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                    getFieldError('customer_phone')
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {getFieldError('customer_phone') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('customer_phone')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="customer_city"
                  value={formData.customer_city}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                    getFieldError('customer_city')
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {getFieldError('customer_city') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('customer_city')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <input
                  type="text"
                  name="customer_region"
                  value={formData.customer_region}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                    getFieldError('customer_region')
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {getFieldError('customer_region') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('customer_region')}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-semibold mt-6 disabled:bg-gray-400"
              >
                {mutation.isPending ? 'Processing...' : 'Buy Now'}
              </button>
            </form>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[400px] w-full max-w-md flex items-center justify-center">
            <img
              src={`${VITE_API_URL}/products/uploads/${product.image}`}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;