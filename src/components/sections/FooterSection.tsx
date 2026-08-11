import Link from "next/link";
import { FadeIn } from "@/components/Reveal";
import { WEBRING_BASE_URL, WEBRING_SITE } from "@/data/site";

/** Copyright + webring navigation. Server component (FadeIn is the client boundary). */
export function FooterSection() {
  return (
    <FadeIn
      delay={0.6}
      className="flex items-center justify-between gap-4 font-serif text-[13px] text-text-muted mt-auto pt-4 pl-1 select-none"
    >
      <span>2026 &copy; Ryan Wang</span>
      <div className="flex items-center gap-3">
        <Link
          href={`${WEBRING_BASE_URL}/#${WEBRING_SITE}?nav=prev`}
          aria-label="Previous site"
          className="group"
        >
          <span
            className="block w-[16px] h-[16px] bg-current opacity-50 group-hover:opacity-100 transition-opacity"
            style={{
              maskImage: "url('/leftarrow.png')",
              WebkitMaskImage: "url('/leftarrow.png')",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          />
        </Link>
        <Link
          href={`${WEBRING_BASE_URL}/#${WEBRING_SITE}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Tron Webring home"
          className="group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tronchrome.png"
            alt="Tron Webring"
            className="block w-8 h-8 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
          />
        </Link>
        <Link
          href={`${WEBRING_BASE_URL}/#${WEBRING_SITE}?nav=next`}
          aria-label="Next site"
          className="group"
        >
          <span
            className="block w-[16px] h-[16px] bg-current opacity-50 group-hover:opacity-100 transition-opacity"
            style={{
              maskImage: "url('/rightarrow.png')",
              WebkitMaskImage: "url('/rightarrow.png')",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          />
        </Link>
      </div>
    </FadeIn>
  );
}
