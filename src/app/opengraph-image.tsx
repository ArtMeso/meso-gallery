import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";
export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#fafaf8",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontStyle: "italic",
            fontWeight: 300,
            letterSpacing: "0.02em",
          }}
        >
          MeSo Ventures
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 24,
            fontWeight: 300,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#9a9490",
          }}
        >
          {siteConfig.locations.join(" · ")}
        </div>
      </div>
    ),
    { ...size }
  );
}
