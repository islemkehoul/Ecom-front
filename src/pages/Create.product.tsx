import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'electronics' | 'clothing' | 'home_garden' | 'books' | 'sports' | null;
  images: File[];
}

const ProductForm: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const categories: Array<Product['category']> = [
    null,
    'electronics',
    'clothing',
    'home_garden',
    'books',
    'sports',
  ];

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...newFiles]);
      // Generate preview URLs for new images
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const handleDeleteImage = (index: number) => {
    // Remove image and its preview at the specified index
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prevPreviews[index]);
      return prevPreviews.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category || ''); // Send empty string for null
    // Append all images under the 'image' key
    images.forEach((image) => {
      formData.append('image', image);
    });

    try {
      const response = await axios.post('http://localhost:3000/api/v1/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      // Reset form
      setId('');
      setName('');
      setPrice('');
      setDescription('');
      setCategory('');
      setImages([]);
      // Revoke all preview URLs
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setImagePreviews([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating product');
      console.error(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-card rounded-2xl shadow-lg border border-border">
      <h2 className="text-2xl font-bold mb-6 text-center text-card-foreground">Create New Product</h2>

      {message && <div className="mb-4 p-3 rounded bg-success/10 text-success border border-success/20">{message}</div>}
      {error && <div className="mb-4 p-3 rounded bg-destructive/10 text-destructive border border-destructive/20">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product ID */}
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-foreground">
            Product ID
          </label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setId(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2"
          />
        </div>

        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-foreground">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2"
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-foreground">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2"
          >
            <option value="">Select a category</option>
            {categories.filter((cat) => cat !== null).map((cat) => (
              <option key={cat} value={cat}>
                {cat
                  .split('_')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Images */}
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-foreground">
            Product Images
          </label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full rounded-lg border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2"
          />
          {images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Selected images:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imagePreviews[index]}
                      alt={`Preview ${image.name}`}
                      className="w-full h-24 object-cover rounded-md border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 text-xs hover:bg-destructive/90 transition"
                    >
                      &times;
                    </button>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{image.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg shadow hover:bg-primary/90 transition"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;