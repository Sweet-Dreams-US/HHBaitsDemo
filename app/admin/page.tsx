"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Contact, Order, Product, money, store, when } from "../lib/store";

type View = "orders" | "contacts" | "products" | "inventory";

const blank: Omit<Product, "id"> = {
  shape: "",
  colour: "",
  photo: "",
  price: null,
  count: null,
  collection: "baits",
  published: false,
  real: true,
};

export default function AdminPage() {
  const [entered, setEntered] = useState(false);
  const [view, setView] = useState<View>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [draft, setDraft] = useState<Omit<Product, "id">>(blank);
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOrders(store.orders());
    setContacts(store.contacts());
    setProducts(store.products());
  }, []);

  function say(text: string) {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function saveProducts(next: Product[]) {
    setProducts(next);
    store.saveProducts(next);
  }

  function startNew() {
    setEditing(null);
    setDraft(blank);
    setView("products");
    window.setTimeout(() => document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function startEdit(p: Product) {
    setEditing(p);
    const { id: _id, ...rest } = p;
    void _id;
    setDraft(rest);
    window.setTimeout(() => document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function onPhoto(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((d) => ({ ...d, photo: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.shape.trim()) return;
    if (editing) {
      saveProducts(products.map((p) => (p.id === editing.id ? { ...editing, ...draft } : p)));
      say("Saved.");
    } else {
      const id = `p-${Date.now()}`;
      saveProducts([...products, { id, ...draft }]);
      say("Added.");
    }
    setEditing(null);
    setDraft(blank);
    if (fileRef.current) fileRef.current.value = "";
  }

  function togglePublished(p: Product) {
    saveProducts(products.map((x) => (x.id === p.id ? { ...x, published: !x.published } : x)));
  }

  function remove(p: Product) {
    if (!window.confirm(`Take ${p.shape} off the site?`)) return;
    saveProducts(products.filter((x) => x.id !== p.id));
  }

  function setCount(p: Product, count: number | null) {
    saveProducts(products.map((x) => (x.id === p.id ? { ...x, count } : x)));
  }

  function setStatus(o: Order, status: Order["status"]) {
    const next = orders.map((x) => (x.id === o.id ? { ...x, status } : x));
    setOrders(next);
    store.saveOrders(next);
  }

  function resetDemo() {
    if (!window.confirm("Put the demo back the way it started?")) return;
    store.reset();
    setOrders(store.orders());
    setContacts(store.contacts());
    setProducts(store.products());
    say("Reset.");
  }

  if (!entered) {
    return (
      <main className="gate">
        <div className="demo-bar">
          <span>Sweet Dreams demo admin</span>
          <Link href="/">Back to the site</Link>
        </div>
        <div className="gate-body">
          <p className="index">Private page for Heather</p>
          <h1>H&amp;H Baits admin</h1>
          <p className="lede">Orders, anyone who contacted you, and your products. On a demo there is no password, one button gets you in.</p>
          <button className="button" onClick={() => setEntered(true)}>Enter</button>
        </div>
      </main>
    );
  }

  const newOrders = orders.filter((o) => o.status === "new").length;

  return (
    <main className="admin">
      <div className="demo-bar">
        <span>Sweet Dreams demo admin. Sample rows are marked.</span>
        <Link href="/">Back to the site</Link>
      </div>

      <div className="admin-shell">
        <aside className="admin-side">
          <div className="admin-mark">H&amp;H<br />BAITS</div>
          <nav aria-label="Admin sections">
            {(
              [
                ["orders", "Orders"],
                ["contacts", "Contacts"],
                ["products", "Products"],
                ["inventory", "Inventory"],
              ] as [View, string][]
            ).map(([key, label]) => (
              <button key={key} className={view === key ? "active" : ""} onClick={() => setView(key)}>
                {label}
                {key === "orders" && newOrders > 0 && <b className="badge" aria-label={`${newOrders} new`}>{newOrders}</b>}
              </button>
            ))}
          </nav>
          <button className="side-new" onClick={startNew}>+ Add a product</button>
          <button className="side-reset" onClick={resetDemo}>Reset demo</button>
        </aside>

        <section className="admin-main">
          {notice && <p className="toast" role="status">{notice}</p>}

          {view === "orders" && (
            <>
              <header className="admin-head">
                <h1>Orders</h1>
                <p>Every order placed on the site. Sample rows show what a day looks like. When you place a sample order on the site it lands here too.</p>
              </header>
              <div className="table">
                {orders.map((o) => (
                  <article className="row" key={o.id}>
                    <div className="row-main">
                      <p className="row-top">
                        <strong>{o.id}</strong>
                        <span>{when(o.placedAt)}</span>
                        {o.sample && <em className="sample">sample, we will swap this for yours</em>}
                      </p>
                      <p className="row-name">{o.name}, {o.email}</p>
                      <p className="row-address">{o.address}</p>
                      <ul className="row-lines">
                        {o.lines.map((l, i) => (
                          <li key={i}>{l.qty} &times; {l.shape}, {l.colour}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="row-side">
                      <label className="select">
                        Status
                        <select value={o.status} onChange={(e) => setStatus(o, e.target.value as Order["status"])}>
                          <option value="new">New</option>
                          <option value="packed">Packed</option>
                          <option value="shipped">Shipped</option>
                        </select>
                      </label>
                      <p className="fine"><span className="slot">shipping label, prints from here once payments are set up</span></p>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {view === "contacts" && (
            <>
              <header className="admin-head">
                <h1>Contacts</h1>
                <p>Anyone who used the ask form on the site.</p>
              </header>
              <div className="table">
                {contacts.map((c) => (
                  <article className="row" key={c.id}>
                    <div className="row-main">
                      <p className="row-top">
                        <strong>{c.name}</strong>
                        <span>{when(c.receivedAt)}</span>
                        {c.sample && <em className="sample">sample, we will swap this for yours</em>}
                      </p>
                      <p className="row-name">{c.reach}</p>
                      <p className="row-message">{c.message}</p>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {view === "products" && (
            <>
              <header className="admin-head">
                <h1>Products</h1>
                <p>A product is a shape in a colour with a photo. Name it, price it, add the photo, set the count, publish. It shows on the site the moment it is published.</p>
              </header>

              <form className="product-form" id="product-form" onSubmit={submitProduct}>
                <p className="index">{editing ? `Editing ${editing.shape}` : "Add a product"}</p>
                <div className="form-grid">
                  <label>Shape or name<input value={draft.shape} onChange={(e) => setDraft({ ...draft, shape: e.target.value })} placeholder="Stick worm" required /></label>
                  <label>Colour<input value={draft.colour} onChange={(e) => setDraft({ ...draft, colour: e.target.value })} placeholder="Green pumpkin, gold and red flake" /></label>
                  <label>Price<input type="number" inputMode="decimal" step="0.01" min="0" value={draft.price ?? ""} onChange={(e) => setDraft({ ...draft, price: e.target.value === "" ? null : Number(e.target.value) })} placeholder="Not set" /></label>
                  <label>Count in stock<input type="number" inputMode="numeric" min="0" step="1" value={draft.count ?? ""} onChange={(e) => setDraft({ ...draft, count: e.target.value === "" ? null : Number(e.target.value) })} placeholder="Not set" /></label>
                  <label>Collection
                    <select value={draft.collection} onChange={(e) => setDraft({ ...draft, collection: e.target.value as Product["collection"] })}>
                      <option value="baits">Baits</option>
                      <option value="merch">Shirts and merchandise</option>
                    </select>
                  </label>
                  <label className="check"><input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Published on the site</label>
                  <label className="photo-field">Photo
                    <input ref={fileRef} type="file" accept="image/*" onChange={(e) => onPhoto(e.target.files?.[0])} />
                    {draft.photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={draft.photo} alt="" className="photo-preview" />
                    )}
                  </label>
                </div>
                <div className="form-actions">
                  <button className="button" type="submit">{editing ? "Save" : "Add product"}</button>
                  {editing && <button type="button" className="link" onClick={() => { setEditing(null); setDraft(blank); }}>Cancel</button>}
                </div>
              </form>

              <div className="product-list">
                {products.map((p) => (
                  <article className={`product ${p.published ? "" : "off"}`} key={p.id}>
                    <div className="product-photo">
                      {p.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.photo} alt="" />
                      ) : (
                        <span className="slot">no photo yet</span>
                      )}
                    </div>
                    <div className="product-body">
                      <h3>{p.shape}</h3>
                      <p>{p.colour || <span className="slot">colour not written yet</span>}</p>
                      <p className="product-meta">
                        <span>{money(p.price) ?? <span className="slot">price not set</span>}</span>
                        <span>{p.count === null ? <span className="slot">count not set</span> : `${p.count} in stock`}</span>
                        <span>{p.collection === "baits" ? "Baits" : "Merch"}</span>
                      </p>
                      <div className="product-actions">
                        <button className="link" onClick={() => togglePublished(p)}>{p.published ? "Unpublish" : "Publish"}</button>
                        <button className="link" onClick={() => startEdit(p)}>Edit</button>
                        <button className="link danger" onClick={() => remove(p)}>Remove</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {view === "inventory" && (
            <>
              <header className="admin-head">
                <h1>Inventory</h1>
                <p>Counts per product. Change a number and it saves.</p>
              </header>
              <div className="table">
                {products.map((p) => (
                  <article className="row inv" key={p.id}>
                    <div className="row-main">
                      <p className="row-top"><strong>{p.shape}</strong><span>{p.colour}</span></p>
                    </div>
                    <div className="row-side">
                      <label className="select">
                        In stock
                        <input type="number" inputMode="numeric" min="0" step="1" value={p.count ?? ""} placeholder="Not set" onChange={(e) => setCount(p, e.target.value === "" ? null : Number(e.target.value))} />
                      </label>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
