"use server";

import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { revalidatePath } from "next/cache";

export async function updateProfile(data) {
  const user = await checkUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      name: data.name,
      imageUrl: data.imageUrl,
      salary: parseFloat(data.salary) || 0,
      bio: data.bio,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/simulator");
  return updatedUser;
}
