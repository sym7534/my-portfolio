import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ryan Wang — wangdynasty.ca";

export default async function OpengraphImage() {
  const lora = await readFile(
    new URL("./og-fonts/Lora-SemiBold.ttf", import.meta.url)
  );

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
          background: "#ffffff",
          fontFamily: "Lora",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 600,
            color: "#171717",
            lineHeight: 1,
          }}
        >
          Ryan Wang
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 26,
            color: "#737373",
          }}
        >
          mechatronics @ uwaterloo — wangdynasty.ca
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Lora", data: lora, weight: 600, style: "normal" }],
    }
  );
}
