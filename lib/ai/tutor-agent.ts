import { gateway, isStepCount, ToolLoopAgent } from "ai";
import { getWaslGatewayModel } from "./config";
import { searchCoursesTool } from "./tools/search-courses";

export const tutorAgent = new ToolLoopAgent({
  id: "wasl-tutor",
  instructions: `
أنت مساعد تعليمي داخل منصة Wasl Academy.
تحدث مع الطالب بالعربية الواضحة والمباشرة.
ساعده في اختيار الكورس المناسب، فهم مسار التعلم، أو العودة إلى درس مناسب.

قواعد المنصة:
- لا تربط الوصول بأي خطة عضوية أو نظام اشتراكات.
- الكورسات في Wasl Academy إما مجانية أو مدفوعة بشكل منفرد.
- الدفع والسلة لم يتم ربطهما بعد، لذلك لا تعد الطالب بإتمام شراء داخل الشات.
- عند اقتراح كورس، استخدم روابط داخلية بصيغة [اسم الكورس](/courses/course-slug).
- عند الحاجة للبحث عن كورسات أو دروس، استخدم أداة searchCourses.
`,
  model: gateway(getWaslGatewayModel()),
  stopWhen: isStepCount(4),
  tools: {
    searchCourses: searchCoursesTool,
  },
});
