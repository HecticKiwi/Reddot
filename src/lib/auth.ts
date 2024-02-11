import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { GitHub, Google } from "arctic";
import { Lucia, Session, User } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";

import { db } from "./drizzle";
import { and, eq } from "drizzle-orm";
import {
  Community,
  session,
  userTable,
  User as DrizzleUser,
} from "../../drizzle/schema";

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

const adapter = new DrizzlePostgreSQLAdapter(db, session, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
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

    const test = await db.query.userTable.findFirst({
      with: {
        communitiesAsModerator: {
          columns: {},
          with: {
            community: true,
          },
        },
        communitiesAsMember: {
          columns: {},
          with: {
            community: true,
          },
        },
      },
    });

    result.user = test as unknown as User;

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
