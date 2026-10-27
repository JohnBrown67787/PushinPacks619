import FaqView from "../../../components/FaqView";
import { CATALOGS } from "../../../data/catalogs";

export const metadata = {
  title: "PushinPacks: Stocks FAQs | Purity Testing, Stamped Bricks & Lavada",
  description: "Technical answers on cocaine purity assay testing, master kilo brick stamps, and odor-proof discreet dispatch.",
};

export default function StocksFaqPage() {
  return <FaqView catalog={CATALOGS.stocks} />;
}
