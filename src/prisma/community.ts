import { db } from "@/lib/drizzle";
import prisma from "@/lib/prisma";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { communityTable } from "../../drizzle/schema";

export const getCommunityById = cache(async (id: string) => {
  const a = await db.query.communityTable.findFirst({
    where: eq(communityTable.name, id),
    with: {
      moderators: true,
      members: true,
    },
  });

  return a;

  return await prisma.community.findUnique({
    where: {
      name: id,
    },
    include: {
      moderators: true,
      _count: {
        select: {
          members: true,
        },
      },
    },
  });
});
