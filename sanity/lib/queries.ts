import { defineQuery } from "next-sanity";

export const FEATURED_COURSES_QUERY = defineQuery(`
  *[
    _type == "course"
    && featured == true
  ] | order(_createdAt desc)[0...6] {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    description,
    accessType,
    price,
    currency,
    featured,
    level,
    thumbnail {
      asset-> {
        _id,
        url
      }
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[]->lessons[])
  }
`);

export const STATS_QUERY = defineQuery(`
  {
    "courseCount": count(*[_type == "course"]),
    "lessonCount": count(*[_type == "lesson"]),
    "freeCourseCount": count(*[_type == "course" && accessType == "free"]),
    "paidCourseCount": count(*[_type == "course" && accessType == "paid"])
  }
`);

export const DASHBOARD_COURSES_QUERY = defineQuery(`
  *[_type == "course"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    subtitle,
    description,
    accessType,
    price,
    currency,
    stripePriceId,
    featured,
    level,
    completedBy,
    thumbnail {
      asset-> {
        _id,
        url
      }
    },
    category-> {
      _id,
      title,
      "slug": slug.current
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[]->lessons[])
  }
`);
