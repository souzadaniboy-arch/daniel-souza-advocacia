import type { Metadata } from "next";
import { MessagesManager } from "@/components/admin/MessagesManager";

export const metadata: Metadata = {
  title: "Mensagens | Administração",
  robots: { index: false, follow: false },
};

export default function AdminMensagensPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-brand-graphite">Mensagens de contato</h1>
      <MessagesManager initial={{ messages: [], total: 0, page: 1, totalPages: 1 }} />
    </div>
  );
}
