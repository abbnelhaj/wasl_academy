import { currentUser } from "@clerk/nextjs/server";
import { CoursesSection } from "@/components/courses-section";
import { CtaSection } from "@/components/cta-section";
import { FeatureSection } from "@/components/feature-section";
import HeroSection from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { TestimonialsSection } from "@/components/testimonials-section";

export default async function Home() {
  const user = await currentUser();

  return (
    <main className="bg-background text-foreground">
      <HeroSection isSignedIn={!!user} />
      <FeatureSection />
      <CoursesSection isSignedIn={!!user} />
      <TestimonialsSection />
      <CtaSection isSignedIn={!!user} />
      <SiteFooter />
    </main>
  );
}
