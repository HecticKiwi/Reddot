import {
  pgTable,
  foreignKey,
  pgEnum,
  text,
  timestamp,
  boolean,
  integer,
  uniqueIndex,
  serial,
  index,
  varchar,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { v4ID } from "./schemaasdf";

export const provider = pgEnum("Provider", ["GOOGLE", "GITHUB"]);
export const voteTarget = pgEnum("VoteTarget", ["COMMENT", "POST"]);

export const oauthAccount = pgTable(
  "OAuthAccount",
  {
    providerId: provider("providerId").notNull(),
    providerUserId: text("providerUserId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      providerIdProviderUserIdKey: uniqueIndex(
        "OAuthAccount_providerId_providerUserId_key",
      ).on(table.providerId, table.providerUserId),
    };
  },
);

export const session = pgTable("Session", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),

  userId: text("userId")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expiresAt", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
export type Session = typeof session.$inferSelect;

export const sessionRelations = relations(session, ({ one, many }) => ({
  user: one(userTable, {
    fields: [session.userId],
    references: [userTable.id],
  }),
}));

export const userTable = pgTable(
  "User",
  {
    id: text("id").primaryKey().notNull(),
    email: text("email").notNull(),
    username: text("username").notNull(),
    avatarUrl: text("avatarUrl"),
    about: text("about"),
    score: integer("score").default(0).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      emailKey: uniqueIndex("User_email_key").on(table.email),
    };
  },
);
export type User = typeof userTable.$inferSelect;

export const userRelations = relations(userTable, ({ one, many }) => ({
  sessions: many(session),
  communitiesAsModerator: many(communityMods),
  communitiesAsMember: many(communityToUser),
}));

export const communityTable = pgTable(
  "Community",
  {
    id: serial("id").primaryKey().notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    imageUrl: text("imageUrl"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      nameKey: uniqueIndex("Community_name_key").on(table.name),
    };
  },
);
export type Community = typeof communityTable.$inferSelect;

export const communityRelations = relations(communityTable, ({ many }) => ({
  moderators: many(communityMods),
  members: many(communityToUser),
}));

export const post = pgTable("Post", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mediaUrl: text("mediaUrl"),
  removed: boolean("removed").default(false).notNull(),
  score: integer("score").default(0).notNull(),
  authorId: text("authorId")
    .notNull()
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  communityId: integer("communityId")
    .notNull()
    .references(() => communityTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const postRelations = relations(post, ({ one, many }) => ({
  author: one(userTable, {
    fields: [post.authorId],
    references: [userTable.id],
  }),
  community: one(communityTable, {
    fields: [post.communityId],
    references: [communityTable.id],
  }),
}));

export const comment = pgTable(
  "Comment",
  {
    id: text("id").primaryKey().notNull(),
    content: text("content").notNull(),
    score: integer("score").default(0).notNull(),
    deleted: boolean("deleted").default(false).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    authorId: text("authorId")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    postId: text("postId")
      .notNull()
      .references(() => post.id, { onDelete: "cascade", onUpdate: "cascade" }),
    parentCommentId: text("parentId"),
  },
  (table) => {
    return {
      commentParentIdFkey: foreignKey({
        columns: [table.parentCommentId],
        foreignColumns: [table.id],
        name: "Comment_parentId_fkey",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  },
);

export const commentRelations = relations(comment, ({ one, many }) => ({
  parentComment: one(comment, {
    fields: [comment.parentCommentId],
    references: [comment.id],
  }),
  author: one(userTable, {
    fields: [comment.authorId],
    references: [userTable.id],
  }),
  post: one(post, {
    fields: [comment.postId],
    references: [post.id],
  }),
}));

export const vote = pgTable(
  "Vote",
  {
    id: text("id").primaryKey().notNull(),
    value: integer("value").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    targetType: voteTarget("targetType").notNull(),
    targetId: text("targetId").notNull(),
  },
  (table) => {
    return {
      userIdTargetTypeTargetIdKey: uniqueIndex(
        "Vote_userId_targetType_targetId_key",
      ).on(table.userId, table.targetType, table.targetId),
    };
  },
);

export const communityMods = pgTable(
  "_communityMods",
  {
    a: integer("A")
      .notNull()
      .references(() => communityTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: text("B")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_communityMods_AB_unique").on(table.a, table.b),
      bIdx: index().on(table.b),
    };
  },
);

export const communityModsRelations = relations(
  communityMods,
  ({ one, many }) => ({
    user: one(userTable, {
      fields: [communityMods.b],
      references: [userTable.id],
    }),
    community: one(communityTable, {
      fields: [communityMods.a],
      references: [communityTable.id],
    }),
  }),
);

export const communityToUser = pgTable(
  "_CommunityToUser",
  {
    a: integer("A")
      .notNull()
      .references(() => communityTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: text("B")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_CommunityToUser_AB_unique").on(table.a, table.b),
      bIdx: index().on(table.b),
    };
  },
);

export const communityToUserRelations = relations(
  communityToUser,
  ({ one, many }) => ({
    user: one(userTable, {
      fields: [communityToUser.b],
      references: [userTable.id],
    }),
    community: one(communityTable, {
      fields: [communityToUser.a],
      references: [communityTable.id],
    }),
  }),
);
