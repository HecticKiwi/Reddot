import { relations } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const sessionTable = pgTable("session", {
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
export type Session = typeof sessionTable.$inferSelect;

export const sessionRelations = relations(sessionTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export const userTable = pgTable(
  "user",
  {
    id: serial("id").primaryKey().notNull(),
    email: text("email").notNull(),
    username: text("username").notNull().unique(),
    avatarUrl: text("avatarUrl"),
    about: text("about"),
    score: integer("score").default(0).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (t) => {
    return {
      emailKey: uniqueIndex("user_email_key").on(t.email),
    };
  },
);
export type User = typeof userTable.$inferSelect;

export const userRelations = relations(userTable, ({ one, many }) => ({
  sessions: many(sessionTable),
  communitiesAsModerator: many(communityMods),
  communitiesAsMember: many(communityToUser),
}));

export const communityTable = pgTable(
  "community",
  {
    id: serial("id").primaryKey().notNull(),
    name: text("name").notNull().unique(),
    description: text("description").notNull(),
    imageUrl: text("imageUrl"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (t) => {
    return {
      nameKey: uniqueIndex("community_name_key").on(t.name),
    };
  },
);
export type Community = typeof communityTable.$inferSelect;

export const communityRelations = relations(communityTable, ({ many }) => ({
  moderators: many(communityMods),
  members: many(communityToUser),
}));

export const postTable = pgTable("post", {
  id: serial("id").primaryKey().notNull(),

  title: text("title").notNull(),
  content: text("content").notNull(),
  mediaUrl: text("mediaUrl"),
  removed: boolean("removed").default(false).notNull(),
  score: integer("score").default(0).notNull(),

  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull(),

  authorName: text("authorName")
    .notNull()
    .references(() => userTable.username, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  communityName: text("communityName")
    .notNull()
    .references(() => communityTable.name, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const postRelations = relations(postTable, ({ one, many }) => ({
  author: one(userTable, {
    fields: [postTable.authorName],
    references: [userTable.username],
  }),
  community: one(communityTable, {
    fields: [postTable.communityName],
    references: [communityTable.name],
  }),
  comments: many(commentTable),
  votes: many(voteTable),
}));

export const commentTable = pgTable(
  "comment",
  {
    id: serial("id").primaryKey().notNull(),
    content: text("content").notNull(),
    score: integer("score").default(0).notNull(),
    deleted: boolean("deleted").default(false).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull(),
    authorName: text("authorId")
      .notNull()
      .references(() => userTable.username, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    postId: integer("postId")
      .notNull()
      .references(() => postTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    parentCommentId: integer("parentId"),
  },
  (t) => {
    return {
      commentParentIdFkey: foreignKey({
        columns: [t.parentCommentId],
        foreignColumns: [t.id],
        name: "comment_parentId_fkey",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  },
);
export type CommentType = typeof commentTable.$inferSelect;

export const commentRelations = relations(commentTable, ({ one, many }) => ({
  parentComment: one(commentTable, {
    fields: [commentTable.parentCommentId],
    references: [commentTable.id],
  }),
  author: one(userTable, {
    fields: [commentTable.authorName],
    references: [userTable.username],
  }),
  post: one(postTable, {
    fields: [commentTable.postId],
    references: [postTable.id],
  }),
  votes: many(voteTable),
}));

export const voteTable = pgTable(
  "vote",
  {
    id: serial("id").primaryKey().notNull(),
    value: integer("value").notNull(),
    userId: integer("userId").references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    postId: integer("postId").references(() => postTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    commentId: integer("commentId").references(() => commentTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  },
  (t) => {
    return {
      voteUnique: unique("voteUnique")
        .on(t.userId, t.postId, t.commentId)
        .nullsNotDistinct(),
      userIdTargetTypeTargetIdKey: uniqueIndex(
        "vote_userId_targetType_targetId_key",
      ).on(t.userId, t.postId, t.commentId),
    };
  },
);
export type Vote = typeof voteTable.$inferSelect;

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
    communityName: text("communityName")
      .notNull()
      .references(() => communityTable.name, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: integer("userId")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      unique: uniqueIndex("_communityMods_unique").on(
        table.communityName,
        table.userId,
      ),
      bIdx: index().on(table.userId),
    };
  },
);

export const communityModsRelations = relations(
  communityMods,
  ({ one, many }) => ({
    user: one(userTable, {
      fields: [communityMods.userId],
      references: [userTable.id],
    }),
    community: one(communityTable, {
      fields: [communityMods.communityName],
      references: [communityTable.name],
    }),
  }),
);

export const communityToUser = pgTable(
  "_communityMembers",
  {
    communityName: text("communityName")
      .notNull()
      .references(() => communityTable.name, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: integer("userId")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_communityToUser_unique").on(
        table.communityName,
        table.userId,
      ),
      bIdx: index().on(table.userId),
    };
  },
);

export const communityToUserRelations = relations(
  communityToUser,
  ({ one, many }) => ({
    user: one(userTable, {
      fields: [communityToUser.userId],
      references: [userTable.id],
    }),
    community: one(communityTable, {
      fields: [communityToUser.communityName],
      references: [communityTable.name],
    }),
  }),
);
