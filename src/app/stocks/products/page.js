import ProductsView from "../../../components/ProductsView";
import { CATALOGS } from "../../../data/catalogs";

export const metadata = {
  title: "PushinPacks: Stocks Products | Pure Cocaine Catalog & Flake Inventory",
  description: "Browse the complete inventory of uncut fishscale cocaine, Colombian and Peruvian flake, and stamped master kilo bricks.",
};

export default function StocksProductsPage() {
  return <ProductsView catalog={CATALOGS.stocks} />;
}
