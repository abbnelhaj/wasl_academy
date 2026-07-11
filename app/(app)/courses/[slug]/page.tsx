import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { CourseContent } from "@/components/courses";
import { sanityFetch } from "@/sanity/lib/live";
import { COURSE_WITH_MODULES_QUERY } from "@/sanity/lib/queries";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const { userId } = await auth();

  const { data: course } = await sanityFetch({
    query: COURSE_WITH_MODULES_QUERY,
    params: { slug, userId },
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <CourseContent course={course} userId={userId} />
      </main>
    </div>
  );
}
