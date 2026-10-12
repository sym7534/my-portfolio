import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

/**
 * Link preview card (Discord, iMessage, X): the site, only quieter. Near-black
 * page background, the name in Lora with one muted line under it, and a single
 * object (the robot hand cutout) on the right. Everything sits at least 60px
 * from the edges because chat apps crop the corners. Rendered at build time.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ryan Wang";

const BG = "#0f0f0f"; // dark-mode page background (--color-bg-white)
const NAME = "#ededed"; // dark-mode --color-text-primary
const MUTED = "#8a8a8a"; // dark-mode --color-text-muted
const INSET = 60;

export default async function OpengraphImage() {
  const [lora, hand] = await Promise.all([
    readFile(new URL("./og-fonts/Lora-SemiBold.ttf", import.meta.url)),
    readFile(
      path.join(process.cwd(), "public/assets/projects/robot-hand/nobg.png")
    ),
  ]);
  const handSrc = `data:image/png;base64,${hand.toString("base64")}`;
  // the cutout is 1086x1448; fit it to the inset height
  const handHeight = size.height - INSET * 2;
  const handWidth = Math.round((handHeight * 1086) / 1448);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${INSET}px ${INSET + 40}px ${INSET}px ${INSET + 40}px`,
          background: BG,
          fontFamily: "Lora",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 600,
              color: NAME,
              lineHeight: 1,
            }}
          >
            Ryan Wang
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 30,
              fontSize: 28,
              color: MUTED,
            }}
          >
            robotics engineer · humanoids &amp; hands
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={handSrc} width={handWidth} height={handHeight} />
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Lora", data: lora, weight: 600, style: "normal" }],
    }
  );
}
