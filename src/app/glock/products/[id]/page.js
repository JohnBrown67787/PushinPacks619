import ProductDetailView from "../../../../components/ProductDetailView";
import { CATALOGS } from "../../../../data/catalogs";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = CATALOGS.glock.products.find((p) => p.id === id);
  return {
    title: product ? `${product.name} | PushinPacks Glock` : "Glock Product Details | PushinPacks",
    description: product ? product.description : "Precision engineered Glock components, CNC slides, match barrels, and factory specifications.",
  };
}

export default async function GlockProductDetailPage({ params }) {
  const { id } = await params;
  return <ProductDetailView catalog={CATALOGS.glock} productId={id} />;
}

