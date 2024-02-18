import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { userTable } from "../../../drizzle/schema";

export async function getUser(username: string) {
  const user = db.query.userTable.findFirst({
    where: eq(userTable.username, username),
  });

  return user;
}

export const getCurrentUser = cache(async () => {
  const { user } = await validateRequest();

  return user;
});

export const getCurrentUserOrThrow = cache(async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not logged in");
  }

  return user;
});
