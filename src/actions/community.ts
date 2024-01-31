"use server";

import prisma from "@/lib/prisma";
import { communityDto } from "@/schemas/community";
import { Community, Prisma, PrismaClient, Profile } from "@prisma/client";
import { Score } from "./post";
import { getCurrentProfile } from "@/prisma/profile";
import { revalidatePath } from "next/cache";
import { Long_Cang } from "next/font/google";

export type CommunityWithMods = Community & {
  moderators: Profile[];
};

export type CommunityThing = Partial<Community> & {
  image: File | null;
};

export async function createCommunity(data: communityDto): Promise<number> {
  const profile = await getCurrentProfile();

  const community = await prisma.community.create({
    data: {
      ...data,
      moderators: {
        connect: {
          id: profile.id,
        },
      },
    },
  });

  return community.id;
}

export async function searchCommunitiesByName(
  name: string,
): Promise<Community[]> {
  if (!name) {
    return [];
  }

  return await prisma.community.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
    take: 10,
  });
}

export async function updateCommunity({
  communityId,
  data,
}: {
  communityId: number;
  data: Partial<communityDto>;
}) {
  const community = await prisma.community.update({
    where: {
      id: communityId,
    },
    data,
  });

  return community;
}

export async function joinOrLeaveCommunity({
  communityId,
}: {
  communityId: number;
}) {
  const profile = await getCurrentProfile();

  const where: Prisma.ProfileWhereUniqueInput = {
    id: profile.id,
    communitiesAsMember: {
      some: {
        id: communityId,
      },
    },
  };

  const hasJoined = await prisma.profile.findUnique({
    where,
  });

  if (hasJoined) {
    await prisma.profile.update({
      where,
      data: {
        communitiesAsMember: {
          disconnect: {
            id: communityId,
          },
        },
      },
    });
  } else {
    await prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        communitiesAsMember: {
          connect: {
            id: communityId,
          },
        },
      },
    });
  }

  revalidatePath("/");

  return !hasJoined;
}

export async function getPosts({
  type,
  id,
  pageParam = 0,
  orderBy: orderByType,
}: {
  type: "profile" | "community";
  id: number | null;
  pageParam?: number;
  orderBy: "new" | "top";
}) {
  console.time("getPosts");
  const profile = await getCurrentProfile();

  const take = 5;
  const cursor = pageParam
    ? {
        id: pageParam,
      }
    : undefined;
  const skip = cursor ? 1 : 0;

  const communitiesAsMemberIds = profile.communitiesAsMember.map(
    (community) => community.id,
  );

  const where: Prisma.PostScalarWhereInput = {
    removed: false,
  };

  if (type === "profile") {
    if (id === null) {
      where.communityId = {
        in: communitiesAsMemberIds,
      };
    } else {
      where.authorId = id;
    }
  } else {
    if (id === null) {
    } else {
      where.communityId = id;
    }
  }

  const orderBy: Prisma.PostOrderByWithRelationInput =
    orderByType === "new"
      ? {
          createdAt: "desc",
        }
      : {
          score: "desc",
        };

  const posts = await prisma.post.findMany({
    where,
    orderBy,
    include: {
      author: true,
      community: true,
      _count: {
        select: {
          comment: true,
        },
      },
    },
    skip,
    cursor,
    take,
  });

  const results = await Promise.all(
    posts.map(async (post) => {
      const userVote = await prisma.vote.findUnique({
        where: {
          profileId_targetType_targetId: {
            profileId: profile.id,
            targetType: "POST",
            targetId: post.id,
          },
        },
      });

      return {
        ...post,
        userScore: (userVote?.value as Score) || 0,
      };
    }),
  );

  return results;
}
