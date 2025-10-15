// ../data/product.type.ts

export interface ProductImagesType {
  id: number;
  productId: string;
  isMain: boolean;
  imageUrl: string | null;
}

export interface ProductType {
  id: string;
  name: string;
  description: string | null;
  price: string;
  category: 'electronics' | 'clothing' | 'home_garden' | 'books' | 'sports' | null;
  productImages: ProductImagesType[];
}