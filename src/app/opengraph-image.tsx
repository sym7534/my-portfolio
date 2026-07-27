import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ryan Wang — wangdynasty.ca";

const BG = "#f6f6f6";
const INK = "#141414";
const MUTED = "#8a8a8a";
const HAIRLINE = "#e2e2e2";

export default async function OpengraphImage() {
  const [italic, regular] = await Promise.all([
    readFile(new URL("./og-fonts/Newsreader-Italic.ttf", import.meta.url)),
    readFile(new URL("./og-fonts/Newsreader-Regular.ttf", import.meta.url)),
  ]);

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
          background: BG,
          position: "relative",
          fontFamily: "Newsreader",
        }}
      >
        {/* mounted-print frame */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#ffffff",
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 4,
            paddingTop: 64,
            paddingBottom: 40,
            paddingLeft: 96,
            paddingRight: 96,
            boxShadow: "0 14px 40px rgba(0,0,0,0.07)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 108,
              fontStyle: "italic",
              fontWeight: 500,
              color: INK,
              lineHeight: 1,
            }}
          >
            Ryan Wang
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 40,
              fontSize: 24,
              color: MUTED,
            }}
          >
            <span style={{ fontFamily: "monospace", marginRight: 16 }}>
              no. 03
            </span>
            <span>mechatronics @ uwaterloo — wangdynasty.ca</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Newsreader", data: italic, weight: 500, style: "italic" },
        { name: "Newsreader", data: regular, weight: 400, style: "normal" },
      ],
    }
  );
}
