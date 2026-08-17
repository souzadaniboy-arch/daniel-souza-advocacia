"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "./ui/Modal";
import { Checkbox } from "./ui/FormFields";

const CONSENT_KEY = "ds_cookie_consent";
const VISITOR_KEY = "ds_visitor_id";

interface Consent {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
}

interface CookieBannerProps {
  bannerText: string;
}

function getVisitorKey(): string {
  if (typeof window === "undefined") return "";
  let key = window.localStorage.getItem(VISITOR_KEY);
  if (!key) {
    key = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, key);
  }
  return key;
}

export async function saveConsent(consent: Consent): Promise<void> {
  await fetch("/api/cookies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visitorKey: getVisitorKey(), ...consent }),
  });
}

export function CookieBanner({ bannerText }: CookieBannerProps) {
  const [visible, setVisible] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const [prefs, setPrefs] = useState<Consent>({
    necessary: true,
    preferences: false,
    statistics: false,
    marketing: false,
  });

  const open = useCallback(() => setVisible(true), []);

  useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    if (!saved) {
      open();
    } else {
      try {
        setPrefs(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
    const handler = () => {
      window.localStorage.removeItem(CONSENT_KEY);
      open();
    };
    window.addEventListener("open-cookie-preferences", handler);
    return () => window.removeEventListener("open-cookie-preferences", handler);
  }, [open]);

  const apply = async (consent: Consent) => {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    setPrefs(consent);
    try {
      await saveConsent(consent);
    } catch {
      /* consentimento local ainda vale */
    }
    setVisible(false);
    setConfiguring(false);
  };

  const acceptAll = () =>
    apply({ necessary: true, preferences: true, statistics: true, marketing: true });

  const rejectNonEssential = () =>
    apply({ necessary: true, preferences: false, statistics: false, marketing: false });

  if (!visible) return null;

  return (
    <>
      <div
        role="region"
        aria-label="Aviso de cookies"
        className="fixed inset-x-0 bottom-0 z-[95] border-t border-brand-sand bg-white p-5 shadow-lg"
      >
        <div className="container-page flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-sm leading-relaxed text-brand-gray">{bannerText}</p>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <button type="button" onClick={rejectNonEssential} className="btn-secondary px-4 py-2 text-xs">
              Recusar não essenciais
            </button>
            <button type="button" onClick={() => setConfiguring(true)} className="btn px-4 py-2 text-xs text-brand-graphite hover:text-brand-deep">
              Configurar
            </button>
            <button type="button" onClick={acceptAll} className="btn-primary px-4 py-2 text-xs">
              Aceitar todos
            </button>
          </div>
        </div>
      </div>

      <Modal open={configuring} onClose={() => setConfiguring(false)} title="Centro de Preferências de Cookies">
        <div className="space-y-5">
          <p className="text-sm leading-relaxed text-brand-gray">
            Gerencie as categorias de cookies utilizadas pelo site.
          </p>
          <div className="space-y-4 rounded-sm border border-brand-sand p-4">
            <Checkbox
              name="necessary"
              checked
              disabled
              label="Cookies necessários (sempre ativos)"
            />
            <Checkbox
              name="preferences"
              checked={prefs.preferences}
              onChange={(e) => setPrefs((p) => ({ ...p, preferences: e.target.checked }))}
              label="Preferências"
            />
            <Checkbox
              name="statistics"
              checked={prefs.statistics}
              onChange={(e) => setPrefs((p) => ({ ...p, statistics: e.target.checked }))}
              label="Estatísticos"
            />
            <Checkbox
              name="marketing"
              checked={prefs.marketing}
              onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
              label="Marketing"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setConfiguring(false)} className="btn-secondary px-4 py-2 text-xs">
              Cancelar
            </button>
            <button type="button" onClick={() => apply(prefs)} className="btn-primary px-4 py-2 text-xs">
              Salvar preferências
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function CookiePrefsLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-preferences"))}
      className="text-brand-off-white/60 transition-colors hover:text-brand-sand"
    >
      Alterar preferências de cookies
    </button>
  );
}
