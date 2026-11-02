import ProductDetailView from "../../../../components/ProductDetailView";
import { CATALOGS } from "../../../../data/catalogs";

export const instant = false;

export async function generateStaticParams() {
  return (CATALOGS.pharms?.products || []).map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = CATALOGS.pharms?.products?.find((p) => p.id === id);
  return {
    title: product ? `${product.name} | PushinPacks Pharms` : "Pharms Product Details | PushinPacks",
    description: product ? product.description : "Factory-sealed pharmaceutical blister packs, verified NDC reserves, and certified compound lots.",
  };
}

export default async function PharmsProductDetailPage({ params }) {
  const { id } = await params;
  return <ProductDetailView catalog={CATALOGS.pharms} productId={id} />;
}
