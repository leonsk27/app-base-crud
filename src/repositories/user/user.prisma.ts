import { PrismaClient } from "@/generated/prisma";
import { UserRepository } from "./user.repository";

const prisma = new PrismaClient();

export const prismaUserRepository: UserRepository = {
  async getAll() {
    return prisma.user.findMany();
  },

  async getById(id) {
    return prisma.user.findUnique({ where: { id } });
  },
  async getByEmailAndName(email, name) {
    console.log("TESTING IMPLEMENT EMAIL", email);
    console.log("TESTING IMPLEMENT NAME", name);
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        name: name,
      },
    });
    console.log("TESTING IMPLEMENT LOGIN", user);
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  },
  async delete(id: string) {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return {
        success: true,
        message: "Usuario eliminado correctamente.",
      };
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return {
        success: false,
        message: "No se pudo eliminar el usuario.",
      };
    }
  },
};
