// Local demo data. There is no database. Everything the public page or the
// admin panel changes lives in this browser only, under the keys below.

export type Product = {
  id: string;
  shape: string; // what is visibly in the photograph, not a product name
  colour: string; // a description of the plastic, not a colour name
  photo: string; // path under /images, or a data URL when she adds one in admin
  price: number | null; // null until she sets it. No dollar figure was ever said.
  count: number | null; // null until she sets it
  collection: "baits" | "merch";
  published: boolean;
  real: boolean; // true when the photograph is hers
};

export type CartLine = { productId: string; qty: number };

export type Order = {
  id: string;
  placedAt: string;
  name: string;
  email: string;
  address: string;
  lines: { shape: string; colour: string; qty: number }[];
  status: "new" | "packed" | "shipped";
  sample: boolean;
};

export type Contact = {
  id: string;
  receivedAt: string;
  name: string;
  reach: string;
  message: string;
  sample: boolean;
};

// The three real items. Every one is a photograph she sent. Price and count
// are empty on purpose: she sets them in the admin panel on day one.
export const realProducts: Product[] = [
  {
    id: "stick-worm",
    shape: "Stick worm",
    colour: "Green pumpkin, gold and red flake",
    photo: "/images/worms.jpg",
    price: null,
    count: null,
    collection: "baits",
    published: true,
    real: true,
  },
  {
    id: "ribbon-tail",
    shape: "Ribbon tail worm",
    colour: "Green pumpkin, gold, silver and red flake",
    photo: "/images/swatch.jpg",
    price: null,
    count: null,
    collection: "baits",
    published: true,
    real: true,
  },
  {
    id: "creature",
    shape: "Creature bait",
    colour: "Green pumpkin, gold, silver and red flake",
    photo: "/images/creature.jpg",
    price: null,
    count: null,
    collection: "baits",
    published: true,
    real: true,
  },
  {
    id: "tee",
    shape: "T-shirt, Catch Ya Later bass print",
    colour: "Yellow",
    photo: "/images/shirt.jpg",
    price: null,
    count: null,
    collection: "merch",
    published: false,
    real: true,
  },
];

// Sample rows for the admin panel so Heather can see how a day looks.
// Names are placeholders and every row is flagged sample.
export const sampleOrders: Order[] = [
  {
    id: "HH-1001",
    placedAt: "2026-09-19T08:12:00",
    name: "Sample customer one",
    email: "sample@example.com",
    address: "Sample address, city, state",
    lines: [{ shape: "Stick worm", colour: "Green pumpkin, gold and red flake", qty: 2 }],
    status: "shipped",
    sample: true,
  },
  {
    id: "HH-1002",
    placedAt: "2026-09-20T17:40:00",
    name: "Sample customer two",
    email: "sample@example.com",
    address: "Sample address, city, state",
    lines: [
      { shape: "Creature bait", colour: "Green pumpkin, gold, silver and red flake", qty: 1 },
      { shape: "Ribbon tail worm", colour: "Green pumpkin, gold, silver and red flake", qty: 1 },
    ],
    status: "packed",
    sample: true,
  },
  {
    id: "HH-1003",
    placedAt: "2026-09-21T09:05:00",
    name: "Sample customer three",
    email: "sample@example.com",
    address: "Sample address, city, state",
    lines: [{ shape: "Stick worm", colour: "Green pumpkin, gold and red flake", qty: 3 }],
    status: "new",
    sample: true,
  },
];

export const sampleContacts: Contact[] = [
  {
    id: "C-1",
    receivedAt: "2026-09-20T12:30:00",
    name: "Sample contact",
    reach: "sample@example.com",
    message: "Do you pour any other colours? Sample message.",
    sample: true,
  },
];

const KEYS = {
  products: "hh.products",
  orders: "hh.orders",
  contacts: "hh.contacts",
  cart: "hh.cart",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage may be blocked in private windows, the page still works
  }
}

export const store = {
  products: () => read<Product[]>(KEYS.products, realProducts),
  saveProducts: (p: Product[]) => write(KEYS.products, p),
  orders: () => read<Order[]>(KEYS.orders, sampleOrders),
  saveOrders: (o: Order[]) => write(KEYS.orders, o),
  contacts: () => read<Contact[]>(KEYS.contacts, sampleContacts),
  saveContacts: (c: Contact[]) => write(KEYS.contacts, c),
  cart: () => read<CartLine[]>(KEYS.cart, []),
  saveCart: (c: CartLine[]) => write(KEYS.cart, c),
  reset: () => {
    Object.values(KEYS).forEach((k) => {
      try {
        window.localStorage.removeItem(k);
      } catch {
        // ignore
      }
    });
  },
};

export function money(price: number | null) {
  return price === null ? null : `$${price.toFixed(2)}`;
}

export function when(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
