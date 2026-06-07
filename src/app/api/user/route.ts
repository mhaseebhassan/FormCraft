import { jsonError, requireUserId, withDatabase } from "@/lib/api";
import { Form } from "@/models/Form";
import { Notification } from "@/models/Notification";
import { Response as FormResponse } from "@/models/Response";
import { User } from "@/models/User";

export async function DELETE() {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const forms = await Form.find({ userId }).select("_id").lean();
  const formIds = forms.map((form) => form._id);
  await FormResponse.deleteMany({ formId: { $in: formIds } });
  await Notification.deleteMany({ userId });
  await Form.deleteMany({ userId });
  await User.findByIdAndDelete(userId);
  return new Response(null, { status: 204 });
}
