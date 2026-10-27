import LandingView from "../../components/LandingView";
import { CATALOGS } from "../../data/catalogs";

export default function PharmsLandingPage() {
  return <LandingView catalog={CATALOGS.pharms} />;
}
