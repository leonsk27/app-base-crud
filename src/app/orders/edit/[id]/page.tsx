
import OrderForm from '@/components/orders/OrderForm';
import { getOrderById } from '@/app/orders/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface EditOrderPageProps {
  params: { id: string };
}

export default async function EditOrderPage(props: EditOrderPageProps) {
  const id = await props.params.id;
  const order = (await getOrderById(id)).data;

  if (!order) {
    return (
      <Card className="max-w-2xl mx-auto mt-10">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-6 w-6" /> Pedido no encontrado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>El pedido que intenta editar no existe o ha sido eliminado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Editar Pedido</h1>
      <OrderForm initialData={order} isEditing />
    </div>
  );
}
