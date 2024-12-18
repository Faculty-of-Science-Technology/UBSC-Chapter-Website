import { relations, sql } from 'drizzle-orm';
import {
	boolean,
	date,
	integer,
	pgEnum,
	pgTable,
	real,
	text,
	timestamp,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';

export const accountTypeEnum = pgEnum('account_type', ['host', 'student', 'owner']);
export const jobTypeStatusEnum = pgEnum('jobtype_status', ['pending', 'approved', 'rejected']);

export const Users = pgTable('Users', {
	Id: uuid('id')
		.$defaultFn(() => sql.raw('uuid_generate_v4()'))
		.unique()
		.primaryKey(),
	AccountType: accountTypeEnum('account_type').notNull(),
	FirstName: varchar('first_name', { length: 255 }).notNull(),
	LastName: varchar('last_name', { length: 255 }).notNull(),
	Email: varchar('email', { length: 64 }).unique().notNull(),
	Password: text('password').notNull(),
	ActivationCode: varchar('activation_code', { length: 255 }).unique(),
	Bio: varchar('bio', { length: 255 }),
	Hireable: boolean('hireable').notNull().default(false),
	CreatedAt: date('__created_at__')
		.default(sql`CURRENT_DATE`)
		.notNull()
	//Session: text('session').unique(),
});

export const JobTypes = pgTable('JobTypes', {
	Id: integer('id').unique().primaryKey().generatedAlwaysAsIdentity(),
	Name: varchar('name', { length: 255 }).notNull(),
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

export const Questions = pgTable('Questions', {
	Id: integer('id').unique().primaryKey().generatedAlwaysAsIdentity(),
	JobsId: uuid('jobs_id').references(() => Jobs.Id, { onDelete: 'cascade' }),
	Content: varchar('content', { length: 255 }).notNull(),
	Type: boolean('type').notNull(),
	Draft: boolean('draft').notNull(),
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

export const Jobs = pgTable('Jobs', {
	Id: uuid('id')
		.$defaultFn(() => sql.raw('uuid_generate_v4()'))
		.unique()
		.primaryKey(),
	Title: varchar('title', { length: 255 }).notNull(),
	MinRate: real('min_rate').notNull(),
	MaxRate: real('max_rate').notNull(),
	Description: text('description').notNull(),
	JobTypeId: integer('job_type_id').references(() => JobTypes.Id, { onDelete: 'cascade' }),
	Draft: boolean('draft').notNull(),
	UserId: uuid('user_id').references(() => Users.Id, { onDelete: 'cascade' }),
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

export const JobApplications = pgTable('JobApplications', {
	Id: uuid('id')
		.$defaultFn(() => sql.raw('uuid_generate_v4()'))
		.unique()
		.primaryKey(),
	JobsId: uuid('jobs_id').references(() => Jobs.Id, { onDelete: 'cascade' }),
	FirstName: varchar('first_name', { length: 255 }).notNull(),
	LastName: varchar('last_name', { length: 255 }).notNull(),
	PhoneNumber: varchar('phone_number', { length: 15 }).notNull(),
	EmailAddress: varchar('email_address', { length: 64 }).notNull(),
	ResumeUrl: text('resume_url').notNull(),
	NoticePeriod: integer('notice_period').notNull(),
	Draft: boolean('draft').notNull(),
	UserId: uuid('user_id').references(() => Users.Id, { onDelete: 'cascade' }),
	Status: jobTypeStatusEnum('status').notNull(),
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

export const JobQuestionResponses = pgTable('JobQuestionResponses', {
	Id: integer('id').unique().primaryKey().generatedAlwaysAsIdentity(),
	QuestionsId: integer('questions_id').references(() => Questions.Id, { onDelete: 'cascade' }),
	JobApplicationId: uuid('job_application_id').references(() => JobApplications.Id, {
		onDelete: 'cascade'
	}),
	Content: varchar('content', { length: 512 }).notNull(),
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

// Database relations
export const UsersRelations = relations(Users, ({ many }) => ({
	jobs: many(Jobs),
	jobApplications: many(JobApplications)
}));

export const JobTypesRelations = relations(JobTypes, ({ many }) => ({
	jobs: many(Jobs)
}));

export const JobsRelations = relations(Jobs, ({ one, many }) => ({
	jobType: one(JobTypes, {
		fields: [Jobs.JobTypeId],
		references: [JobTypes.Id]
	}),
	user: one(Users, {
		fields: [Jobs.UserId],
		references: [Users.Id]
	}),
	questions: many(Questions),
	jobApplications: many(JobApplications)
}));

export const QuestionsRelations = relations(Questions, ({ one, many }) => ({
	job: one(Jobs, {
		fields: [Questions.JobsId],
		references: [Jobs.Id]
	}),
	jobQuestionResponses: many(JobQuestionResponses)
}));

export const JobApplicationsRelations = relations(JobApplications, ({ one, many }) => ({
	job: one(Jobs, {
		fields: [JobApplications.JobsId],
		references: [Jobs.Id]
	}),
	user: one(Users, {
		fields: [JobApplications.UserId],
		references: [Users.Id]
	}),
	jobQuestionResponses: many(JobQuestionResponses)
}));

export const JobQuestionResponsesRelations = relations(JobQuestionResponses, ({ one }) => ({
	question: one(Questions, {
		fields: [JobQuestionResponses.QuestionsId],
		references: [Questions.Id]
	}),
	jobApplication: one(JobApplications, {
		fields: [JobQuestionResponses.JobApplicationId],
		references: [JobApplications.Id]
	})
}));
