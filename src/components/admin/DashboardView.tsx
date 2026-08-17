"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDateShort } from "@/lib/utils";

interface DashboardData {
  stats: {
    published: number;
    scheduled: number;
    drafts: number;
    subscribers: number;
    messages: number;
    faqs: number;
    publishedThisMonth: number;
    subscribersThisMonth: number;
    messagesThisMonth: number;
  };
  recentMessages: { id: string; name: string; email: string; subject?: string | null; createdAt: string }[];
  recentArticles: { id: string; title: string; slug: string; status: string; publishedAt?: string | null }[];
  scheduledUpcoming: { id: string; title: string; scheduledAt: string }[];
  recentActivity: { id: string; action: string; user?: { name: string } | null; createdAt: string }[];
  now: string;
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="rounded-sm bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-xs uppercase tracking-wider text-brand-gray">{label}</p>
      <p className="mt-2 font-serif text-4xl font-semibold text-brand-terracotta">{value}</p>
    </Link>
  );
}

export function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError("Não foi possível carregar os dados."));
  }, []);

  if (error) return <p className="text-brand-deep">{error}</p>;
  if (!data) return <p className="text-brand-gray">Carregando…</p>;

  const { stats, recentMessages, recentArticles, scheduledUpcoming, recentActivity } = data;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Artigos publicados" value={stats.published} href="/admin/artigos" />
        <StatCard label="Programados" value={stats.scheduled} href="/admin/calendario" />
        <StatCard label="Rascunhos" value={stats.drafts} href="/admin/artigos" />
        <StatCard label="Inscritos" value={stats.subscribers} href="/admin/inscritos" />
        <StatCard label="Mensagens novas" value={stats.messages} href="/admin/mensagens" />
        <StatCard label="Perguntas ativas" value={stats.faqs} href="/admin/faq" />
      </div>

      <div className="grid gap-6 rounded-sm bg-brand-sand/40 p-5 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-brand-gray">Publicados no mês</p>
          <p className="mt-1 font-serif text-2xl text-brand-deep">{stats.publishedThisMonth}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-brand-gray">Novos inscritos no mês</p>
          <p className="mt-1 font-serif text-2xl text-brand-deep">{stats.subscribersThisMonth}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-brand-gray">Mensagens no mês</p>
          <p className="mt-1 font-serif text-2xl text-brand-deep">{stats.messagesThisMonth}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-sm bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-xl font-semibold text-brand-graphite">Próximas publicações</h2>
          {scheduledUpcoming.length === 0 ? (
            <p className="text-sm text-brand-gray">Nenhuma publicação programada.</p>
          ) : (
            <ul className="space-y-3">
              {scheduledUpcoming.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-brand-graphite">{a.title}</span>
                  <span className="shrink-0 text-brand-terracotta">{formatDateShort(a.scheduledAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-sm bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-xl font-semibold text-brand-graphite">Últimas atividades</h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-brand-gray">Nenhuma atividade registrada.</p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((log) => (
                <li key={log.id} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-brand-graphite">
                    {log.action} {log.user ? `— ${log.user.name}` : ""}
                  </span>
                  <span className="shrink-0 text-xs text-brand-gray">{formatDateShort(log.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-sm bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-brand-graphite">Últimos artigos</h2>
            <Link href="/admin/artigos" className="text-sm text-brand-terracotta hover:text-brand-deep">
              Ver todos
            </Link>
          </div>
          <ul className="space-y-3">
            {recentArticles.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 text-sm">
                <Link href={`/admin/artigos/${a.id}`} className="text-brand-graphite hover:text-brand-deep">
                  {a.title}
                </Link>
                <span className="shrink-0 text-xs text-brand-gray">{formatDateShort(a.publishedAt)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-sm bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-brand-graphite">Últimas mensagens</h2>
            <Link href="/admin/mensagens" className="text-sm text-brand-terracotta hover:text-brand-deep">
              Ver todas
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-sm text-brand-gray">Nenhuma mensagem recebida.</p>
          ) : (
            <ul className="space-y-3">
              {recentMessages.map((m) => (
                <li key={m.id} className="text-sm">
                  <p className="font-medium text-brand-graphite">{m.name}</p>
                  <p className="text-brand-gray">{m.subject || "Sem assunto"}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
