import { Product } from "@/domain/product.model";
import { ProductRepository } from "@/repositories/product/product.repository";
import { convertBsToUsd } from "@/ai/flows/convert-bs-to-usd";
import { checkPermissions } from "@/ai/flows/access-control";

export async function getAllProducts(repo: ProductRepository) {
  return repo.getAll();
}

export async function getProductById(repo: ProductRepository, id: string) {
  return repo.getById(id);
}

export async function createProduct(
  repo: ProductRepository,
  data: Omit<Product, "id" | "priceUsd" | "exchangeRate">,
  userId: string
) {
  const conversion = await convertBsToUsd({ amountBs: data.priceBs });
  const priceUsd = conversion.amountUsd;
  const exchangeRate = data.priceBs / priceUsd;

  return repo.create({ ...data, userId, priceUsd, exchangeRate });
}

export async function updateProduct(
  repo: ProductRepository,
  id: string,
  updates: Partial<Omit<Product, "id" | "userId">>,
  previousPriceBs: number
) {
  if (updates.priceBs && updates.priceBs !== previousPriceBs) {
    const conversion = await convertBsToUsd({ amountBs: updates.priceBs });
    updates.priceUsd = conversion.amountUsd;
    updates.exchangeRate = updates.priceBs / conversion.amountUsd;
  }

  return repo.update(id, updates);
}

export async function deleteProduct(
  repo: ProductRepository,
  id: string,
  userName: string
) {
  const perms = await checkPermissions({ userName, resourceType: "Product" });
  if (!perms.hasPermission) {
    throw new Error(perms.reason || "No autorizado");
  }

  return repo.delete(id);
}
