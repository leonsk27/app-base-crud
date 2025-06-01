
"use client";

import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createProductAction, updateProductAction } from '@/app/products/actions';
import { Textarea } from '../ui/textarea'; // Assuming Textarea might be useful for product description later

const productFormSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }).max(100),
  priceBs: z.coerce.number().positive({ message: "El precio en BS debe ser un número positivo." }),
  imageUrl: z.string().url({ message: "Debe ser una URL válida para la imagen." }).optional().or(z.literal('')),
  // userId is handled by the server action based on logged in user
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  initialData?: Product | null;
  isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing }: ProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      priceBs: initialData?.priceBs || 0,
      imageUrl: initialData?.imageUrl || "",
    },
  });
  
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        priceBs: initialData.priceBs,
        imageUrl: initialData.imageUrl || '',
      });
    }
  }, [initialData, form]);


const onSubmit = async (data: ProductFormValues) => {
  if (!user) {
    toast({ variant: "destructive", title: "Error", description: "Debe iniciar sesión para realizar esta acción." });
    return;
  }

  const productDataPayload = {
    name: data.name,
    priceBs: data.priceBs,
    imageUrl: data.imageUrl || undefined,
    userId: user.id,
  };

  try {
    const response = await fetch(
      isEditing && initialData
        ? "/api/products/update"
        : "/api/products/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isEditing && initialData
            ? {
                id: initialData.id,
                updates: productDataPayload,
                previousPriceBs: initialData.priceBs,
              }
            : {
                product: productDataPayload,
                userId: user.id,
              }
        ),
      }
    );

    const result = await response.json();

    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      router.push("/products");
      router.refresh();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  } catch (error) {
    console.error("Form submission error:", error);
    toast({ variant: "destructive", title: "Error", description: "Ocurrió un error inesperado." });
  }
};


  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Producto" : "Crear Nuevo Producto"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Leche PIL (1L)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priceBs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio (Bs.)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Ej: 7.50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de Imagen (Opcional)</FormLabel>
                  <FormControl>
                    
                    <Input placeholder="https://i.pinimg.com/" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {isEditing && initialData && (
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Precio USD:</span> {initialData.priceUsd ? `\$${initialData.priceUsd.toFixed(2)}` : 'N/A'}</p>
                <p><span className="font-semibold">Tasa de Cambio:</span> {initialData.exchangeRate ? initialData.exchangeRate.toFixed(2) : 'N/A'}</p>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Guardando..." : (isEditing ? "Actualizar Producto" : "Crear Producto")}
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
