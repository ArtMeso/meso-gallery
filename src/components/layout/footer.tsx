import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-mist bg-warm">
      <div className="section-x mx-auto grid w-full max-w-content gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif italic text-2xl font-light text-ink">
            MeSo Ventures
          </p>
          <p className="mt-4 max-w-sm font-sans text-sm font-light text-ink/70">
            An international contemporary art gallery and advisory platform,
            based in {siteConfig.locations.join(" and ")}.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Navigate</p>
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-sans text-sm font-light text-ink/70 hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Contact</p>
          <ul className="space-y-3 font-sans text-sm font-light text-ink/70">
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-ink">
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-ink"
              >
                Instagram {siteConfig.instagramHandle}
              </a>
            </li>
            <li>{siteConfig.locations.join(" — ")}</li>
          </ul>
        </div>
      </div>

      <div className="section-x mx-auto w-full max-w-content border-t border-mist py-6">
        <p className="font-sans text-xs font-light tracking-wide text-stone">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
