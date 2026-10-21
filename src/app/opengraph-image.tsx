import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#0c0c0b",
          color: "#eae6de",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: "#a39d93" }}>
          <span>XORO VISUALS</span>
          <span>2.39 : 1</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: 300,
            border: "1px solid #4a4742",
            background: "linear-gradient(120deg, #0c0c0b 10%, #3a2f24 50%, #a8946f 75%, #0c0c0b 100%)",
            padding: "0 48px",
          }}
        >
          <span style={{ fontSize: 78 }}>Ideas into images.</span>
          <span style={{ fontSize: 78, fontStyle: "italic" }}>Images into films.</span>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#a39d93" }}>{site.description}</div>
      </div>
    ),
    size,
  );
}
