"use client";

import { useEffect, useState } from "react";

const MSG = "Hey, are you there?";
const CIPHER = "9f3a c1e7 04bd 7a52 e81c";
const NODES = ["Client A", "E2EE", "TLS", "ISP / Internet", "TLS", "E2EE", "Client B"];
const CAPTIONS = [
  "Client A types a message",
  "E2EE: encrypted with Noise",
  "TLS: wrapped for transport",
  "The ISP sees only ciphertext",
  "TLS removed on arrival",
  "E2EE: decrypted by the recipient",
  "Client B reads the message",
];

export default function SeverusFlow() {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(6);
      setTyped(MSG.length);
      return;
    }

    let timeout: ReturnType<typeof setTimeout> | undefined;
    let interval: ReturnType<typeof setInterval> | undefined;

    if (step === 0) {
      setTyped(0);
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        setTyped(i);
        if (i >= MSG.length) {
          clearInterval(interval);
          timeout = setTimeout(() => setStep(1), 800);
        }
      }, 60);
    } else {
      timeout = setTimeout(
        () => setStep((s) => (s + 1) % NODES.length),
        step === NODES.length - 1 ? 2200 : 1100
      );
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [step]);

  const e2eeActive = step === 1 || step === 5;
  const tlsActive = step === 2 || step === 4;
  const encrypted = step >= 1 && step <= 4;

  return (
    <section className="mx-auto max-w-140 text-[#aab2b8]">
      <div
        className={`rounded-[14px] border-[0.5px] border-dashed p-3.5 transition-colors duration-400 motion-reduce:transition-none ${
          tlsActive ? "border-[#5a9a5e] bg-[#0c100d]" : "border-[#3a423e] bg-transparent"
        }`}
      >
        <div className="mb-2.5 flex justify-between text-[11px] tracking-[0.18em]">
          <span>LAYER 2 · TLS</span>
          <span>transport</span>
        </div>

        <div
          className={`rounded-[10px] border-[0.5px] p-3.5 transition-colors duration-400 motion-reduce:transition-none ${
            e2eeActive ? "border-[#3f7a45] bg-[#0c100d]" : "border-[#2a312d] bg-transparent"
          }`}
        >
          <div className="mb-2.5 flex justify-between text-[11px] tracking-[0.18em]">
            <span>LAYER 1 · E2EE</span>
            <span>Noise XX</span>
          </div>

          <div className="flex min-h-12 items-center rounded-lg border-[0.5px] border-[#2a312d] p-3.5">
            <span
              aria-live="polite"
              className={`text-sm ${
                encrypted ? "font-mono text-[#8a6a60]" : "text-[#e4e8ea]"
              }`}
            >
              {encrypted ? CIPHER : MSG.slice(0, typed)}
              {step === 0 && (
                <span className="ml-0.5 inline-block h-[1em] w-px animate-blink bg-[#e4e8ea] align-[-2px] motion-reduce:animate-none" />
              )}
            </span>
          </div>
        </div>
      </div>

      <ol className="mt-7 mb-3.5 flex flex-wrap justify-center gap-1.5 text-xs">
        {NODES.map((name, i) => (
          <li
            key={i}
            className={`rounded-md border-[0.5px] px-3 py-2 transition-all duration-400 motion-reduce:transition-none ${
              i === step
                ? "border-[#3f7a45] bg-[#0f1a11] text-[#e4e8ea]"
                : "border-[#2a312d] bg-transparent text-[#7d868c]"
            }`}
          >
            {name}
          </li>
        ))}
      </ol>

      <p className="min-h-5 text-center text-[13px] text-[#7d868c]">{CAPTIONS[step]}</p>
    </section>
  );
}