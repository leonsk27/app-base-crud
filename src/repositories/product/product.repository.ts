import { Product } from "@/domain/product.model";

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(data: Omit<Product, "id">): Promise<{ success: boolean, message: string}>;
  update(id: string, data: Partial<Omit<Product, "id" | "userId">>): Promise<{ success: boolean, message: string}>;
  delete(id: string): Promise<{ success: boolean, message: string}>;
}