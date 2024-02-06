import { github, lucia } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<Response> {
  // Check that url, code, state, and storedState are all valid
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response("Missing OAuth details", {
      status: 400,
    });
  }

  try {
    // Validate code
    const tokens = await github.validateAuthorizationCode(code);

    // Get GitHub user
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    // Get email(s)
    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const emails: Email[] = await emailsResponse.json();

    const primaryEmail = emails.find((email: any) => email.primary) ?? null;
    if (!primaryEmail) {
      return new Response("No primary email address", {
        status: 400,
      });
    }
    if (!primaryEmail.verified) {
      return new Response("Unverified email", {
        status: 400,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: primaryEmail.email,
      },
    });

    // If user is found, create session
    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
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
    const user = await prisma.user.create({
      data: {
        username: "",
        email: primaryEmail.email,
        avatarUrl: githubUser.avatar_url,
      },
      select: {
        id: true,
      },
    });

    // const account = await prisma.oAuthAccount.create({
    //   data: {
    //     providerId: Provider.GITHUB,
    //     providerUserId: githubUser.id.toString(),
    //     userId: user.id,
    //   },
    // });

    const session = await lucia.createSession(user.id, {});
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

interface Email {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: "private" | "public";
}
