import { NextResponse } from 'next/server';
import { prismaProductRepository } from '@/repositories/product/product.prisma';
import { updateProduct } from '@/services/product.service';

export async function POST(req: Request) {
  try {
    const { id, updates, previousPriceBs } = await req.json();
    console.log("ROUTING PATCH");

    if (!id || !updates) {
      return NextResponse.json(
        { success: false, message: 'Faltan datos requeridos.' },
        { status: 400 }
      );
    }

    // ✅ Usa directamente el servicio (no la Server Action)
    const result = await updateProduct(prismaProductRepository, id, updates, previousPriceBs);
    console.log("ROUTING PATCH AFTER CALL");

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ API Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'Error en el servidor.' },
      { status: 500 }
    );
  }
}
