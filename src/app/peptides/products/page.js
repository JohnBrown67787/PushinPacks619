import ProductsView from "../../../components/ProductsView";
import { CATALOGS } from "../../../data/catalogs";

export const metadata = {
  title: "PushinPacks: Peptides Products | Full Research Compounds Catalog",
  description: "Browse the complete inventory of 99%+ certified research peptides with specifications and batch pricing.",
};

export default function PeptidesProductsPage() {
  return <ProductsView catalog={CATALOGS.peptides} />;
}
