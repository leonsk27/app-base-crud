// /app/api/products/delete/route.ts
import { NextResponse } from 'next/server';
import { deleteProductAction } from '@/app/products/actions';

export async function POST(req: Request) {
  try {
    const { id, userName } = await req.json();

    if (!id || !userName) {
      return NextResponse.json({ success: false, message: 'Datos incompletos.' }, { status: 400 });
    }

    const result = await deleteProductAction(id, userName);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json({ success: false, message: 'Error en el servidor.' }, { status: 500 });
  }
}
