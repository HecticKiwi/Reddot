"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/prisma/profile";
import { User } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function isUsernameAvailable(username: string) {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  return !user;
}

export async function updateProfile(data: Partial<User>) {
  const user = await getCurrentUser();

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data,
  });

  return updatedUser;
}
