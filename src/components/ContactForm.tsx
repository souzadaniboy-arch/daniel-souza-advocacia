"use client";

import { useState, type FormEvent } from "react";
import { Input, Textarea, Checkbox, Select } from "./ui/FormFields";
import { HONEYPOT_FIELD } from "@/lib/security";

const SUBJECTS = [
  "Previdenciário",
  "Trabalhista",
  "Tributário",
  "Bancário",
  "Direitos das Pessoas Autistas",
  "Perícia Grafotécnica e Digital",
  "Outro assunto",
];

interface ContactFormProps {
  hasPhone?: boolean;
  hasSubject?: boolean;
}

export function ContactForm({ hasPhone = true, hasSubject = true }: ContactFormProps) {
  const [state, setState] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ status: "idle" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: "loading" });
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", { method: "POST", body: data });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setState({
          status: "success",
          message:
            "Mensagem enviada. O escritório analisará sua solicitação e entrará em contato o quanto antes.",
        });
        form.reset();
      } else {
        setState({ status: "error", message: body.error ?? "Não foi possível enviar a mensagem. Tente novamente." });
      }
    } catch {
      setState({ status: "error", message: "Erro de conexão. Tente novamente." });
    }
  }

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-sm bg-brand-sand/40 p-8 text-center">
        <p className="font-serif text-2xl text-brand-deep">Mensagem enviada</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-brand-gray">{state.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {state.status === "error" && (
        <p role="alert" className="rounded-sm bg-brand-deep/10 p-4 text-sm text-brand-deep">
          {state.message}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Nome" name="name" placeholder="Seu nome completo" required autoComplete="name" />
        <Input label="E-mail" name="email" type="email" placeholder="seu@email.com" required autoComplete="email" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {hasPhone && <Input label="Telefone" name="phone" placeholder="(00) 00000-0000" autoComplete="tel" />}
        {hasSubject ? (
          <Select label="Assunto" name="subject">
            <option value="">Selecione o assunto</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        ) : null}
      </div>
      <Textarea label="Mensagem" name="message" rows={6} placeholder="Descreva sua situação de forma objetiva." required />
      <Checkbox
        name="consent"
        required
        label="Autorizo o tratamento dos dados informados para fins de atendimento, conforme a Política de Privacidade."
      />
      <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <button type="submit" disabled={state.status === "loading"} className="btn-primary w-full disabled:opacity-60">
        {state.status === "loading" ? "Enviando…" : "ENVIAR MENSAGEM"}
      </button>
      <p className="text-xs text-brand-gray">
        Suas informações são utilizadas apenas para responder à sua solicitação, em conformidade com a LGPD.
      </p>
    </form>
  );
}
