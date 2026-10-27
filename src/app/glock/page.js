import LandingView from "../../components/LandingView";
import { CATALOGS } from "../../data/catalogs";

export default function GlockLandingPage() {
  return <LandingView catalog={CATALOGS.glock} />;
}
