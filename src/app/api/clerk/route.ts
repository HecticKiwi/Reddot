import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const payload: WebhookEvent = await request.json();
    const userJson = payload.data as UserJSON;
    console.log(userJson);
    console.log(userJson.image_url);

    await prisma.profile.update({
      where: {
        clerkId: userJson.id,
      },
      data: {
        clerkImageUrl: userJson.image_url,
      },
    });

    return Response.json({ message: "Received" });
  } catch (error) {
    return NextResponse.error();
  }
}

export async function GET() {
  return NextResponse.json({ message: "Hello world" });
}
