import { Cormorant_Garamond, Inter } from "next/font/google";

// Primary serif — used italic for headings/display type
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["italic", "normal"],
  variable: "--font-cormorant",
  display: "swap",
});

// Helvetica Neue substitute — Helvetica Neue is not freely licensed for web
// embedding, so Inter (a neutral grotesk with the same light-weight character)
// stands in. System-installed Helvetica Neue is still preferred first via the
// Tailwind font-sans fallback stack on Apple devices.
export const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});
