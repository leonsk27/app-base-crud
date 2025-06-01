
"use client";

import React from 'react';
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { deleteProductAction } from '@/app/products/actions';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const handleDelete = async (productId: string) => {
    if (!user) {
      toast({ variant: "destructive", title: "Error", description: "Debe iniciar sesión." });
      return;
    }
    const response = await deleteProductAction(productId, user.name);
    if (response.success) {
      toast({ title: "Éxito", description: response.message });
      router.refresh(); // Re-fetch data
    } else {
      toast({ variant: "destructive", title: "Error", description: response.message });
    }
  };

  if (products.length === 0) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No hay productos</CardTitle>
          <CardDescription>Aún no se han agregado productos. Comience agregando uno nuevo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/products/new">
            <Button>Crear Nuevo Producto</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Productos</CardTitle>
        <CardDescription>Administre los productos de su tienda.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Precio (Bs.)</TableHead>
                <TableHead className="text-right">Precio (USD)</TableHead>
                <TableHead className="text-right">T. Cambio</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image
                      src={product.imageUrl || `https://placehold.co/64x64.png?text=${product.name.charAt(0)}`}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                      data-ai-hint="product item"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">{product.priceBs.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.priceUsd ? `\$${product.priceUsd.toFixed(2)}` : 'N/A'}</TableCell>
                  <TableCell className="text-right">{product.exchangeRate ? product.exchangeRate.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Link href={`/products/edit/${product.id}`} passHref>
                        <Button variant="outline" size="icon" aria-label="Editar producto">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="destructive" size="icon" aria-label="Eliminar producto">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el producto.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(product.id)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
