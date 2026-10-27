import ProductsView from "../../../components/ProductsView";
import { CATALOGS } from "../../../data/catalogs";

export const metadata = {
  title: "PushinPacks: Psychedelics Products | Full Botanicals & Microdose Catalog",
  description: "Browse the complete inventory of organic tinctures, sacred mushroom extracts, and functional nootropics.",
};

export default function PsychedelicsProductsPage() {
  return <ProductsView catalog={CATALOGS.psychedelics} />;
}
