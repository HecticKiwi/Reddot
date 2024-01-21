import { Score } from "@/actions/post";
import prisma from "@/lib/prisma";
import { getCurrentProfile } from "@/prisma/profile";
import { Prisma } from "@prisma/client";

export async function getCommunityById(id: number) {
  return await prisma.community.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      moderators: true,
      members: {
        select: {
          id: true,
        },
      },
    },
  });
}

export async function getPosts({
  communityId,
  pageParam = 0,
  orderBy: orderByType,
}: {
  communityId: number | "all" | null;
  pageParam?: number;
  orderBy: "new" | "top";
}) {
  const profile = await getCurrentProfile();
  console.log("a");

  const take = 10;
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

  if (communityId === "all") {
  } else {
    where.communityId = communityId || {
      in: communitiesAsMemberIds,
    };
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
