import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { CoursesSection } from "@/components/courses-section";
import type { FeaturedCourse } from "@/components/courses-section";
import { CtaSection } from "@/components/cta-section";
import { FeatureSection } from "@/components/feature-section";
import HeroSection from "@/components/hero";
import type { HeroStats } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FEATURED_COURSES_QUERY, STATS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";

export default async function Home() {
  const [{ data: courses }, { data: stats }, user, users] = await Promise.all([
    sanityFetch({ query: FEATURED_COURSES_QUERY }),
    sanityFetch({ query: STATS_QUERY }),
    currentUser(),
    clerkClient().then((client) => client.users.getUserList({ limit: 1 })),
  ]);

  const isSignedIn = !!user;
  const heroStats = {
    ...(stats as Exclude<HeroStats, null>),
    studentCount: users.totalCount,
  } satisfies Exclude<HeroStats, null>;

  return (
    <main className="bg-background text-foreground">
      <HeroSection isSignedIn={isSignedIn} stats={heroStats} />
      <FeatureSection />
      <CoursesSection
        courses={courses as FeaturedCourse[]}
        isSignedIn={isSignedIn}
      />
      <TestimonialsSection />
      <CtaSection isSignedIn={isSignedIn} />
      <SiteFooter />
    </main>
  );
}
