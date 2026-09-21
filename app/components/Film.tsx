"use client";

import { ReactNode, useEffect, useRef } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    gsap?: any;
    ScrollTrigger?: any;
    Lenis?: any;
  }
}

// The pour. Her name is set as type and used as a mould. Her photograph of
// the tub (20260917_18409) rises inside the letterforms as the page scrolls,
// then her hand (20260917_18410) lifts one bait clear of the batch and the
// page opens into the store. Nothing in here is generated.

const POUR = "/images/pour.jpg";
const HAND = "/images/hand.jpg";
// Where the creature bait sits in the hand photograph, as a fraction of the image.
const BAIT_POINT = { x: 0.49, y: 0.49 };

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
function ease(t: number) {
  return t * t * (3 - 2 * t);
}
function span(p: number, a: number, b: number) {
  return ease(clamp01((p - a) / (b - a)));
}

export default function Film({ topRow }: { topRow?: ReactNode }) {
  const filmRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beatOne = useRef<HTMLDivElement>(null);
  const beatTwo = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const film = filmRef.current;
    if (!canvas || !stage || !film) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const family = getComputedStyle(stage).fontFamily;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let fontSize = 100;
    let lines: { text: string; x: number; y: number }[] = [];
    let progress = reduced ? 1 : 0;
    let pour: HTMLImageElement | null = null;
    let hand: HTMLImageElement | null = null;
    let dead = false;

    function layout() {
      W = stage!.clientWidth;
      H = stage!.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const wide = W / H > 2.2;
      const words = wide ? ["H&H BAITS"] : ["H&H", "BAITS"];
      ctx!.font = `400 100px ${family}`;
      const widest = Math.max(...words.map((w) => ctx!.measureText(w).width));
      const lineGap = 0.9; // em between baselines
      const cap = 0.7; // em, cap height of the display face
      const blockEm = cap + lineGap * (words.length - 1);
      const byWidth = ((W - (wide ? 48 : 32)) / widest) * 100;
      const byHeight = ((H * (wide ? 0.5 : 0.57)) / blockEm) * 100;
      fontSize = Math.floor(Math.min(byWidth, byHeight));
      const block = blockEm * fontSize;
      const top = (H - block) / 2 - fontSize * (wide ? 0 : 0.12);
      lines = words.map((text, i) => ({ text, x: W / 2, y: top + cap * fontSize + i * lineGap * fontSize }));
    }

    function cover(img: HTMLImageElement, offsetY = 0) {
      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      return { x: (W - dw) / 2, y: (H - dh) / 2 + offsetY, w: dw, h: dh };
    }

    function drawWord(mode: "fill" | "stroke") {
      ctx!.font = `400 ${fontSize}px ${family}`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "alphabetic";
      for (const l of lines) {
        if (mode === "fill") ctx!.fillText(l.text, l.x, l.y);
        else ctx!.strokeText(l.text, l.x, l.y);
      }
    }

    function wavePath(level: number, phase: number) {
      const ly = H * (1 - level) + (level <= 0 ? 4 : 0);
      const amp = 4 + 10 * (1 - level) * level * 4;
      ctx!.beginPath();
      ctx!.moveTo(-10, ly);
      for (let x = -10; x <= W + 10; x += 6) {
        const y = ly + Math.sin(x / (W / 3.2) * Math.PI * 2 + phase) * amp + Math.sin(x / 41 + phase * 1.7) * (amp * 0.35);
        ctx!.lineTo(x, y);
      }
      ctx!.lineTo(W + 10, H + 10);
      ctx!.lineTo(-10, H + 10);
      ctx!.closePath();
    }

    function draw() {
      if (dead) return;
      const p = progress;
      const level = reduced ? 1 : span(p, 0, 0.55);
      const handIn = reduced ? 0 : span(p, 0.56, 0.72);
      const reveal = reduced ? 0 : span(p, 0.74, 0.93);

      ctx!.clearRect(0, 0, W, H);

      // The empty mould.
      ctx!.fillStyle = "#dcdfd4";
      drawWord("fill");

      // The pour, only where the letters already are.
      ctx!.globalCompositeOperation = "source-atop";
      if (pour && level > 0) {
        ctx!.save();
        wavePath(level, p * 9);
        ctx!.clip();
        const r = cover(pour, (1 - level) * H * 0.14);
        ctx!.drawImage(pour, r.x, r.y, r.w, r.h);
        ctx!.restore();
        if (level < 1) {
          ctx!.save();
          wavePath(level, p * 9);
          ctx!.lineWidth = 2;
          ctx!.strokeStyle = "rgba(255,255,255,.6)";
          ctx!.stroke();
          ctx!.restore();
        }
      }
      if (hand && handIn > 0) {
        ctx!.globalAlpha = handIn;
        const r = cover(hand);
        ctx!.drawImage(hand, r.x, r.y, r.w, r.h);
        ctx!.globalAlpha = 1;
      }
      ctx!.globalCompositeOperation = "source-over";

      // Mould edge.
      ctx!.lineWidth = 1;
      ctx!.strokeStyle = "rgba(34,37,24,.32)";
      drawWord("stroke");

      // The hand lifts the bait clear of the letters and the photograph
      // spreads over the stage.
      if (hand && reveal > 0) {
        const r = cover(hand);
        const cx = r.x + r.w * BAIT_POINT.x;
        const cy = r.y + r.h * BAIT_POINT.y;
        const maxR = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) * 1.05;
        ctx!.save();
        ctx!.beginPath();
        ctx!.ellipse(cx, cy, maxR * reveal, maxR * reveal * 0.9, 0, 0, Math.PI * 2);
        ctx!.clip();
        ctx!.drawImage(hand, r.x, r.y, r.w, r.h);
        ctx!.restore();
      }

      // Copy beats.
      const b1 = beatOne.current;
      const b2 = beatTwo.current;
      const hint = hintRef.current;
      if (b1) {
        const o = reduced ? 1 : span(p, 0.03, 0.12) * (1 - span(p, 0.44, 0.54));
        b1.style.opacity = String(o);
        b1.style.transform = `translateY(${(1 - o) * 14}px)`;
      }
      if (b2) {
        const o = reduced ? 0 : span(p, 0.8, 0.9);
        b2.style.opacity = String(o);
        b2.style.transform = `translateY(${(1 - o) * 14}px)`;
      }
      if (hint) hint.style.opacity = reduced ? "0" : String(1 - span(p, 0, 0.08));
    }

    function load(src: string) {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    }

    let trigger: any = null;
    let lenis: any = null;
    let ticker: ((t: number) => void) | null = null;

    async function start() {
      try {
        await document.fonts.load(`400 100px ${family}`);
      } catch {
        // fall through and draw with the fallback face
      }
      layout();
      draw();
      load(POUR).then((img) => {
        pour = img;
        draw();
      });
      load(HAND).then((img) => {
        hand = img;
        draw();
      });

      if (reduced) return;
      const { gsap, ScrollTrigger, Lenis } = window;
      if (!gsap || !ScrollTrigger) return;
      gsap.registerPlugin(ScrollTrigger);

      if (Lenis) {
        lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        ticker = (t: number) => lenis.raf(t * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
      }

      trigger = ScrollTrigger.create({
        trigger: film,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self: any) => {
          progress = self.progress;
          draw();
        },
      });
      progress = trigger.progress;
      draw();
    }

    start();

    const onResize = () => {
      layout();
      draw();
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(() => {
      if (stage.clientWidth !== W || stage.clientHeight !== H) onResize();
    });
    ro.observe(stage);

    return () => {
      dead = true;
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (trigger) trigger.kill();
      if (ticker && window.gsap) window.gsap.ticker.remove(ticker);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <section className="film" ref={filmRef} aria-label="H&H Baits">
      <div className="stage" ref={stageRef}>
        <canvas ref={canvasRef} aria-hidden="true" />
        <h1 className="sr-only">H&amp;H Baits. Soft fishing baits, poured by hand.</h1>
        <div className="stage-top">{topRow}</div>
        <div className="beat beat-one" ref={beatOne}>
          <p className="beat-index">01</p>
          <p className="beat-quote">&ldquo;We just do soft baits, fishing baits.&rdquo;</p>
          <p className="beat-who">H&amp;H Baits</p>
        </div>
        <div className="beat beat-two" ref={beatTwo}>
          <p className="beat-index">02</p>
        </div>
        <div className="scroll-hint" ref={hintRef} aria-hidden="true">
          Scroll to pour
        </div>
      </div>
      <figure className="still-hand">
        {/* Shown only when motion is reduced, so the hand is never lost. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HAND} alt="A hand lifting a creature bait out of a tub of green pumpkin soft plastics" />
      </figure>
    </section>
  );
}
