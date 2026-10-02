"use client";

import { useEffect, useState } from "react";
import { Headphones, Play } from "lucide-react";

export function ListeningPlayer({ text }: { text: string }) {
  const [played, setPlayed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported("speechSynthesis" in window);
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  function play() {
    if (played || playing || !supported) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((voice) => voice.lang.toLowerCase().startsWith("en-gb")) ??
      voices.find((voice) => voice.lang.toLowerCase().startsWith("en-au")) ??
      voices.find((voice) => voice.lang.toLowerCase().startsWith("en"));

    if (preferred) utterance.voice = preferred;
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => {
      setPlaying(false);
      setPlayed(true);
    };
    utterance.onerror = () => {
      setPlaying(false);
      setPlayed(true);
    };

    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
          <Headphones size={21} />
        </div>
        <div>
          <div className="text-sm font-semibold">Practice recording</div>
          <div className="mt-0.5 text-xs text-slate-400">One play, like the exam.</div>
        </div>
      </div>

      <button
        type="button"
        onClick={play}
        disabled={played || playing || !supported}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Play size={17} />
        {!supported ? "Audio unavailable in this browser" : playing ? "Playing…" : played ? "Recording played" : "Play recording"}
      </button>

      <p className="mt-3 text-xs leading-5 text-slate-400">
        This MVP uses your browser&apos;s English text-to-speech voice. Later, exam-style recorded audio can replace it without changing the question engine.
      </p>
    </div>
  );
}
