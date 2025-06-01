export interface OrderProduct {
  productId: string;
  quantity: number;
  priceBsAtTimeOfOrder: number;
  priceUsdAtTimeOfOrder?: number;
}