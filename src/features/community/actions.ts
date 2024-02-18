"use server";

import { db } from "@/lib/drizzle";
import { getCurrentUserOrThrow } from "@/features/user/utils";
import { communityDto } from "@/features/community/schema";
import { and, eq, gt, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  communityMods,
  communityTable,
  communityToUser,
} from "../../../drizzle/schema";

export async function isCommunityNameAvailable(name: string) {
  const community = await db.query.communityTable.findFirst({
    where: eq(communityTable.name, name),
  });

  return !community;
}

export async function createCommunity(data: communityDto) {
  const profile = await getCurrentUserOrThrow();

  const community = await db.transaction(async (tx) => {
    const [community] = await tx
      .insert(communityTable)
      .values({
        ...data,
      })
      .returning();

    await tx.insert(communityMods).values({
      communityName: data.name,
      userId: profile.id,
    });

    await tx.insert(communityToUser).values({
      communityName: data.name,
      userId: profile.id,
    });

    return community;
  });

  return community.name;
}

export async function searchCommunitiesByName(name: string) {
  if (!name) {
    return [];
  }

  return await db.query.communityTable.findMany({
    where: ilike(communityTable.name, `%${name}%`),
  });
}

export async function updateCommunity({
  communityId,
  data,
}: {
  communityId: string;
  data: Partial<communityDto>;
}) {
  const community = await db
    .update(communityTable)
    .set(data)
    .where(eq(communityTable.name, communityId));

  return community;
}

export async function joinOrLeaveCommunity({
  communityName,
}: {
  communityName: string;
}) {
  const profile = await getCurrentUserOrThrow();

  const existingMembership = await db.query.communityToUser.findFirst({
    where: and(
      eq(communityToUser.userId, profile.id),
      eq(communityToUser.communityName, communityName),
    ),
  });

  if (existingMembership) {
    await db
      .delete(communityToUser)
      .where(
        and(
          eq(communityToUser.userId, profile.id),
          eq(communityToUser.communityName, communityName),
        ),
      );
  } else {
    await db.insert(communityToUser).values({
      userId: profile.id,
      communityName: communityName,
    });
  }

  revalidatePath("/");

  return !existingMembership;
}
