import FaqView from "../../../components/FaqView";
import { CATALOGS } from "../../../data/catalogs";

export const metadata = {
  title: "PushinPacks: Glock FAQs | CNC Tolerances, Optic Footprints & DLC Coating",
  description: "Technical answers on slide manufacturing, optic cut screw sizes, and installation recommendations.",
};

export default function GlockFaqPage() {
  return <FaqView catalog={CATALOGS.glock} />;
}
