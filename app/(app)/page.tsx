import { clerkClient, currentUser } from "@clerk/nextjs/server";
import type { FeaturedCourse } from "@/components/courses-section";
import { CoursesSection } from "@/components/courses-section";
import { CtaSection } from "@/components/cta-section";
import { FeatureSection } from "@/components/feature-section";
import type { HeroStats } from "@/components/hero";
import HeroSection from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { TestimonialsSection } from "@/components/testimonials-section";
import { sanityFetch } from "@/sanity/lib/live";
import { FEATURED_COURSES_QUERY, STATS_QUERY } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [courses, stats, user, studentCount] = await Promise.all([
    sanityFetch({ query: FEATURED_COURSES_QUERY })
      .then(({ data }) => data)
      .catch((error) => {
        console.error("Failed to load featured courses", error);
        return [] satisfies FeaturedCourse[];
      }),
    sanityFetch({ query: STATS_QUERY })
      .then(({ data }) => data)
      .catch((error) => {
        console.error("Failed to load home stats", error);
        return null;
      }),
    currentUser().catch((error) => {
      console.error("Failed to load current user", error);
      return null;
    }),
    clerkClient()
      .then((client) => client.users.getCount())
      .catch((error) => {
        console.error("Failed to load user count", error);
        return null;
      }),
  ]);

  const isSignedIn = !!user;
  const heroStats = {
    ...(stats ?? {}),
    studentCount,
  } satisfies Exclude<HeroStats, null>;

  return (
    <main className="bg-background text-foreground">
      <HeroSection isSignedIn={isSignedIn} stats={heroStats} />
      <FeatureSection />
      <CoursesSection courses={courses} isSignedIn={isSignedIn} />
      <TestimonialsSection />
      <CtaSection isSignedIn={isSignedIn} />
      <SiteFooter />
    </main>
  );
}
