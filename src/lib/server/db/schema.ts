import { sql } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, real, text, uuid, varchar } from 'drizzle-orm/pg-core';

export const accountTypeEnum = pgEnum('account_type', ['host', 'student', 'owner']);
export const jobTypeStatusEnum = pgEnum('jobtype_status', ['pending', 'approved', 'rejected']);

export const Users = pgTable('Users', {
	Id: uuid('id').$defaultFn(()=>sql.raw('uuid_generate_v4()')).unique().primaryKey(),
	AccountType: accountTypeEnum('account_type').notNull(),
	FirstName: varchar('first_name', { length: 255 }).notNull(),
	LastName: varchar('last_name', { length: 255 }).notNull(),
	Email: varchar('email', { length: 64 }).unique().notNull(),
	Password: text('password').notNull(),
	ActivationCode: varchar('activation_code', { length: 255 }).unique(),
	//Session: text('session').unique(),
});

export const JobTypes = pgTable('JobTypes', {
	Id: integer('id').unique().primaryKey().generatedAlwaysAsIdentity(),
	Name: varchar('name', { length: 255 }).notNull()
});

export const Questions = pgTable('Questions', {
	Id: integer('id').unique().primaryKey().generatedAlwaysAsIdentity(),
	JobsId: uuid('jobs_id').references(() => Jobs.Id, { onDelete: 'cascade' }),
	Content: varchar('content', { length: 255 }).notNull(),
	Type: boolean('type').notNull(),
	Draft: boolean('draft').notNull()
});

export const Jobs = pgTable('Jobs', {
	Id: uuid('id').$defaultFn(()=>sql.raw('uuid_generate_v4()')).unique().primaryKey(),
	Title: varchar('title', { length: 255 }).notNull(),
	MinRate: real('min_rate').notNull(),
	MmaxRate: real('max_rate').notNull(),
	Description: text('description').notNull(),
	JobTypeId: integer('job_type_id').references(() => JobTypes.Id, { onDelete: 'cascade' }),
	Draft: boolean('draft').notNull(),
	UserId: uuid('user_id').references(() => Users.Id, { onDelete: 'cascade' })
});

export const JobApplications = pgTable('JobApplications', {
	Id: uuid('id').$defaultFn(()=>sql.raw('uuid_generate_v4()')).unique().primaryKey(),
	JobsId: uuid('jobs_id').references(() => Jobs.Id, { onDelete: 'cascade' }),
	FirstName: varchar('first_name', { length: 255 }).notNull(),
	LastName: varchar('last_name', { length: 255 }).notNull(),
	PhoneNumber: varchar('phone_number', { length: 15 }).notNull(),
	EmailAddress: varchar('email_address', { length: 64 }).notNull(),
	ResumeUrl: text('resume_url').notNull(),
	NoticePeriod: integer('notice_period').notNull(),
	Draft: boolean('draft').notNull(),
	UserId: uuid('user_id').references(() => Users.Id, { onDelete: 'cascade' }),
	Status: jobTypeStatusEnum('status').notNull()
});

export const JobQuestionResponses = pgTable('JobQuestionResponses', {
	Id: integer('id').unique().primaryKey().generatedAlwaysAsIdentity(),
	QuestionsId: integer('questions_id').references(() => Questions.Id, { onDelete: 'cascade' }),
	JobApplicationId: uuid('job_application_id').references(() => JobApplications.Id, {
		onDelete: 'cascade'
	}),
	content: varchar('content', { length: 512 }).notNull()
});
