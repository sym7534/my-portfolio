import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ryan Wang — wangdynasty.ca";

const BG = "#0e0e10";
const TEXT = "#f5f5f3";
const MUTED = "#8a8a93";
const ACCENT = "#ff4d00";

export default async function OpengraphImage() {
  const archivo = await readFile(
    new URL("./og-fonts/Archivo-ExpandedBold.ttf", import.meta.url)
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: BG,
          position: "relative",
          fontFamily: "Archivo",
          paddingLeft: 88,
          paddingRight: 88,
          paddingBottom: 84,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 72,
            left: 88,
            display: "flex",
            width: 34,
            height: 34,
            background: ACCENT,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 132,
            color: TEXT,
            lineHeight: 0.95,
            letterSpacing: -3,
          }}
        >
          <span>RYAN</span>
          <span>WANG</span>
        </div>
        <div
          style={{
            display: "flex",
            width: 460,
            height: 10,
            background: ACCENT,
            marginTop: 34,
          }}
        />
        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 26,
            color: MUTED,
            letterSpacing: 2,
          }}
        >
          mechatronics @ uwaterloo — wangdynasty.ca
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Archivo", data: archivo, weight: 800, style: "normal" }],
    }
  );
}
