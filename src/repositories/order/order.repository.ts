// src/repositories/order.repository.ts
import { Order } from "@/domain/order.model";

export interface OrderRepository {
  getAll(): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
  create(order: Omit<Order, "id">): Promise<{ success: boolean; message: string }>;
  update(id: string, data: Partial<Omit<Order, "id" | "products">> & { products?: Order["products"] }): Promise<{ success: boolean; message: string }>;
  delete(id: string): Promise<{ success: boolean; message: string }>;
}
