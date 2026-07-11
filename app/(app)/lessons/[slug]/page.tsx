import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { LessonPageContent } from "@/components/lessons";
import { sanityFetch } from "@/sanity/lib/live";
import { LESSON_BY_SLUG_QUERY } from "@/sanity/lib/queries";

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const { userId } = await auth();

  const { data: lesson } = await sanityFetch({
    query: LESSON_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!lesson) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <LessonPageContent lesson={lesson} userId={userId} />
      </main>
    </div>
  );
}
