import { ArrowDown } from "@/components/ArrowDown";
import { Download } from "@/components/Download";
import { FeaturesSection } from "@/components/FeaturesSection";
import Hero from "@/components/Hero";
import { MapDotGrid } from "@/components/MapDotGrid";
import { Reveal } from "@/components/Reveal";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SeverusDemoSection } from "@/components/SeverusDemoSection";

export default function page() {
    return (
        <div>
            <section className="relative isolate flex min-h-[calc(100dvh-var(--header-h))] flex-col items-center justify-center pb-64">
                <Hero />
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: "1s" }}>
                    <ArrowDown target="#Severus-Flow" />
                </div>
                <MapDotGrid />
            </section>

            <section id="Severus-Flow" className="flex min-h-dvh items-center justify-center">
                <Reveal>
                    <FeaturesSection />
                    <div className="mt-35 flex justify-center">
                        <ArrowDown target="#Severus-Demo" />
                    </div>
                </Reveal>
            </section>
            <section id="Severus-Demo">
                <Reveal> <SeverusDemoSection /> </Reveal>
                <div className="mt-35 flex justify-center">
                    <ArrowDown target="#Download-Section" />
                </div>
            </section>
            <section className="py-14 mt-25" id="Download-Section">
                <Reveal> <Download /> </Reveal>
            </section>

            <ScrollToTop />
        </div>
    )
}