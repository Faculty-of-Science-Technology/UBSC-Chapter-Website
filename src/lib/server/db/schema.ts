import { relations, sql } from 'drizzle-orm';
import {
	boolean,
	customType,
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

export const accountTypeEnum = pgEnum('account_type', ['org', 'student', 'owner']);
export const jobTypeStatusEnum = pgEnum('jobtype_status', ['pending', 'approved', 'rejected']);
export const groupTypeEnum = pgEnum('group_type', ['STANDARD', 'COMMITTEE']);
export const postTypeEnum = pgEnum('post_type', ['EVENT', 'BLOG']);
export const roleTypeEnum = pgEnum('role_type', [
	'ADMIN',
	'MODERATOR',
	'EVENT_MANAGER',
	'USER_MANAGER',
	'CONTENT_MANAGER',
	'MEMBER'
]);
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
		return val as Buffer;
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
	ActivationCode: varchar('activation_code', { length: 255 }).unique(),
	Bio: varchar('bio', { length: 255 }),
	Hidden: boolean('hidden').notNull().default(false),
	InviteCodeUsed: varchar('invite_code_used', { length: 255 }),
	CreatedAt: date('__created_at__')
		.default(sql`CURRENT_DATE`)
		.notNull()
	//Session: text('session').unique(),
});

// Roles and RBAC System
export const Roles = pgTable('Roles', {
	Id: uuid('id')
		.$defaultFn(() => sql.raw('uuid_generate_v4()'))
		.unique()
		.primaryKey(),
	Name: varchar('name', { length: 100 }).notNull().unique(),
	Description: text('description'),
	Type: roleTypeEnum('type').notNull(),
	Color: varchar('color', { length: 7 }).notNull().default('#6366f1'),
	CanManageUsers: boolean('can_manage_users').notNull().default(false),
	CanManageEvents: boolean('can_manage_events').notNull().default(false),
	CanManageGroups: boolean('can_manage_groups').notNull().default(false),
	CanManagePosts: boolean('can_manage_posts').notNull().default(false),
	CanEditOthersPosts: boolean('can_edit_others_posts').notNull().default(false),
	CanManageRoles: boolean('can_manage_roles').notNull().default(false),
	CanManageInvites: boolean('can_manage_invites').notNull().default(false),
	CanManageTheme: boolean('can_manage_theme').notNull().default(false),
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

export const UserRoles = pgTable('UserRoles', {
	Id: uuid('id')
		.$defaultFn(() => sql.raw('uuid_generate_v4()'))
		.unique()
		.primaryKey(),
	UserId: uuid('user_id')
		.references(() => Users.Id, { onDelete: 'cascade' })
		.notNull(),
	RoleId: uuid('role_id')
		.references(() => Roles.Id, { onDelete: 'cascade' })
		.notNull(),
	AssignedBy: uuid('assigned_by').references(() => Users.Id),
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

// Invite System
export const InviteCodes = pgTable('InviteCodes', {
	Id: uuid('id')
		.$defaultFn(() => sql.raw('uuid_generate_v4()'))
		.unique()
		.primaryKey(),
	Code: varchar('code', { length: 32 }).unique().notNull(),
	CreatedBy: uuid('created_by')
		.references(() => Users.Id, { onDelete: 'cascade' })
		.notNull(),
	MaxUses: integer('max_uses').notNull().default(1),
	CurrentUses: integer('current_uses').notNull().default(0),
	ExpiresAt: timestamp('expires_at', { withTimezone: true }),
	IsActive: boolean('is_active').notNull().default(true),
	Description: text('description'),
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

export const InviteCodeUsage = pgTable('InviteCodeUsage', {
	Id: uuid('id')
		.$defaultFn(() => sql.raw('uuid_generate_v4()'))
		.unique()
		.primaryKey(),
	InviteCodeId: uuid('invite_code_id')
		.references(() => InviteCodes.Id, { onDelete: 'cascade' })
		.notNull(),
	UserId: uuid('user_id')
		.references(() => Users.Id, { onDelete: 'cascade' })
		.notNull(),
	UsedAt: timestamp('used_at', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

// Theme Management
export const ThemeSettings = pgTable('ThemeSettings', {
	Id: uuid('id')
		.$defaultFn(() => sql.raw('uuid_generate_v4()'))
		.unique()
		.primaryKey(),
	PrimaryColor: varchar('primary_color', { length: 7 }).notNull().default('#3B82F6'),
	SecondaryColor: varchar('secondary_color', { length: 7 }).notNull().default('#1E40AF'),
	AccentColor: varchar('accent_color', { length: 7 }).notNull().default('#F59E0B'),
	BackgroundColor: varchar('background_color', { length: 7 }).notNull().default('#FFFFFF'),
	TextColor: varchar('text_color', { length: 7 }).notNull().default('#1F2937'),
	IsActive: boolean('is_active').notNull().default(true),
	UpdatedBy: uuid('updated_by').references(() => Users.Id),
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	UpdatedAt: timestamp('__updated_at__', { withTimezone: true })
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

export const Groups = pgTable('Groups', {
	Id: uuid('id')
		.$defaultFn(() => sql.raw('uuid_generate_v4()'))
		.primaryKey(),
	Title: varchar('title', { length: 255 }).notNull(),
	Description: text('description'),
	Type: groupTypeEnum('type').notNull().default('STANDARD'),
	IsActive: boolean('is_active').notNull().default(true),
	CreatedBy: uuid('created_by').references(() => Users.Id, { onDelete: 'cascade' }),
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

// Blog Posts and Events unified as Posts
export const Posts = pgTable('Posts', {
	Id: uuid('id')
		.$defaultFn(() => sql.raw('uuid_generate_v4()'))
		.primaryKey(),
	Title: varchar('title', { length: 255 }).notNull(),
	Slug: varchar('slug', { length: 255 }).unique().notNull(),
	Content: text('content').notNull(),
	Excerpt: text('excerpt'),
	Type: postTypeEnum('type').notNull(),
	AuthorId: uuid('author_id')
		.references(() => Users.Id, { onDelete: 'cascade' })
		.notNull(),
	FeaturedImage: text('featured_image'),
	Published: boolean('published').notNull().default(false),
	PublishedAt: timestamp('published_at', { withTimezone: true }),
	// Event-specific fields (only used when type = 'EVENT')
	EventStartTime: timestamp('event_start_time', { withTimezone: true }),
	EventEndTime: timestamp('event_end_time', { withTimezone: true }),
	EventLocation: varchar('event_location', { length: 255 }),
	EventMaxAttendees: integer('event_max_attendees'),
	EventCurrentAttendees: integer('event_current_attendees').notNull().default(0),
	EventPrice: real('event_price'), // Price for the event (null means free)
	GroupId: uuid('group_id').references(() => Groups.Id, { onDelete: 'set null' }), // Associate event with a group
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	UpdatedAt: timestamp('__updated_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

export const PostTags = pgTable('PostTags', {
	Id: uuid('id')
		.$defaultFn(() => sql.raw('uuid_generate_v4()'))
		.primaryKey(),
	PostId: uuid('post_id')
		.references(() => Posts.Id, { onDelete: 'cascade' })
		.notNull(),
	TagName: varchar('tag_name', { length: 50 }).notNull(),
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

export const EventAttendees = pgTable('EventAttendees', {
	Id: uuid('id')
		.$defaultFn(() => sql.raw('uuid_generate_v4()'))
		.primaryKey(),
	PostId: uuid('post_id')
		.references(() => Posts.Id, { onDelete: 'cascade' })
		.notNull(),
	UserId: uuid('user_id')
		.references(() => Users.Id, { onDelete: 'cascade' })
		.notNull(),
	Status: varchar('status', { length: 20 }).notNull().default('attending'), // attending, maybe, not_attending
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

export const GroupMembers = pgTable('GroupMembers', {
	Id: uuid('id')
		.$defaultFn(() => sql.raw('uuid_generate_v4()'))
		.primaryKey(),
	GroupId: uuid('group_id').references(() => Groups.Id, { onDelete: 'cascade' }),
	UserId: uuid('user_id').references(() => Users.Id, { onDelete: 'cascade' }),
	CreatedAt: timestamp('__created_at__', { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

// Database relations
export const UsersRelations = relations(Users, ({ many }) => ({
	userRoles: many(UserRoles),
	createdInvites: many(InviteCodes),
	usedInvites: many(InviteCodeUsage),
	posts: many(Posts),
	eventAttendances: many(EventAttendees),
	groupMemberships: many(GroupMembers),
	createdGroups: many(Groups),
	assignedRoles: many(UserRoles, { relationName: 'assignedBy' }),
	themeUpdates: many(ThemeSettings)
}));

export const RolesRelations = relations(Roles, ({ many }) => ({
	userRoles: many(UserRoles)
}));

export const UserRolesRelations = relations(UserRoles, ({ one }) => ({
	user: one(Users, {
		fields: [UserRoles.UserId],
		references: [Users.Id]
	}),
	role: one(Roles, {
		fields: [UserRoles.RoleId],
		references: [Roles.Id]
	}),
	assignedByUser: one(Users, {
		fields: [UserRoles.AssignedBy],
		references: [Users.Id],
		relationName: 'assignedBy'
	})
}));

export const InviteCodesRelations = relations(InviteCodes, ({ one, many }) => ({
	creator: one(Users, {
		fields: [InviteCodes.CreatedBy],
		references: [Users.Id]
	}),
	usages: many(InviteCodeUsage)
}));

export const InviteCodeUsageRelations = relations(InviteCodeUsage, ({ one }) => ({
	inviteCode: one(InviteCodes, {
		fields: [InviteCodeUsage.InviteCodeId],
		references: [InviteCodes.Id]
	}),
	user: one(Users, {
		fields: [InviteCodeUsage.UserId],
		references: [Users.Id]
	})
}));

export const PostsRelations = relations(Posts, ({ one, many }) => ({
	author: one(Users, {
		fields: [Posts.AuthorId],
		references: [Users.Id]
	}),
	group: one(Groups, {
		fields: [Posts.GroupId],
		references: [Groups.Id]
	}),
	tags: many(PostTags),
	attendees: many(EventAttendees)
}));

export const PostTagsRelations = relations(PostTags, ({ one }) => ({
	post: one(Posts, {
		fields: [PostTags.PostId],
		references: [Posts.Id]
	})
}));

export const EventAttendeesRelations = relations(EventAttendees, ({ one }) => ({
	post: one(Posts, {
		fields: [EventAttendees.PostId],
		references: [Posts.Id]
	}),
	user: one(Users, {
		fields: [EventAttendees.UserId],
		references: [Users.Id]
	})
}));

export const GroupsRelations = relations(Groups, ({ one, many }) => ({
	creator: one(Users, {
		fields: [Groups.CreatedBy],
		references: [Users.Id]
	}),
	members: many(GroupMembers),
	posts: many(Posts)
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

export const ThemeSettingsRelations = relations(ThemeSettings, ({ one }) => ({
	updatedBy: one(Users, {
		fields: [ThemeSettings.UpdatedBy],
		references: [Users.Id]
	})
}));
