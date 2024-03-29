import { google, lucia } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { userTable } from "../../../../../../drizzle/schema";

export async function GET(request: Request): Promise<Response> {
  // Check that url, code, state, and storedState are all valid
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const storedCodeVerifier =
    cookies().get("google_oauth_code_verifier")?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !storedCodeVerifier
  ) {
    return new Response("Missing OAuth details", {
      status: 400,
    });
  }

  try {
    // Validate code

    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );

    // Get Google user data
    const googleUserResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
    const googleUser: GoogleUser = await googleUserResponse.json();
    const email = googleUser.email;

    if (!googleUser.email_verified) {
      return new Response("Unverified email", {
        status: 400,
      });
    }

    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    // If user is found, create session
    if (existingUser) {
      const session = await lucia.createSession(existingUser.id.toString(), {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    // Otherwise, create user and OAuth account

    const [user] = await db
      .insert(userTable)
      .values({
        username: `_${crypto.randomUUID()}`,
        email,
        avatarUrl: googleUser.picture,
      })
      .returning();

    const session = await lucia.createSession(user.id.toString(), {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e: any) {
    console.error(e.message);

    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
}

interface GoogleUser {
  sub: string;
  picture: string;
  email: string;
  email_verified: boolean;
}
