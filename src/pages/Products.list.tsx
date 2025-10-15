import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { VITE_API_URL } from '../api/apiconfig';
import { useQuery } from '@tanstack/react-query';
import type { ProductType } from '../data/product.type';
import { getAllProducts } from '../controllers/product.controller';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports'];

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });

  // Filter products based on search term and category
  const filteredProducts = useMemo(() => {
    if (!data) return []; // Access data.data based on response structure

    return data.filter((product: ProductType) => {
      const matchesSearch =
        searchTerm === '' ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' ||
        product.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Electronics' && product.category === 'electronics') ||
        (selectedCategory === 'Clothing' && product.category === 'clothing') ||
        (selectedCategory === 'Home & Garden' && product.category === 'home_garden') ||
        (selectedCategory === 'Books' && product.category === 'books') ||
        (selectedCategory === 'Sports' && product.category === 'sports');

      return matchesSearch && matchesCategory;
    });
  }, [data, searchTerm, selectedCategory]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching products</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <p className="mt-2 mb-6">Browse through our collection</p>

      {/* Search & Filter Controls */}
      <div className="mb-8 space-y-4 md:flex md:items-center md:justify-between md:space-y-0">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded mt-2 md:mt-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredProducts.length} of {data?.data?.length || 0} products
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No products found.</p>
          {(searchTerm || selectedCategory !== 'All') && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product: ProductType) => {
            // Select the main image (isMain: true) or the first image if no main image
            const mainImage = product.productImages.find((img) => img.isMain) || product.productImages[0];
            return (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 flex flex-col h-[420px]"
              >
                {mainImage && mainImage.imageUrl && (
                  <img
                    src={`${VITE_API_URL}/products/uploads/${mainImage.imageUrl}`}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{product.category}</p>
                    <p className="mt-2">
                      <strong>${product.price}</strong>
                    </p>
                    <p className="text-gray-700 text-sm mt-1 line-clamp-2 overflow-hidden">
                      {product.description}
                    </p>
                  </div>
                  <Link
                    to={`/products/${product.id}`}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition block text-center"
                  >
                    Add to Cart
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;