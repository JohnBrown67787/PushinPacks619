import ProductsView from "../../../components/ProductsView";
import { CATALOGS } from "../../../data/catalogs";

export const metadata = {
  title: "PushinPacks: Glock Products | Custom Slides, Match Barrels & Triggers",
  description: "Browse the complete inventory of CNC machined 17-4 stainless slides, DLC coated barrels, and match internals.",
};

export default function GlockProductsPage() {
  return <ProductsView catalog={CATALOGS.glock} />;
}
