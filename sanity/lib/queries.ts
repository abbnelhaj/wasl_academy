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
    modules[]-> {
      _id,
      lessons[]-> {
        _id,
        completedBy
      }
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[]->lessons[])
  }
`);

export const COURSE_WITH_MODULES_QUERY = defineQuery(`
  *[
    _type == "course"
    && slug.current == $slug
  ][0] {
    _id,
    title,
    slug,
    subtitle,
    description,
    accessType,
    price,
    currency,
    featured,
    level,
    completedBy,
    "isCompleted": $userId in completedBy[],
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
    modules[]-> {
      _id,
      title,
      slug,
      description,
      lessons[]-> {
        _id,
        title,
        slug,
        shortDescription,
        durationMinutes,
        isFreePreview,
        completedBy,
        video {
          asset-> {
            _id,
            playbackId,
            status
          }
        },
        content[] {
          _key,
          _type,
          _type == "block" => {
            style,
            listItem,
            level,
            markDefs[] {
              _key,
              _type,
              _type == "link" => {
                href
              }
            },
            children[] {
              _key,
              _type,
              text,
              marks
            }
          },
          _type == "image" => {
            _key,
            _type,
            asset-> {
              _id,
              url
            },
            alt,
            caption,
            crop,
            hotspot
          }
        }
      }
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[]->lessons[])
  }
`);

export const LESSON_BY_ID_QUERY = defineQuery(`
  *[
    _type == "lesson"
    && _id == $lessonId
  ][0] {
    _id,
    title,
    slug,
    shortDescription,
    durationMinutes,
    isFreePreview,
    completedBy,
    video {
      asset-> {
        _id,
        playbackId,
        status,
        data {
          duration
        }
      }
    },
    content[] {
      _key,
      _type,
      _type == "block" => {
        style,
        listItem,
        level,
        markDefs[] {
          _key,
          _type,
          _type == "link" => {
            href
          }
        },
        children[] {
          _key,
          _type,
          text,
          marks
        }
      },
      _type == "image" => {
        _key,
        _type,
        asset-> {
          _id,
          url
        },
        alt,
        caption,
        crop,
        hotspot
      }
    },
    "courses": *[
      _type == "course"
      && ^._id in modules[]->lessons[]->_id
    ] | order(select(accessType == "free" => 0, accessType == "paid" => 1, 2), _createdAt desc) {
      _id,
      title,
      slug,
      subtitle,
      description,
      accessType,
      price,
      currency,
      completedBy,
      modules[]-> {
        _id,
        title,
        slug,
        description,
        lessons[]-> {
          _id,
          title,
          slug,
          shortDescription,
          durationMinutes,
          isFreePreview,
          completedBy,
          video {
            asset-> {
              _id,
              playbackId,
              status
            }
          }
        }
      },
      "moduleCount": count(modules),
      "lessonCount": count(modules[]->lessons[])
    }
  }
`);

export const LESSON_BY_SLUG_QUERY = defineQuery(`
  *[
    _type == "lesson"
    && slug.current == $slug
  ][0] {
    _id,
    title,
    slug,
    shortDescription,
    durationMinutes,
    isFreePreview,
    completedBy,
    video {
      asset-> {
        _id,
        playbackId,
        status,
        data {
          duration
        }
      }
    },
    content[] {
      _key,
      _type,
      _type == "block" => {
        style,
        listItem,
        level,
        markDefs[] {
          _key,
          _type,
          _type == "link" => {
            href
          }
        },
        children[] {
          _key,
          _type,
          text,
          marks
        }
      },
      _type == "image" => {
        _key,
        _type,
        asset-> {
          _id,
          url
        },
        alt,
        caption,
        crop,
        hotspot
      }
    },
    "courses": *[
      _type == "course"
      && ^._id in modules[]->lessons[]->_id
    ] | order(select(accessType == "free" => 0, accessType == "paid" => 1, 2), _createdAt desc) {
      _id,
      title,
      slug,
      subtitle,
      description,
      accessType,
      price,
      currency,
      completedBy,
      modules[]-> {
        _id,
        title,
        slug,
        description,
        lessons[]-> {
          _id,
          title,
          slug,
          shortDescription,
          durationMinutes,
          isFreePreview,
          completedBy,
          video {
            asset-> {
              _id,
              playbackId,
              status
            }
          }
        }
      },
      "moduleCount": count(modules),
      "lessonCount": count(modules[]->lessons[])
    }
  }
`);
