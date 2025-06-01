
"use server";

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/product.service";

import { prismaProductRepository } from "@/repositories/product/product.prisma";
import { revalidatePath } from "next/cache";

// Aquí se usa el repositorio concreto (Prisma)
const repo = prismaProductRepository;

export async function getProductsAction() {
  return await getAllProducts(repo);
}

export async function getProductByIdAction(id: string) {
  return await getProductById(repo, id);
}

export async function createProductAction(data: any, userId: string) {
  const product = await createProduct(repo, data, userId);
  revalidatePath("/products");
  return product;
}

export async function updateProductAction(
  id: string,
  updates: any,
  previousPriceBs: number
) {
  console.log("UPDATING FROM ACTIONS");
  const success = await updateProduct(repo, id, updates, previousPriceBs);
  revalidatePath("/products");
  return success;
}

export async function deleteProductAction(id: string, userName: string) {
  try {
    await deleteProduct(repo, id, userName);
    revalidatePath("/products");
    return { success: true, message: "Producto eliminado" };
  } catch (error) {
    console.error("Error deleting product");
    return { success: false, message: "No se pudo eliminar la orden."}
  }
}

