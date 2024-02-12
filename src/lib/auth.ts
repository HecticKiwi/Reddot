import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { GitHub, Google } from "arctic";
import { Lucia, Session } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import {
  Community,
  User as DrizzleUser,
  User,
  sessionTable,
  userTable,
} from "../../drizzle/schema";
import { db } from "./drizzle";
import { eq } from "drizzle-orm";

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!,
);

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_CLIENT_REDIRECT_URI!,
);

export type UserWithCommunities = User & {
  communitiesAsMember: {
    community: Community;
  }[];
  communitiesAsModerator: {
    community: Community;
  }[];
};

// Cast to any so I can use some different column types...
const adapter = new DrizzlePostgreSQLAdapter(
  db,
  sessionTable as any,
  userTable as any,
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      // Set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return attributes;
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DrizzleUser;
  }
}

export const validateRequest = cache(
  async (): Promise<
    | { user: UserWithCommunities; session: Session }
    | { user: null; session: null }
  > => {
    // Check the session cookie
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    // next.js throws when you attempt to set cookie when rendering page
    try {
      // If session is valid, refresh cookie if needed
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }

      // If no session or session is invalid, clear session cookie
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}

    //@ts-ignore
    return result;
  },
);
