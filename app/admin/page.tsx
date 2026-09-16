"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type View = "overview" | "products" | "orders" | "contacts";

export default function AdminPage() {
  const [view, setView] = useState<View>("overview");
  const [notice, setNotice] = useState("");

  return (
    <main className="admin-shell">
      <div className="demo-bar admin-bar">
        <span>Sweet Dreams demo admin</span>
        <Link href="/">View public demo</Link>
      </div>
      <aside className="admin-nav">
        <div className="admin-wordmark">H&amp;H<br />BAITS</div>
        <p>STORE DESK</p>
        <nav aria-label="Admin views">
          {(["overview", "products", "orders", "contacts"] as View[]).map((item, index) => (
            <button key={item} onClick={() => { setView(item); setNotice(""); }} className={view === item ? "active" : ""}>
              <span>0{index + 1}</span>{item.toUpperCase()}
            </button>
          ))}
        </nav>
        <Link className="back-link" href="/">← PUBLIC DEMO</Link>
      </aside>
      <section className="admin-main">
        <header>
          <div><p>DEMO ADMIN PREVIEW</p><h1>{view}</h1></div>
          <span className="sample-pill">SAMPLE DATA ONLY</span>
        </header>

        {view === "overview" && (
          <div className="admin-content">
            <div className="metric-grid">
              <article><span>ORDERS</span><strong>0</strong><p>No live checkout is connected</p></article>
              <article><span>CONTACTS</span><strong>0</strong><p>No form entries are stored</p></article>
              <article className="wide"><span>COLLECTION STATUS</span><strong>First collection is not published</strong><p>Add confirmed details before any item is offered for sale.</p></article>
            </div>
            <div className="admin-note"><span>01</span><p>This sample shows how H&amp;H could review orders, contacts, products, and collections after a signed build. Nothing here is live.</p></div>
          </div>
        )}

        {view === "products" && (
          <div className="admin-content">
            <div className="editor-card">
              <div className="editor-image"><Image src="/images/hh-baits-client-bait.jpg" alt="Client supplied bait photograph in sample editor" fill sizes="240px" /></div>
              <div>
                <p className="tiny-label">SAMPLE COLLECTION EDITOR</p>
                <label>Collection name<input value="First collection" readOnly /></label>
                <label>Confirmed details<textarea value="Waiting for product names, options, prices, stock, and shipping details." readOnly rows={3} /></label>
                <div className="editor-actions">
                  <button onClick={() => setNotice("Sample saved on this device only.")}>SAVE SAMPLE</button>
                  <span>NOT PUBLISHED</span>
                </div>
                {notice && <p className="notice" role="status">{notice}</p>}
              </div>
            </div>
          </div>
        )}

        {(view === "orders" || view === "contacts") && (
          <div className="admin-content empty-admin">
            <div className="empty-mark"><span /><span /><span /></div>
            <p className="tiny-label">EMPTY DEMO STATE</p>
            <h2>No {view} yet.</h2>
            <p>{view === "orders" ? "No checkout or payment processing is connected to this demo." : "The public sample form does not send or store data."}</p>
          </div>
        )}
      </section>
    </main>
  );
}
