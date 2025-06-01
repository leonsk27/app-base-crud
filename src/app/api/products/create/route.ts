import { NextResponse } from "next/server";
import { createProductAction } from "@/app/products/actions";

export async function POST(req: Request) {
  try {
    const { product, userId } = await req.json();

    if (!product || !userId) {
      return NextResponse.json(
        { success: false, message: "Faltan datos requeridos." },
        { status: 400 }
      );
    }

    const result = await createProductAction(product, userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error creating product:", error);
    return NextResponse.json(
      { success: false, message: "Error en el servidor." },
      { status: 500 }
    );
  }
}
