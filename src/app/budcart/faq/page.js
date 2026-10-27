import FaqView from "../../../components/FaqView";
import { CATALOGS } from "../../../data/catalogs";

export const metadata = {
  title: "PushinPacks: Bud'Cart FAQs | Ceramic Coils, Rechargeable Batteries & Heavy Metal Tests",
  description: "Technical answers on hardware specifications, cartridge compatibility, and CA Stage 3 testing.",
};

export default function BudCartFaqPage() {
  return <FaqView catalog={CATALOGS.budcart} />;
}
