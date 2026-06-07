import bcrypt from "bcryptjs";
import { connectToDatabase } from "../src/lib/db";
import { formTemplates } from "../src/lib/templates";
import { generateSlug } from "../src/lib/utils";
import { Form } from "../src/models/Form";
import { Response as FormResponse } from "../src/models/Response";
import { User } from "../src/models/User";

const users = [
  { email: "demo@formcraft.test", name: "Demo User", isPro: false },
  { email: "pro@formcraft.test", name: "Pro User", isPro: true },
  { email: "agency@formcraft.test", name: "Agency User", isPro: true },
];

function answerFor(type: string, options: string[]) {
  if (type === "email") return `person${Math.floor(Math.random() * 999)}@example.com`;
  if (type === "phone") return "+1 555 0100";
  if (type === "number") return Math.floor(Math.random() * 10) + 1;
  if (type === "rating") return Math.floor(Math.random() * 5) + 1;
  if (type === "checkboxes") return options.slice(0, 2);
  if (["multiple_choice", "dropdown"].includes(type)) return options[0] ?? "Yes";
  if (type === "date") return new Date().toISOString().slice(0, 10);
  if (type === "file_upload") return "resume.pdf";
  return "This is a realistic seeded answer.";
}

async function main() {
  await connectToDatabase();
  await Promise.all([User.deleteMany({ email: { $in: users.map((user) => user.email) } }), Form.deleteMany({}), FormResponse.deleteMany({})]);
  const password = await bcrypt.hash("FormCraft123!", 12);
  for (const userData of users) {
    const user = await User.create({ ...userData, password });
    for (const template of formTemplates.slice(0, userData.email.startsWith("agency") ? 4 : 3)) {
      const form = await Form.create({ userId: user._id, title: template.name, slug: generateSlug(), status: "active", fields: template.fields });
      const count = 50 + Math.floor(Math.random() * 150);
      const responses = Array.from({ length: count }).map((_, index) => {
        const createdAt = new Date(Date.now() - Math.floor(Math.random() * 60) * 86400000);
        return {
          formId: form._id,
          answers: Object.fromEntries(template.fields.filter((field) => field.type !== "section_break").map((field) => [field.id, answerFor(field.type, field.options)])),
          metadata: { startedAt: createdAt, completedAt: createdAt, timeToCompleteSeconds: 60 + Math.floor(Math.random() * 540) },
          isComplete: index % 9 !== 0,
          createdAt,
        };
      });
      await FormResponse.insertMany(responses);
      await Form.updateOne({ _id: form._id }, { responseCount: responses.length, lastResponseAt: responses[0]?.createdAt });
    }
  }
}

main().then(() => process.exit(0)).catch((error: unknown) => { process.stderr.write(`${error instanceof Error ? error.message : "Seed failed"}\n`); process.exit(1); });
