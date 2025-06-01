
import ProductForm from '@/components/products/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Añadir Nuevo Producto</h1>
      <ProductForm />
    </div>
  );
}
