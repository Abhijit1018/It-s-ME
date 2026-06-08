"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COMMANDS: Record<string, () => string[]> = {
  help: () => [
    "Available commands:",
    "  about      — who is this guy",
    "  skills     — tech stack",
    "  projects   — notable builds",
    "  contact    — get in touch",
    "  clear      — clear terminal",
    "  exit       — close",
  ],
  about: () => [
    "Abhijit Singh",
    "B.Tech CS (SAP) — Parul University, 2027",
    "SAP Full Stack Developer @ VegaH LLC",
    "Python Django Intern @ Infosys Springboard (ex)",
    "Vadodara, Gujarat",
    "",
    "Building AI agents, SAP BTP apps, and open-source tools.",
    "39+ public repos. Available for select projects.",
  ],
  skills: () => [
    "─── SAP ────────────────────────────",
    "  ABAP · ABAP Cloud · RAP · CDS Views",
    "  OData · SAP BTP · Fiori · SAPUI5",
    "─── Backend ────────────────────────",
    "  Python · Django · FastAPI · Flask",
    "  REST APIs · Node.js",
    "─── AI/ML ──────────────────────────",
    "  LLM Orchestration · AI Agents",
    "  NLP · Generative AI · Automation",
    "─── Frontend ───────────────────────",
    "  TypeScript · React · Next.js",
    "  Three.js · Tailwind CSS",
    "─── Cloud ──────────────────────────",
    "  AWS · Oracle OCI · SAP BTP",
  ],
  projects: () => [
    "01  Recall          — AI-powered SAP outreach system",
    "02  Arora AI        — autonomous Python agent",
    "03  Bharat Biz      — Hindi/Hinglish voice assistant",
    "04  MINDISPO        — resource optimization (Django)",
    "05  REDHOPE         — blood & organ logistics",
    "06  ShieldRoute     — TypeScript RBAC routing framework",
    "07  Nexus OS        — browser OS in TypeScript",
    "",
    "→ /work for full case studies",
  ],
  contact: () => [
    "abhijeetrathore104@gmail.com",
    "github.com/Abhijit1018",
    "linkedin.com/in/abhijit-singh10",
    "",
    "→ /contact to send a message",
  ],
  whoami: () => ["abhijit"],
  pwd: () => ["/home/abhijit/portfolio"],
  ls: () => ["work/  about/  skills/  writing/  lab/  uses/  now/  contact/"],
  date: () => [new Date().toString()],
  uname: () => ["Portfolio OS v1.0 — built with Next.js + Three.js"],
};

type Line = { type: "input" | "output" | "error"; text: string };

export function TerminalModal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: "Portfolio OS v1.0 — type 'help' to start" },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOpen() { setOpen(true); }
    document.addEventListener("open-terminal", onOpen);
    return () => document.removeEventListener("open-terminal", onOpen);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  function runCommand(raw: string) {
    const cmd = raw.trim().toLowerCase();
    const newLines: Line[] = [{ type: "input", text: raw }];

    if (!cmd) {
      setLines((l) => [...l, ...newLines]);
      return;
    }

    if (cmd === "clear") {
      setLines([]);
      return;
    }
    if (cmd === "exit" || cmd === "quit") {
      setOpen(false);
      return;
    }

    const handler = COMMANDS[cmd];
    if (handler) {
      handler().forEach((t) => newLines.push({ type: "output", text: t }));
    } else {
      newLines.push({ type: "error", text: `command not found: ${cmd}` });
      newLines.push({ type: "output", text: "type 'help' for available commands" });
    }

    setLines((l) => [...l, ...newLines]);
    setHistory((h) => [raw, ...h]);
    setHistIdx(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : history[next]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[500]"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[501] w-full max-w-2xl rounded-xl overflow-hidden"
            style={{
              background: "#0D0D0B",
              border: "1px solid var(--border-medium)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title bar */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#161612" }}
            >
              <button
                onClick={() => setOpen(false)}
                className="w-3 h-3 rounded-full"
                style={{ background: "#FF5F57" }}
                aria-label="Close terminal"
              />
              <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
              <span
                className="mx-auto text-xs"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)" }}
              >
                portfolio — bash
              </span>
            </div>

            {/* Output */}
            <div
              className="px-5 pt-4 pb-2 overflow-y-auto"
              style={{ height: "340px", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}
            >
              {lines.map((line, i) => (
                <div key={i} className="leading-relaxed">
                  {line.type === "input" ? (
                    <span>
                      <span style={{ color: "#7B9E87" }}>abhijit</span>
                      <span style={{ color: "rgba(255,255,255,0.3)" }}>@portfolio</span>
                      <span style={{ color: "rgba(255,255,255,0.3)" }}> ~ </span>
                      <span style={{ color: "#EDE8DF" }}>$ {line.text}</span>
                    </span>
                  ) : line.type === "error" ? (
                    <span style={{ color: "#C4847A" }}>{line.text}</span>
                  ) : (
                    <span style={{ color: "rgba(237,232,223,0.7)" }}>{line.text || " "}</span>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="flex items-center gap-2 px-5 py-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span style={{ color: "#7B9E87", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                abhijit@portfolio ~ $
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 bg-transparent outline-none"
                style={{
                  color: "#EDE8DF",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  caretColor: "#7B9E87",
                }}
                autoComplete="off"
                spellCheck={false}
                aria-label="Terminal input"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
