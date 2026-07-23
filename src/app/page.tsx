import { BackToTop } from "@/components/BackToTop";
import { ParallaxLayers } from "@/components/ParallaxLayers";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Education } from "@/components/site/Education";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";
import { nameAt } from "@/lib/content";

/**
 * Read once when the module loads, which for this static export means build
 * time. Keeping it out of the render body is also what the purity rule wants:
 * a component must not read the clock while rendering.
 */
const BUILT_AT = Date.now();

export default function Home() {
  // Baked in so neither the footer year nor the surname can cause a hydration
  // mismatch; `PersonName` corrects the name in the browser if this build
  // predates the change.
  const year = new Date(BUILT_AT).getFullYear();
  const name = nameAt(BUILT_AT);

  return (
    // `clip`, not `hidden`: `overflow-x: hidden` would turn this into a scroll
    // container and give the page a second, nested scrollbar.
    <div className="min-h-screen overflow-x-clip bg-cream">
      <ParallaxLayers />
      <SiteNav name={name} />
      <main>
        <Hero />
        <About />
        <Education />
        <Services />
        <Contact />
      </main>
      <BackToTop />
      <SiteFooter year={year} name={name} />
    </div>
  );
}
