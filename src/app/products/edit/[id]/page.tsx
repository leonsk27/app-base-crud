
import ProductForm from '@/components/products/ProductForm';
import { getProductByIdAction } from '@/app/products/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: { id: string };
}

export default async function EditProductPage(props: EditProductPageProps) {
  const id = await props.params.id;
  const product = await getProductByIdAction(id);

  if (!product) {
    return (
      <Card className="max-w-2xl mx-auto mt-10">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-6 w-6" /> Producto no encontrado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>El producto que intenta editar no existe o ha sido eliminado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Editar Producto</h1>
      <ProductForm initialData={product} isEditing={true} />
    </div>
  );
}
