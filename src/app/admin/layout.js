export const metadata = {
  title: "PushinPacks: Network Admin Console | Unified Dashboard",
  description: "Administrative console managing portals, inquiries desk, catalog offerings, and knowledge articles across all PushinPacks sub-websites.",
};

export default function AdminLayout({ children }) {
  return <section id="admin-section">{children}</section>;
}
