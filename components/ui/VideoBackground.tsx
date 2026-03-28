"use client";

import { useEffect, useRef } from "react";

interface VideoBackgroundProps {
  webm?: string;
  mp4: string;
  poster?: string;
  overlay?: boolean;
}

export function VideoBackground({ webm, mp4, poster, overlay = false }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        {...(poster ? { poster } : {})}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "brightness(0.55) saturate(0.8)" }}
      >
        {webm && <source src={webm} type="video/webm" />}
        <source src={mp4} type="video/mp4" />
      </video>
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(26,24,20,0.3) 0%, rgba(26,24,20,0.7) 100%)",
          }}
        />
      )}
    </div>
  );
}
