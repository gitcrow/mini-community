import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * 테이블 정의
 */
export const userTable = pgTable('user', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .notNull(),
});

export const userPostTable = pgTable('user_post', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull() //user테이블과 타입 일치시켜야함 serial은 integer
        .references(() => userTable.id, {onDelete: 'cascade'}),
    title: text('title').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .notNull(),
});

export const userPostCommentTable = pgTable('user_post_comment', {
    id: serial('id').primaryKey(),
    userId: integer('user_id') //user테이블과 타입 일치시켜야함 serial은 integer
        .notNull()
        .references(() => userTable.id, {onDelete: 'cascade'}),
    postId: integer('post_id')  //user테이블과 타입 일치시켜야함 serial은 integer
        .notNull()
        .references(() => userPostTable.id, {onDelete: 'cascade'}),
    content: text('content').notNull(),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .notNull(),
})

/**
 * 테이블 사이의 관계 정의
 */
export const userRelations = relations(userTable, ({ many }) => ({
    posts: many(userPostTable),
    comments: many(userPostCommentTable),
}));

export const postRelations = relations(userPostTable, ({ one, many }) => ({
    user: one(userTable, {
        fields: [userPostTable.userId],
        references: [userTable.id],
    }),
    comments: many(userPostCommentTable),
}));

export const commentRelations = relations(userPostCommentTable, ({ one }) => ({
    user: one(userTable, {
        fields: [userPostCommentTable.userId],
        references: [userTable.id],
    }),
    post: one(userPostTable, {
        fields: [userPostCommentTable.postId],
        references: [userPostTable.id],
    }),
}));

/**
 * 테이블들의 타입 정의
 */
export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;

export type InsertUserPost = typeof userPostTable.$inferInsert;
export type SelectUserPost = typeof userPostTable.$inferSelect & {
    user: Pick<SelectUser, 'id' | 'name'>;
    comments: SelectUserPostComment[];
};

export type InsertUserPostComment = typeof userPostCommentTable.$inferInsert;
export type SelectUserPostComment = typeof userPostCommentTable.$inferSelect;

// npx drizzle-kit push 명령어로 테이블 생성시키려 할때 권한이 없는경우 psql에서 아래 명령 수행
// GRANT ALL ON SCHEMA public TO your_user;
//       your_user;
// GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
