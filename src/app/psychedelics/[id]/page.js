import { Suspense } from "react";
import ProductDetailView from "../../../components/ProductDetailView";
import { CATALOGS } from "../../../data/catalogs";

export const instant = false;

export async function generateStaticParams() {
  return (CATALOGS.psychedelics?.products || []).map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = CATALOGS.psychedelics?.products?.find((p) => p.id === id);
  return {
    title: product ? `${product.name} | PushinPacks Psychedelics` : "Psychedelics Product Details | PushinPacks",
    description: product ? product.description : "Sacred botanical cultivations, organic fruiting bodies, and calibrated microdose formulations.",
  };
}

async function ProductDetailContent({ params }) {
  const { id } = await params;
  return <ProductDetailView catalog={CATALOGS.psychedelics} productId={id} />;
}

export default function PsychedelicsDetailPageDirect({ params }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading product...</div>}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
