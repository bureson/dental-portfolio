import type { Metadata } from "next";
import { BackToTop } from "@/components/BackToTop";
import { ParallaxLayers } from "@/components/ParallaxLayers";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Education } from "@/components/site/Education";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";
import { StructuredData } from "@/components/site/StructuredData";

/** Set here rather than in the root layout, which /login and /vocabulary share. */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Read once when the module loads, which for this static export means build
 * time. Keeping it out of the render body is also what the purity rule wants:
 * a component must not read the clock while rendering.
 */
const BUILT_AT = Date.now();

export default function Home() {
  // Baked in so the footer year cannot cause a hydration mismatch.
  const year = new Date(BUILT_AT).getFullYear();

  return (
    // `clip`, not `hidden`: `overflow-x: hidden` would turn this into a scroll
    // container and give the page a second, nested scrollbar.
    <div className="min-h-screen overflow-x-clip bg-cream">
      <ParallaxLayers />
      <SiteNav />
      <main>
        <Hero />
        <About />
        <Education />
        <Services />
        <Contact />
      </main>
      <BackToTop />
      <SiteFooter year={year} />
      <StructuredData />
    </div>
  );
}
