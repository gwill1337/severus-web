import Link from "next/link";
import type { ReactNode } from "react";

type TocItem = { id: string; label: string };

export function DocPage({
  title,
  intro,
  toc,
  children,
}: {
  title: string;
  intro: string;
  toc: TocItem[];
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 leading-relaxed text-[#aab2b8]">
      <Link
        href="/"
        className="text-sm text-[#7d868c] transition-colors hover:text-green-400 focus-visible:text-green-400"
      >
        ← Severus
      </Link>

      <h1 className="mt-8 text-4xl font-semibold tracking-wide text-white">
        {title}
      </h1>
      <p className="mt-4 text-lg">{intro}</p>

      <nav
        aria-label="On this page"
        className="mt-8 rounded-lg border border-white/10 p-4"
      >
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {toc.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-[#aab2b8] transition-colors hover:text-green-400 focus-visible:text-green-400"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {children}
    </main>
  );
}

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-14 mb-4 scroll-mt-24 text-2xl font-semibold text-green-400"
    >
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-8 mb-2 text-lg font-medium text-[#e4e8ea]">{children}</h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="my-4">{children}</p>;
}

export function B({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-[#e4e8ea]">{children}</strong>;
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-[#e4e8ea]">
      {children}
    </code>
  );
}

export function Pre({ children }: { children: string }) {
  return (
    <pre className="my-4 overflow-x-auto rounded-lg border border-white/10 bg-white/5 p-4 font-mono text-sm text-[#e4e8ea]">
      {children}
    </pre>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="my-4 list-disc space-y-2 pl-6">{children}</ul>;
}

export function OL({ children }: { children: ReactNode }) {
  return <ol className="my-4 list-decimal space-y-2 pl-6">{children}</ol>;
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  const className =
    "text-green-400 underline underline-offset-4 hover:text-green-300 focus-visible:text-green-300";

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full min-w-136 text-left text-sm">
        <thead className="bg-white/5 text-[#e4e8ea]">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-white/10 align-top">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}