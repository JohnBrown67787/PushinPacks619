import ProductDetailView from "../../../../components/ProductDetailView";
import { CATALOGS } from "../../../../data/catalogs";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = CATALOGS.stocks.products.find((p) => p.id === id);
  return {
    title: product ? `${product.name} | PushinPacks Stocks` : "Stocks Product Details | PushinPacks",
    description: product ? product.description : "Direct import reserve stocks with verified GC-MS assay and discreet vacuum dispatch.",
  };
}

export default async function StocksProductDetailPage({ params }) {
  const { id } = await params;
  return <ProductDetailView catalog={CATALOGS.stocks} productId={id} />;
}

