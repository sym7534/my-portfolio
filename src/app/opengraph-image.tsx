import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ryan Wang | Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            color: "#f0f0f0",
            lineHeight: 1.2,
          }}
        >
          hey, i&apos;m Ryan Wang
        </div>
        <div
          style={{
            width: 400,
            height: 1,
            backgroundColor: "rgba(144,144,144,0.3)",
            marginTop: 32,
            marginBottom: 32,
          }}
        />
        <div
          style={{
            fontSize: 28,
            color: "#909090",
            fontFamily: "sans-serif",
            fontWeight: 300,
          }}
        >
          mechatronics engineering @ UWaterloo
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#606060",
            fontFamily: "sans-serif",
            fontWeight: 300,
            marginTop: 16,
          }}
        >
          wangdynasty.ca
        </div>
      </div>
    ),
    { ...size }
  );
}
