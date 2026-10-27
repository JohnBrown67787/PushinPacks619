import LandingView from "../../components/LandingView";
import { CATALOGS } from "../../data/catalogs";

export default function PsychedelicsLandingPage() {
  return <LandingView catalog={CATALOGS.psychedelics} />;
}
