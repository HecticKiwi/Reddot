"use server";

import { db } from "@/lib/drizzle";
import { getCurrentUser, getCurrentUserOrThrow } from "@/features/user/server";
import { communityDto } from "@/features/community/schema";
import { and, eq, gt, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  communityMods,
  communityTable,
  communityToUser,
} from "../../../drizzle/schema";
import invariant from "tiny-invariant";

export async function isCommunityNameAvailable(name: string) {
  invariant(typeof name === "string", "Expected name to be a string");

  const community = await db.query.communityTable.findFirst({
    where: eq(communityTable.name, name),
  });

  return !community;
}

export async function createCommunity(data: communityDto) {
  invariant(data, "Expected data");

  const user = await getCurrentUserOrThrow();

  const community = await db.transaction(async (tx) => {
    const [community] = await tx
      .insert(communityTable)
      .values({
        ...data,
      })
      .returning();

    await tx.insert(communityMods).values({
      communityName: data.name,
      userId: user.id,
    });

    await tx.insert(communityToUser).values({
      communityName: data.name,
      userId: user.id,
    });

    return community;
  });

  return community.name;
}

export async function searchCommunitiesByName(name: string) {
  invariant(typeof name === "string", "Expected name to be a string");

  if (!name) {
    return [];
  }

  return await db.query.communityTable.findMany({
    where: ilike(communityTable.name, `%${name}%`),
  });
}

export async function updateCommunity({
  communityName,
  data,
}: {
  communityName: string;
  data: Partial<communityDto>;
}) {
  invariant(
    typeof communityName === "string",
    "Expected communityName to be a string",
  );
  invariant(data, "Expected data");

  const user = await getCurrentUser();
  const isMod = user?.communitiesAsModerator.some(
    (community) => community.community.name === communityName,
  );
  invariant(isMod, "The user is not a mod of this community");

  const community = await db
    .update(communityTable)
    .set(data)
    .where(eq(communityTable.name, communityName));

  return community;
}

export async function joinOrLeaveCommunity({
  communityName,
}: {
  communityName: string;
}) {
  invariant(
    typeof communityName === "string",
    "Expected communityName to be a string",
  );

  const user = await getCurrentUserOrThrow();

  const existingMembership = await db.query.communityToUser.findFirst({
    where: and(
      eq(communityToUser.userId, user.id),
      eq(communityToUser.communityName, communityName),
    ),
  });

  if (existingMembership) {
    await db
      .delete(communityToUser)
      .where(
        and(
          eq(communityToUser.userId, user.id),
          eq(communityToUser.communityName, communityName),
        ),
      );
  } else {
    await db.insert(communityToUser).values({
      userId: user.id,
      communityName: communityName,
    });
  }

  revalidatePath("/");

  return !existingMembership;
}
