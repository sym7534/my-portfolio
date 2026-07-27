import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ryan Wang — wangdynasty.ca";

const PAPER = "#faf7f1";
const INK = "#1a1817";
const INK_SOFT = "#6b655d";
const HAIRLINE = "#e2dcd2";
const SEAL = "#c3272b";

export default async function OpengraphImage() {
  const fraunces = await readFile(
    new URL("./og-fonts/Fraunces-SemiBold.ttf", import.meta.url)
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: PAPER,
          position: "relative",
          fontFamily: "Fraunces",
        }}
      >
        {/* hairline frame */}
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 32,
            right: 32,
            bottom: 32,
            display: "flex",
            border: `1px solid ${HAIRLINE}`,
          }}
        />

        {/* seal, stamped slightly askew */}
        <div
          style={{
            position: "absolute",
            top: 88,
            right: 96,
            display: "flex",
            transform: "rotate(-4deg)",
          }}
        >
          <svg width="150" height="150" viewBox="0 0 64 64">
            <rect x="2" y="2" width="60" height="60" rx="13" fill={SEAL} />
            <g
              stroke={PAPER}
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            >
              <path d="M21.5 21.5h21" />
              <path d="M24.5 32.5h15" />
              <path d="M18.5 44h27" />
              <path d="M32 21.5V44" />
            </g>
          </svg>
        </div>

        {/* name + line */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            paddingLeft: 96,
            paddingRight: 96,
            paddingBottom: 96,
          }}
        >
          <div style={{ display: "flex", fontSize: 118, color: INK, lineHeight: 1 }}>
            Ryan Wang
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              color: INK_SOFT,
            }}
          >
            mechatronics @ uwaterloo — wangdynasty.ca
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
      ],
    }
  );
}
