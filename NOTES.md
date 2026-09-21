# Notes, H&H Baits rework

## What the research found

Nothing was on file for fishing and outdoor gear, so this is the first write up. Looked at Obee Fishing Co, Lakebound Baits, Get Bit Baits and Zoom Bait Company, all soft plastic makers, the first three hand pour.

- The first screen is always one line about hand pouring plus a shop button, then straight into products. No lifestyle photography leads.
- The shop is keyed shape first then colour. A shape page lists "20+ colors" and every colour is its own photographed row. Colour is the unit of sale.
- Prices are per pack with a unit price beside them, typically two to six dollars a pack. Not used here, no price was ever said.
- Every one carries reviews, a "why us" strip and an email signup. Reviews are not built here, they would be invented.
- Small batch "custom colour runs" is a recurring section. It maps onto the empty swatches on this site, which is what Heather actually has.
- Mobile is a plain Shopify pattern, product grid two up, cart drawer, native checkout. That is what was built, plain on purpose.

Sources: obeebaits.com, lakeboundbaits.com, getbitbaits.com, zoombait.com. Words, prices and layouts were not taken.

## What was sourced from the open web

Nothing on the page. The fonts (Alfa Slab One, Sometype Mono, Permanent Marker) are open licence and self hosted at build time through next/font. GSAP, ScrollTrigger and Lenis are vendored from their npm packages into `public/vendor/`.

## What is a labelled empty slot

Fourteen on the public page, listed in SAMPLE-CONTENT.md: five next colours, one next shape, three prices, items total, shipping, payment, the merch line, the logo. Each reads in the handwritten marker with what it waits for.

## What is labelled sample content

Four blocks, all in the admin panel: three sample orders and one sample contact, each marked "sample, we will swap this for yours". Nothing on the public page is sample.

## What was not done and why

- Higgsfield was not used. DIRECTION.md allowed at most two surround textures behind headlines below the film. The tub white and the deep olive from her photos carried the sections without them, and every generated element is one more thing to explain to her.
- `20260917_18403.jpg` was not opened, copied or referenced. It is excluded in `.gitignore` and `.vercelignore`.
- The scent bottle in `20260914_21428.jpg` was cropped out of frame. The card shows the worms above it only.
- No Square, no card brands, no payment method named anywhere. The payment line is an empty slot.
- No Facebook or social link. Two searches did not find her page.

## After Cole's first look

Fonts swapped for faces with character (slab, mono, marker). Every sentence of ours that named the owner or explained the idea was cut, the page now carries her two quotes, section names and slot markers. The back half was rebuilt away from cards and columns: tubs from above, full bleed photo strips with the shape name overlapping the photograph, a packing slip for checkout, one shirt strip, questions in the footer.

Second look: the media was too large. The hand reveal is now a porthole instead of the whole stage, the shape photographs are inset at about half width and alternate sides with tub white around them, and the shirt is inset. Every photograph now has air around it.

## Unsure about

- The three shapes are described from what is visible in her photographs (stick worm, ribbon tail worm, creature bait). They are descriptions, not her product names. If she calls them something else the admin panel renames them in a minute.
- "Silver flake" is described because it is visibly in the 18409 photo. If it is actually a different flake she corrects the colour line in admin.
- The mobile wordmark is width bound, so the letters sit smaller on a phone than on desktop and the beats live above and below. A rotated or three line treatment would make them bigger but would make her name harder to read on the first screen, so upright was kept.
- The merch line is shown once, honestly, with her quote. If she confirms it is a line, it becomes a second collection in admin, which already exists as an option.
