"use client";

import { useState, useRef, useEffect } from "react";

const sounds = [
  { label: "Rain", src: "/audio/rain.mp3" },
  { label: "Cafe", src: "/audio/cafe.mp3" },
  { label: "Lo-fi", src: "/audio/lofi.mp3" },
];

export function AmbientSound() {
  const [active, setActive] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("portfolio-sound");
    if (stored) {
      try {
        const { vol, idx } = JSON.parse(stored);
        setVolume(vol);
        setSelected(idx);
      } catch {}
    }
  }, []);

  function toggleSound() {
    if (!active) {
      const audio = new Audio(sounds[selected].src);
      audio.loop = true;
      audio.volume = volume;
      audio.play().catch(() => {});
      audioRef.current = audio;
      setActive(true);
    } else {
      audioRef.current?.pause();
      audioRef.current = null;
      setActive(false);
    }
  }

  function changeVolume(v: number) {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    localStorage.setItem("portfolio-sound", JSON.stringify({ vol: v, idx: selected }));
  }

  function selectSound(idx: number) {
    setSelected(idx);
    localStorage.setItem("portfolio-sound", JSON.stringify({ vol: volume, idx }));
    if (active && audioRef.current) {
      audioRef.current.pause();
      const audio = new Audio(sounds[idx].src);
      audio.loop = true;
      audio.volume = volume;
      audio.play().catch(() => {});
      audioRef.current = audio;
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs"
        style={{
          color: active ? "var(--accent-sage)" : "var(--text-tertiary)",
          fontFamily: "var(--font-mono)",
        }}
        aria-label={active ? "Sound on — click to manage" : "Enable ambient sound"}
        aria-expanded={open}
      >
        <span>{active ? "♪" : "♩"}</span>
        <span>Sound</span>
      </button>

      {open && (
        <div
          className="absolute bottom-8 right-0 rounded-xl p-4 space-y-4 w-52"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-medium)",
            boxShadow: "var(--shadow-medium)",
          }}
        >
          <div className="flex flex-wrap gap-1.5">
            {sounds.map((s, i) => (
              <button
                key={s.label}
                onClick={() => selectSound(i)}
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: selected === i ? "var(--accent-sage)" : "transparent",
                  color: selected === i ? "#F7F4EF" : "var(--text-secondary)",
                  border: `1px solid ${selected === i ? "var(--accent-sage)" : "var(--border-medium)"}`,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div>
            <p
              className="text-xs mb-2"
              style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
            >
              Volume
            </p>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              className="w-full"
              aria-label="Ambient sound volume"
            />
          </div>

          <button
            onClick={toggleSound}
            className="w-full text-xs py-2 rounded-lg"
            style={{
              background: active ? "var(--accent-rose)" : "var(--accent-sage)",
              color: "#F7F4EF",
              fontFamily: "var(--font-mono)",
            }}
          >
            {active ? "Turn off" : "Turn on"}
          </button>
        </div>
      )}
    </div>
  );
}
