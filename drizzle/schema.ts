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
    userId: integer("userId")
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

  userId: integer("userId")
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
    id: serial("id").primaryKey().notNull(),
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

export const postTable = pgTable("Post", {
  id: serial("id").primaryKey().notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mediaUrl: text("mediaUrl"),
  removed: boolean("removed").default(false).notNull(),
  score: integer("score").default(0).notNull(),
  authorId: integer("authorId")
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

export const postRelations = relations(postTable, ({ one, many }) => ({
  author: one(userTable, {
    fields: [postTable.authorId],
    references: [userTable.id],
  }),
  community: one(communityTable, {
    fields: [postTable.communityId],
    references: [communityTable.id],
  }),
  comments: many(commentTable),
  votes: many(voteTable),
}));

export const commentTable = pgTable(
  "Comment",
  {
    id: serial("id").primaryKey().notNull(),
    content: text("content").notNull(),
    score: integer("score").default(0).notNull(),
    deleted: boolean("deleted").default(false).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    authorId: integer("authorId")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    postId: integer("postId")
      .notNull()
      .references(() => postTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    parentCommentId: serial("parentId"),
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

export const commentRelations = relations(commentTable, ({ one, many }) => ({
  parentComment: one(commentTable, {
    fields: [commentTable.parentCommentId],
    references: [commentTable.id],
  }),
  author: one(userTable, {
    fields: [commentTable.authorId],
    references: [userTable.id],
  }),
  post: one(postTable, {
    fields: [commentTable.postId],
    references: [postTable.id],
  }),
}));

export const voteTable = pgTable(
  "Vote",
  {
    id: text("id").primaryKey().notNull(),
    value: integer("value").notNull(),
    userId: integer("userId")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    postId: integer("postId"),
    commentId: integer("commentId"),
    // targetType: voteTarget("targetType").notNull(),
    // targetId: text("targetId").notNull(),
  },
  (table) => {
    return {
      userIdTargetTypeTargetIdKey: uniqueIndex(
        "Vote_userId_targetType_targetId_key",
      ).on(table.userId, table.postId, table.commentId),
    };
  },
);

export const voteRelations = relations(voteTable, ({ one, many }) => ({
  post: one(postTable, {
    fields: [voteTable.postId],
    references: [postTable.id],
  }),
  comment: one(commentTable, {
    fields: [voteTable.commentId],
    references: [commentTable.id],
  }),
}));

export const communityMods = pgTable(
  "_communityMods",
  {
    a: integer("A")
      .notNull()
      .references(() => communityTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: integer("B")
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
    b: integer("B")
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
