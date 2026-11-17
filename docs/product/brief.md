# Product brief

Who the product is for and what it does for them: segments, value propositions, jobs to be
done and use cases. Read it before planning a phase or a stage, and when judging whether a
change serves anyone. The product section of `AGENTS.md` keeps the one-paragraph summary,
the users in one line each, who can do what, scope and the data invariants; this file holds
the depth behind them and restates none of them.

Research, sources and the screen options: `proposal.html`. Every claim below is traceable
to it; nothing here is newer than that artifact except where dated.

## Segments

- **Portfolio operators running 3–30 affiliate sites — the first customer.** They already
  pay $25–128/month for sites, tools or blogs (S11, S19), decide in an evening with a card,
  and hold their own Amazon Associates and eBay Partner Network accounts.
- **First-time builders** — a larger market that churns before the first commission and
  compares the price to $0. Served by the same build, not by a cheaper one.
- **Small agencies** — the highest willingness to pay, but they want white-label, roles and
  SLAs before a first version is worth showing (direction C, v3).
- **The reader** — a stranger who lands on a generated store from search, reads on a phone,
  and clicks an affiliate link or leaves. Never signs up, never pays, always the reason the
  store has to be worth reading.

The payer is the operator. The reader is never the customer and never identified.

## Value propositions

- **For the operator:** a store whose look and code are theirs, built in a day, instead of
  a $10/month site that looks like every other site on the network (the incumbent's own
  customers complain about exactly this, S19). Against WordPress plus plugins they get no
  maintenance and no theme decisions; against an agency build they get it for $299 rather
  than $2,000–8,000, and against doing nothing they get price history pages that a rival
  cannot copy from a template.
- **For the reader:** a straight answer with a dated price, the method behind the ranking
  and a visible disclosure, instead of a listicle of links (the shape of the site the brief
  arrived with).
- **For the operator's accountant:** a build fee and a small caretaker fee, no revenue
  share, no credential handed over.

## Jobs to be done

1. *When I have spare budget and no new niche, I want someone to find a niche with real
   search volume and weak rivals, so I don't spend a month on a site that cannot rank.*
2. *When I know the niche, I want to see whether the commission per sale covers the work,
   so I pick products by margin, not by enthusiasm.*
3. *When I have the niche, I want a store that looks like a publication rather than a
   template, so people link to it and Google treats it as one site, not one of thirty.*
4. *When prices change, I want the pages to stay true without me editing thirty sites, so
   the store keeps converting while I sleep.*
5. *When a merchant API is gated, I want the store to degrade honestly, so it never shows a
   price it cannot prove.*
6. *When I have thirty stores, I want one screen that tells me which one needs me today.*
7. *When I sell a store or stop paying, I want the code to be mine, so nothing I built walks
   out with a vendor.*
8. *When a reader arrives on a phone, I want the disclosure and the choice clear in one
   screen, so the click is compliant and the reader is not tricked.*

## Use cases

Numbered, end to end; other documents point here by number.

- **UC1 — Start.** An operator signs up, names a workspace and lands on `/stores` with one
  seeded example store marked *sample data*, so the product is legible before any credential
  is entered.
- **UC2 — Niche.** The operator asks for a niche ("resin printers for miniature painters");
  the Scout agent researches for a few minutes and returns a brief: US search volume,
  commission per sale, established rivals, the argument, and evidence lines each carrying a
  source and a date. The operator accepts it, rejects it, or asks for another angle; the
  brief is stored with its evidence, not as chat.
- **UC3 — Look.** The operator sees three storefronts rendered from the brief — not theme
  thumbnails — and picks one. The pick is stored against the store; the other two are
  discarded.
- **UC4 — Offers.** The Broker agent searches the connected networks for products in the
  niche and returns a catalogue ordered by commission per sale, with each merchant's state
  (live, gated, no feed) and each product's affiliate link. The operator removes products
  and reorders; approval freezes the catalogue the store is built from.
- **UC5 — The gate.** A merchant whose API is gated (Amazon, until the operator's own
  account has 10 qualifying sales in 30 days) is offered as a *link with a price gate*: the
  store renders "check current price at Amazon" and never a number. When the operator
  reports the gate open, the same products start showing stamped prices on the next
  refresh — with no rebuild.
- **UC6 — Build.** The operator presses Build; the Mason agent writes the storefront, pushes
  it to a repository in the operator's own GitHub account, deploys it to their Vercel
  account, and returns the live URL, the repository URL and the commit. Every generated
  page carries the affiliate disclosure above the first link, the method page and its
  sources, and a sitemap.
- **UC7 — Caretaker.** Every night the store's prices, offers and links are refreshed; a
  dead link becomes a visible state on the page, never a silent 404; the operator gets one
  line per change that mattered and nothing when nothing changed.
- **UC8 — Portfolio.** The operator's `/stores` shows every store, its last refresh, its
  open gates, its dead links and what needs them today, in one screen.
- **UC9 — Reader.** A stranger opens a generated store from search on a phone, reads a
  comparison, sees the disclosure before the first link, taps through to the merchant, and
  the outbound click is recorded as a referral by our redirect (which stores no personal
  data beyond network, store, product and time).
- **UC10 — Leaving.** The operator deletes their account: credentials and workspace data are
  deleted; the repositories and deployments in their own accounts stay, because they were
  never ours.

## What the product deliberately does not do

Selling the operator's own products (D4), hosting stores on our domain (D1 option A),
managing the operator's affiliate accounts, and writing content for stores after the build
beyond price and offer refresh.
