import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions",
  description: "Terms of use for the MeSo Ventures website.",
  path: "/terms-and-conditions",
});

const sectionClass = "mt-12 border-t border-mist pt-10";
const headingClass = "font-serif text-xl italic font-light text-ink";
const bodyClass =
  "mt-4 space-y-4 font-sans text-sm font-light leading-relaxed text-ink/70";

export default function TermsAndConditionsPage() {
  return (
    <div className="py-16">
      <Container className="max-w-3xl">
        <p className="eyebrow mb-4">Legal</p>
        <h1 className="font-serif text-4xl italic font-light text-ink sm:text-5xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-6 font-sans text-sm font-light text-stone">
          Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className={bodyClass.replace("mt-4 ", "mt-10 ")}>
          <p>
            These terms govern your use of{" "}
            {siteConfig.url.replace("https://", "")} (the
            &ldquo;Website&rdquo;), operated by MESO VENTURES PICTURES AND
            PAINTING TRADING L.L.C., a Limited Liability Company &ndash;
            Single Owner (LLC-SO) licensed by the Dubai Department of Economy
            and Tourism (DET), with its registered office at Office 71, Court
            Tower, Business Bay, Dubai, United Arab Emirates
            (&ldquo;MeSo Ventures&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;).
            By using the Website, you agree to these terms.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>1. Use of the website</h2>
          <div className={bodyClass}>
            <p>
              You may browse the Website and use its contact features for
              your own personal or professional use. You agree not to
              misuse the Website &mdash; including attempting to access it
              by automated means beyond normal search-engine indexing,
              interfering with its operation, or using it for any unlawful
              purpose.
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>2. Intellectual property</h2>
          <div className={bodyClass}>
            <p>
              All content on the Website &mdash; including artwork images,
              artist biographies, editorial content, photography and the
              MeSo Ventures name and branding &mdash; is owned by MeSo
              Ventures, the represented artists, or our licensors, and is
              protected by copyright and other intellectual property laws.
              Artwork remains the intellectual property of the respective
              artist unless otherwise agreed in writing. You may not
              reproduce, distribute or otherwise use any content from the
              Website without prior written permission.
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>3. Artworks and enquiries</h2>
          <div className={bodyClass}>
            <p>
              The Website is a gallery and advisory platform, not an online
              store &mdash; it does not process payments or sales directly.
              Artworks shown are representative of available work; images,
              dimensions, medium and pricing are provided for guidance and
              subject to confirmation at the time of enquiry. Where a price
              is not shown (&ldquo;Pricing on request&rdquo;), pricing is
              provided directly on enquiry. Any sale is a separate
              transaction agreed directly between you and MeSo Ventures (or
              the relevant artist/gallery), on terms confirmed at that time.
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>4. Not financial advice</h2>
          <div className={bodyClass}>
            <p>
              Editorial content on the Website, including MeSo Mag articles
              discussing art as an investment, market trends, or collecting
              guidance, is provided for general informational purposes only
              and does not constitute financial, investment or professional
              advice. You should seek independent professional advice before
              making any acquisition or investment decision. Art advisory
              services referenced on the Website are provided under separate
              terms agreed directly with MeSo Ventures.
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>5. Third-party links</h2>
          <div className={bodyClass}>
            <p>
              The Website may link to third-party sites, such as our social
              media, press coverage, or partner organisations. We are not
              responsible for the content, accuracy or practices of any
              third-party site.
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>6. Limitation of liability</h2>
          <div className={bodyClass}>
            <p>
              The Website and its content are provided &ldquo;as is&rdquo;
              without warranties of any kind. To the fullest extent
              permitted by law, MeSo Ventures is not liable for any indirect
              or consequential loss arising from your use of the Website.
              Nothing in these terms limits liability that cannot be limited
              under applicable UAE law.
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>7. Governing law</h2>
          <div className={bodyClass}>
            <p>
              These terms are governed by the laws of the Emirate of Dubai
              and the applicable federal laws of the United Arab Emirates.
              The courts of Dubai have exclusive jurisdiction over any
              dispute arising from these terms or your use of the Website.
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>8. Changes to these terms</h2>
          <div className={bodyClass}>
            <p>
              We may update these terms from time to time. The &ldquo;Last
              updated&rdquo; date at the top of this page reflects the most
              recent revision. Continued use of the Website after changes
              constitutes acceptance of the updated terms.
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>9. Contact</h2>
          <div className={bodyClass}>
            <p>
              Questions about these terms can be sent to{" "}
              <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-4 hover:text-ink">
                {siteConfig.email}
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
