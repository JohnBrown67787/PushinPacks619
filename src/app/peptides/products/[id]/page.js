import { Suspense } from "react";
import ProductDetailView from "../../../../components/ProductDetailView";
import { CATALOGS } from "../../../../data/catalogs";

export const instant = false;

export async function generateStaticParams() {
  return (CATALOGS.peptides?.products || []).map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = CATALOGS.peptides?.products?.find((p) => p.id === id);
  return {
    title: product ? `${product.name} | PushinPacks Peptides` : "Peptides Product Details | PushinPacks",
    description: product ? product.description : "Pharmaceutical-grade 99.8% HPLC-certified research peptides and dial-a-dose subcutaneous devices.",
  };
}

async function ProductDetailContent({ params }) {
  const { id } = await params;
  return <ProductDetailView catalog={CATALOGS.peptides} productId={id} />;
}

export default function PeptidesProductDetailPage({ params }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading product...</div>}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
