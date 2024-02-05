import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from "react";

export const initialProfile = async (): Promise<User | null> => {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/login");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
  });

  return userData;
};

export async function getProfile(id: string) {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      username: id,
    },
    include: {
      communitiesAsMember: true,
      communitiesAsModerator: true,
    },
  });

  return userData;
}

export const getCurrentUser = cache(async () => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Not logged in");
  }

  return user;
});
