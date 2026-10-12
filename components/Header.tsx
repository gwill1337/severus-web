"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
    { label: "Download", href: "/download" },
    { label: "Docs", href: "/docs" },
    { label: "Security", href: "/security" },
    { label: "GitHub", href: "https://github.com/gwill1337/Severus" },
];

const button = "font-semibold text-base hover text-white/80 hover:text-[#4ADE80] transition-colors duration-300 cursor-pointer relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#4ADE80]  after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
export function Header() {
    const [open, setOpen] = useState(false);
    return (
        <header className="py-1 sticky top-0 z-50 w-full bg-[#050505]/40 backdrop-blur-md shadow-md">
            <div className="flex items-center py-1">
                <Link href="/" className="font-sans font-semibold tracking-widest text-white text-xl sm:text-3xl px-2 ml-3 md:ml-10">
                    Severus
                </Link>
                <div className="absolute right-5 md:right-10">
                    <nav className="hidden md:flex gap-7">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => <Link href={link.href} />}
                                className={button}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    <button
                        className="text-white/90 transition-colors duration-300 cursor-pointer md:hidden"
                        onClick={() => setOpen((v) => !v)}
                        aria-label="Menu"
                        aria-expanded={open}
                    >
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {open && (
                    <>
                        <div className="fixed inset-0 -z-10 md:hidden" onClick={() => setOpen(false)} />
                        <nav className="md:hidden absolute right-3 top-full mt-2 w-44 rounded-xl border border-border bg-card/90 backdrop-blur-md shadow-lg p-2">
                            <nav className="flex flex-col items-start gap-1">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => {
                                            setOpen(false);
                                        }}
                                        className="w-full px-3 py-1.5 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-black/10 dark:hover:bg-white/10 transition"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </nav>
                        </nav>
                    </>
                )}
            </div>
        </header>
    );
}