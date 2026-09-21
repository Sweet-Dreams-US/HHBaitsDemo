# Plan, H&H Baits rework

## The idea in one sentence

Her name is set as heavy type and used as a mould, and as you scroll her own photograph of green pumpkin plastic pours up inside the letters until they are solid with gold, silver and red flake, then her hand lifts one bait clear and the page opens into a colour first store she runs from her phone.

## What changed and why

Nothing on the first demo was rejected. On 17 September Heather texted three photographs with no words. Two of them, the tub of poured worms and her hand lifting a creature bait out of the batch, are far better than anything the first build had. The rework builds the product story on those two photographs. Structure that worked is kept (demo bar, one page, a real bait section, a merch example kept honest, a contact form, a working admin). The thin parts are replaced (a generic hero, a decorative flake graphic, an interest form standing in for a store).

## Palette, sampled from her photographs

| Token | Hex | Where |
| --- | --- | --- |
| plastic | #3f4328 | buttons, headings on the checkout band, the dominant olive in the pour |
| plastic-2 | #585c36 | index labels, secondary text, the lighter olive of the ribbon tails |
| plastic-deep | #22251a | the ships band, admin sidebar |
| gold | #cbb64a | flake accents, admin active state, checkout button |
| red | #b4463c | flake red, the empty slot and sample markers |
| tub | #f1f2ec | page background, the white tub |
| tub-blue | #dfe5ee | merch band, the bluish tub in the hand photo |
| mould | #dcdfd4 | the empty letterforms before the pour, empty swatches |
| ink | #1d1f16 | body text, demo bar, footer |

## Type

Three faces, three jobs, all self hosted through next/font at build time, nothing from a CDN at runtime.

- Display: Archivo Black 400. The wordmark in the canvas, section headings, product names. Heavy with big counters so the photograph reads inside the letters.
- Body: Instrument Sans 400, 500, 600. 17px body, 18px lede, 13px uppercase index labels, 16px inputs so iOS does not zoom.
- Accent: Caveat 500. Only for the empty slot markers, the sample row markers, the scroll hint and the attribution under her quote.

Scale: h2 clamp(28px, 6.4vw, 54px), h3 20px, beat quote clamp(19px, 4.8vw, 27px), wordmark computed per viewport by the canvas.

## Sections, in order

1. Demo bar. States it is a Sweet Dreams demo and links to the admin panel.
2. The film, four beats on one scroll progress, CSS sticky stage, ScrollTrigger progress, Lenis smoothing, both vendored in `public/vendor/`.
   - 01, the tub. The empty mould fills with `pour.jpg` (her 18409). Her line "We just do soft baits, fishing baits." in the clear band under the letters.
   - 02, poured, not bought. `hand.jpg` (her 18410) crossfades inside the letters, then reveals outward from the bait she is holding until it covers the stage. No caption beyond the beat index.
   - 03, the colour. The pin releases and the catalogue scrolls over.
   - 04, ships from here. Bag and checkout.
3. The colour. One real swatch from her photograph plus five labelled empty swatches, then the three shapes visible in her photographs as products, each with a labelled empty price slot, plus one labelled empty product slot. Industry pattern: every hand pour brand keys the shop by shape then colour.
4. Ships from here. Bag, native inputs for name, email and ship to, three labelled empty slots (prices, shipping, payment), a sample order that lands in the admin panel. Industry pattern: plain Shopify style cart, nothing clever.
5. Shirts and merchandise. Her shirt photo, her line about merch, one labelled empty slot. The bass art is captioned as the shirt's print, not the logo.
6. Ask Heather. Contact form that lands in the admin panel.
7. Footer. Name set as type with a labelled empty logo slot. No address, phone, hours, social.

## Media plan

Every photograph is hers. Nothing is generated.

- `public/images/pour.jpg` from `20260917_18409_conv.jpg`, the fill for the letters.
- `public/images/hand.jpg` from `20260917_18410_conv.jpg`, the second fill and the reveal.
- `public/images/swatch.jpg` a centre crop of 18409, the colour swatch and the ribbon tail card.
- `public/images/creature.jpg` a crop of 18410 around the bait, the creature bait card.
- `public/images/worms.jpg` the top band of `20260914_21428.jpg`, cropped so the third party scent bottle is out of frame, the stick worm card.
- `public/images/shirt.jpg` from `20260914_19656.jpg`, merchandise only.
- `20260917_18403.jpg` is not copied, referenced or shown. It is a child on a boat and Cole has to ask her first.

Higgsfield: not used. DIRECTION.md says it is close to unnecessary here and that is a good sign. The two allowed surround textures were not needed once the sections took the tub white and the deep olive from her photos.

## Mobile

Written first at 375. The stage is 100svh, the wordmark stacks on two lines and is width bound, so the letters sit smaller than on desktop and the beats live above and below them. The hand reveal covers the full stage. Swatches go two up, shapes one up, checkout stacks bag over form, the drawer is full width. Body never exceeds 100vw, `overflow-x: clip` so sticky still works. Checked at 320, 375, 390 and 430 with no horizontal scroll. Reduced motion: no pin, letters drawn already full, the hand shown as a plain figure below.

## Admin panel, for this owner

Cole promised on the call: see all orders, see anyone who contacted her, add or update products, collections and inventory without him. Built as the real product entry:

- Orders. Sample rows plus any sample order placed on the site. Status new, packed, shipped. A labelled empty slot for the shipping label.
- Contacts. Sample row plus anything from the ask form.
- Products. Shape or name, colour, price, count, collection (baits or merch), published toggle, photo from her phone (file input with preview). Published items appear on the site immediately. The three real items ship with price and count empty.
- Inventory. Counts per product.
- One Enter button, no passcode. Reset demo button. Everything in localStorage, nothing sent.
