ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "_communityMods" DROP CONSTRAINT "_communityMods_A_Community_id_fk";
--> statement-breakpoint
ALTER TABLE "_communityMods" DROP CONSTRAINT "_communityMods_B_User_id_fk";
--> statement-breakpoint
ALTER TABLE "_CommunityToUser" DROP CONSTRAINT "_CommunityToUser_A_Community_id_fk";
--> statement-breakpoint
ALTER TABLE "_CommunityToUser" DROP CONSTRAINT "_CommunityToUser_B_User_id_fk";
--> statement-breakpoint
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "Post" DROP CONSTRAINT "Post_communityId_Community_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "_communityMods_B_index";--> statement-breakpoint
DROP INDEX IF EXISTS "_CommunityToUser_B_index";--> statement-breakpoint
DROP INDEX IF EXISTS "_communityMods_AB_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "_CommunityToUser_AB_unique";--> statement-breakpoint
ALTER TABLE "Comment" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "Comment" ALTER COLUMN "authorId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Comment" ALTER COLUMN "parentId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Comment" ALTER COLUMN "parentId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "Community" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "OAuthAccount" ALTER COLUMN "userId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Post" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "Vote" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "Vote" ALTER COLUMN "userId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Vote" ALTER COLUMN "userId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "_communityMods" ADD COLUMN "communityName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "_communityMods" ADD COLUMN "userId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "_CommunityToUser" ADD COLUMN "communityName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "_CommunityToUser" ADD COLUMN "userId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "Post" ADD COLUMN "authorName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Post" ADD COLUMN "communityName" text NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_communityMods_userId_index" ON "_communityMods" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "_CommunityToUser_userId_index" ON "_CommunityToUser" ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_communityMods_AB_unique" ON "_communityMods" ("communityName","userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "_CommunityToUser_AB_unique" ON "_CommunityToUser" ("communityName","userId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_User_username_fk" FOREIGN KEY ("authorId") REFERENCES "User"("username") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_communityMods" ADD CONSTRAINT "_communityMods_communityName_Community_name_fk" FOREIGN KEY ("communityName") REFERENCES "Community"("name") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_communityMods" ADD CONSTRAINT "_communityMods_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_CommunityToUser" ADD CONSTRAINT "_CommunityToUser_communityName_Community_name_fk" FOREIGN KEY ("communityName") REFERENCES "Community"("name") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_CommunityToUser" ADD CONSTRAINT "_CommunityToUser_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post" ADD CONSTRAINT "Post_authorName_User_username_fk" FOREIGN KEY ("authorName") REFERENCES "User"("username") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post" ADD CONSTRAINT "Post_communityName_Community_name_fk" FOREIGN KEY ("communityName") REFERENCES "Community"("name") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Vote" ADD CONSTRAINT "Vote_postId_Post_id_fk" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Vote" ADD CONSTRAINT "Vote_commentId_Comment_id_fk" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "_communityMods" DROP COLUMN IF EXISTS "A";--> statement-breakpoint
ALTER TABLE "_communityMods" DROP COLUMN IF EXISTS "B";--> statement-breakpoint
ALTER TABLE "_CommunityToUser" DROP COLUMN IF EXISTS "A";--> statement-breakpoint
ALTER TABLE "_CommunityToUser" DROP COLUMN IF EXISTS "B";--> statement-breakpoint
ALTER TABLE "Post" DROP COLUMN IF EXISTS "authorId";--> statement-breakpoint
ALTER TABLE "Post" DROP COLUMN IF EXISTS "communityId";--> statement-breakpoint
ALTER TABLE "Community" ADD CONSTRAINT "Community_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_username_unique" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_postId_commentId_unique" UNIQUE("userId","postId","commentId");