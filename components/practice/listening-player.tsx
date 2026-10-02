"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Headphones, Pause, Play } from "lucide-react";
import { HumanAudioSource } from "@/types";

export function ListeningPlayer({
  source,
  revealSource = false,
}: {
  source: HumanAudioSource;
  revealSource?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [played, setPlayed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [source.id]);

  async function play() {
    if (played || playing || error) return;

    const audio = audioRef.current;
    if (!audio) return;

    try {
      setPlaying(true);
      await audio.play();
    } catch {
      setPlaying(false);
      setError(true);
    }
  }

  function pause() {
    const audio = audioRef.current;
    if (!audio || !playing) return;
    audio.pause();
    setPlaying(false);
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white">
      <audio
        ref={audioRef}
        src={source.url}
        preload="metadata"
        onEnded={() => {
          setPlaying(false);
          setPlayed(true);
        }}
        onPause={() => {
          if (audioRef.current && !audioRef.current.ended) setPlaying(false);
        }}
        onError={() => {
          setPlaying(false);
          setError(true);
        }}
      />

      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10">
          <Headphones size={21} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">Human recording</div>
          <div className="mt-0.5 text-xs text-slate-400">
            Real person · {source.duration} · one complete play
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Reader
        </div>
        <div className="mt-2 text-sm font-semibold text-white">{source.reader}</div>
        <div className="mt-1 text-xs text-slate-400">
          Audio streamed from {source.provider}. No browser-generated speech is used.
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={playing ? pause : play}
          disabled={played || error}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {playing ? <Pause size={17} /> : <Play size={17} />}
          {error
            ? "Recording unavailable"
            : playing
              ? "Pause"
              : played
                ? "Recording played"
                : "Play human recording"}
        </button>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-400">
        For exam discipline, finishing the recording marks it as played. Pausing does not create a second playback.
      </p>

      {revealSource && (
        <div className="mt-5 border-t border-white/10 pt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Source revealed after answering
          </div>
          <div className="mt-2 text-sm font-semibold">{source.sourceTitle}</div>
          <div className="mt-1 text-xs leading-5 text-slate-400">{source.licenseNote}</div>
          <a
            href={source.sourcePage}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:text-sky-200"
          >
            View original source <ExternalLink size={13} />
          </a>
        </div>
      )}
    </div>
  );
}
