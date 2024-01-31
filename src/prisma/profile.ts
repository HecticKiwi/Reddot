import prisma from "@/lib/prisma";
import { Prisma, Profile } from "@prisma/client";
import { cache } from "react";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const initialProfile = async (): Promise<Profile | null> => {
  const user = await getUser();

  if (!user) {
    return redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  return profile;
};

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

export const getCurrentProfile = cache(async () => {
  const { id } = await getUser();

  if (!id) {
    throw new Error("Profile doesn't exist");
  }

  console.time("auth");
  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: id,
    },
    include: {
      communitiesAsMember: true,
      communitiesAsModerator: true,
    },
  });
  console.timeEnd("auth");

  if (!profile) {
    throw new Error("Profile doesn't exist");
  }

  return profile;
});

export async function getCurrentUser() {
  const user = await getUser();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
