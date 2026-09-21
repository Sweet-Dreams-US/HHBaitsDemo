"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Film from "./components/Film";
import { CartLine, Product, realProducts, store } from "./lib/store";

function DemoBar() {
  return (
    <div className="demo-bar">
      <span>Sweet Dreams demo for H&amp;H Baits. Nothing here is live.</span>
      <Link href="/admin">Open the admin panel</Link>
    </div>
  );
}

function Slot({ children }: { children: React.ReactNode }) {
  return <span className="slot">{children}</span>;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>(realProducts);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [placed, setPlaced] = useState<string | null>(null);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    setProducts(store.products());
    setCart(store.cart());
  }, []);

  useEffect(() => {
    document.body.classList.toggle("drawer-open", drawer);
  }, [drawer]);

  const baits = products.filter((p) => p.collection === "baits" && p.published);
  const count = cart.reduce((n, l) => n + l.qty, 0);
  const lines = useMemo(
    () =>
      cart
        .map((l) => ({ ...l, product: products.find((p) => p.id === l.productId) }))
        .filter((l) => l.product) as (CartLine & { product: Product })[],
    [cart, products],
  );

  function updateCart(next: CartLine[]) {
    setCart(next);
    store.saveCart(next);
  }
  function add(id: string) {
    const existing = cart.find((l) => l.productId === id);
    updateCart(existing ? cart.map((l) => (l.productId === id ? { ...l, qty: l.qty + 1 } : l)) : [...cart, { productId: id, qty: 1 }]);
    setDrawer(true);
  }
  function setQty(id: string, qty: number) {
    updateCart(qty <= 0 ? cart.filter((l) => l.productId !== id) : cart.map((l) => (l.productId === id ? { ...l, qty } : l)));
  }

  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const id = `HH-${1000 + store.orders().length + 1}`;
    store.saveOrders([
      {
        id,
        placedAt: new Date().toISOString(),
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        address: String(data.get("address") || ""),
        lines: lines.map((l) => ({ shape: l.product.shape, colour: l.product.colour, qty: l.qty })),
        status: "new",
        sample: false,
      },
      ...store.orders(),
    ]);
    updateCart([]);
    setPlaced(id);
  }

  function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    store.saveContacts([
      {
        id: `C-${Date.now()}`,
        receivedAt: new Date().toISOString(),
        name: String(data.get("name") || ""),
        reach: String(data.get("reach") || ""),
        message: String(data.get("message") || ""),
        sample: false,
      },
      ...store.contacts(),
    ]);
    setAsked(true);
  }

  const bagButton = (
    <button className="bag-button" onClick={() => setDrawer(true)} aria-label={`Open bag, ${count} items`}>
      Bag <span>{count}</span>
    </button>
  );

  return (
    <main>
      <DemoBar />

      <Film
        topRow={
          <>
            <span className="top-word">Soft fishing baits</span>
            <a href="#colour" className="top-link">Shop</a>
            {bagButton}
          </>
        }
      />

      {/* 03, the colour */}
      <section className="colour" id="colour">
        <div className="colour-head">
          <p className="index">03, the colour</p>
          <h2>Soft plastics sell by colour. This is the one in the tub today.</h2>
          <p className="lede">Green pumpkin with gold, silver and red flake, photographed close enough to count it. More colours land here as Heather adds them.</p>
        </div>

        <div className="swatches" role="list" aria-label="Colours">
          <div className="swatch real" role="listitem">
            <div className="swatch-photo">
              <Image src="/images/swatch.jpg" alt="Green pumpkin soft plastic with gold, silver and red flake, poured by H&H Baits" fill sizes="(max-width: 700px) 60vw, 22vw" />
            </div>
            <p className="swatch-name">Green pumpkin, gold, silver and red flake</p>
            <p className="swatch-note">Her photograph</p>
          </div>
          {[1, 2, 3, 4, 5].map((n) => (
            <div className="swatch empty" role="listitem" key={n}>
              <div className="swatch-photo" />
              <p className="swatch-name">Next colour</p>
              <p className="swatch-note"><Slot>empty, Heather adds it from the admin panel</Slot></p>
            </div>
          ))}
        </div>

        <div className="shapes">
          {baits.map((p) => (
            <article className="shape" key={p.id}>
              <div className="shape-photo">
                <Image src={p.photo} alt={`${p.shape}, ${p.colour}, photographed by H&H Baits`} fill sizes="(max-width: 700px) 100vw, 33vw" />
              </div>
              <div className="shape-body">
                <h3>{p.shape}</h3>
                <p className="shape-colour">{p.colour}</p>
                <p className="shape-price">
                  {p.price !== null ? `$${p.price.toFixed(2)}` : <Slot>price, Heather sets it</Slot>}
                </p>
                <button className="add" onClick={() => add(p.id)}>Add to bag</button>
              </div>
            </article>
          ))}
          <article className="shape ghost" aria-label="Empty product slot">
            <div className="shape-photo" />
            <div className="shape-body">
              <h3>Next shape</h3>
              <p className="shape-colour"><Slot>empty, a photo from her phone fills this</Slot></p>
            </div>
          </article>
        </div>
      </section>

      {/* 04, ships from here */}
      <section className="ships" id="ships">
        <div className="ships-head">
          <p className="index">04, ships from here</p>
          <h2>Heather packs it and ships it.</h2>
          <p className="lede">A plain checkout. Bag, address, done.</p>
        </div>

        <div className="checkout">
          <div className="bag">
            <h3>Your bag</h3>
            {lines.length === 0 ? (
              <p className="bag-empty">Nothing in the bag yet. <a href="#colour">Pick a bait.</a></p>
            ) : (
              <ul>
                {lines.map((l) => (
                  <li key={l.productId}>
                    <div className="bag-thumb"><Image src={l.product.photo} alt="" fill sizes="64px" /></div>
                    <div className="bag-text">
                      <strong>{l.product.shape}</strong>
                      <span>{l.product.colour}</span>
                    </div>
                    <div className="qty" aria-label={`Quantity of ${l.product.shape}`}>
                      <button onClick={() => setQty(l.productId, l.qty - 1)} aria-label="Fewer">&minus;</button>
                      <span>{l.qty}</span>
                      <button onClick={() => setQty(l.productId, l.qty + 1)} aria-label="More">+</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <dl className="totals">
              <div><dt>Items</dt><dd><Slot>prices, Heather sets them</Slot></dd></div>
              <div><dt>Shipping</dt><dd><Slot>rates, Heather sets them</Slot></dd></div>
              <div><dt>Payment</dt><dd><Slot>set up when the store goes live</Slot></dd></div>
            </dl>
          </div>

          {placed ? (
            <div className="done" role="status">
              <p className="index">Order {placed}</p>
              <h3>Sample order placed.</h3>
              <p>It is saved on this device only and shows up in the admin panel under orders. Nothing was sent and nothing was charged.</p>
              <div className="done-actions">
                <Link href="/admin" className="button">See it in the admin panel</Link>
                <button className="link" onClick={() => setPlaced(null)}>Start again</button>
              </div>
            </div>
          ) : (
            <form className="ship-form" onSubmit={placeOrder}>
              <label>Name<input name="name" required autoComplete="name" /></label>
              <label>Email<input name="email" type="email" required autoComplete="email" inputMode="email" /></label>
              <label>Ship to<textarea name="address" required rows={3} autoComplete="street-address" /></label>
              <button className="button" type="submit" disabled={lines.length === 0}>Place a sample order</button>
              <p className="fine">Demo only. This does not send, store or charge anything beyond this browser.</p>
            </form>
          )}
        </div>
      </section>

      {/* Merchandise, empty on purpose */}
      <section className="merch" id="merch">
        <div className="merch-photo">
          <Image src="/images/shirt.jpg" alt="A yellow t-shirt with a Catch Ya Later largemouth bass print, photographed by H&H Baits" fill sizes="(max-width: 700px) 100vw, 40vw" />
          <p className="merch-tag">Her photograph. The bass art is the shirt&rsquo;s print, not the H&amp;H Baits logo.</p>
        </div>
        <div className="merch-copy">
          <p className="index">Shirts and merchandise</p>
          <h2>&ldquo;Also we sell tshirts and merchandise with our logo.&rdquo;</h2>
          <p className="lede">One shirt has been photographed so far. The line goes here once Heather adds it.</p>
          <p><Slot>empty, waiting on the merch line and a logo file</Slot></p>
        </div>
      </section>

      {/* Contact */}
      <section className="ask" id="ask">
        <div className="ask-copy">
          <p className="index">Ask Heather</p>
          <h2>Got a question about a bait?</h2>
          <p className="lede">It lands in her admin panel with the orders.</p>
        </div>
        {asked ? (
          <div className="done" role="status">
            <h3>Saved on this device.</h3>
            <p>It shows in the admin panel under contacts. Nothing was sent.</p>
            <button className="link" onClick={() => setAsked(false)}>Ask another</button>
          </div>
        ) : (
          <form className="ask-form" onSubmit={ask}>
            <label>Name<input name="name" required autoComplete="name" /></label>
            <label>Email or phone<input name="reach" required /></label>
            <label>Question<textarea name="message" required rows={4} /></label>
            <button className="button" type="submit">Send</button>
            <p className="fine">Demo only. Saved in this browser, not sent.</p>
          </form>
        )}
      </section>

      <footer>
        <div className="foot-mark">
          <span className="mark">H&amp;H BAITS</span>
          <Slot>logo, the name set as type stands in until Heather sends a file</Slot>
        </div>
        <p>Soft fishing baits, poured by hand.</p>
        <nav aria-label="Footer">
          <a href="#colour">Shop</a>
          <a href="#ask">Ask</a>
          <Link href="/admin">Admin</Link>
        </nav>
      </footer>

      {/* Bag drawer */}
      <div className={`drawer ${drawer ? "open" : ""}`} aria-hidden={!drawer}>
        <button className="scrim" onClick={() => setDrawer(false)} aria-label="Close bag" tabIndex={drawer ? 0 : -1} />
        <aside className="drawer-panel" role="dialog" aria-label="Bag">
          <div className="drawer-head">
            <h3>Bag <span>{count}</span></h3>
            <button className="close" onClick={() => setDrawer(false)} aria-label="Close">&times;</button>
          </div>
          {lines.length === 0 ? (
            <p className="bag-empty">Nothing in the bag yet.</p>
          ) : (
            <ul>
              {lines.map((l) => (
                <li key={l.productId}>
                  <div className="bag-thumb"><Image src={l.product.photo} alt="" fill sizes="64px" /></div>
                  <div className="bag-text">
                    <strong>{l.product.shape}</strong>
                    <span>{l.product.colour}</span>
                  </div>
                  <div className="qty">
                    <button onClick={() => setQty(l.productId, l.qty - 1)} aria-label="Fewer">&minus;</button>
                    <span>{l.qty}</span>
                    <button onClick={() => setQty(l.productId, l.qty + 1)} aria-label="More">+</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="fine"><Slot>prices and shipping, Heather sets them</Slot></p>
          <a href="#ships" className="button" onClick={() => setDrawer(false)}>Go to checkout</a>
        </aside>
      </div>
    </main>
  );
}
