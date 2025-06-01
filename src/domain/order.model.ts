import { OrderProduct } from "./orderItem.model";

export interface Order {
  id: string;
  date: string;
  userId: string;
  totalBs: number;
  totalUsd?: number;
  products: OrderProduct[];
}

export type OrderProductInput = {
  productId: string;
  quantity: number;
  priceBsAtTimeOfOrder: number;
  priceUsdAtTimeOfOrder?: number;
};

export type CreateOrderInput = {
  userId: string;
  date: string;
  totalBs: number;
  totalUsd?: number;
  products: OrderProductInput[];
};
