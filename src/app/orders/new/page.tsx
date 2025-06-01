
import OrderForm from '@/components/orders/OrderForm';

export default function NewOrderPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Registrar Nuevo Pedido</h1>
      <OrderForm />
    </div>
  );
}
