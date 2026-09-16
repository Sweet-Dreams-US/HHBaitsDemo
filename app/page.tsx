"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

const requestStorageKey = "hh-baits-interest-requests";

type InterestRequest = {
  id: string;
  name: string;
  contact: string;
  question: string;
  createdAt: string;
};

const flecks = [
  [9, 48, 7, "gold"], [15, 38, 4, "red"], [20, 57, 6, "gold"],
  [26, 45, 5, "gold"], [31, 35, 3, "red"], [36, 53, 7, "gold"],
  [42, 42, 4, "red"], [47, 58, 5, "gold"], [53, 45, 7, "gold"],
  [58, 35, 4, "red"], [64, 52, 6, "gold"], [70, 42, 5, "gold"],
  [76, 55, 3, "red"], [82, 45, 7, "gold"], [88, 38, 4, "red"],
  [93, 49, 5, "gold"], [27, 64, 3, "red"], [40, 29, 4, "gold"],
  [62, 67, 4, "red"], [74, 27, 3, "gold"],
] as const;

function DemoBar() {
  return (
    <div className="demo-bar">
      <span>Sweet Dreams demo</span>
      <Link href="/admin">Open sample admin</Link>
    </div>
  );
}

function FlakeField({ mode }: { mode: "bait" | "shirt" }) {
  return (
    <svg className={`flake-field ${mode}`} viewBox="0 0 100 100" aria-hidden="true">
      <path className="lure-ghost" d="M8 51 C20 26 70 25 88 45 L98 34 L94 51 L98 68 L87 56 C65 75 20 75 8 51Z" />
      {flecks.map(([x, y, size, color], index) => (
        <rect
          key={index}
          className={`fleck ${color}`}
          x={x}
          y={y}
          width={size}
          height={Math.max(2, size / 2)}
          rx="1"
          style={{ "--delay": `${index * 36}ms` } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

export default function Home() {
  const [mode, setMode] = useState<"bait" | "shirt">("bait");
  const [sent, setSent] = useState(false);

  function choose(next: "bait" | "shirt") {
    setMode(next);
    document.getElementById(next === "bait" ? "baits" : "merchandise")?.scrollIntoView({ behavior: "smooth" });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const request: InterestRequest = {
      id: crypto.randomUUID(),
      name: String(data.get("name") || ""),
      contact: String(data.get("contact") || ""),
      question: String(data.get("question") || ""),
      createdAt: new Date().toISOString(),
    };
    let previous: InterestRequest[] = [];
    try {
      previous = JSON.parse(localStorage.getItem(requestStorageKey) || "[]");
    } catch {
      previous = [];
    }
    localStorage.setItem(requestStorageKey, JSON.stringify([request, ...previous]));
    form.reset();
    setSent(true);
  }

  return (
    <main>
      <DemoBar />
      <header className="hero">
        <div className="hero-copy">
          <div className="wordmark">H&amp;H BAITS</div>
          <div className="hero-text">
            <p className="eyebrow">HAND POURED SOFT FISHING BAITS</p>
            <h1><span>GREEN</span><span>PUMPKIN.</span><span>GOLD + RED.</span></h1>
            <p className="hero-sub">A close look at H&amp;H stick worms with gold and red flake.</p>
            <a className="primary-button" href="#baits">SEE THE STICK WORMS <span aria-hidden="true">↓</span></a>
            <p className="trust"><span /> Real H&amp;H product photo</p>
          </div>
        </div>
        <div className="hero-image">
          <Image
            src="/images/hh-baits-client-bait.jpg"
            alt="Client supplied photograph of H&H soft fishing baits"
            fill
            priority
            sizes="(max-width: 700px) 100vw, 54vw"
          />
          <div className="image-label"><span>01</span> GOLD + RED FLAKE</div>
        </div>
        <div className="field-wrap"><FlakeField mode={mode} /></div>
      </header>

      <nav className="choice-rail" aria-label="Explore the collection">
        <p>CHOOSE A PATH</p>
        <button className={mode === "bait" ? "active" : ""} onClick={() => choose("bait")}>BAITS <span>01</span></button>
        <button className={mode === "shirt" ? "active" : ""} onClick={() => choose("shirt")}>MERCHANDISE <span>02</span></button>
      </nav>

      <section className="bait-section" id="baits">
        <div className="section-number">01</div>
        <div className="bait-photo frame-photo">
          <Image src="/images/hh-baits-client-bait.jpg" alt="Close view of client supplied soft bait photograph" fill sizes="(max-width: 800px) 100vw, 55vw" />
        </div>
        <div className="section-copy">
          <p className="eyebrow dark">SOFT FISHING BAITS</p>
          <h2>GREEN<br />PUMPKIN.</h2>
          <p>H&amp;H hand pours these stick worms in green pumpkin with gold and red flake. Ask what is available now.</p>
          <a href="#interest" className="text-link">ASK ABOUT AVAILABILITY <span>↘</span></a>
        </div>
      </section>

      <section className="merch-section" id="merchandise">
        <div className="merch-copy">
          <p className="eyebrow">MERCHANDISE</p>
          <h2>CATCH YA<br />LATER.</h2>
          <p>Fishing merchandise sits beside the soft bait lineup, including this yellow Catch Ya Later tee.</p>
        </div>
        <div className="shirt-card">
          <div className="shirt-photo frame-photo">
            <Image src="/images/hh-baits-client-shirt.jpg" alt="Client supplied yellow Catch Ya Later fishing shirt" fill sizes="(max-width: 800px) 84vw, 34vw" />
          </div>
          <div className="card-caption"><span>FISHING MERCHANDISE</span><span>CATCH YA LATER TEE</span></div>
        </div>
        <div className="shirt-field"><FlakeField mode="shirt" /></div>
      </section>

      <section className="store-note">
        <p className="eyebrow dark">FIRST ONLINE STORE</p>
        <p className="statement">H&amp;H Baits is preparing its first online store for soft baits and fishing merchandise.</p>
      </section>

      <section className="interest-section" id="interest">
        <div>
          <p className="eyebrow">ASK H&amp;H</p>
          <h2>WHAT ARE YOU<br />LOOKING FOR?</h2>
          <p className="form-intro">Ask about stick worms, merchandise, or current availability.</p>
        </div>
        {sent ? (
          <div className="form-success" role="status">
            <span>✓</span>
            <h3>Request saved.</h3>
            <p>Saved in this preview on this device. H&amp;H has not received it.</p>
            <button onClick={() => setSent(false)}>SAVE ANOTHER</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label>Name<input name="name" required autoComplete="name" /></label>
            <label>Phone or email<input name="contact" required /></label>
            <label>What are you looking for?<textarea name="question" required rows={4} /></label>
            <button className="submit-button" type="submit">SAVE REQUEST <span>↗</span></button>
            <p className="demo-note">This preview saves requests on this device so you can review the flow in the admin.</p>
          </form>
        )}
      </section>

      <footer>
        <div className="wordmark">H&amp;H BAITS</div>
        <p>Soft fishing baits and merchandise</p>
        <Link href="/admin">Sample admin</Link>
      </footer>
    </main>
  );
}
