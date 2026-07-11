import {
  createAgentUIStreamResponse,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import {
  getWaslAiFallbackProvider,
  getWaslAiProvider,
  getWaslGeminiModel,
  getWaslGroqModel,
  type WaslAiProvider,
} from "./config";
import { searchWaslCourses } from "./tools/search-courses";
import { tutorAgent } from "./tutor-agent";

function getMessageText(message: UIMessage): string {
  return (
    message.parts
      ?.filter((part) => part.type === "text")
      .map((part) => (part as { text: string; type: "text" }).text)
      .join("\n") ?? ""
  );
}

function getLastUserMessage(messages: UIMessage[]) {
  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  return lastUserMessage ? getMessageText(lastUserMessage).trim() : "";
}

type TutorPromptContext = {
  conversationText: string;
  localResponseText: string;
  query: string;
  searchContext: string;
};

const TUTOR_SYSTEM_INSTRUCTION = `أنت مساعد تعليمي داخل Wasl Academy.
لا تربط الوصول بأي اشتراك أو خطة عضوية.
الكورسات إما مجانية أو مدفوعة بشكل منفرد.
الدفع والسلة لم يتم تفعيلهما بعد.
اعتمد على نتائج البحث المرسلة من Sanity ولا تخترع كورسات أو روابط غير موجودة.
اكتب بالعربية الواضحة والمباشرة.`;

function formatLocalSearchResponse(
  query: string,
  result: Awaited<ReturnType<typeof searchWaslCourses>>,
) {
  if (!query) {
    return "اكتب لي اسم المهارة أو الموضوع الذي تريد تعلمه، وسأبحث لك داخل كورسات وصل المتاحة.";
  }

  if (!result.found) {
    return `${result.message}\n\nجرّب كلمات أبسط مثل: إعلانات، متجر، دفع عند الاستلام، أو أساسيات التجارة.`;
  }

  const courses = result.courses
    .map((course) => {
      const details = [
        course.access,
        course.level ? `المستوى: ${course.level}` : null,
        `${course.moduleCount} وحدات`,
        `${course.lessonCount} دروس`,
      ]
        .filter(Boolean)
        .join(" • ");

      return `- [${course.title}](${course.url})\n  ${details}${
        course.description ? `\n  ${course.description}` : ""
      }`;
    })
    .join("\n\n");

  return `هذا رد مجاني بدون استخدام أي مودل خارجي. بحثت داخل محتوى Wasl Academy ووجدت:\n\n${courses}\n\nلو تريد ردود ذكية حقيقية بدل البحث المحلي، نفعّل مودل لاحقًا من env بعد ما تختار الخيار المناسب.`;
}

function createTutorTextResponse(messages: UIMessage[], responseText: string) {
  const textId = "wasl-tutor-response";
  const stream = createUIMessageStream({
    execute({ writer }) {
      writer.write({ id: textId, type: "text-start" });
      writer.write({
        delta: responseText,
        id: textId,
        type: "text-delta",
      });
      writer.write({ id: textId, type: "text-end" });
    },
    originalMessages: messages,
  });

  return createUIMessageStreamResponse({ stream });
}

function canUseProvider(provider: WaslAiProvider) {
  if (provider === "groq") {
    return Boolean(process.env.GROQ_API_KEY);
  }

  if (provider === "gemini") {
    return Boolean(process.env.GEMINI_API_KEY);
  }

  if (provider === "gateway") {
    return Boolean(process.env.AI_GATEWAY_API_KEY);
  }

  return true;
}

function getConversationText(messages: UIMessage[]) {
  return messages
    .slice(-8)
    .map((message) => {
      const speaker = message.role === "user" ? "الطالب" : "مساعد وصل";
      const text = getMessageText(message).trim();

      return text ? `${speaker}: ${text}` : null;
    })
    .filter(Boolean)
    .join("\n");
}

function formatSearchContext(
  result: Awaited<ReturnType<typeof searchWaslCourses>>,
) {
  if (!result.found) {
    return result.message;
  }

  return result.courses
    .map((course) => {
      const lessons = course.modules
        .flatMap((module) =>
          module.lessons
            .filter((lesson) => lesson.title || lesson.description)
            .slice(0, 3)
            .map((lesson) => ({
              lesson,
              moduleTitle: module.title,
            })),
        )
        .slice(0, 6)
        .map(
          ({ lesson, moduleTitle }) =>
            `    - ${lesson.title ?? "درس بدون عنوان"}${
              moduleTitle ? ` (${moduleTitle})` : ""
            }${lesson.lessonUrl ? `: ${lesson.lessonUrl}` : ""}${
              lesson.description ? `\n      ${lesson.description}` : ""
            }`,
        )
        .join("\n");

      return `- ${course.title}: ${course.url}
  ${course.access}، ${course.moduleCount} وحدات، ${course.lessonCount} دروس
  ${course.description ?? ""}
${lessons}`;
    })
    .join("\n\n");
}

async function createTutorPromptContext(
  messages: UIMessage[],
): Promise<TutorPromptContext> {
  const query = getLastUserMessage(messages);
  const searchResult = await searchWaslCourses(query);

  return {
    conversationText: getConversationText(messages),
    localResponseText: formatLocalSearchResponse(query, searchResult),
    query,
    searchContext: formatSearchContext(searchResult),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function extractGeminiText(response: unknown) {
  if (
    response &&
    typeof response === "object" &&
    "output_text" in response &&
    typeof response.output_text === "string"
  ) {
    return response.output_text;
  }

  if (!isRecord(response) || !Array.isArray(response.steps)) {
    return "";
  }

  return response.steps
    .flatMap((step: unknown) => {
      if (!isRecord(step) || step.type !== "model_output") {
        return [];
      }

      if (!Array.isArray(step.content)) {
        return [];
      }

      return step.content.flatMap((content: unknown) => {
        if (
          !isRecord(content) ||
          content.type !== "text" ||
          typeof content.text !== "string"
        ) {
          return [];
        }

        return [content.text];
      });
    })
    .join("\n")
    .trim();
}

function extractOpenAiCompatibleText(response: unknown) {
  if (!isRecord(response) || !Array.isArray(response.choices)) {
    return "";
  }

  return response.choices
    .flatMap((choice: unknown) => {
      if (!isRecord(choice) || !isRecord(choice.message)) {
        return [];
      }

      const { content } = choice.message;

      return typeof content === "string" ? [content] : [];
    })
    .join("\n")
    .trim();
}

function shouldTryFallback(error: unknown) {
  if (!isRecord(error) || typeof error.status !== "number") {
    return true;
  }

  return (
    error.status === 401 ||
    error.status === 403 ||
    error.status === 429 ||
    error.status >= 500
  );
}

async function generateGroqResponse(context: TutorPromptContext) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return context.localResponseText;
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      body: JSON.stringify({
        max_tokens: 650,
        messages: [
          {
            content: TUTOR_SYSTEM_INSTRUCTION,
            role: "system",
          },
          {
            content: `آخر المحادثة:
${context.conversationText}

نتائج البحث من Sanity:
${context.searchContext}

اكتب إجابة عربية قصيرة ومفيدة. إذا اقترحت كورسًا أو درسًا، استخدم روابط Markdown الداخلية كما هي.`,
            role: "user",
          },
        ],
        model: getWaslGroqModel(),
        temperature: 0.35,
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    throw {
      provider: "groq",
      status: response.status,
    };
  }

  const data: unknown = await response.json();
  const text = extractOpenAiCompatibleText(data);

  return text || context.localResponseText;
}

async function generateGeminiResponse(context: TutorPromptContext) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return context.localResponseText;
  }

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/interactions",
    {
      body: JSON.stringify({
        generation_config: {
          temperature: 0.4,
          thinking_level: "low",
        },
        input: `سؤال الطالب:
${context.query}

آخر المحادثة:
${context.conversationText}

نتائج البحث من Sanity:
${context.searchContext}

اكتب إجابة عربية قصيرة ومفيدة. إذا اقترحت كورسًا أو درسًا، استخدم روابط Markdown الداخلية كما هي.`,
        model: getWaslGeminiModel(),
        system_instruction: TUTOR_SYSTEM_INSTRUCTION,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    throw {
      provider: "gemini",
      status: response.status,
    };
  }

  const data: unknown = await response.json();
  const text = extractGeminiText(data).trim();

  return text || context.localResponseText;
}

async function generateProviderResponse(
  provider: WaslAiProvider,
  context: TutorPromptContext,
) {
  if (provider === "groq") {
    return generateGroqResponse(context);
  }

  if (provider === "gemini") {
    return generateGeminiResponse(context);
  }

  return context.localResponseText;
}

export function getActiveWaslAiProvider() {
  const provider = getWaslAiProvider();

  return canUseProvider(provider) ? provider : "local";
}

export async function createTutorResponse(messages: UIMessage[]) {
  const provider = getActiveWaslAiProvider();
  const context = await createTutorPromptContext(messages);

  if (provider === "groq" || provider === "gemini") {
    try {
      const responseText = await generateProviderResponse(provider, context);

      return createTutorTextResponse(messages, responseText);
    } catch (error) {
      const fallbackProvider = getWaslAiFallbackProvider();

      if (
        fallbackProvider !== provider &&
        canUseProvider(fallbackProvider) &&
        shouldTryFallback(error)
      ) {
        try {
          const responseText = await generateProviderResponse(
            fallbackProvider,
            context,
          );

          return createTutorTextResponse(messages, responseText);
        } catch {
          return createTutorTextResponse(messages, context.localResponseText);
        }
      }

      return createTutorTextResponse(messages, context.localResponseText);
    }
  }

  if (provider === "gateway") {
    return createAgentUIStreamResponse({
      agent: tutorAgent,
      uiMessages: messages,
    });
  }

  return createTutorTextResponse(messages, context.localResponseText);
}
