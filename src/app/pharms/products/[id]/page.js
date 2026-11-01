import ProductDetailView from "../../../../components/ProductDetailView";
import { CATALOGS } from "../../../../data/catalogs";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = CATALOGS.pharms.products.find((p) => p.id === id);
  return {
    title: product ? `${product.name} | PushinPacks Pharms` : "Pharms Product Details | PushinPacks",
    description: product ? product.description : "Pharmaceutical-grade compounds with sealed lot serialization and certified laboratory standards.",
  };
}

export default async function PharmsProductDetailPage({ params }) {
  const { id } = await params;
  return <ProductDetailView catalog={CATALOGS.pharms} productId={id} />;
}

