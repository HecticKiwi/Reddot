import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const sessionTable = pgTable("Session", {
  id: text("id").primaryKey(),
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
  id: uuid("id").primaryKey(),
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
  id: serial("id").primaryKey(),
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
    communityId: integer("A")
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
  id: serial("id").primaryKey(),

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
