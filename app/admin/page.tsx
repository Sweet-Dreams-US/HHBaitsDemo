"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type View = "overview" | "products" | "orders" | "contacts";
type InterestRequest = {
  id: string;
  name: string;
  contact: string;
  question: string;
  createdAt: string;
};

const requestStorageKey = "hh-baits-interest-requests";

export default function AdminPage() {
  const [view, setView] = useState<View>("overview");
  const [notice, setNotice] = useState("");
  const [requests, setRequests] = useState<InterestRequest[]>([]);

  useEffect(() => {
    try {
      setRequests(JSON.parse(localStorage.getItem(requestStorageKey) || "[]"));
    } catch {
      setRequests([]);
    }
  }, []);

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
              <article><span>REQUESTS ON THIS DEVICE</span><strong>{requests.length}</strong><p>Saved through the public preview form</p></article>
              <article className="wide"><span>FEATURED BAIT</span><strong>Green pumpkin stick worms</strong><p>Gold and red flake. Price and availability are not published.</p></article>
            </div>
            <div className="admin-note"><span>01</span><p>Requests in this preview stay in this browser. No customer message or payment is sent.</p></div>
          </div>
        )}

        {view === "products" && (
          <div className="admin-content">
            <div className="editor-card">
              <div className="editor-image"><Image src="/images/hh-baits-client-bait.jpg" alt="Client supplied bait photograph in sample editor" fill sizes="240px" /></div>
              <div>
                <p className="tiny-label">PRODUCT PREVIEW</p>
                <label>Product name<input value="Green pumpkin stick worms" readOnly /></label>
                <label>Confirmed details<textarea value="Hand poured soft fishing baits with gold and red flake." readOnly rows={3} /></label>
                <div className="editor-actions">
                  <button onClick={() => setNotice("Sample saved on this device only.")}>SAVE SAMPLE</button>
                  <span>NOT PUBLISHED</span>
                </div>
                {notice && <p className="notice" role="status">{notice}</p>}
              </div>
            </div>
          </div>
        )}

        {view === "orders" && (
          <div className="admin-content empty-admin">
            <div className="empty-mark"><span /><span /><span /></div>
            <p className="tiny-label">ORDER DESK</p>
            <h2>No orders yet.</h2>
            <p>No checkout or payment processing is connected to this preview.</p>
          </div>
        )}

        {view === "contacts" && (
          <div className="admin-content">
            {requests.length === 0 ? (
              <div className="empty-admin">
                <div className="empty-mark"><span /><span /><span /></div>
                <p className="tiny-label">REQUEST DESK</p>
                <h2>No requests yet.</h2>
                <p>Submit the public form to save a request in this browser.</p>
              </div>
            ) : (
              <div className="request-list">
                {requests.map((request) => (
                  <article className="request-card" key={request.id}>
                    <div>
                      <p className="tiny-label">{new Date(request.createdAt).toLocaleString()}</p>
                      <h2>{request.name}</h2>
                      <p className="request-contact">{request.contact}</p>
                    </div>
                    <p>{request.question}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
