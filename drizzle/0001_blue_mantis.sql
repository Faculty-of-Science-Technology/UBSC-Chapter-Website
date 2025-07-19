CREATE TYPE "public"."group_type" AS ENUM('STANDARD', 'COMMITTEE');--> statement-breakpoint
CREATE TYPE "public"."post_type" AS ENUM('EVENT', 'BLOG');--> statement-breakpoint
CREATE TYPE "public"."role_type" AS ENUM('ADMIN', 'MODERATOR', 'EVENT_MANAGER', 'USER_MANAGER', 'CONTENT_MANAGER', 'MEMBER');--> statement-breakpoint
CREATE TABLE "Agenda" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" varchar(255),
	"body" text NOT NULL,
	"start_time" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"user_id" uuid,
	"__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "AgendaEvents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"agenda_id" uuid,
	"title" varchar(255) NOT NULL,
	"subtitle" varchar(255),
	"body" text NOT NULL,
	"speaker_name" varchar(255),
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "EventAttendees" (
	"id" uuid PRIMARY KEY NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'attending' NOT NULL,
	"__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "GroupMembers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"group_id" uuid,
	"user_id" uuid,
	"__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Groups" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" "group_type" DEFAULT 'STANDARD' NOT NULL,
	"agenda_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" uuid,
	"__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "InviteCodeUsage" (
	"id" uuid PRIMARY KEY NOT NULL,
	"invite_code_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"used_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "InviteCodeUsage_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "InviteCodes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" varchar(32) NOT NULL,
	"created_by" uuid NOT NULL,
	"max_uses" integer DEFAULT 1 NOT NULL,
	"current_uses" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	"__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "InviteCodes_id_unique" UNIQUE("id"),
	CONSTRAINT "InviteCodes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "MediaPool" (
	"id" text PRIMARY KEY NOT NULL,
	"file" "bytea" NOT NULL,
	"mime_type" varchar(64) NOT NULL,
	"__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "MediaPool_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "PostTags" (
	"id" uuid PRIMARY KEY NOT NULL,
	"post_id" uuid NOT NULL,
	"tag_name" varchar(50) NOT NULL,
	"__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Posts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"type" "post_type" NOT NULL,
	"author_id" uuid NOT NULL,
	"featured_image" text,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"event_start_time" timestamp with time zone,
	"event_end_time" timestamp with time zone,
	"event_location" varchar(255),
	"event_max_attendees" integer,
	"event_current_attendees" integer DEFAULT 0 NOT NULL,
	"agenda_id" uuid,
	"__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"__updated_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "Posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "Roles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"type" "role_type" NOT NULL,
	"can_manage_users" boolean DEFAULT false NOT NULL,
	"can_manage_events" boolean DEFAULT false NOT NULL,
	"can_manage_groups" boolean DEFAULT false NOT NULL,
	"can_manage_posts" boolean DEFAULT false NOT NULL,
	"can_edit_others_posts" boolean DEFAULT false NOT NULL,
	"can_manage_roles" boolean DEFAULT false NOT NULL,
	"can_manage_invites" boolean DEFAULT false NOT NULL,
	"can_manage_theme" boolean DEFAULT false NOT NULL,
	"__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "Roles_id_unique" UNIQUE("id"),
	CONSTRAINT "Roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "ThemeSettings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"primary_color" varchar(7) DEFAULT '#3B82F6' NOT NULL,
	"secondary_color" varchar(7) DEFAULT '#1E40AF' NOT NULL,
	"accent_color" varchar(7) DEFAULT '#F59E0B' NOT NULL,
	"background_color" varchar(7) DEFAULT '#FFFFFF' NOT NULL,
	"text_color" varchar(7) DEFAULT '#1F2937' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_by" uuid,
	"__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"__updated_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "ThemeSettings_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "UserRoles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"assigned_by" uuid,
	"__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "UserRoles_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "UserSkills" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"name" varchar(64) NOT NULL,
	"__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserSocialLinks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"platform" varchar(32) NOT NULL,
	"url" varchar(255) NOT NULL,
	"__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "JobApplications" ADD COLUMN "__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "JobQuestionResponses" ADD COLUMN "__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "JobTypes" ADD COLUMN "__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "Jobs" ADD COLUMN "deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "Jobs" ADD COLUMN "__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "Questions" ADD COLUMN "__created_at__" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "administrator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "phone" varchar(15);--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "location" varchar(255);--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "profile_picture" text;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "cover_photo" text;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "username" varchar(16) NOT NULL;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "resume_url" text;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "hidden" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "invite_code_used" varchar(255);--> statement-breakpoint
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AgendaEvents" ADD CONSTRAINT "AgendaEvents_agenda_id_Agenda_id_fk" FOREIGN KEY ("agenda_id") REFERENCES "public"."Agenda"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "EventAttendees" ADD CONSTRAINT "EventAttendees_post_id_Posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."Posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "EventAttendees" ADD CONSTRAINT "EventAttendees_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GroupMembers" ADD CONSTRAINT "GroupMembers_group_id_Groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."Groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GroupMembers" ADD CONSTRAINT "GroupMembers_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_agenda_id_Agenda_id_fk" FOREIGN KEY ("agenda_id") REFERENCES "public"."Agenda"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_created_by_Users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "InviteCodeUsage" ADD CONSTRAINT "InviteCodeUsage_invite_code_id_InviteCodes_id_fk" FOREIGN KEY ("invite_code_id") REFERENCES "public"."InviteCodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "InviteCodeUsage" ADD CONSTRAINT "InviteCodeUsage_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "InviteCodes" ADD CONSTRAINT "InviteCodes_created_by_Users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PostTags" ADD CONSTRAINT "PostTags_post_id_Posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."Posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_author_id_Users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_agenda_id_Agenda_id_fk" FOREIGN KEY ("agenda_id") REFERENCES "public"."Agenda"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ThemeSettings" ADD CONSTRAINT "ThemeSettings_updated_by_Users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_role_id_Roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."Roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_assigned_by_Users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserSkills" ADD CONSTRAINT "UserSkills_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserSocialLinks" ADD CONSTRAINT "UserSocialLinks_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Users" ADD CONSTRAINT "Users_username_unique" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "public"."Users" ALTER COLUMN "account_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."account_type";--> statement-breakpoint
CREATE TYPE "public"."account_type" AS ENUM('org', 'student', 'owner');--> statement-breakpoint
ALTER TABLE "public"."Users" ALTER COLUMN "account_type" SET DATA TYPE "public"."account_type" USING "account_type"::"public"."account_type";