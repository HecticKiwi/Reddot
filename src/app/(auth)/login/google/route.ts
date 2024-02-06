import { github, google } from "@/lib/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["email"],
  });

  const options: Partial<ResponseCookie> = {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "none",
  };

  cookies().set("google_oauth_state", state, options);

  cookies().set("google_oauth_code_verifier", codeVerifier, options);

  return Response.redirect(url);
}
