ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";
--> statement-breakpoint
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";
--> statement-breakpoint
ALTER TABLE "Post" DROP CONSTRAINT "Post_communityId_fkey";
--> statement-breakpoint
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";
--> statement-breakpoint
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";
--> statement-breakpoint
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentId_fkey";
--> statement-breakpoint
ALTER TABLE "OAuthAccount" DROP CONSTRAINT "OAuthAccount_userId_fkey";
--> statement-breakpoint
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_userId_fkey";
--> statement-breakpoint
ALTER TABLE "_communityMods" DROP CONSTRAINT "_communityMods_A_fkey";
--> statement-breakpoint
ALTER TABLE "_communityMods" DROP CONSTRAINT "_communityMods_B_fkey";
--> statement-breakpoint
ALTER TABLE "_CommunityToUser" DROP CONSTRAINT "_CommunityToUser_A_fkey";
--> statement-breakpoint
ALTER TABLE "_CommunityToUser" DROP CONSTRAINT "_CommunityToUser_B_fkey";
--> statement-breakpoint
DROP INDEX IF EXISTS "Vote_userId_targetType_targetId_key";--> statement-breakpoint
ALTER TABLE "Session" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "Session" ALTER COLUMN "userId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Session" ALTER COLUMN "expiresAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "Post" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "Post" ALTER COLUMN "authorId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Post" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Community" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Comment" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "Comment" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Comment" ALTER COLUMN "authorId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Comment" ALTER COLUMN "postId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Comment" ALTER COLUMN "parentId" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "Comment" ALTER COLUMN "parentId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Vote" ADD COLUMN "postId" integer;--> statement-breakpoint
ALTER TABLE "Vote" ADD COLUMN "commentId" integer;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Vote_userId_targetType_targetId_key" ON "Vote" ("userId","postId","commentId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_User_id_fk" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post" ADD CONSTRAINT "Post_communityId_Community_id_fk" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_User_id_fk" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_Post_id_fk" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "OAuthAccount" ADD CONSTRAINT "OAuthAccount_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_communityMods" ADD CONSTRAINT "_communityMods_A_Community_id_fk" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_communityMods" ADD CONSTRAINT "_communityMods_B_User_id_fk" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_CommunityToUser" ADD CONSTRAINT "_CommunityToUser_A_Community_id_fk" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_CommunityToUser" ADD CONSTRAINT "_CommunityToUser_B_User_id_fk" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "Vote" DROP COLUMN IF EXISTS "targetType";--> statement-breakpoint
ALTER TABLE "Vote" DROP COLUMN IF EXISTS "targetId";