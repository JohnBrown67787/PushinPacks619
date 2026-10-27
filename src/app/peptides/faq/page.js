import FaqView from "../../../components/FaqView";
import { CATALOGS } from "../../../data/catalogs";

export const metadata = {
  title: "PushinPacks: Peptides FAQs | Research Purity, Storage & Dispatch",
  description: "Technical answers on reconstitution, HPLC testing, cold storage, and discreet shipping for peptides.",
};

export default function PeptidesFaqPage() {
  return <FaqView catalog={CATALOGS.peptides} />;
}
