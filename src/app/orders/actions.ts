"use server";

import { prismaOrderRepository } from "@/repositories/order/order.prisma";
import {
  createOrderService,
  updateOrderService,
  deleteOrderService,
  getAllOrdersService,
  getOrderByIdService,
} from "@/services/order.service";
import { revalidatePath } from "next/cache";

// Obtener todos los pedidos
export async function getOrders() {
  return await getAllOrdersService(prismaOrderRepository);
}

// Obtener pedido por ID
export async function getOrderById(id: string) {
  return await getOrderByIdService(prismaOrderRepository, id);
}

// Crear un nuevo pedido
export async function createOrder(
  orderData: { userId: string; products: { productId: string; quantity: number }[] },
  currentUserName: string
): Promise<{ success: boolean; message: string }> {
  const result = await createOrderService(prismaOrderRepository, orderData.userId, orderData.products);
  if (result.success) {
    revalidatePath("/orders");
  }
  return result;
}

// Actualizar pedido existente
export async function updateOrder(
  id: string,
  data: { products?: { productId: string; quantity: number; priceBsAtTimeOfOrder: number; priceUsdAtTimeOfOrder?: number }[] }
): Promise<{ success: boolean; message: string }> {
  const result = await updateOrderService(prismaOrderRepository, id, data.products ?? []);
  if (result.success) {
    revalidatePath("/orders");
  }
  return result;
}

// Eliminar pedido
export async function deleteOrder(id: string): Promise<{ success: boolean; message: string }> {
  const result = await deleteOrderService(prismaOrderRepository, id);
  if (result.success) {
    revalidatePath("/orders");
  }
  return result;
}

// // In-memory store for orders
// let ordersStore: Order[] = [
//     { 
//         id: "order-1", 
//         date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
//         userId: MOCK_USERS[1].id, 
//         products: [
//             { productId: "prod-1", quantity: 2, priceBsAtTimeOfOrder: 7.50, priceUsdAtTimeOfOrder: 1.08 },
//             { productId: "prod-2", quantity: 1, priceBsAtTimeOfOrder: 12.00, priceUsdAtTimeOfOrder: 1.73 },
//         ],
//         totalBs: (2 * 7.50) + (1 * 12.00),
//         totalUsd: (2* 1.08) + (1* 1.73),
//     },
//     { 
//         id: "order-2", 
//         date: new Date().toISOString(), // Today
//         userId: MOCK_USERS[2].id, 
//         products: [
//             { productId: "prod-3", quantity: 5, priceBsAtTimeOfOrder: 8.00, priceUsdAtTimeOfOrder: 1.15 },
//         ],
//         totalBs: 5 * 8.00,
//         totalUsd: 5 * 1.15
//     },
// ];


// // Facade: Get all orders
// export async function getOrders(): Promise<Order[]> {
//   // In a real app, this would fetch from a database
//   return JSON.parse(JSON.stringify(ordersStore)); // Return a copy
// }

// // Facade: Get a single order by ID
// export async function getOrderById(id: string): Promise<Order | undefined> {
//   return ordersStore.find(o => o.id === id);
// }

// // Singleton (Conceptual via Server Action) & Facade: Create a new order
// export async function createOrder(
//   orderData: Omit<Order, "id" | "date" | "totalBs" | "totalUsd">,
//   currentUserName: string
// ): Promise<{ success: boolean; message: string; order?: Order }> {
//   const currentUser = MOCK_USERS.find(u => u.name === currentUserName);
//   if (!currentUser) {
//     return { success: false, message: "Usuario no encontrado." };
//   }

//   let totalBs = 0;
//   let totalUsd = 0;
//   const processedProducts: OrderProduct[] = [];

//   for (const item of orderData.products) {
//     const productDetails = await getProductById(item.productId);
//     if (!productDetails) {
//       return { success: false, message: `Producto con ID ${item.productId} no encontrado.` };
//     }
//     processedProducts.push({
//       productId: item.productId,
//       quantity: item.quantity,
//       priceBsAtTimeOfOrder: productDetails.priceBs, // Price at time of order
//       priceUsdAtTimeOfOrder: productDetails.priceUsd, // USD Price at time of order
//     });
//     totalBs += productDetails.priceBs * item.quantity;
//     if (productDetails.priceUsd) {
//       totalUsd += productDetails.priceUsd * item.quantity;
//     }
//   }
  
//   const newId = `order-${Date.now()}`;
//   const newOrder: Order = {
//     ...orderData,
//     id: newId,
//     userId: currentUser.id,
//     date: new Date().toISOString(),
//     products: processedProducts,
//     totalBs,
//     totalUsd: totalUsd > 0 ? totalUsd : undefined, // Only set if calculated
//   };

//   ordersStore.push(newOrder);
//   revalidatePath("/orders");
//   revalidatePath("/");
//   return { success: true, message: "Pedido creado exitosamente.", order: newOrder };
// }

// // Facade: Update an existing order (Simplified: e.g., only products list, recalculate totals)
// // Full order update can be complex (status changes, payment etc.) - keeping it simple for now.
// export async function updateOrder(
//   id: string,
//   orderUpdateData: { products?: { productId: string; quantity: number }[] }, // Allow updating products
//   currentUserName: string
// ): Promise<{ success: boolean; message: string; order?: Order }> {
//   const orderIndex = ordersStore.findIndex(o => o.id === id);
//   if (orderIndex === -1) {
//     return { success: false, message: "Pedido no encontrado." };
//   }

//   const existingOrder = ordersStore[orderIndex];
//   let updatedOrder = { ...existingOrder };

//   if (orderUpdateData.products) {
//     let newTotalBs = 0;
//     let newTotalUsd = 0;
//     const newProcessedProducts: OrderProduct[] = [];

//     for (const item of orderUpdateData.products) {
//       const productDetails = await getProductById(item.productId);
//       if (!productDetails) {
//         return { success: false, message: `Producto con ID ${item.productId} no encontrado para la actualización.` };
//       }
//       newProcessedProducts.push({
//         productId: item.productId,
//         quantity: item.quantity,
//         priceBsAtTimeOfOrder: productDetails.priceBs,
//         priceUsdAtTimeOfOrder: productDetails.priceUsd,
//       });
//       newTotalBs += productDetails.priceBs * item.quantity;
//       if (productDetails.priceUsd) {
//         newTotalUsd += productDetails.priceUsd * item.quantity;
//       }
//     }
//     updatedOrder.products = newProcessedProducts;
//     updatedOrder.totalBs = newTotalBs;
//     updatedOrder.totalUsd = newTotalUsd > 0 ? newTotalUsd : undefined;
//   }
  
//   ordersStore[orderIndex] = updatedOrder;
//   revalidatePath("/orders");
//   revalidatePath("/");
//   revalidatePath(`/orders/edit/${id}`);
//   return { success: true, message: "Pedido actualizado exitosamente.", order: updatedOrder };
// }


// // Proxy Pattern & Facade: Delete an order
// export async function deleteOrder(
//   id: string,
//   currentUserName: string
// ): Promise<{ success: boolean; message: string }> {
//   // Proxy: Check permissions
//   try {
//     const permissions = await checkPermissionsAI({ userName: currentUserName, resourceType: "Order" });
//     if (!permissions.hasPermission) {
//       return { success: false, message: `Acceso denegado: ${permissions.reason || 'No tiene permisos para eliminar pedidos.'}` };
//     }
//   } catch (error) {
//     console.error("Error checking permissions:", error);
//     return { success: false, message: "Error al verificar permisos. No se eliminó el pedido." };
//   }

//   const initialLength = ordersStore.length;
//   ordersStore = ordersStore.filter(o => o.id !== id);

//   if (ordersStore.length < initialLength) {
//     revalidatePath("/orders");
//     revalidatePath("/");
//     return { success: true, message: "Pedido eliminado exitosamente." };
//   }
//   return { success: false, message: "Pedido no encontrado para eliminar." };
// }
