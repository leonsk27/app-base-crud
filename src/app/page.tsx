
import FeaturedCarousel from "@/components/dashboard/FeaturedCarousel";
import SummaryCard from "@/components/dashboard/SummaryCard";
import { Package, ShoppingCart, DollarSign } from "lucide-react";
import { getProductsAction } from "./products/actions"; // Assuming actions.ts will export this
import { getOrders } from "./orders/actions"; // Assuming actions.ts will export this
import type { Product } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  // Fetch initial data using Server Actions
  // These will be simple in-memory arrays for now
  let products: Product[] = [];
  let orders = [];
  let totalRevenueBs = 0;

  try {
    const response = await getProductsAction();

    if (response) {
      products = response;
      totalRevenueBs = response.reduce((sum, order) => sum + order.priceBs, 0);
    } else {
      console.error("Error al obtener pedidos:");
    }
  } catch (error) {
    console.error("Failed to fetch products for dashboard:", error);
  }
  
  try {
    const fetchedOrders = await getOrders();
    orders = fetchedOrders.data;
    totalRevenueBs = fetchedOrders.data.reduce((sum, order) => sum + order.totalBs, 0);
  } catch (error) {
    console.error("Failed to fetch orders for dashboard:", error);
  }


  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">Productos Destacados</h2>
        <FeaturedCarousel products={products} />
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SummaryCard 
          title="Total Productos" 
          value={products.length} 
          icon={Package}
          className="bg-card hover:border-primary"
        />
        <SummaryCard 
          title="Total Pedidos" 
          value={orders.length} 
          icon={ShoppingCart}
          className="bg-card hover:border-primary"
        />
        <SummaryCard 
          title="Ingresos Totales (Bs.)" 
          value={totalRevenueBs.toFixed(2)} 
          icon={DollarSign}
          className="bg-card hover:border-primary md:col-span-1 lg:col-span-1"
        />
      </section>

      {/* Placeholder for future charts or more detailed summaries */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Actividad Reciente</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Aquí se mostrarán gráficos de ventas o pedidos recientes.</p>
          </CardContent>
        </Card>
      </section>
     
    </div>
  );
}

// Make sure actions.ts files are created and export getProducts and getOrders.
// For now, these would return empty arrays or mock data.
