// src/services/order.service.ts
import { OrderRepository } from "@/repositories/order/order.repository";
import { getProductByIdAction } from "@/app/products/actions";
import type { OrderProduct } from "@/domain/orderItem.model";

export async function createOrderService(
  repo: OrderRepository,
  userId: string,
  products: { productId: string; quantity: number }[]
) {
  let totalBs = 0;
  let totalUsd = 0;
  const processedProducts: OrderProduct[] = [];

  for (const item of products) {
    const product = await getProductByIdAction(item.productId);
    if (!product) {
      return { success: false, message: `Producto con ID ${item.productId} no encontrado.` };
    }

    processedProducts.push({
      productId: item.productId,
      quantity: item.quantity,
      priceBsAtTimeOfOrder: product.priceBs,
      priceUsdAtTimeOfOrder: product.priceUsd ?? 0,
    });

    totalBs += product.priceBs * item.quantity;
    if (product.priceUsd) {
      totalUsd += product.priceUsd * item.quantity;
    }
  }

  return await repo.create({
    userId,
    date: new Date().toISOString(),
    totalBs,
    totalUsd: totalUsd > 0 ? totalUsd : undefined,
    products: processedProducts,
  });
}

export async function updateOrderService(
  repo: OrderRepository,
  orderId: string,
  products: { productId: string; quantity: number }[]
) {
  let totalBs = 0;
  let totalUsd = 0;
  const processedProducts: OrderProduct[] = [];

  for (const item of products) {
    const product = await getProductByIdAction(item.productId);
    if (!product) {
      return { success: false, message: `Producto con ID ${item.productId} no encontrado.` };
    }

    processedProducts.push({
      productId: item.productId,
      quantity: item.quantity,
      priceBsAtTimeOfOrder: product.priceBs,
      priceUsdAtTimeOfOrder: product.priceUsd ?? 0,
    });

    totalBs += product.priceBs * item.quantity;
    if (product.priceUsd) {
      totalUsd += product.priceUsd * item.quantity;
    }
  }

  return await repo.update(orderId, {
    totalBs,
    totalUsd: totalUsd > 0 ? totalUsd : undefined,
    products: processedProducts,
  });
}

export async function deleteOrderService(
  repo: OrderRepository,
  id: string
) {
  return await repo.delete(id);
}

export async function getAllOrdersService(repo: OrderRepository) {
  const data = await repo.getAll();
  return { success: true, data };
}

export async function getOrderByIdService(repo: OrderRepository, id: string) {
  const data = await repo.getById(id);
  if (data) return { success: true, data };
  return { success: false, message: "Pedido no encontrado." };
}
