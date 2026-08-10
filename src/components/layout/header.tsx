"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-mist bg-cream/90 backdrop-blur">
      <div className="section-x mx-auto flex h-20 w-full max-w-content items-center justify-between">
        <Link
          href="/"
          className="font-serif italic text-2xl font-light tracking-wide text-ink"
        >
          MeSo Ventures
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-sans text-xs font-light uppercase tracking-widest text-ink/70 hover:text-ink",
                pathname === link.href || pathname?.startsWith(`${link.href}/`)
                  ? "text-ink"
                  : ""
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={cn(
              "block h-px w-6 bg-ink transition-transform duration-400",
              open && "translate-y-[3.5px] rotate-45"
            )}
          />
          <span
            className={cn(
              "block h-px w-6 bg-ink transition-transform duration-400",
              open && "-translate-y-[3.5px] -rotate-45"
            )}
          />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-6 border-t border-mist bg-cream px-6 py-8 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-sm font-light uppercase tracking-widest text-ink"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-sans text-sm font-light uppercase tracking-widest text-stone"
          >
            {siteConfig.email}
          </a>
        </nav>
      )}
    </header>
  );
}
