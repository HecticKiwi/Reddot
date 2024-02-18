import { github, google, lucia, validateRequest } from "@/lib/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(): Promise<Response> {
  const { session } = await validateRequest();

  if (session) {
    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }

  return redirect("/login");
}
