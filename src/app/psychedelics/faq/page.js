import FaqView from "../../../components/FaqView";
import { CATALOGS } from "../../../data/catalogs";

export const metadata = {
  title: "PushinPacks: Psychedelics FAQs | Botanical Extraction, Shelf Life & Synergy",
  description: "Technical answers on cold-ethanol extraction, organic sourcing, and active compound bioavailability.",
};

export default function PsychedelicsFaqPage() {
  return <FaqView catalog={CATALOGS.psychedelics} />;
}
