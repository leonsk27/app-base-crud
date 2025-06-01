
"use client";

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Order, Product as ProductType, OrderProduct } from "@/lib/types";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createOrder, updateOrder } from '@/app/orders/actions';
import { getProductsAction } from '@/app/products/actions'; // To fetch products for selection
import { PlusCircle, Trash2, PackageSearch } from 'lucide-react';

const orderProductSchema = z.object({
  productId: z.string().min(1, "Debe seleccionar un producto."),
  quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1."),
});

const orderFormSchema = z.object({
  products: z.array(orderProductSchema).min(1, "Debe añadir al menos un producto al pedido."),
  // userId is handled by server action
  // date, totals are calculated by server action
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface OrderFormProps {
  initialData?: Order | null;
  isEditing?: boolean;
}

export default function OrderForm({ initialData, isEditing = false }: OrderFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [availableProducts, setAvailableProducts] = useState<ProductType[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      products: initialData?.products.map(p => ({ productId: p.productId, quantity: p.quantity })) || [{ productId: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  useEffect(() => {
    async function fetchProducts() {
      setIsLoadingProducts(true);
      try {
        const products = await getProductsAction();
        setAvailableProducts(products);
      } catch (error) {
        console.error("Failed to fetch products for order form:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los productos." });
      }
      setIsLoadingProducts(false);
    }
    fetchProducts();
  }, [toast]);
  
  useEffect(() => {
    if (initialData) {
      form.reset({
        products: initialData.products.map(p => ({ productId: p.productId, quantity: p.quantity })),
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: OrderFormValues) => {
    if (!user) {
      toast({ variant: "destructive", title: "Error", description: "Debe iniciar sesión." });
      return;
    }

    const orderPayload = {
      userId: user.id, // Handled by server
      products: data.products,
    };

    try {
      let response;
      if (isEditing && initialData) {
        // Map form products to include price fields from initialData
        const updatedProducts = data.products.map((prod) => {
          const original = initialData.products.find(p => p.productId === prod.productId);
          return {
            productId: prod.productId,
            quantity: prod.quantity,
            priceBsAtTimeOfOrder: original?.priceBsAtTimeOfOrder ?? 0,
            priceUsdAtTimeOfOrder: original?.priceUsdAtTimeOfOrder,
          };
        });
        response = await updateOrder(initialData.id, { products: updatedProducts });
      } else {
        response = await createOrder(orderPayload, user.name);
      }

      if (response.success) {
        toast({ title: "Éxito", description: response.message });
        router.push('/orders');
        router.refresh();
      } else {
        toast({ variant: "destructive", title: "Error", description: response.message });
      }
    } catch (error) {
      console.error("Order form submission error:", error);
      toast({ variant: "destructive", title: "Error", description: "Ocurrió un error inesperado." });
    }
  };

  if (isLoadingProducts) {
    return <Card><CardContent className="p-6">Cargando productos...</CardContent></Card>;
  }
  
  if (availableProducts.length === 0 && !isEditing) {
     return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PackageSearch className="mr-2 h-6 w-6" /> No hay productos disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>No se pueden crear pedidos porque no hay productos en el sistema. Por favor, añada productos primero.</p>
          <Button onClick={() => router.push('/products/new')} className="mt-4">
            Añadir Producto
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Pedido" : "Crear Nuevo Pedido"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Productos del Pedido</h3>
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-end space-x-2 mb-4 p-3 border rounded-md bg-muted/30">
                  <FormField
                    control={form.control}
                    name={`products.${index}.productId`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Producto</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un producto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableProducts.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name} (Bs. {p.priceBs.toFixed(2)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`products.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="w-24">
                        <FormLabel>Cantidad</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
               <FormMessage>{form.formState.errors.products?.message || form.formState.errors.products?.root?.message}</FormMessage>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ productId: "", quantity: 1 })}
                className="mt-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Producto
              </Button>
            </div>

            {isEditing && initialData && (
              <div className="space-y-1 text-sm mt-4 p-3 border rounded-md bg-background">
                <p><span className="font-semibold">Fecha del Pedido:</span> {new Date(initialData.date).toLocaleDateString()}</p>
                <p><span className="font-semibold">Total Bs.:</span> {initialData.totalBs.toFixed(2)}</p>
                <p><span className="font-semibold">Total USD:</span> {initialData.totalUsd ? `\$${initialData.totalUsd.toFixed(2)}` : 'N/A'}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Guardando..." : (isEditing ? "Actualizar Pedido" : "Crear Pedido")}
            </Button>
          </form>
        </Form>
      </CardContent>
       {isEditing && (
        <CardFooter>
            <Button variant="outline" onClick={() => router.back()} className="w-full">
                Cancelar
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}

