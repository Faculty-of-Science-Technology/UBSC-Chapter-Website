import { relations, sql } from 'drizzle-orm';
import {
	boolean,
	customType,
	date,
	integer,
	pgEnum,
	pgTable,
	real,
	serial,
	text,
	timestamp,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';

export const accountTypeEnum = pgEnum('account_type', ['org', 'student', 'owner']);
export const jobTypeStatusEnum = pgEnum('jobtype_status', ['pending', 'approved', 'rejected']);
// Apparently, the bytea type is not supported by drizzle-orm, so we have to create a custom type for it
// https://stackoverflow.com/a/76499742/10976415
// Fast implementation
const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
	dataType() {
		return 'bytea';
	},
	toDriver(val: Buffer) {
		return val;
	},
	fromDriver(val: unknown) {
		return (val as Buffer);
	}
});
// Slow-implementation
// export const bytea = customType<{ data: string; notNull: false; default: false }>({
// 	dataType() {
// 		return 'bytea';
// 	},
// 	toDriver(val) {
// 		let newVal = val;
// 		if (val.startsWith('0x')) {
// 			newVal = val.slice(2);
// 		}

// 		return Buffer.from(newVal, 'hex');
// 	},
// 	fromDriver(val: unknown) {
// 		return (val as Buffer).toString('hex');
// 	}
// });

export const Users = pgTable('Users', {
	Id: uuid('id')
		.$defaultFn(() => sql.raw('uuid_generate_v4()'))
		.unique()
		.primaryKey(),
	AccountType: accountTypeEnum('account_type').notNull(),
	Administrator: boolean('administrator').notNull().default(false),
	FirstName: varchar('first_name', { length: 255 }).notNull(),
	LastName: varchar('last_name', { length: 255 }).notNull(),
	Email: varchar('email', { length: 64 }).unique().notNull(),
	Phone: varchar('phone', { length: 15 }),
	Location: varchar('location', { length: 255 }),
	ProfilePicture: text('profile_picture'), // URL to Profile Picture
	CoverPhoto: text('cover_photo'), // URL to Cover Photo
	Password: text('password').notNull(),
	Username: varchar('username', { length: 16 }).unique().notNull(),
	ResumeUrl: text('resume_url'), // MediaPool URL to Resume
	ActivationCode: varchar('activation_code', { length: 255 }).unique(),
	Bio: varchar('bio', { length: 255 }),
	Hireable: boolean('hireable').notNull().default(false),
	Hidden: boolean('hidden').notNull().default(false),
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
	Deleted: boolean('deleted').notNull().default(false),
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

export const UserSkills = pgTable('UserSkills', {
	Id: serial('id').primaryKey(),
	UserId: uuid('user_id').references(() => Users.Id),
	Name: varchar('name', { length: 64 }).notNull(),
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

export const UserSocialLinks = pgTable('UserSocialLinks', {
	Id: serial('id').primaryKey(),
	UserId: uuid('user_id').references(() => Users.Id),
	Platform: varchar('platform', { length: 32 }).notNull(), // 'LinkedIn', 'GitHub', 'Twitter', etc.
	Url: varchar('url', { length: 255 }).notNull(),
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

export const MediaPool = pgTable('MediaPool', {
	Id: text('id').primaryKey().unique().notNull(),
	File: bytea('file').notNull(),
	MimeType: varchar('mime_type', { length: 64 }).notNull(),
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

export const Agenda = pgTable('Agenda', {
    Id: uuid('id').$defaultFn(() => sql.raw('uuid_generate_v4()')).primaryKey(),
    Title: varchar('title', { length: 255 }).notNull(),
    Subtitle: varchar('subtitle', { length: 255 }),
    Body: text('body').notNull(),
    StartTime: timestamp('start_time', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    EndTime: timestamp('end_time', { withTimezone: true }).notNull(),
    UserId: uuid('user_id').references(() => Users.Id, { onDelete: 'cascade' }),
    CreatedAt: timestamp('__created_at__', { withTimezone: true })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull()
});

export const AgendaEvents = pgTable('AgendaEvents', {
    Id: uuid('id').$defaultFn(() => sql.raw('uuid_generate_v4()')).primaryKey(),
    AgendaId: uuid('agenda_id').references(() => Agenda.Id, { onDelete: 'cascade' }),
    Title: varchar('title', { length: 255 }).notNull(),
    Subtitle: varchar('subtitle', { length: 255 }),
    Body: text('body').notNull(),
    SpeakerName: varchar('speaker_name', { length: 255 }),
    StartTime: timestamp('start_time', { withTimezone: true }).notNull(),
    EndTime: timestamp('end_time', { withTimezone: true }).notNull(),
    CreatedAt: timestamp('__created_at__', { withTimezone: true })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull()
});

export const Groups = pgTable('Groups', {
    Id: uuid('id').$defaultFn(() => sql.raw('uuid_generate_v4()')).primaryKey(),
    Title: varchar('title', { length: 255 }).notNull(),
    AgendaId: uuid('agenda_id').references(() => Agenda.Id, { onDelete: 'cascade' }),
    CreatedAt: timestamp('__created_at__', { withTimezone: true })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull()
});

export const GroupMembers = pgTable('GroupMembers', {
    Id: uuid('id').$defaultFn(() => sql.raw('uuid_generate_v4()')).primaryKey(),
    GroupId: uuid('group_id').references(() => Groups.Id, { onDelete: 'cascade' }),
    UserId: uuid('user_id').references(() => Users.Id, { onDelete: 'cascade' }),
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

export const AgendaRelations = relations(Agenda, ({ one, many }) => ({
    creator: one(Users, {
        fields: [Agenda.UserId],
        references: [Users.Id]
    }),
    groups: many(Groups),
    events: many(AgendaEvents)
}));

export const AgendaEventsRelations = relations(AgendaEvents, ({ one }) => ({
    agenda: one(Agenda, {
        fields: [AgendaEvents.AgendaId],
        references: [Agenda.Id]
    })
}));

export const GroupsRelations = relations(Groups, ({ one, many }) => ({
    agenda: one(Agenda, {
        fields: [Groups.AgendaId],
        references: [Agenda.Id]
    }),
    members: many(GroupMembers)
}));

export const GroupMembersRelations = relations(GroupMembers, ({ one }) => ({
    group: one(Groups, {
        fields: [GroupMembers.GroupId],
        references: [Groups.Id]
    }),
    user: one(Users, {
        fields: [GroupMembers.UserId],
        references: [Users.Id]
    })
}));
