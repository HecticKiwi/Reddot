import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";
import { userTable } from "../../drizzle/schema";

export async function getProfile(username: string) {
  const user = db.query.userTable.findFirst({
    where: eq(userTable.username, username),
  });

  return user;
}

export const getCurrentUser = cache(async () => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Not logged in");
  }

  return user;
});
