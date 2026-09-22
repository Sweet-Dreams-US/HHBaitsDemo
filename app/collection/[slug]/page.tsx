"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Collection, Product, store } from "../../lib/store";

export default function CollectionPage() {
  const params = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProducts(store.products());
    setCollections(store.collections());
    setReady(true);
  }, []);

  if (!ready) return <main className="product-page" />;

  const collection = collections.find((c) => c.slug === params.slug);
  const items = collection ? products.filter((p) => p.published && p.collections.includes(collection.id)) : [];
  const others = collections.filter((c) => c.ownPage && c.slug !== params.slug);

  return (
    <main className="product-page">
      <div className="demo-bar">
        <span>Sweet Dreams demo for H&amp;H Baits. Nothing here is live.</span>
        <Link href="/admin">Open the admin panel</Link>
      </div>

      <div className="product-wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">H&amp;H Baits</Link>
          <span>{collection ? collection.name : "Not found"}</span>
        </nav>

        {!collection ? (
          <>
            <h1>That collection is not here.</h1>
            <Link className="button" href="/">Back to the site</Link>
          </>
        ) : (
          <>
            <h1 className="collection-title">{collection.name}</h1>
            {collection.blurb && <p className="lede">{collection.blurb}</p>}

            {items.length === 0 ? (
              <p className="slot">nothing published in this collection yet</p>
            ) : (
              <div className="also-grid wide">
                {items.map((p) => (
                  <Link className="also-item" key={p.id} href={`/product/${p.id}`}>
                    <div className="also-photo">
                      {p.photo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.photo} alt="" />
                      )}
                    </div>
                    <h3>{p.shape}</h3>
                    <p>{p.colour}</p>
                    <p className="also-price">{p.price !== null ? `$${p.price.toFixed(2)}` : <span className="slot">price to be set</span>}</p>
                  </Link>
                ))}
              </div>
            )}

            <section className="also">
              <p className="slip-title">Other collections</p>
              <div className="tag-row">
                {others.map((c) => (
                  <Link className="tag" key={c.id} href={`/collection/${c.slug}`}>{c.name}</Link>
                ))}
                <Link className="tag" href="/">Everything</Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
