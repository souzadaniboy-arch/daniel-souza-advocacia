"use client";

import { useRef, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import { useFocusTrap, useEscape, useBodyScrollLock } from "./Accordion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  labelledBy?: string;
}

export function Modal({ open, onClose, title, children, labelledBy }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open);
  useEscape(onClose, open);
  useBodyScrollLock(open);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      aria-labelledby={labelledBy}
    >
      <div className="absolute inset-0 bg-brand-graphite/60" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-sm bg-white p-6 shadow-xl sm:p-8"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? <h2 id={labelledBy} className="font-serif text-2xl text-brand-graphite">{title}</h2> : <span />}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-sm p-1 text-brand-gray transition-colors hover:text-brand-deep"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
