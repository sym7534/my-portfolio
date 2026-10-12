"use client";

import { useEffect, useRef, useState } from "react";

const BGM_URL = process.env.NEXT_PUBLIC_BGM_URL;
const BGM_VOLUME = 0.3;
const hasAudio = Boolean(BGM_URL);

const TRACK = {
  title: "SUPERPOSITION",
  artist: "Daniel Caesar, John Mayer",
  art: "https://i.scdn.co/image/ab67616d00001e02969c21ea34fe372a3e468947",
};

/**
 * An incidental "now playing" line for the ambient background track: small
 * album art, title and artist, nothing else. Clicking anywhere on it
 * toggles a looping <audio> (streamed from a Blob URL). Nothing plays until
 * the visitor clicks it.
 */
export function NowPlaying() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  // mirror the audio element's state into the UI
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = BGM_VOLUME;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  const art = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={TRACK.art}
      alt={hasAudio ? "" : `${TRACK.title} — ${TRACK.artist}`}
      className="size-8 shrink-0 rounded-[3px] object-cover"
    />
  );

  const text = (
    <span className="flex min-w-0 flex-col gap-0.5 text-left opacity-70">
      <span className="font-serif text-[13px] leading-tight text-text-muted">
        {TRACK.title}
      </span>
      <span className="-mt-px font-serif text-[12px] leading-tight text-text-muted">
        {TRACK.artist}
      </span>
    </span>
  );

  // The whole row (art + title + artist) is the play/pause control. It only
  // spans its content, so empty space beside it isn't clickable.
  const row = "flex w-fit max-w-[320px] items-center gap-2.5";

  if (!hasAudio) {
    return (
      <div className={row}>
        {art}
        {text}
      </div>
    );
  }

  return (
    <>
      <audio ref={audioRef} src={BGM_URL} loop preload="auto" aria-hidden="true" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause ${TRACK.title}` : `Play ${TRACK.title}`}
        className={`${row} cursor-pointer transition-opacity hover:opacity-80`}
      >
        {art}
        {text}
      </button>
    </>
  );
}
