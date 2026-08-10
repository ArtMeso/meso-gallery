import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How MeSo Ventures collects, uses and protects personal data.",
  path: "/privacy-policy",
});

const sectionClass = "mt-12 border-t border-mist pt-10";
const headingClass = "font-serif text-xl italic font-light text-ink";
const bodyClass =
  "mt-4 space-y-4 font-sans text-sm font-light leading-relaxed text-ink/70";

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16">
      <Container className="max-w-3xl">
        <p className="eyebrow mb-4">Legal</p>
        <h1 className="font-serif text-4xl italic font-light text-ink sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-6 font-sans text-sm font-light text-stone">
          Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className={bodyClass.replace("mt-4 ", "mt-10 ")}>
          <p>
            This policy explains what personal data MESO VENTURES PICTURES
            AND PAINTING TRADING L.L.C. (&ldquo;MeSo Ventures&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects through{" "}
            {siteConfig.url.replace("https://", "")}, why, and the rights you
            have over it under UAE Federal Decree-Law No. 45 of 2021 on the
            Protection of Personal Data (the &ldquo;PDPL&rdquo;).
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>1. Who we are</h2>
          <div className={bodyClass}>
            <p>
              MESO VENTURES PICTURES AND PAINTING TRADING L.L.C. is a Limited
              Liability Company &ndash; Single Owner (LLC-SO), licensed by the
              Dubai Department of Economy and Tourism (DET), with its
              registered office at Office 71, Court Tower, Business Bay,
              Dubai, United Arab Emirates.
            </p>
            <p>
              For any question about this policy or your data, contact us at{" "}
              <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-4 hover:text-ink">
                {siteConfig.email}
              </a>
              .
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>2. What we collect</h2>
          <div className={bodyClass}>
            <p>We keep this deliberately limited. The site does not have user accounts, online checkout, or a newsletter sign-up. We collect:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="font-normal text-ink">Enquiries you send us.</strong>{" "}
                The Contact page and &ldquo;Enquire&rdquo; buttons open a
                pre-filled email in your own email application, addressed to{" "}
                {siteConfig.email}. Nothing is submitted to or stored on our
                servers at this step &mdash; the message only reaches us once
                you choose to send it from your own email account, and from
                that point it is handled like any other email we receive.
              </li>
              <li>
                <strong className="font-normal text-ink">Website usage data.</strong>{" "}
                We use Google Analytics 4 to understand how the site is used
                &mdash; pages visited, approximate location (derived from IP
                address), device/browser type, and how you arrived at the
                site. This data is aggregated and does not, on its own,
                identify you by name.
              </li>
            </ul>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>3. Why we process it</h2>
          <div className={bodyClass}>
            <ul className="list-disc space-y-2 pl-5">
              <li>To respond to enquiries you send us.</li>
              <li>To understand and improve how the website is used, based on aggregated analytics.</li>
              <li>To comply with legal obligations where applicable.</li>
            </ul>
            <p>
              Our legal basis for processing is your consent (for enquiries
              you choose to send, and for analytics cookies where required)
              and our legitimate interest in understanding website
              performance.
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>4. Cookies</h2>
          <div className={bodyClass}>
            <p>
              Google Analytics sets cookies in your browser to distinguish
              visitors and sessions. You can block or delete these at any
              time through your browser settings. We do not use advertising
              or tracking cookies beyond standard Google Analytics.
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>5. Sharing and international transfers</h2>
          <div className={bodyClass}>
            <p>
              We do not sell personal data. Website usage data is processed
              by Google LLC as part of Google Analytics, which may process
              data on servers located outside the UAE, under Google&rsquo;s
              own data processing terms and safeguards. We do not share data
              with any other third party except where required by law.
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>6. Data retention</h2>
          <div className={bodyClass}>
            <p>
              We do not store contact-form submissions on our servers (see
              Section 2). Analytics data is retained according to Google
              Analytics&rsquo; standard retention settings. Emails you send
              us directly are retained in our mailbox for as long as
              reasonably necessary to handle your enquiry and our business
              records.
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>7. Your rights</h2>
          <div className={bodyClass}>
            <p>Under the PDPL, you have the right to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Request access to personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request erasure of your data, where applicable.</li>
              <li>Object to or restrict certain processing.</li>
              <li>Withdraw consent at any time, without affecting processing already carried out.</li>
              <li>Lodge a complaint with the UAE Data Office if you believe your rights have been infringed.</li>
            </ul>
            <p>
              To exercise any of these rights, email{" "}
              <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-4 hover:text-ink">
                {siteConfig.email}
              </a>
              .
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>8. Children</h2>
          <div className={bodyClass}>
            <p>
              This website is not directed at children, and we do not
              knowingly collect personal data from minors.
            </p>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>9. Changes to this policy</h2>
          <div className={bodyClass}>
            <p>
              We may update this policy from time to time. The &ldquo;Last
              updated&rdquo; date at the top of this page reflects the most
              recent revision.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
