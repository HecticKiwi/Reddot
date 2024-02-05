import prisma from "@/lib/prisma";
import { cache } from "react";

export const getCommunityById = cache(async (id: string) => {
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
