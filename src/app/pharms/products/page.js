import ProductsView from "../../../components/ProductsView";
import { CATALOGS } from "../../../data/catalogs";

export const metadata = {
  title: "PushinPacks: Pharms Products | Full Laboratory Formulations Catalog",
  description: "Browse the complete inventory of GMP certified softgels, sterile osmolytes, and crystalline compounds.",
};

export default function PharmsProductsPage() {
  return <ProductsView catalog={CATALOGS.pharms} />;
}
