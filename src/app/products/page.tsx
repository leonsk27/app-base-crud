
import React from 'react';
import ProductList from '@/components/products/ProductList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getProductsAction } from './actions';
import type { Product } from '@/lib/types';

export const dynamic = 'force-dynamic'; // Ensure data is fetched on each request

export default async function ProductsPage() {
  let products: Product[] = [];
  try {
    products = await getProductsAction();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    // Optionally, render an error state here
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Gestión de Productos</h1>
        <Link href="/products/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Producto
          </Button>
        </Link>
      </div>
      <ProductList products={products} />
    </div>
  );
}
