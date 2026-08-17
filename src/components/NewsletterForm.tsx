"use client";

import { useState, type FormEvent } from "react";
import { Input, Checkbox } from "./ui/FormFields";
import { HONEYPOT_FIELD } from "@/lib/security";

interface NewsletterFormProps {
  compact?: boolean;
  source?: string;
}

export function NewsletterForm({ compact = false, source = "newsletter" }: NewsletterFormProps) {
  const [state, setState] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ status: "idle" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: "loading" });
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("source", source);

    try {
      const res = await fetch("/api/newsletter", { method: "POST", body: data });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setState({ status: "success", message: "Inscrição realizada. Em breve você receberá conteúdos do escritório." });
        form.reset();
      } else {
        setState({ status: "error", message: body.error ?? "Não foi possível concluir a inscrição. Tente novamente." });
      }
    } catch {
      setState({ status: "error", message: "Erro de conexão. Tente novamente." });
    }
  }

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-sm bg-brand-sand/40 p-6 text-center">
        <p className="font-serif text-xl text-brand-deep">Inscrição confirmada</p>
        <p className="mt-2 text-sm text-brand-gray">{state.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {state.status === "error" && (
        <p role="alert" className="rounded-sm bg-brand-deep/10 p-3 text-sm text-brand-deep">
          {state.message}
        </p>
      )}
      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Input label="Nome" name="name" placeholder="Seu nome" required autoComplete="name" />
        <Input
          label="E-mail"
          name="email"
          type="email"
          placeholder="seu@email.com"
          required
          autoComplete="email"
        />
      </div>
      <Checkbox
        name="consent"
        required
        label="Concordo em receber conteúdos informativos e newsletter do escritório."
      />
      <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <button type="submit" disabled={state.status === "loading"} className="btn-primary w-full disabled:opacity-60">
        {state.status === "loading" ? "Enviando…" : "QUERO RECEBER"}
      </button>
      <p className="text-xs text-brand-gray">
        Seus dados serão utilizados apenas para o envio de conteúdos. Conheça a{" "}
        <a href="/politica-de-privacidade" className="link-underline">
          Política de Privacidade
        </a>
        .
      </p>
    </form>
  );
}
