import type { Metadata } from "next";
import { DashboardView } from "@/components/admin/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard | Administração",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-brand-graphite">Dashboard</h1>
      <DashboardView />
    </div>
  );
}
