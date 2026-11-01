import { Suspense } from "react";
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
    title: product ? `${product.name} | PushinPacks Glock & Tactical` : "Glock & Tactical Product Details | PushinPacks",
    description: product ? product.description : "Factory-new polymer pistols, match-grade barrels, optic-ready slides, and extended magazines.",
  };
}

async function ProductDetailContent({ params }) {
  const { id } = await params;
  return <ProductDetailView catalog={CATALOGS.glock} productId={id} />;
}

export default function GlockProductDetailPage({ params }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading product...</div>}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
