export interface Category {
  slug: string;
  name: string;
  tagline: string;
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  tag?: string;
}
