"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { writeClient } from "@/sanity/lib/client";

export async function toggleLessonCompletion(
  lessonId: string,
  lessonSlug: string,
  markComplete: boolean,
  courseSlug?: string | null,
): Promise<{ success: boolean; isCompleted: boolean; error?: string }> {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      isCompleted: false,
      error: "سجل الدخول أولاً لحفظ تقدمك.",
    };
  }

  try {
    const completedByUserPath = `completedBy[@ == ${JSON.stringify(userId)}]`;

    if (markComplete) {
      await writeClient
        .patch(lessonId)
        .setIfMissing({ completedBy: [] })
        .unset([completedByUserPath])
        .append("completedBy", [userId])
        .commit();
    } else {
      await writeClient.patch(lessonId).unset([completedByUserPath]).commit();
    }

    revalidatePath(`/lessons/${lessonSlug}`);
    if (courseSlug) {
      revalidatePath(`/courses/${courseSlug}`);
    }
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/courses");

    return { success: true, isCompleted: markComplete };
  } catch (error) {
    console.error("Failed to toggle lesson completion:", error);
    const errorMessage =
      error instanceof Error && error.message.includes("permission")
        ? "توكن Sanity الحالي لا يملك صلاحية تحديث البيانات."
        : "تعذر حفظ حالة الدرس الآن. جرّب مرة أخرى.";

    return { success: false, isCompleted: !markComplete, error: errorMessage };
  }
}
