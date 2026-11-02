import ProductDetailView from "../../../../components/ProductDetailView";
import { CATALOGS } from "../../../../data/catalogs";

export const instant = false;

export async function generateStaticParams() {
  return (CATALOGS.glock?.products || []).map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = CATALOGS.glock?.products?.find((p) => p.id === id);
  return {
    title: product ? `${product.name} | PushinPacks Glock Parts` : "Glock Parts Product Details | PushinPacks",
    description: product ? product.description : "Precision-machined slides, match-grade threaded barrels, and OEM internal component packages.",
  };
}

export default async function GlockProductDetailPage({ params }) {
  const { id } = await params;
  return <ProductDetailView catalog={CATALOGS.glock} productId={id} />;
}
