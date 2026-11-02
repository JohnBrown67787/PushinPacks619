import ProductDetailView from "../../../../components/ProductDetailView";
import { CATALOGS } from "../../../../data/catalogs";

export const instant = false;

export async function generateStaticParams() {
  return (CATALOGS.budcart?.products || []).map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = CATALOGS.budcart?.products?.find((p) => p.id === id);
  return {
    title: product ? `${product.name} | PushinPacks Bud'Cart` : "Bud'Cart Product Details | PushinPacks",
    description: product ? product.description : "Premium disposable vaporizers and live resin cartridges with ceramic core heating technology.",
  };
}

export default async function BudcartProductDetailPage({ params }) {
  const { id } = await params;
  return <ProductDetailView catalog={CATALOGS.budcart} productId={id} />;
}
