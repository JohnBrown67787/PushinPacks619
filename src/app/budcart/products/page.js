import ProductsView from "../../../components/ProductsView";
import { CATALOGS } from "../../../data/catalogs";

export const metadata = {
  title: "PushinPacks: Bud'Cart Products | Full Distillate & Hardware Catalog",
  description: "Browse the complete inventory of ceramic core 510 cartridges and rechargeable disposables.",
};

export default function BudCartProductsPage() {
  return <ProductsView catalog={CATALOGS.budcart} />;
}
