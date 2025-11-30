import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { VITE_API_URL } from '../api/apiconfig';
import { useQuery } from '@tanstack/react-query';
import type { ProductType } from '../data/product.type';
import { getAllProducts } from '../controllers/product.controller';
import { useTranslation } from 'react-i18next';

const Products = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { key: 'all', label: t('categories.all') },
    { key: 'electronics', label: t('categories.electronics') },
    { key: 'clothing', label: t('categories.clothing') },
    { key: 'home_garden', label: t('categories.home_garden') },
    { key: 'books', label: t('categories.books') },
    { key: 'sports', label: t('categories.sports') }
  ];

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
        selectedCategory === 'all' ||
        product.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [data, searchTerm, selectedCategory]);

  if (isLoading) return <p>{t('products.loading')}</p>;
  if (isError) return <p>{t('products.error_fetching')}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-foreground">{t('products.title')}</h1>
      <p className="mt-2 mb-6 text-muted-foreground">{t('products.browse_collection')}</p>

      {/* Search & Filter Controls */}
      <div className="mb-8 space-y-4 md:flex md:items-center md:justify-between md:space-y-0">
        <input
          type="text"
          placeholder={t('products.search_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground transition-colors"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-input rounded mt-2 md:mt-0 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground transition-colors"
        >
          {categories.map((category) => (
            <option key={category.key} value={category.key}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-muted-foreground">
          {t('products.showing')} {filteredProducts.length} {t('products.of')} {data?.data?.length || 0} {t('products.products_text')}
          {searchTerm && ` ${t('products.for')} "${searchTerm}"`}
          {selectedCategory !== 'all' && ` ${t('products.in')} ${categories.find(c => c.key === selectedCategory)?.label}`}
        </p>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-lg">{t('products.no_products')}</p>
          {(searchTerm || selectedCategory !== 'all') && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="text-primary hover:text-primary/80 underline transition-colors"
              >
                {t('products.clear_filters')}
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
                className="border border-border rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 flex flex-col h-[420px] bg-card"
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
                    <h3 className="text-lg font-semibold text-card-foreground">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{product.category}</p>
                    <p className="mt-2 text-foreground">
                      <strong>${product.price}</strong>
                    </p>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2 overflow-hidden">
                      {product.description}
                    </p>
                  </div>
                  <Link
                    to={`/products/${product.id}`}
                    className="mt-4 w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition block text-center"
                  >
                    {t('products.add_to_cart')}
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