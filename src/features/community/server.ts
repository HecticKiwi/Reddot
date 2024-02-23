import "server-only";

import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { communityTable } from "../../../drizzle/schema";
import { getCurrentUserOrThrow } from "../user/server";

export const getCommunityById = cache(async (name: string) => {
  const user = getCurrentUserOrThrow();

  return await db.query.communityTable.findFirst({
    where: eq(communityTable.name, name),
    with: {
      moderators: true,
      members: true,
    },
  });
});
