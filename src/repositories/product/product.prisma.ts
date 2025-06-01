import { PrismaClient } from "@/generated/prisma";
import { ProductRepository } from "./product.repository";

const prisma = new PrismaClient();

export const prismaProductRepository: ProductRepository = {
  async getAll() {
    console.log("accediendo a prisma");
    return prisma.product.findMany();
  },

  async getById(id) {
    return prisma.product.findUnique({ where: { id } });
  },

  async create(data) {
    console.log("CREATING DATA", data);
    try {
      const { priceUsd, exchangeRate, ...rest } = data;
      const createData: any = {
        id: `prod-${Date.now()}`,
        ...rest,
      };
      if (priceUsd !== undefined) {
        createData.priceUsd = priceUsd;
      }
      if (exchangeRate !== undefined) {
        createData.exchangeRate = exchangeRate;
      }
    await prisma.product.create({
      data: createData,
    });
      return {success: true, message: "Producto creado correctamente."};
    } catch (error) {
      console.log("ERROR", error);
      return {success: false, message: "No se pudo crear el producto."};
    }
  },

  async update(id, data) {
    console.log("UPDATING DATA", data);
    try {
      await prisma.product.update({ where: { id }, data });
      return {success: true, message: "Producto actualizado correctamente."};

    } catch (error) {
      return {success: false, message: "No se pudo actualizar el producto."};
    }
  },

  async delete(id) {
    try {
      await prisma.product.delete({ where: { id } });
      return {success: true, message: "Producto eliminado correctamente."};
    } catch {
      return {success: false, message: "No se pudo eliminar el producto."};
    }
  },
};
