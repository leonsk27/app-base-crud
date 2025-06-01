import { User } from "@/domain/user.model";

export interface UserRepository {
    getAll(): Promise<User[]>;
    getById(id: string): Promise<User | null>;
    getByEmailAndName(email: string, name: string): Promise<User | null>;
    delete(id: string): Promise<{ success: boolean; message: string }>;
}