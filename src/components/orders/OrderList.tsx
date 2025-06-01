
"use client";

import React, { useEffect, useState } from 'react';
import type { Order } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Eye, PackageSearch } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { deleteOrder } from '@/app/orders/actions';
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
import { Badge } from '../ui/badge';
import { getAllUsers } from '@/app/login/actions';


interface OrderListProps {
  orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchUsers() {
      const users = await getAllUsers();
      const userMap: Record<string, string> = {};
      users.forEach(u => {
        userMap[u.id] = u.name;
      });
      setUsersMap(userMap);
    }
    fetchUsers();
  }, []);
  const handleDelete = async (orderId: string) => {
    if (!user) {
      toast({ variant: "destructive", title: "Error", description: "Debe iniciar sesión." });
      return;
    }


    
    const response = await deleteOrder(orderId);
    if (response.success) {
      toast({ title: "Éxito", description: response.message });
      router.refresh();
    } else {
      toast({ variant: "destructive", title: "Error", description: response.message });
    }
  };

  
  const getUserName = (userId: string) => usersMap[userId] || 'Desconocido';


  if (orders.length === 0) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center"> 
            <PackageSearch className="mr-2 h-8 w-8 text-muted-foreground" />
            No hay pedidos
          </CardTitle>
          <CardDescription>Aún no se han registrado pedidos. Comience creando uno nuevo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/orders/new">
            <Button>Crear Nuevo Pedido</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Pedidos</CardTitle>
        <CardDescription>Administre los pedidos de sus clientes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pedido</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Total (Bs.)</TableHead>
                <TableHead className="text-right">Total (USD)</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <Link href={`/orders/view/${order.id}`} className="text-primary hover:underline">
                        {order.id.substring(0,10)}...
                    </Link>
                  </TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>{getUserName(order.userId)}</TableCell>
                  <TableCell className="text-right">{order.totalBs.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{order.totalUsd ? `\$${order.totalUsd.toFixed(2)}` : 'N/A'}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{order.products.reduce((sum, p) => sum + p.quantity, 0)}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Link href={`/orders/view/${order.id}`} passHref>
                        <Button variant="outline" size="icon" aria-label="Ver pedido">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/orders/edit/${order.id}`} passHref>
                        <Button variant="outline" size="icon" aria-label="Editar pedido">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="destructive" size="icon" aria-label="Eliminar pedido">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el pedido.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(order.id)}>
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
