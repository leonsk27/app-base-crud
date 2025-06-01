// src/infrastructure/prisma/order.repository.ts
// import { Order } from "@/domain/order.model";

import { OrderRepository } from "./order.repository";
// import {PrismaClient  } from "@/generated/prisma";
import { OrderItem, Order, PrismaClient } from "@/generated/prisma";
// import { Order } from "@/domain/order.model";
const prisma = new PrismaClient();
export const prismaOrderRepository: OrderRepository = {
  // ...getAll, getById, create
  update: async (id, data) => {
  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!existingOrder) {
      return { success: false, message: "Pedido no encontrado." };
    }

    if (data.products) {
      await prisma.orderItem.deleteMany({ where: { orderId: id } });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        date: data.date ? new Date(data.date) : undefined,
        userId: data.userId,
        totalBs: data.totalBs,
        totalUsd: data.totalUsd,
        orderItems: data.products
          ? {
              create: data.products.map(p => ({
                productId: p.productId,
                quantity: p.quantity,
                priceBsAtTimeOfOrder: p.priceBsAtTimeOfOrder,
                priceUsdAtTimeOfOrder: p.priceUsdAtTimeOfOrder ?? 0,
              })),
            }
          : undefined,
      },
      include: { orderItems: true },
    });

    return {
      success: true,
      message: "Pedido actualizado exitosamente.",
      data: {
        id: updated.id,
        date: updated.date.toISOString(),
        userId: updated.userId,
        totalBs: updated.totalBs,
        totalUsd: updated.totalUsd,
        products: updated.orderItems.map((item: OrderItem) => ({
          productId: item.productId,
          quantity: item.quantity,
          priceBsAtTimeOfOrder: item.priceBsAtTimeOfOrder,
          priceUsdAtTimeOfOrder: item.priceUsdAtTimeOfOrder,
        })),
      },
    };
  } catch (error) {
    console.error("Error updating order:", error);
    return {
      success: false,
      message: "No se pudo actualizar el pedido.",
    };
  }
},

  async delete(id) {
    try {
      await prisma.orderItem.deleteMany({ where: { orderId: id } });
      await prisma.order.delete({ where: { id } });
      return { success: true, message: "Pedido eliminado correctamente." };
    } catch (error) {
      console.error("Error deleting order:", error);
      return { success: false, message: "No se pudo eliminar el pedido." };
    }
  },

  getAll: async () => {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: true,
      },
    });

    return orders.map((order: Order & { orderItems: OrderItem[]; }) => ({
      id: order.id,
      date: order.date.toISOString(),
      userId: order.userId,
      totalBs: order.totalBs,
      totalUsd: order.totalUsd,
      products: order.orderItems.map((item: OrderItem) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceBsAtTimeOfOrder: item.priceBsAtTimeOfOrder,
        priceUsdAtTimeOfOrder: item.priceUsdAtTimeOfOrder,
      })),
    }));
  },

create: async (data) => {
  try {
    const { v4: uuidv4 } = require('uuid');
    const created = await prisma.order.create({
      data: {
        id: uuidv4(),
        date: new Date(),
        userId: data.userId,
        totalBs: data.totalBs,
        totalUsd: data.totalUsd!,
        orderItems: {
          create: data.products.map(p => ({
            productId: p.productId,
            quantity: p.quantity,
            priceBsAtTimeOfOrder: p.priceBsAtTimeOfOrder,
            priceUsdAtTimeOfOrder: p.priceUsdAtTimeOfOrder ?? 0,
          })),
        },
      },
      include: { orderItems: true },
    });

    return {
      success: true,
      message: "Pedido creado exitosamente.",
      data: {
        id: created.id,
        date: created.date.toISOString(),
        userId: created.userId,
        totalBs: created.totalBs,
        totalUsd: created.totalUsd,
        products: created.orderItems.map((item: OrderItem) => ({
          productId: item.productId,
          quantity: item.quantity,
          priceBsAtTimeOfOrder: item.priceBsAtTimeOfOrder,
          priceUsdAtTimeOfOrder: item.priceUsdAtTimeOfOrder,
        })),
      },
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      message: "No se pudo crear el pedido.",
    };
  }
},

getById: async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { orderItems: true },
  });

  if (!order) return null;

  return {
    id: order.id,
    date: order.date.toISOString(),
    userId: order.userId,
    totalBs: order.totalBs,
    totalUsd: order.totalUsd,
    products: order.orderItems.map((item: OrderItem) => ({
      productId: item.productId,
      quantity: item.quantity,
      priceBsAtTimeOfOrder: item.priceBsAtTimeOfOrder,
      priceUsdAtTimeOfOrder: item.priceUsdAtTimeOfOrder,
    })),
  };
},

};
