import LandingView from "../../components/LandingView";
import { CATALOGS } from "../../data/catalogs";

export const metadata = {
  title: "PushinPacks: Peptides | Research Grade Synthetic Peptides",
  description: "Certified 99%+ pure research peptides, lyophilized vials, and metabolic compounds.",
};

export default function PeptideAliasPage() {
  return <LandingView catalog={CATALOGS.peptides} />;
}
