import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/forms/contact-form";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with MeSo Ventures — for collector enquiries, art advisory, or general questions, based in London and Dubai.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="py-16">
      <Container className="max-w-3xl">
        <p className="eyebrow mb-4">Contact</p>
        <h1 className="font-serif text-4xl italic font-light text-ink sm:text-5xl">
          Get in Touch
        </h1>
        <p className="mt-6 max-w-xl font-sans text-sm font-light leading-relaxed text-ink/70">
          For collector enquiries, art advisory or general questions, complete
          the form below or reach us directly.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <Button href={`mailto:${siteConfig.email}`} variant="text">
            {siteConfig.email}
          </Button>
        </div>

        <div className="mt-16 border-t border-mist pt-16">
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
