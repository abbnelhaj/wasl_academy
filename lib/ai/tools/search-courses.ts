import { jsonSchema, tool } from "ai";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

type CourseSearchInput = {
  query: string;
};

type SearchCourseResult = {
  access: string;
  category: string | null;
  description: string | null;
  lessonCount: number;
  level: string | null;
  moduleCount: number;
  modules: Array<{
    description: string | null;
    lessons: Array<{
      contentPreview: string | null;
      description: string | null;
      lessonUrl: string | null;
      title: string | null;
    }>;
    title: string | null;
  }>;
  title: string;
  url: string;
};

export type WaslCourseSearchResult = {
  courses: SearchCourseResult[];
  found: boolean;
  message: string;
};

type Lesson = {
  _id: string;
  contentText: string | null;
  shortDescription: string | null;
  slug: string | null;
  title: string | null;
};

type Module = {
  _id: string;
  description: string | null;
  lessons?: Lesson[] | null;
  title: string | null;
};

type Course = {
  _id: string;
  accessType: "free" | "paid" | null;
  category: string | null;
  currency: string | null;
  description: string | null;
  level: string | null;
  modules?: Module[] | null;
  price: number | null;
  slug: string | null;
  subtitle: string | null;
  title: string | null;
};

const ALL_COURSES_WITH_CONTENT_QUERY = defineQuery(`
  *[_type == "course"] | order(featured desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    description,
    accessType,
    price,
    currency,
    level,
    "category": category->title,
    modules[]-> {
      _id,
      title,
      description,
      lessons[]-> {
        _id,
        title,
        "slug": slug.current,
        shortDescription,
        "contentText": pt::text(content)
      }
    }
  }
`);

function textContains(
  text: null | string | undefined,
  searchTerm: string,
): boolean {
  if (!text) {
    return false;
  }

  return text.toLowerCase().includes(searchTerm.toLowerCase());
}

function scoreCourse(course: Course, searchTerms: string[]): number {
  let score = 0;

  for (const term of searchTerms) {
    if (textContains(course.title, term)) {
      score += 100;
    }

    if (textContains(course.subtitle, term)) {
      score += 60;
    }

    if (textContains(course.description, term)) {
      score += 50;
    }

    if (textContains(course.category, term)) {
      score += 30;
    }

    for (const module of course.modules ?? []) {
      if (textContains(module.title, term)) {
        score += 20;
      }

      if (textContains(module.description, term)) {
        score += 10;
      }

      for (const lesson of module.lessons ?? []) {
        if (textContains(lesson.title, term)) {
          score += 15;
        }

        if (textContains(lesson.shortDescription, term)) {
          score += 8;
        }

        if (textContains(lesson.contentText, term)) {
          score += 5;
        }
      }
    }
  }

  return score;
}

function formatAccess(course: Course) {
  if (course.accessType === "free") {
    return "مجاني";
  }

  if (typeof course.price === "number" && course.price > 0) {
    return `مدفوع - ${course.price} ${course.currency ?? "LYD"}`;
  }

  return "مدفوع";
}

export async function searchWaslCourses(
  query: string,
): Promise<WaslCourseSearchResult> {
  const cleanQuery = query.trim();
  const searchTerms = cleanQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 1);

  if (searchTerms.length === 0) {
    return {
      courses: [],
      found: false,
      message: "اكتب موضوعًا أو مهارة للبحث عنها داخل الكورسات.",
    };
  }

  const { data } = await sanityFetch({
    query: ALL_COURSES_WITH_CONTENT_QUERY,
  });
  const allCourses = (Array.isArray(data) ? data : []) as Course[];
  const scoredCourses = allCourses
    .map((course) => ({
      course,
      score: scoreCourse(course, searchTerms),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (scoredCourses.length === 0) {
    return {
      courses: [],
      found: false,
      message: "لم أجد كورسات أو دروسًا مطابقة لهذا البحث.",
    };
  }

  const courses = scoredCourses.map(({ course }) => {
    const modules = course.modules ?? [];
    const moduleDetails = modules.map((module) => {
      const lessons = module.lessons ?? [];

      return {
        description: module.description,
        lessons: lessons.map((lesson) => ({
          contentPreview: lesson.contentText
            ? `${lesson.contentText.slice(0, 900)}${
                lesson.contentText.length > 900 ? "..." : ""
              }`
            : null,
          description: lesson.shortDescription,
          lessonUrl: lesson.slug ? `/lessons/${lesson.slug}` : null,
          title: lesson.title,
        })),
        title: module.title,
      };
    });

    return {
      access: formatAccess(course),
      category: course.category,
      description: course.description ?? course.subtitle,
      level: course.level,
      lessonCount: moduleDetails.reduce(
        (acc, module) => acc + module.lessons.length,
        0,
      ),
      moduleCount: moduleDetails.length,
      modules: moduleDetails,
      title: course.title ?? "كورس بدون عنوان",
      url: course.slug ? `/courses/${course.slug}` : "/dashboard",
    };
  });

  return {
    courses,
    found: true,
    message: `وجدت ${courses.length} نتيجة مناسبة.`,
  };
}

export const searchCoursesTool = tool({
  description:
    "Search Wasl Academy courses, modules, lessons, and lesson notes for a student's learning goal.",
  inputSchema: jsonSchema<CourseSearchInput>({
    additionalProperties: false,
    properties: {
      query: {
        description: "The topic, course, skill, or lesson the student needs.",
        type: "string",
      },
    },
    required: ["query"],
    type: "object",
  }),
  execute: async ({ query }) => searchWaslCourses(query),
});
