import type { Metadata } from "next";
import { SubscribersManager } from "@/components/admin/SubscribersManager";

export const metadata: Metadata = {
  title: "Inscritos | Administração",
  robots: { index: false, follow: false },
};

export default function AdminInscritosPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-brand-graphite">Inscritos na newsletter</h1>
      <SubscribersManager initial={{ subscribers: [], total: 0, page: 1, totalPages: 1 }} />
    </div>
  );
}
