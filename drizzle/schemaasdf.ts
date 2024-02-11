import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const v4ID = (name: string) =>
  varchar(name, { length: 36 }).$defaultFn(() => crypto.randomUUID());

export const sessionTable = pgTable("Session", {
  id: v4ID("id").primaryKey(),

  userId: text("userId")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expiresAt", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const sessionRelations = relations(sessionTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export const userTable = pgTable("User", {
  id: v4ID("id").primaryKey(),

  email: text("email"),
  username: text("username"),
  avatarUrl: text("avatarUrl"),
  about: text("about"),
  score: integer("score"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const userRelations = relations(userTable, ({ one, many }) => ({
  sessions: many(sessionTable),
  communitiesAsModerator: many(modUsersToCommunities),
}));

export const communityTable = pgTable("Community", {
  id: v4ID("id").primaryKey(),

  name: text("name").unique(),
  description: text("description").notNull(),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const communityRelations = relations(communityTable, ({ many }) => ({
  moderators: many(modUsersToCommunities),
}));

export const modUsersToCommunities = pgTable(
  "_communityMods",
  {
    userId: text("B")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    communityId: text("A")
      .notNull()
      .references(() => communityTable.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.userId, t.communityId],
    }),
  }),
);

export const modUsersToCommunitiesRelations = relations(
  modUsersToCommunities,
  ({ one }) => ({
    community: one(communityTable, {
      fields: [modUsersToCommunities.communityId],
      references: [communityTable.id],
    }),
    user: one(userTable, {
      fields: [modUsersToCommunities.userId],
      references: [userTable.id],
    }),
  }),
);

export const postTable = pgTable("Post", {
  id: v4ID("id").primaryKey(),

  title: text("title").notNull(),
  content: text("content").notNull(),
  mediaUrl: text("mediaUrl"),
  removed: boolean("removed").default(false),
  score: integer("score").default(0),

  authorId: text("authorId").references(() => userTable.id, {
    onDelete: "cascade",
  }),
  communityId: text("communityId").references(() => communityTable.id, {
    onDelete: "cascade",
  }),
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
}));

export const commentTable = pgTable("Comment", {
  id: v4ID("id").primaryKey(),

  content: text("content"),
  score: integer("score").default(0),
  deleted: boolean("deleted").default(false),

  createdAt: timestamp("createdAt").defaultNow(),

  parentCommentId: text("parentCommentId"),
  authorId: text("authorId").references(() => userTable.id, {
    onDelete: "cascade",
  }),
  postId: text("postId").references(() => postTable.id, {
    onDelete: "cascade",
  }),
});

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
    id: v4ID("id").primaryKey(),

    value: text("value"),
    // targetType: voteTargetEnum("targetType"),
    targetId: text("targetId"),

    userId: text("userId"),
  },
  // (t) => ({
  //   pk: primaryKey({
  //     columns: [t.targetType, t.targetId],
  //   }),
  // }),
);

export const voteRelations = relations(voteTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [voteTable.userId],
    references: [userTable.id],
  }),
}));
