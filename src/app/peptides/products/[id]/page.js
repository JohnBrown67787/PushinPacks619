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

export default async function PeptidesProductDetailPage({ params }) {
  const { id } = await params;
  return <ProductDetailView catalog={CATALOGS.peptides} productId={id} />;
}
