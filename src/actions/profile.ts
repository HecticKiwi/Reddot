"use server";

import prisma from "@/lib/prisma";
import { Prisma, Profile } from "@prisma/client";
import { Score } from "./post";
import { getCurrentProfile, getCurrentUser } from "@/prisma/profile";
import { getUser } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

export async function isUsernameAvailable(username: string) {
  const profile = await prisma.profile.findUnique({
    where: {
      username,
    },
  });

  return !profile;
}

export async function createProfile(username: string) {
  const user = await getUser();

  if (!user) {
    throw new Error("Not signed in");
  }

  const profile = await prisma.profile.create({
    data: {
      username,
      clerkId: user.id,
      clerkEmailAddress: user.email ?? "",
      clerkImageUrl: "",
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

export const signOut = async () => {
  "use server";
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  redirect("/login");
};
