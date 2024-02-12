"use server";

import { db } from "@/lib/drizzle";
import { getCurrentUserOrThrow } from "@/server/profile";
import { eq } from "drizzle-orm";
import { User, userTable } from "../../drizzle/schema";

export async function isUsernameAvailable(username: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.username, username),
  });

  return !user;
}

export async function updateProfile(data: Partial<User>) {
  const user = await getCurrentUserOrThrow();

  const [updatedUser] = await db
    .update(userTable)
    .set(data)
    .where(eq(userTable.id, user.id));

  return updatedUser;
}
