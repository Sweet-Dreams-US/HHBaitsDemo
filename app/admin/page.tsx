"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { APPAREL, Collection, Contact, Order, Product, money, slugify, store, when } from "../lib/store";

type View = "orders" | "contacts" | "products" | "apparel" | "collections";

const blank: Omit<Product, "id"> = {
  shape: "",
  colour: "",
  photo: "",
  price: null,
  count: null,
  collections: ["baits"],
  sizes: "",
  published: false,
  real: true,
};

export default function AdminPage() {
  const [entered, setEntered] = useState(false);
  const [view, setView] = useState<View>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollection, setNewCollection] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [draft, setDraft] = useState<Omit<Product, "id">>(blank);
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOrders(store.orders());
    setContacts(store.contacts());
    setProducts(store.products());
    setCollections(store.collections());
  }, []);

  function say(text: string) {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function saveProducts(next: Product[]) {
    setProducts(next);
    store.saveProducts(next);
  }

  function saveCollections(next: Collection[]) {
    setCollections(next);
    store.saveCollections(next);
  }

  function addCollection() {
    const name = newCollection.trim();
    if (!name) return;
    const id = slugify(name);
    if (collections.some((c) => c.id === id)) {
      say("That collection already exists.");
      return;
    }
    saveCollections([...collections, { id, name, slug: id, ownPage: true, blurb: "" }]);
    setNewCollection("");
    say("Collection added.");
  }

  function toggleOwnPage(c: Collection) {
    saveCollections(collections.map((x) => (x.id === c.id ? { ...x, ownPage: !x.ownPage } : x)));
  }

  function removeCollection(c: Collection) {
    if (!window.confirm(`Delete the ${c.name} collection? Products stay, they just leave this collection.`)) return;
    saveCollections(collections.filter((x) => x.id !== c.id));
    saveProducts(products.map((p) => ({ ...p, collections: p.collections.filter((id) => id !== c.id) })));
  }

  function toggleProductCollection(id: string) {
    setDraft((d) => ({
      ...d,
      collections: d.collections.includes(id) ? d.collections.filter((x) => x !== id) : [...d.collections, id],
    }));
  }

  // Inventory is adjusted on the product itself, so she never has to go
  // looking for a separate screen after a batch.
  function bump(p: Product, by: number) {
    const next = Math.max(0, (p.count ?? 0) + by);
    saveProducts(products.map((x) => (x.id === p.id ? { ...x, count: next } : x)));
  }

  function startNew(collectionId = "baits") {
    setEditing(null);
    setDraft({ ...blank, collections: [collectionId] });
    setView(collectionId === APPAREL ? "apparel" : "products");
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
    setCollections(store.collections());
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
          <p className="index">Private page</p>
          <h1>H&amp;H Baits admin</h1>
          <p className="lede">Orders, contacts, products, inventory. No password on a demo.</p>
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
                ["products", "Baits"],
                ["apparel", "Apparel"],
                ["collections", "Collections"],
              ] as [View, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                className={view === key ? "active" : ""}
                onClick={() => {
                  setView(key);
                  if (!editing) setDraft({ ...blank, collections: [key === "apparel" ? APPAREL : "baits"] });
                }}
              >
                {label}
                {key === "orders" && newOrders > 0 && <b className="badge" aria-label={`${newOrders} new`}>{newOrders}</b>}
              </button>
            ))}
          </nav>
          <button className="side-new" onClick={() => startNew(view === "apparel" ? APPAREL : "baits")}>+ Add {view === "apparel" ? "apparel" : "a bait"}</button>
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

          {(view === "products" || view === "apparel") && (
            <>
              <header className="admin-head">
                <h1>{view === "apparel" ? "Apparel" : "Baits"}</h1>
                <p>
                  {view === "apparel"
                    ? "Shirts and anything else you print. Same as a bait, plus the sizes you stock. Type them the way you say them, separated by commas."
                    : "A bait is a shape in a colour with a photo. Name it, price it, add the photo, set the count, publish. It shows on the site the moment it is published."}
                </p>
              </header>

              <form className="product-form" id="product-form" onSubmit={submitProduct}>
                <p className="index">{editing ? `Editing ${editing.shape}` : view === "apparel" ? "Add apparel" : "Add a bait"}</p>
                <div className="form-grid">
                  <label>Shape or name<input value={draft.shape} onChange={(e) => setDraft({ ...draft, shape: e.target.value })} placeholder="Stick worm" required /></label>
                  <label>Colour<input value={draft.colour} onChange={(e) => setDraft({ ...draft, colour: e.target.value })} placeholder={view === "apparel" ? "Yellow" : "Green pumpkin, gold and red flake"} /></label>
                  {draft.collections.includes(APPAREL) && (
                    <label>Sizes<input value={draft.sizes} onChange={(e) => setDraft({ ...draft, sizes: e.target.value })} placeholder="S, M, L, XL" /></label>
                  )}
                  <label>Price<input type="number" inputMode="decimal" step="0.01" min="0" value={draft.price ?? ""} onChange={(e) => setDraft({ ...draft, price: e.target.value === "" ? null : Number(e.target.value) })} placeholder="Not set" /></label>
                  <label>Count in stock<input type="number" inputMode="numeric" min="0" step="1" value={draft.count ?? ""} onChange={(e) => setDraft({ ...draft, count: e.target.value === "" ? null : Number(e.target.value) })} placeholder="Not set" /></label>
                  <fieldset className="collection-pick">
                    <legend>Collections</legend>
                    {collections.map((c) => (
                      <label className="check" key={c.id}>
                        <input type="checkbox" checked={draft.collections.includes(c.id)} onChange={() => toggleProductCollection(c.id)} /> {c.name}
                      </label>
                    ))}
                  </fieldset>
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
                  <button className="button" type="submit">{editing ? "Save" : view === "apparel" ? "Add apparel" : "Add bait"}</button>
                  {editing && <button type="button" className="link" onClick={() => { setEditing(null); setDraft(blank); }}>Cancel</button>}
                </div>
              </form>

              <div className="product-list">
                {products
                  .filter((p) => (view === "apparel" ? p.collections.includes(APPAREL) : !p.collections.includes(APPAREL)))
                  .map((p) => (
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
                        <span>{p.collections.map((id) => collections.find((c) => c.id === id)?.name ?? id).join(", ") || <span className="slot">no collection</span>}</span>
                      </p>
                      <div className="stock-row">
                        <span className="tiny-label">In stock</span>
                        <div className="qty">
                          <button onClick={() => bump(p, -1)} aria-label={`One fewer ${p.shape}`}>&minus;</button>
                          <span>{p.count ?? 0}</span>
                          <button onClick={() => bump(p, 1)} aria-label={`One more ${p.shape}`}>+</button>
                        </div>
                        <button className="link" onClick={() => bump(p, 12)}>+12</button>
                        {p.count === null && <span className="slot">count not set</span>}
                      </div>
                      {p.collections.includes(APPAREL) && (
                        <p className="product-meta"><span>Sizes</span><span>{p.sizes || <span className="slot">to be set</span>}</span></p>
                      )}
                      <div className="product-actions">
                        <button className="link" onClick={() => togglePublished(p)}>{p.published ? "Unpublish" : "Publish"}</button>
                        <button className="link" onClick={() => startEdit(p)}>Edit</button>
                        <a className="link" href={`/product/${p.id}`} target="_blank" rel="noreferrer">View page</a>
                        <button className="link danger" onClick={() => remove(p)}>Remove</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {view === "collections" && (
            <>
              <header className="admin-head">
                <h1>Collections</h1>
                <p>Collections sort your products. Turn a page on and that collection gets its own page on the site. Turn it off and it still sorts your products, it just does not get a page.</p>
              </header>

              <div className="add-collection">
                <label>New collection<input value={newCollection} onChange={(e) => setNewCollection(e.target.value)} placeholder="Watermelon red" /></label>
                <button className="button" onClick={addCollection}>Add</button>
              </div>

              <div className="table">
                {collections.map((c) => {
                  const count = products.filter((p) => p.collections.includes(c.id)).length;
                  return (
                    <article className="row" key={c.id}>
                      <div className="row-main">
                        <p className="row-top"><strong>{c.name}</strong><span>{count} {count === 1 ? "product" : "products"}</span></p>
                        <p className="row-address">{c.ownPage ? `Has its own page at /collection/${c.slug}` : "Sorts products only, no page"}</p>
                      </div>
                      <div className="row-side">
                        <label className="check"><input type="checkbox" checked={c.ownPage} onChange={() => toggleOwnPage(c)} /> Give this collection its own page</label>
                        <div className="product-actions">
                          {c.ownPage && <a className="link" href={`/collection/${c.slug}`} target="_blank" rel="noreferrer">View page</a>}
                          <button className="link danger" onClick={() => removeCollection(c)}>Delete</button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}

        </section>
      </div>
    </main>
  );
}
