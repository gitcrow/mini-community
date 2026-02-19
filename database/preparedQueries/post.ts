import { desc, eq, sql } from 'drizzle-orm';
import { db } from '@/database/db';
import {
    userTable,
    userPostTable,
    userPostCommentTable,
    type SelectUserPostComment,
} from '@/database/schema';


export const preparedPostsQuery = async function getPosts() {
  return await db.query.userPostTable.findMany({
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        },
      },
      comments: true,
    },
  });
}

export const preparedPostQuery = async function getPost(postId: number) {
  return await db.query.userPostTable.findFirst({
    where: (posts, { eq }) => eq(posts.id, postId),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        },
      },
      comments: true,
    },
  });
}

/**
 * 아래 코드 구조는 SQLite 스타일

const selectPostBaseQuery = db
    .select({
        id: userPostTable.id,
        userId: userPostTable.userId,
        title: userPostTable.title,
        content: userPostTable.content,
        createdAt: userPostTable.createdAt,
        updatedAt: userPostTable.updatedAt,
        user: {
            id: userTable.id,
            name: userTable.name,
        },
        comments: sql<SelectUserPostComment[]>'
            CASE
                WHEN ${userPostCommentTable.id} IS NOT NULL
                THEN JSON_GROUP_ARRAY(
                    JSON_OBJECT(
                        'id', ${userPostCommentTable.id},
                        'userId', ${userPostCommentTable.userId},
                        'postId', ${userPostCommentTable.postId},
                        'content', ${userPostCommentTable.content},
                        'createdAt', ${userPostCommentTable.createdAt},
                        'updatedAt', ${userPostCommentTable.updatedAt}
                    )
                )
                ELSE JSON_ARRAY()
            END'
            .mapWith((commentsJsonStr) => JSON.parse(commentsJsonStr))
            .as('comments'),
    })
    .from(userPostTable)
    .innerJoin(userTable, eq(userTable.id, userPostTable.userId))
    .leftJoin(
        userPostCommentTable,
        eq(userPostCommentTable.postId, userPostTable.id)
    )
    .groupBy(userPostTable.id)
    .orderBy(desc(userPostTable.createdAt));

export const preparedPostsQuery = selectPostBaseQuery.prepare();

export const preparedPostQuery = selectPostBaseQuery
    .where(eq(userPostTable.id, sql.placeholder('postId')))
    .prepare();

 */