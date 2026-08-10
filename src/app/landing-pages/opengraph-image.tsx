import { ImageResponse } from "next/og";

export const alt = "Landing pages profesionales desde $50.000 ARS — Matecito.dev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf7f2",
          color: "#1a1614",
          padding: "64px 72px",
          fontFamily: "Arial, sans-serif",
          border: "18px solid #1a1614",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>
            matecito<span style={{ color: "#8b1538" }}>.dev</span>
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: 999,
              background: "#8b1538",
              color: "white",
              padding: "12px 22px",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            DESDE $50.000 ARS
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", maxWidth: 920, fontSize: 76, lineHeight: 0.98, fontWeight: 800 }}>
            Landing pages que explican, convencen y venden.
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 25, color: "#6b6460" }}>
            Diseño responsive · SEO base · WhatsApp integrado
          </div>
        </div>
      </div>
    ),
    size,
  );
}
