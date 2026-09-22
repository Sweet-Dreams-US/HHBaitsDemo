"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CartLine, Collection, Product, store } from "../../lib/store";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [ready, setReady] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setProducts(store.products());
    setCollections(store.collections());
    setReady(true);
  }, []);

  const product = products.find((p) => p.id === params.id);

  function add() {
    if (!product) return;
    const cart: CartLine[] = store.cart();
    const line = cart.find((l) => l.productId === product.id);
    store.saveCart(line ? cart.map((l) => (l.productId === product.id ? { ...l, qty: l.qty + 1 } : l)) : [...cart, { productId: product.id, qty: 1 }]);
    setAdded(true);
  }

  if (!ready) return <main className="product-page" />;

  if (!product) {
    return (
      <main className="product-page">
        <div className="demo-bar">
          <span>Sweet Dreams demo for H&amp;H Baits. Nothing here is live.</span>
          <Link href="/admin">Open the admin panel</Link>
        </div>
        <div className="product-wrap">
          <p className="index">Not found</p>
          <h1>That product is not here.</h1>
          <Link className="button" href="/">Back to the site</Link>
        </div>
      </main>
    );
  }

  const mine = collections.filter((c) => product.collections.includes(c.id));
  const suggested = products
    .filter((p) => p.published && p.id !== product.id && p.collections.some((c) => product.collections.includes(c)))
    .slice(0, 3);

  return (
    <main className="product-page">
      <div className="demo-bar">
        <span>Sweet Dreams demo for H&amp;H Baits. Nothing here is live.</span>
        <Link href="/admin">Open the admin panel</Link>
      </div>

      <div className="product-wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">H&amp;H Baits</Link>
          {mine[0] && <Link href={mine[0].ownPage ? `/collection/${mine[0].slug}` : "/#colour"}>{mine[0].name}</Link>}
          <span>{product.shape}</span>
        </nav>

        <div className="product-main">
          <div className="hero-photo">
            {product.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.photo} alt={`${product.shape}, ${product.colour}`} />
            ) : (
              <span className="slot">photo to come</span>
            )}
          </div>

          <div className="product-body">
            <h1>{product.shape}</h1>
            <p className="product-colour">{product.colour}</p>

            <p className="item-line"><span>Price</span><span className="leader" />{product.price !== null ? <span>${product.price.toFixed(2)}</span> : <span className="slot">to be set</span>}</p>
            <p className="item-line">
              <span>In stock</span><span className="leader" />
              {product.count === null ? <span className="slot">count to be set</span> : <span>{product.count > 0 ? `${product.count} ready to ship` : "Sold out"}</span>}
            </p>
            {product.collections.includes("merch") && (
              <p className="item-line"><span>Size</span><span className="leader" /><span className="slot">sizes to be set</span></p>
            )}

            <button className="button" onClick={add} disabled={product.count === 0}>
              {added ? "In your bag" : product.count === 0 ? "Sold out" : "Add to bag"}
            </button>
            {added && <Link className="link" href="/#ships">Go to checkout</Link>}

            {mine.length > 0 && (
              <div className="product-tags">
                <p className="slip-title">Collections</p>
                <div className="tag-row">
                  {mine.map((c) =>
                    c.ownPage ? (
                      <Link className="tag" key={c.id} href={`/collection/${c.slug}`}>{c.name}</Link>
                    ) : (
                      <span className="tag flat" key={c.id}>{c.name}</span>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {suggested.length > 0 && (
          <section className="also">
            <p className="slip-title">Also in these collections</p>
            <div className="also-grid">
              {suggested.map((p) => (
                <Link className="also-item" key={p.id} href={`/product/${p.id}`}>
                  <div className="also-photo">
                    {p.photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.photo} alt="" />
                    )}
                  </div>
                  <h3>{p.shape}</h3>
                  <p>{p.colour}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="also">
          <p className="slip-title">Browse</p>
          <div className="tag-row">
            {collections.filter((c) => c.ownPage).map((c) => (
              <Link className="tag" key={c.id} href={`/collection/${c.slug}`}>{c.name}</Link>
            ))}
            <Link className="tag" href="/">Everything</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
