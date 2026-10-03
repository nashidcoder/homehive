import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function getAdminUser() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  await connectDB();
  const user = await User.findById(currentUser.id).select("isAdmin name");

  if (!user?.isAdmin) return null;

  return { id: currentUser.id, name: user.name };
}