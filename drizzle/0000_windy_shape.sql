CREATE TYPE "public"."account_type" AS ENUM('host', 'student', 'owner');--> statement-breakpoint
CREATE TYPE "public"."jobtype_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "JobApplications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"jobs_id" uuid,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"email_address" varchar(64) NOT NULL,
	"resume_url" text NOT NULL,
	"notice_period" integer NOT NULL,
	"draft" boolean NOT NULL,
	"user_id" uuid,
	"status" "jobtype_status" NOT NULL,
	CONSTRAINT "JobApplications_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "JobQuestionResponses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "JobQuestionResponses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"questions_id" integer,
	"job_application_id" uuid,
	"content" varchar(512) NOT NULL,
	CONSTRAINT "JobQuestionResponses_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "JobTypes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "JobTypes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	CONSTRAINT "JobTypes_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "Jobs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"min_rate" real NOT NULL,
	"max_rate" real NOT NULL,
	"description" text NOT NULL,
	"job_type_id" integer,
	"draft" boolean NOT NULL,
	"user_id" uuid,
	CONSTRAINT "Jobs_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "Questions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Questions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"jobs_id" uuid,
	"content" varchar(255) NOT NULL,
	"type" boolean NOT NULL,
	"draft" boolean NOT NULL,
	CONSTRAINT "Questions_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "Users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"account_type" "account_type" NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(64) NOT NULL,
	"password" text NOT NULL,
	"activation_code" varchar(255),
	CONSTRAINT "Users_id_unique" UNIQUE("id"),
	CONSTRAINT "Users_email_unique" UNIQUE("email"),
	CONSTRAINT "Users_activation_code_unique" UNIQUE("activation_code")
);
--> statement-breakpoint
ALTER TABLE "JobApplications" ADD CONSTRAINT "JobApplications_jobs_id_Jobs_id_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."Jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "JobApplications" ADD CONSTRAINT "JobApplications_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "JobQuestionResponses" ADD CONSTRAINT "JobQuestionResponses_questions_id_Questions_id_fk" FOREIGN KEY ("questions_id") REFERENCES "public"."Questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "JobQuestionResponses" ADD CONSTRAINT "JobQuestionResponses_job_application_id_JobApplications_id_fk" FOREIGN KEY ("job_application_id") REFERENCES "public"."JobApplications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_job_type_id_JobTypes_id_fk" FOREIGN KEY ("job_type_id") REFERENCES "public"."JobTypes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_jobs_id_Jobs_id_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."Jobs"("id") ON DELETE cascade ON UPDATE no action;