
import React from 'react';
import OrderList from '@/components/orders/OrderList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getOrders } from './actions';
import type { Order } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  let orders: Order[] = [];
  try {
    orders = (await getOrders()).data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Gestión de Pedidos</h1>
        <Link href="/orders/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Pedido
          </Button>
        </Link>
      </div>
      <OrderList orders={orders} />
    </div>
  );
}
