import { auth } from "@clerk/nextjs/server";
import type { UIMessage } from "ai";
import { createTutorResponse } from "@/lib/ai/tutor";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("يجب تسجيل الدخول لاستخدام مساعد وصل.", {
      status: 401,
    });
  }

  let body: { messages?: UIMessage[] };

  try {
    body = await request.json();
  } catch {
    return new Response("صيغة الطلب غير صحيحة.", { status: 400 });
  }

  if (!Array.isArray(body.messages)) {
    return new Response("لا توجد رسائل صالحة.", { status: 400 });
  }

  return createTutorResponse(body.messages);
}
