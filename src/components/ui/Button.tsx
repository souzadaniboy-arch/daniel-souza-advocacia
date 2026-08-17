import Link from "next/link";
import type { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "light" | "dark" | "whatsapp";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  light: "btn-light",
  dark: "btn-dark",
  whatsapp: "btn-whatsapp",
};

const sizeClass: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", fullWidth = false, children } = props;
  const className = `${variantClass[variant]} ${sizeClass[size]} ${
    fullWidth ? "w-full" : ""
  } ${props.className ?? ""}`;

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, fullWidth: _f, children: _c, ...rest } = props as ButtonAsLink;
    const internal = href.startsWith("/") && !href.startsWith("//");
    if (internal) {
      return (
        <Link href={href} className={className} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }

  const { variant: _v, size: _s, fullWidth: _f, children: _c, ...rest } = props as ButtonAsButton;
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
}
