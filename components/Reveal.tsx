"use client";

import { useInView } from "../hooks/useInView";

export function Reveal({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { ref, isInView } = useInView<HTMLDivElement>(0.15);

    return (
        <div
            ref={ref}
            className={`${className} ${isInView ? "animate-fade-in" : "opacity-0"}`}
        >
            {children}
        </div>
    );
}