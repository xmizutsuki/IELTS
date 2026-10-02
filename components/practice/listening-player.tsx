"use client";

import { useEffect, useMemo, useState } from "react";
import { Headphones, Play, Volume2 } from "lucide-react";

const VOICE_STORAGE_KEY = "ielts-listening-voice";

function voiceScore(voice: SpeechSynthesisVoice) {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();

  let score = 0;

  if (lang.startsWith("en-gb")) score += 60;
  else if (lang.startsWith("en-au")) score += 55;
  else if (lang.startsWith("en-nz")) score += 52;
  else if (lang.startsWith("en-ie")) score += 50;
  else if (lang.startsWith("en-us")) score += 45;
  else if (lang.startsWith("en")) score += 35;

  if (name.includes("natural")) score += 100;
  if (name.includes("neural")) score += 95;
  if (name.includes("online")) score += 80;
  if (name.includes("google")) score += 70;
  if (name.includes("microsoft")) score += 55;
  if (name.includes("siri")) score += 55;
  if (name.includes("premium")) score += 45;
  if (!voice.localService) score += 15;

  return score;
}

function friendlyAccent(lang: string) {
  const code = lang.toLowerCase();
  if (code.startsWith("en-gb")) return "British";
  if (code.startsWith("en-au")) return "Australian";
  if (code.startsWith("en-nz")) return "New Zealand";
  if (code.startsWith("en-ie")) return "Irish";
  if (code.startsWith("en-us")) return "American";
  if (code.startsWith("en-ca")) return "Canadian";
  return "English";
}

function qualityLabel(voice: SpeechSynthesisVoice) {
  const name = voice.name.toLowerCase();
  if (name.includes("natural") || name.includes("neural")) return "Natural";
  if (name.includes("online") || name.includes("google")) return "Enhanced";
  return "System";
}

export function ListeningPlayer({ text }: { text: string }) {
  const [played, setPlayed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }

    const synth = window.speechSynthesis;

    function loadVoices() {
      const englishVoices = synth
        .getVoices()
        .filter((voice) => voice.lang.toLowerCase().startsWith("en"))
        .sort((a, b) => voiceScore(b) - voiceScore(a));

      setVoices(englishVoices);

      const saved = window.localStorage.getItem(VOICE_STORAGE_KEY);
      const savedExists = saved && englishVoices.some((voice) => voice.voiceURI === saved);
      const best = savedExists ? saved : englishVoices[0]?.voiceURI ?? "";

      setSelectedVoiceURI((current) => current || best);
    }

    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);

    return () => {
      synth.removeEventListener("voiceschanged", loadVoices);
      synth.cancel();
    };
  }, []);

  const selectedVoice = useMemo(
    () => voices.find((voice) => voice.voiceURI === selectedVoiceURI) ?? voices[0],
    [selectedVoiceURI, voices],
  );

  function saveVoice(uri: string) {
    setSelectedVoiceURI(uri);
    window.localStorage.setItem(VOICE_STORAGE_KEY, uri);
  }

  function createUtterance(content: string, preview = false) {
    const utterance = new SpeechSynthesisUtterance(content);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = "en-GB";
    }

    utterance.rate = preview ? 0.96 : 0.93;
    utterance.pitch = 1;
    utterance.volume = 1;

    return utterance;
  }

  function testVoice() {
    if (!supported || playing) return;

    window.speechSynthesis.cancel();
    const utterance = createUtterance(
      "Good morning. Before we begin, please check that you can hear the recording clearly.",
      true,
    );
    window.speechSynthesis.speak(utterance);
  }

  function play() {
    if (played || playing || !supported) return;

    window.speechSynthesis.cancel();
    const utterance = createUtterance(text);

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
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10">
          <Headphones size={21} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">Practice recording</div>
          <div className="mt-0.5 text-xs text-slate-400">
            One play for the question. Voice preview does not reveal the recording.
          </div>
        </div>
      </div>

      {supported && voices.length > 0 && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="min-w-0 flex-1">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Listening voice
              </span>
              <select
                value={selectedVoice?.voiceURI ?? ""}
                onChange={(event) => saveVoice(event.target.value)}
                disabled={playing || played}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none disabled:opacity-50"
              >
                {voices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} · {friendlyAccent(voice.lang)} · {qualityLabel(voice)}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={testVoice}
              disabled={playing || played}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Volume2 size={16} />
              Test voice
            </button>
          </div>

          {selectedVoice && (
            <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-slate-300">
                {friendlyAccent(selectedVoice.lang)}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-slate-300">
                {qualityLabel(selectedVoice)}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-slate-300">
                {selectedVoice.localService ? "Device voice" : "Online voice"}
              </span>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={play}
        disabled={played || playing || !supported}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Play size={17} />
        {!supported
          ? "Audio unavailable in this browser"
          : playing
            ? "Playing…"
            : played
              ? "Recording played"
              : "Play recording"}
      </button>

      <p className="mt-3 text-xs leading-5 text-slate-400">
        The app now automatically prioritises Natural/Neural/Online English voices when your browser or operating system provides them. Audio quality can still vary by device.
      </p>
    </div>
  );
}
