import FaqView from "../../../components/FaqView";
import { CATALOGS } from "../../../data/catalogs";

export const metadata = {
  title: "PushinPacks: Pharms FAQs | Cleanroom Standards, GC-MS Testing & Custom Batching",
  description: "Technical answers on cGMP cleanrooms, residual solvent testing, and custom bulk packaging options.",
};

export default function PharmsFaqPage() {
  return <FaqView catalog={CATALOGS.pharms} />;
}
