'use server';

import { prismaUserRepository } from "@/repositories/user/user.prisma";

// Obtener todos los usuarios
export async function getAllUsers() {
  return await prismaUserRepository.getAll();
}

// Obtener un usuario por su ID
export async function getUserById(id: string) {
  return await prismaUserRepository.getById(id);
}

// Obtener un usuario por email y nombre
export async function getUserByEmailAndName(email: string, name: string) {
  return await prismaUserRepository.getByEmailAndName(email, name);
}
