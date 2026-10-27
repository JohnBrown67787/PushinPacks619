import LandingView from "../../components/LandingView";
import { CATALOGS } from "../../data/catalogs";

export default function PeptidesLandingPage() {
  return <LandingView catalog={CATALOGS.peptides} />;
}
