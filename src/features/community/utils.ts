import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { communityTable } from "../../../drizzle/schema";

export const getCommunityById = cache(async (name: string) => {
  return await db.query.communityTable.findFirst({
    where: eq(communityTable.name, name),
    with: {
      moderators: true,
      members: true,
    },
  });
});
