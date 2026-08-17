import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

interface FieldBaseProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, hint, required, children }: FieldBaseProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="label">
        {label}
        {required && (
          <span className="text-brand-terracotta" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-brand-deep">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-brand-gray">{hint}</p>
      ) : null}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, required, id, hint, className = "", ...rest }: InputProps) {
  const inputId = id ?? rest.name;
  return (
    <Field label={label} htmlFor={inputId ?? ""} error={error} hint={hint} required={required}>
      <input
        id={inputId}
        className={`input ${error ? "border-brand-deep" : ""} ${className}`}
        required={required}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
    </Field>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, required, id, hint, className = "", ...rest }: TextareaProps) {
  const textareaId = id ?? rest.name;
  return (
    <Field label={label} htmlFor={textareaId ?? ""} error={error} hint={hint} required={required}>
      <textarea
        id={textareaId}
        className={`input min-h-36 resize-y ${error ? "border-brand-deep" : ""} ${className}`}
        required={required}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
    </Field>
  );
}

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
}

export function Checkbox({ label, error, required, id, className = "", ...rest }: CheckboxProps) {
  const checkId = id ?? rest.name;
  return (
    <div className="space-y-1.5">
      <label htmlFor={checkId} className="flex cursor-pointer items-start gap-3 text-sm text-brand-graphite">
        <input
          id={checkId}
          type="checkbox"
          className={`mt-0.5 h-4 w-4 shrink-0 rounded-sm border-brand-sand accent-brand-terracotta ${className}`}
          required={required}
          aria-invalid={error ? true : undefined}
          {...rest}
        />
        <span>{label}</span>
      </label>
      {error ? (
        <p role="alert" className="text-sm text-brand-deep">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function Select({ label, error, required, id, hint, className = "", children, ...rest }: SelectProps) {
  const selectId = id ?? rest.name;
  return (
    <Field label={label} htmlFor={selectId ?? ""} error={error} hint={hint} required={required}>
      <select id={selectId} className={`input ${error ? "border-brand-deep" : ""} ${className}`} required={required} {...rest}>
        {children}
      </select>
    </Field>
  );
}
