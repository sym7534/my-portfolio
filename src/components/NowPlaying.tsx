"use client";

import { useEffect, useRef, useState } from "react";

const BGM_URL = process.env.NEXT_PUBLIC_BGM_URL;
const BGM_VOLUME = 0.3;
const hasAudio = Boolean(BGM_URL);

const TRACK = {
  title: "SUPERPOSITION (feat. John Mayer)",
  artist: "Daniel Caesar, John Mayer",
  art: "https://i.scdn.co/image/ab67616d00001e02969c21ea34fe372a3e468947",
  href: "https://open.spotify.com/track/1KA2JLeMi0Mo3hjO0442re",
  durationSec: 263, // 4:23
};

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "00:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

/**
 * A quiet "now playing" card for the ambient background track. The play button
 * controls a looping <audio> (streamed from a Blob URL); the time reflects it
 * live. Music also auto-starts on the visitor's first gesture (browsers block
 * autoplay with sound) — unless that first gesture is the play button itself,
 * which the button then handles. The Spotify mark links straight to the song.
 */
export function NowPlaying() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const armedRef = useRef(true);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);

  // auto-start on first gesture (but let the play button handle its own click)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = BGM_VOLUME;
    const onFirst = (e: Event) => {
      if (!armedRef.current) return;
      armedRef.current = false;
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
      if (btnRef.current?.contains(e.target as Node)) return;
      audio.volume = BGM_VOLUME;
      audio.play().catch(() => {});
    };
    window.addEventListener("pointerdown", onFirst);
    window.addEventListener("keydown", onFirst);
    return () => {
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
    };
  }, []);

  // mirror the audio element's state into the UI
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setCurrent(audio.currentTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTime);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTime);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    armedRef.current = false;
    if (audio.paused) {
      audio.volume = BGM_VOLUME;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  return (
    <div className="flex w-full max-w-[320px] items-center gap-3">
      {hasAudio && (
        <audio ref={audioRef} src={BGM_URL} loop preload="auto" aria-hidden="true" />
      )}

      <a
        href={TRACK.href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${TRACK.title} on Spotify`}
        title="Open in Spotify"
        className="shrink-0 transition-opacity hover:opacity-80"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={TRACK.art}
          alt={`${TRACK.title} — ${TRACK.artist}`}
          className="size-12 rounded-[4px] object-cover"
        />
      </a>

      <div className="flex min-w-0 flex-1 flex-col gap-1 opacity-70">
        <p className="font-serif text-[13px] leading-tight text-text-muted">
          {TRACK.title}
        </p>
        <p className="-mt-px font-serif text-[12px] leading-tight text-text-muted">
          {TRACK.artist}
        </p>
        {hasAudio && (
          <div className="flex items-center gap-2 text-text-muted">
            <button
              ref={btnRef}
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause" : "Play"}
              className="shrink-0 transition-colors hover:text-text-primary"
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <span className="font-sans text-[11px] leading-none tabular-nums">
              {fmt(current)} / {fmt(TRACK.durationSec)}
            </span>
            <Equalizer playing={playing} />
          </div>
        )}
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

const EQ_DELAYS = ["0s", "0.3s", "0.1s", "0.4s", "0.2s"];

/** Five subtle bars that pulse while the track plays (static when paused). */
function Equalizer({ playing }: { playing: boolean }) {
  return (
    <span aria-hidden="true" className="flex h-2.5 items-end gap-[2px] text-text-muted">
      {EQ_DELAYS.map((d, i) => (
        <span
          key={i}
          className={`w-[2px] rounded-full bg-current ${playing ? "eq-bar" : ""}`}
          style={{
            height: "100%",
            transformOrigin: "bottom",
            animationDelay: d,
            transform: playing ? undefined : "scaleY(0.4)",
          }}
        />
      ))}
    </span>
  );
}

