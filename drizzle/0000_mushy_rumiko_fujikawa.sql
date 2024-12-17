-- Add new types if they don't exist
IF NOT EXISTS (SELECT * FROM sys.types WHERE name = 'account_type')
BEGIN
	EXEC sp_addtype 'account_type', 'VARCHAR(50)', 'NOT NULL';
END;

IF NOT EXISTS (SELECT * FROM sys.types WHERE name = 'jobtype_status')
BEGIN
	EXEC sp_addtype 'jobtype_status', 'VARCHAR(50)', 'NOT NULL';
END;

-- Modify existing tables
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'JobApplications' AND COLUMN_NAME = 'jobs_id')
	ALTER TABLE [JobApplications] ADD [jobs_id] UNIQUEIDENTIFIER;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'JobApplications' AND COLUMN_NAME = 'first_name')
	ALTER TABLE [JobApplications] ADD [first_name] VARCHAR(255) NOT NULL;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'JobApplications' AND COLUMN_NAME = 'last_name')
	ALTER TABLE [JobApplications] ADD [last_name] VARCHAR(255) NOT NULL;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'JobApplications' AND COLUMN_NAME = 'phone_number')
	ALTER TABLE [JobApplications] ADD [phone_number] VARCHAR(15) NOT NULL;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'JobApplications' AND COLUMN_NAME = 'email_address')
	ALTER TABLE [JobApplications] ADD [email_address] VARCHAR(64) NOT NULL;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'JobApplications' AND COLUMN_NAME = 'resume_url')
	ALTER TABLE [JobApplications] ADD [resume_url] TEXT NOT NULL;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'JobApplications' AND COLUMN_NAME = 'notice_period')
	ALTER TABLE [JobApplications] ADD [notice_period] INT NOT NULL;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'JobApplications' AND COLUMN_NAME = 'draft')
	ALTER TABLE [JobApplications] ADD [draft] BIT NOT NULL;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'JobApplications' AND COLUMN_NAME = 'user_id')
	ALTER TABLE [JobApplications] ADD [user_id] UNIQUEIDENTIFIER;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'JobApplications' AND COLUMN_NAME = 'status')
	ALTER TABLE [JobApplications] ADD [status] VARCHAR(50) NOT NULL;
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'JobApplications_id_unique')
	ALTER TABLE [JobApplications] ADD CONSTRAINT [JobApplications_id_unique] UNIQUE([id]);

ALTER TABLE "JobQuestionResponses"
	ADD COLUMN IF NOT EXISTS "questions_id" integer,
	ADD COLUMN IF NOT EXISTS "job_application_id" uuid,
	ADD COLUMN IF NOT EXISTS "content" varchar(512) NOT NULL,
	ADD CONSTRAINT "JobQuestionResponses_id_unique" UNIQUE("id");

ALTER TABLE "JobTypes"
	ADD COLUMN IF NOT EXISTS "name" varchar(255) NOT NULL,
	ADD CONSTRAINT "JobTypes_id_unique" UNIQUE("id");

ALTER TABLE "Jobs"
	ADD COLUMN IF NOT EXISTS "title" varchar(255) NOT NULL,
	ADD COLUMN IF NOT EXISTS "min_rate" real NOT NULL,
	ADD COLUMN IF NOT EXISTS "max_rate" real NOT NULL,
	ADD COLUMN IF NOT EXISTS "description" text NOT NULL,
	ADD COLUMN IF NOT EXISTS "job_type_id" integer,
	ADD COLUMN IF NOT EXISTS "draft" boolean NOT NULL,
	ADD COLUMN IF NOT EXISTS "user_id" uuid,
	ADD CONSTRAINT "Jobs_id_unique" UNIQUE("id");

ALTER TABLE "Questions"
	ADD COLUMN IF NOT EXISTS "jobs_id" uuid,
	ADD COLUMN IF NOT EXISTS "content" varchar(255) NOT NULL,
	ADD COLUMN IF NOT EXISTS "type" boolean NOT NULL,
	ADD COLUMN IF NOT EXISTS "draft" boolean NOT NULL,
	ADD CONSTRAINT "Questions_id_unique" UNIQUE("id");

ALTER TABLE "Users"
	ADD COLUMN IF NOT EXISTS "account_type" "account_type" NOT NULL,
	ADD COLUMN IF NOT EXISTS "first_name" varchar(255) NOT NULL,
	ADD COLUMN IF NOT EXISTS "last_name" varchar(255) NOT NULL,
	ADD COLUMN IF NOT EXISTS "email" varchar(64) NOT NULL,
	ADD COLUMN IF NOT EXISTS "password" text NOT NULL,
	ADD COLUMN IF NOT EXISTS "activation_code" varchar(255),
	ADD COLUMN IF NOT EXISTS "bio" varchar(255),
	ADD COLUMN IF NOT EXISTS "__created_at__" date DEFAULT CURRENT_DATE NOT NULL,
	ADD COLUMN IF NOT EXISTS "hireable" boolean DEFAULT false NOT NULL,
	ADD CONSTRAINT "Users_id_unique" UNIQUE("id"),
	ADD CONSTRAINT "Users_email_unique" UNIQUE("email"),
	ADD CONSTRAINT "Users_activation_code_unique" UNIQUE("activation_code");

-- Add foreign key constraints
ALTER TABLE "JobApplications" ADD CONSTRAINT "JobApplications_jobs_id_Jobs_id_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."Jobs"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "JobApplications" ADD CONSTRAINT "JobApplications_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "JobQuestionResponses" ADD CONSTRAINT "JobQuestionResponses_questions_id_Questions_id_fk" FOREIGN KEY ("questions_id") REFERENCES "public"."Questions"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "JobQuestionResponses" ADD CONSTRAINT "JobQuestionResponses_job_application_id_JobApplications_id_fk" FOREIGN KEY ("job_application_id") REFERENCES "public"."JobApplications"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_job_type_id_JobTypes_id_fk" FOREIGN KEY ("job_type_id") REFERENCES "public"."JobTypes"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_jobs_id_Jobs_id_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."Jobs"("id") ON DELETE cascade ON UPDATE no action;