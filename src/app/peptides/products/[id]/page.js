import ProductDetailView from "../../../../components/ProductDetailView";
import { CATALOGS } from "../../../../data/catalogs";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = CATALOGS.peptides.products.find((p) => p.id === id);
  return {
    title: product ? `${product.name} | PushinPacks Peptides` : "Peptide Product Details | PushinPacks",
    description: product ? product.description : "High purity research peptides with certified HPLC assay and cold-chain dispatch.",
  };
}

export default async function PeptideProductDetailPage({ params }) {
  const { id } = await params;
  return <ProductDetailView catalog={CATALOGS.peptides} productId={id} />;
}
