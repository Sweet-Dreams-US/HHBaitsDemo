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
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    setProducts(store.products());
    setCart(store.cart());
    setOrderCount(store.orders().length);
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
    setOrderCount(store.orders().length);
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
            <a href="#colour" className="top-link">Baits</a>
            {bagButton}
          </>
        }
      />

      {/* 03, the colour. Tubs from above, then each shape as a strip. */}
      <section className="baits" id="colour">
        <div className="section-head">
          <p className="index">03</p>
          <h2>Baits</h2>
        </div>

        <div className="tubs" role="list" aria-label="Colours">
          <div className="tub real" role="listitem">
            <div className="tub-photo">
              <Image src="/images/swatch.jpg" alt="Green pumpkin soft plastic with gold, silver and red flake, in the tub" fill sizes="(max-width: 700px) 42vw, 18vw" />
            </div>
            <p className="tub-name">Green pumpkin, gold, silver and red flake</p>
          </div>
          {[1, 2, 3, 4, 5].map((n) => (
            <div className="tub empty" role="listitem" key={n}>
              <div className="tub-photo" />
              <p className="tub-name"><Slot>next colour</Slot></p>
            </div>
          ))}
        </div>

        <div className="strips">
          {baits.map((p, i) => (
            <article className="strip" key={p.id}>
              <div className="strip-photo">
                <Image src={p.photo} alt={`${p.shape}, ${p.colour}`} fill sizes="100vw" />
              </div>
              <h3 className="strip-name"><span>{String(i + 1).padStart(2, "0")}</span>{p.shape}</h3>
              <div className="strip-meta">
                <p>{p.colour}</p>
                <p className="strip-price">{p.price !== null ? `$${p.price.toFixed(2)}` : <Slot>price to be set</Slot>}</p>
                <button className="add" onClick={() => add(p.id)}>Add to bag</button>
              </div>
            </article>
          ))}
          <article className="strip ghost" aria-label="Empty product slot">
            <div className="strip-photo" />
            <h3 className="strip-name"><span>{String(baits.length + 1).padStart(2, "0")}</span><Slot>next shape</Slot></h3>
          </article>
        </div>
      </section>

      {/* 04, ships from here. A packing slip. */}
      <section className="slip" id="ships">
        <div className="section-head">
          <p className="index">04</p>
          <h2>Checkout</h2>
        </div>

        <div className="slip-body">
          <div className="slip-paper">
            <p className="slip-title">Packing slip</p>
            <p className="slip-line"><span>From</span><span className="leader" /><span>H&amp;H Baits</span></p>
            <p className="slip-line"><span>Order</span><span className="leader" /><span>{`HH-${1000 + orderCount + 1}`}</span></p>
            <div className="slip-items">
              {lines.length === 0 ? (
                <p className="slip-line"><span>Bag</span><span className="leader" /><span>empty</span></p>
              ) : (
                lines.map((l) => (
                  <div className="slip-item" key={l.productId}>
                    <p className="slip-line"><span>{l.product.shape}</span><span className="leader" /><span>&times; {l.qty}</span></p>
                    <p className="slip-sub">{l.product.colour}</p>
                    <div className="qty" aria-label={`Quantity of ${l.product.shape}`}>
                      <button onClick={() => setQty(l.productId, l.qty - 1)} aria-label="Fewer">&minus;</button>
                      <span>{l.qty}</span>
                      <button onClick={() => setQty(l.productId, l.qty + 1)} aria-label="More">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <p className="slip-line"><span>Items</span><span className="leader" /><Slot>prices to be set</Slot></p>
            <p className="slip-line"><span>Shipping</span><span className="leader" /><Slot>rate to be set</Slot></p>
            <p className="slip-line"><span>Payment</span><span className="leader" /><Slot>to be set up</Slot></p>
          </div>

          {placed ? (
            <div className="done" role="status">
              <p className="index">Order {placed}</p>
              <p>Sample order saved on this device. It shows in the admin panel under orders. Nothing was sent or charged.</p>
              <div className="done-actions">
                <Link href="/admin" className="button">Open the admin panel</Link>
                <button className="link" onClick={() => setPlaced(null)}>Start again</button>
              </div>
            </div>
          ) : (
            <form className="ship-form" onSubmit={placeOrder}>
              <p className="slip-title">Ship to</p>
              <label>Name<input name="name" required autoComplete="name" /></label>
              <label>Email<input name="email" type="email" required autoComplete="email" inputMode="email" /></label>
              <label>Address<textarea name="address" required rows={3} autoComplete="street-address" /></label>
              <button className="button" type="submit" disabled={lines.length === 0}>Place a sample order</button>
              <p className="fine">Demo. Saved in this browser only. Nothing is sent or charged.</p>
            </form>
          )}
        </div>
      </section>

      {/* Shirts, one photo, her words */}
      <section className="shirts" id="merch">
        <div className="shirt-photo">
          <Image src="/images/shirt.jpg" alt="A yellow t-shirt with a Catch Ya Later largemouth bass print" fill sizes="100vw" />
        </div>
        <div className="shirt-copy">
          <p className="index">Shirts</p>
          <p className="shirt-quote">&ldquo;Also we sell tshirts and merchandise with our logo.&rdquo;</p>
          <p><Slot>shirts to be added. The bass print is the shirt&rsquo;s art, not the logo</Slot></p>
        </div>
      </section>

      <footer>
        <div className="foot-row">
          <div className="foot-mark">
            <span className="mark">H&amp;H BAITS</span>
            <Slot>logo to come, the name set as type until then</Slot>
          </div>
          {asked ? (
            <div className="done small" role="status">
              <p>Saved on this device. It shows in the admin panel under contacts.</p>
              <button className="link" onClick={() => setAsked(false)}>Ask another</button>
            </div>
          ) : (
            <form className="ask-form" onSubmit={ask} id="ask">
              <p className="slip-title">Questions</p>
              <label>Name<input name="name" required autoComplete="name" /></label>
              <label>Email or phone<input name="reach" required /></label>
              <label>Question<textarea name="message" required rows={3} /></label>
              <button className="button" type="submit">Send</button>
              <p className="fine">Demo. Saved in this browser, not sent.</p>
            </form>
          )}
        </div>
        <nav aria-label="Footer">
          <a href="#colour">Baits</a>
          <a href="#ships">Checkout</a>
          <a href="#ask">Questions</a>
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
            <p className="bag-empty">Bag is empty.</p>
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
          <p className="fine"><Slot>prices and shipping to be set</Slot></p>
          <a href="#ships" className="button" onClick={() => setDrawer(false)}>Go to checkout</a>
        </aside>
      </div>
    </main>
  );
}
