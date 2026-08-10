import Link from "next/link";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 font-sans text-xs font-light uppercase tracking-widest transition-colors duration-400 px-6 py-3";

const variants = {
  solid: "bg-ink text-cream hover:bg-ink/80",
  outline: "border border-ink text-ink hover:bg-ink hover:text-cream",
  text: "px-0 py-0 text-ink/70 hover:text-ink underline underline-offset-4",
};

type ButtonProps = {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
} & (
  | ({ href: string } & Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      "href" | "className"
    >)
  | ({ href?: undefined } & Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "className"
    >)
);

export function Button({
  children,
  variant = "solid",
  className,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <Link
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
