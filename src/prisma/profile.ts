import {
  auth,
  clerkClient,
  currentUser,
  redirectToSignIn,
} from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { User } from "@clerk/nextjs/server";
import { Prisma, Profile } from "@prisma/client";

export async function initialProfile(): Promise<Profile | null> {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  return profile;
}

export async function getProfile(id: number) {
  const profile = await prisma.profile.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      communitiesAsMember: true,
      communitiesAsModerator: true,
    },
  });

  return profile;
}

export async function getCurrentProfile() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Profile doesn't exist");
  }

  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: userId,
    },
    include: {
      communitiesAsMember: true,
      communitiesAsModerator: true,
    },
  });

  if (!profile) {
    throw new Error("Profile doesn't exist");
  }

  return profile;
}
