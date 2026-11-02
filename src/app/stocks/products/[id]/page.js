import ProductDetailView from "../../../../components/ProductDetailView";
import { CATALOGS } from "../../../../data/catalogs";

export const instant = false;

export async function generateStaticParams() {
  return (CATALOGS.stocks?.products || []).map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = CATALOGS.stocks?.products?.find((p) => p.id === id);
  return {
    title: product ? `${product.name} | PushinPacks Stocks` : "Stocks Product Details | PushinPacks",
    description: product ? product.description : "Raw Colombian fishscale bricks, flake reserves, and high-purity crystalline solid inventories.",
  };
}

export default async function StocksProductDetailPage({ params }) {
  const { id } = await params;
  return <ProductDetailView catalog={CATALOGS.stocks} productId={id} />;
}
