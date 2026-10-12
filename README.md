# Severus — Website

Official website for **Severus**, a peer-to-peer chat with end-to-end encryption (Noise XX) and TLS. No accounts, no cloud, no message history.

The site consists of a landing page, a download page, documentation and a security page.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS
- Fonts via `next/font/google`: Inter, Manrope, Geist Mono
- Deployed on Vercel

## Routes

| Route       | Description                                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `/`         | Landing page: hero with a "Try web client" button, security explainer, web client demo, "Try Severus now" CTA |
| `/download` | Download buttons for Windows, Linux and macOS                                                                    |
| `/docs`     | Documentation: install, host a server, connect as a client, whispers and rooms, verify your contact, connection status, troubleshooting |
| `/security` | Security page (linked from the header)                                                                           |

The header also contains an external link to the project's GitHub repository.

### Landing page sections (`/`)

1. **Hero** — project name, tagline and a "Try web client" button.
2. **How Severus secures your data** — interactive diagram of the two encryption layers: Layer 1 (E2EE, Noise XX) and Layer 2 (TLS transport), shown along the path Client A → ISP / Internet → Client B.
3. **Web client demo** — a demo of the client's connect screen with two connection modes: `Direct` and `QUIC / Iroh`.
4. **CTA** — "Try Severus now" with Download and GitHub buttons.

## Metadata & SEO

Global metadata is defined in `app/layout.tsx` via the Next.js Metadata API and applies to all pages.

| Field               | Value                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------- |
| `metadataBase`      | `https://severus-gwill1337.vercel.app` (`SITE_URL` constant)                           |
| `title.default`     | `Severus — Private P2P Chat with End-to-End Encryption`                                |
| `title.template`    | `%s \| Severus` — pages that set their own `title` get this suffix automatically       |
| `description`       | Shared `DESCRIPTION` constant, reused in Open Graph and Twitter                        |
| `applicationName`   | `Severus`                                                                              |
| `keywords`          | encrypted chat, P2P messenger, end-to-end encryption, Noise Protocol, QUIC, decentralized chat, private messenger, Tauri, Rust |
| `authors`           | gwill1337                                                                              |
| `alternates.canonical` | `/` (resolved against `metadataBase`)                                               |
| `category`          | `technology`                                                                           |

### Open Graph & Twitter

- Open Graph: `type: website`, `siteName: Severus`, locale `en_US`.
- Twitter: `summary_large_image` card.
- Both use the same preview image: `/og-image.png` (1200×630). The file must exist in `public/`.

### Robots

Indexing and following are enabled for all crawlers. For Googlebot, `max-image-preview` is `large` and `max-snippet` / `max-video-preview` are unlimited (`-1`).

### Viewport

```ts
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
```

### Per-page metadata

To set a title or description for a specific page, export `metadata` from its `page.tsx`:

```ts
export const metadata: Metadata = {
  title: "Docs", // renders as "Docs | Severus"
  description: "How to install, host and connect with Severus.",
};
```

## Layout

`app/layout.tsx` is the root layout. It:

- connects the fonts and exposes them as CSS variables (`--font-sans`, `--font-manrope-sans`, `--font-geist-mono`);
- wraps every page in `<Header />`, `<main>` and `<Footer />`;
- uses a dark background (`#050505`) and a full-height flex column so the footer stays at the bottom.

## Deployment

The project is deployed to Vercel. If you change the domain, update the `SITE_URL` constant in `app/layout.tsx` — it affects the canonical URL and Open Graph links.

## License

All rights reserved © 2026 Gwill1337.