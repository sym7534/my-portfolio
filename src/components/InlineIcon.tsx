import Image, { type StaticImageData } from "next/image";
import type { AboutIconKey } from "@/types/about";
import UWaterlooLogo from "../../public/assets/icons/UWaterloo.png";
import BalatroLogo from "../../public/assets/icons/balatro.png";
import ClaudeLogo from "../../public/assets/icons/claude-color.svg";
import SolidWorksLogo from "../../public/assets/icons/solidworks.svg";
import NeuraLinkLogo from "../../public/assets/icons/neuralink.jpeg";
import MinecraftLogo from "../../public/assets/icons/minecraft icon.svg";
import CanadaLogo from "../../public/assets/icons/canada.jpg";
import IbLogo from "../../public/assets/icons/ib.png";

const icons: Record<AboutIconKey, { src: StaticImageData; alt: string }> = {
  uwaterloo: { src: UWaterlooLogo, alt: "UWaterloo Logo" },
  canada: { src: CanadaLogo, alt: "Canada flag" },
  minecraft: { src: MinecraftLogo, alt: "Minecraft" },
  balatro: { src: BalatroLogo, alt: "Balatro" },
  solidworks: { src: SolidWorksLogo, alt: "SolidWorks" },
  claude: { src: ClaudeLogo, alt: "Claude" },
  neuralink: { src: NeuraLinkLogo, alt: "Neuralink" },
  ib: { src: IbLogo, alt: "IB" },
};

/**
 * Small inline icon that sits in running text (about list, hero sub-line).
 * Matches the original inline treatment: 14px, baseline-nudged.
 */
export function InlineIcon({
  icon,
  className = "object-contain relative top-[2px]",
  size = 14,
}: {
  icon: AboutIconKey;
  className?: string;
  size?: number;
}) {
  const { src, alt } = icons[icon];
  return (
    <Image src={src} alt={alt} width={size} height={size} className={className} />
  );
}
