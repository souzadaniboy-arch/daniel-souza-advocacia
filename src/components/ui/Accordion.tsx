"use client";

import { useState, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { ChevronDownIcon } from "@/components/icons";

interface AccordionItemProps {
  question: string;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

export function AccordionItem({ question, children, open, defaultOpen, onToggle }: AccordionItemProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const toggle = () => {
    if (isControlled) {
      onToggle?.(!open);
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  return (
    <div className="border-b border-brand-sand">
      <h3>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-brand-deep"
        >
          <span className="text-base font-medium text-brand-graphite sm:text-lg">{question}</span>
          <ChevronDownIcon
            className={`h-5 w-5 shrink-0 text-brand-terracotta transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>
      <div
        className={`grid transition-all duration-200 ${isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}
        aria-hidden={!isOpen}
      >
        <div className="overflow-hidden">
          <div className="text-base leading-relaxed text-brand-gray">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: { question: string; answer: ReactNode; id?: string }[];
  maxHeight?: string;
  className?: string;
}

export function Accordion({ items, className = "" }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className={`divide-y divide-brand-sand border-y border-brand-sand ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.id ?? item.question}
          question={item.question}
          open={openIndex === index}
          onToggle={(open) => setOpenIndex(open ? index : null)}
        >
          {item.answer}
        </AccordionItem>
      ))}
    </div>
  );
}

export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    const focusable =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = Array.from(el.querySelectorAll<HTMLElement>(focusable)).filter(
        (n) => !n.hasAttribute("disabled")
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [ref, active]);
}

export function useEscape(callback: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") callback();
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [callback, active]);
}

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}
