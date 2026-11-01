import { Suspense } from "react";
import ProductDetailView from "../../../components/ProductDetailView";
import { CATALOGS } from "../../../data/catalogs";

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
    description: product ? product.description : "Raw fishscale cocaine, Colombian export bricks, and triple-washed lavada crystal.",
  };
}

async function ProductDetailContent({ params }) {
  const { id } = await params;
  return <ProductDetailView catalog={CATALOGS.stocks} productId={id} />;
}

export default function StocksDetailPageDirect({ params }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading product...</div>}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
