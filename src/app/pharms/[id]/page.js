import { Suspense } from "react";
import ProductDetailView from "../../../components/ProductDetailView";
import { CATALOGS } from "../../../data/catalogs";

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
    description: product ? product.description : "Authentic sealed pharmaceutical blister packs, original factory bottles, and lab-certified compounds.",
  };
}

async function ProductDetailContent({ params }) {
  const { id } = await params;
  return <ProductDetailView catalog={CATALOGS.pharms} productId={id} />;
}

export default function PharmsDetailPageDirect({ params }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading product...</div>}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
