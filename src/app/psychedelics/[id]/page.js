import ProductDetailView from "../../../components/ProductDetailView";
import { CATALOGS } from "../../../data/catalogs";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = CATALOGS.psychedelics.products.find((p) => p.id === id);
  return {
    title: product ? `${product.name} | PushinPacks Psychedelics` : "Psychedelics Product Details | PushinPacks",
    description: product ? product.description : "Sacred botanical cultivations, organic fruiting bodies, and calibrated microdose formulations.",
  };
}

export default async function PsychedelicsDetailPageDirect({ params }) {
  const { id } = await params;
  return <ProductDetailView catalog={CATALOGS.psychedelics} productId={id} />;
}

