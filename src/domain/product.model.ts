export interface Product {
  id: string;
  name: string;
  priceBs: number;
  priceUsd?: number;
  exchangeRate?: number;
  userId: string; // ID of the user who created/manages the product
  imageUrl?: string; 
}