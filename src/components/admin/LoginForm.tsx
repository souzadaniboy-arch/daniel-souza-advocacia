"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/Logo";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(body.error ?? "Não foi possível entrar.");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && (
        <p role="alert" className="rounded-sm bg-brand-deep/10 p-3 text-sm text-brand-deep">
          {error}
        </p>
      )}
      <div className="space-y-1.5">
        <label htmlFor="email" className="label">
          E-mail
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className="input" placeholder="seu@email.com" />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="label">
          Senha
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" placeholder="Sua senha" />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "Entrando…" : "ENTRAR"}
      </button>
    </form>
  );
}
