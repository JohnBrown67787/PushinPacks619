import LandingView from "../../components/LandingView";
import { CATALOGS } from "../../data/catalogs";

export default function StocksLandingPage() {
  return <LandingView catalog={CATALOGS.stocks} />;
}
