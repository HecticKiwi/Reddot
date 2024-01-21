"use server";

import prisma from "@/lib/prisma";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { Prisma, Profile } from "@prisma/client";
import { Score } from "./post";
import { getCurrentProfile } from "@/prisma/profile";

export async function getCurrentUser() {
  const user = await currentUser();
  console.log(user);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function isUsernameAvailable(username: string) {
  const profile = await prisma.profile.findUnique({
    where: {
      username,
    },
  });
  console.log(!profile);

  return !profile;
}

export async function createProfile(username: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not signed in");
  }

  const profile = await prisma.profile.create({
    data: {
      username,
      clerkId: user.id,
      clerkEmailAddress: user.emailAddresses[0].emailAddress,
      clerkImageUrl: user.imageUrl,
    },
  });

  return profile;
}

export async function updateProfile(data: Partial<Profile>) {
  const user = await getCurrentUser();

  const profile = await prisma.profile.update({
    where: {
      clerkId: user.id,
    },
    data,
  });

  return profile;
}
