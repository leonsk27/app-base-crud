
import { getOrderById } from '@/app/orders/actions';
import { getProductByIdAction } from '@/app/products/actions'; // To get product names
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, ArrowLeft, ShoppingBag, User as UserIcon, CalendarDays, Hash, DollarSign, Package, Edit } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Product } from '@/domain/product.model';
import { getUserById } from '@/app/login/actions';

export const dynamic = 'force-dynamic';

interface ViewOrderPageProps {
  params: { id: string };
}

interface EnrichedOrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  priceBsAtTimeOfOrder: number;
  priceUsdAtTimeOfOrder?: number;
}

export default async function ViewOrderPage({ params }: ViewOrderPageProps) {
  const { id } = params;
  const order = (await getOrderById(id)).data;
  const user = (await getUserById(order?.userId!));

  if (!order) {
    return (
      <Card className="max-w-2xl mx-auto mt-10">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-6 w-6" /> Pedido no encontrado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>El pedido que intenta ver no existe o ha sido eliminado.</p>
          <Button asChild className="mt-4">
            <Link href="/orders"><ArrowLeft className="mr-2 h-4 w-4" /> Volver a Pedidos</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const customerName = user?.name;
  
  const enrichedProducts: EnrichedOrderProduct[] = await Promise.all(
    order.products.map(async (item) => {
      const productDetails: Product | null = await getProductByIdAction(item.productId);
      return {
        ...item,
        productName: productDetails?.name || 'Producto Desconocido',
      };
    })
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/orders"><ArrowLeft className="mr-2 h-4 w-4" /> Volver a Pedidos</Link>
      </Button>

      <Card className="shadow-xl">
        <CardHeader className="bg-muted/30">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold text-primary flex items-center">
                <ShoppingBag className="mr-3 h-8 w-8" /> Pedido #{order.id.substring(0, 8)}...
              </CardTitle>
              <CardDescription>Detalles del pedido realizado.</CardDescription>
            </div>
            <div className="text-right">
               <p className="text-sm text-muted-foreground flex items-center justify-end"><CalendarDays className="mr-1 h-4 w-4" /> {new Date(order.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
               <p className="text-sm text-muted-foreground flex items-center justify-end"><UserIcon className="mr-1 h-4 w-4" /> {customerName}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center"><Package className="mr-2 h-5 w-5 text-primary"/>Productos en el Pedido</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-right">Precio Unit. (Bs.)</TableHead>
                    <TableHead className="text-right">Subtotal (Bs.)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrichedProducts.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.priceBsAtTimeOfOrder.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{(item.priceBsAtTimeOfOrder * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div>
                <h4 className="font-semibold text-muted-foreground mb-1">Información del Cliente:</h4>
                <p><UserIcon className="inline mr-1 h-4 w-4" /> {customerName}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div className="text-right md:text-left"> {/* Adjusted alignment */}
                <h4 className="font-semibold text-muted-foreground mb-1">Resumen de Pago:</h4>
                <p className="flex items-center md:justify-start justify-end"><DollarSign className="inline mr-1 h-4 w-4 text-green-500" /> Total Bs: <span className="font-bold ml-1">{order.totalBs.toFixed(2)}</span></p>
                {order.totalUsd && <p className="flex items-center md:justify-start justify-end"><DollarSign className="inline mr-1 h-4 w-4 text-blue-500" /> Total USD: <span className="font-bold ml-1">${order.totalUsd.toFixed(2)}</span></p>}
            </div>
          </div>

        </CardContent>
        <CardFooter className="bg-muted/30 p-4 flex justify-end">
           <Link href={`/orders/edit/${order.id}`} passHref>
                <Button variant="default">
                  <Edit className="mr-2 h-4 w-4" /> Editar Pedido
                </Button>
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

