import { auth } from '@clerk/nextjs/server';
import { getDbConnection } from '~/utils/db';

export async function getSummaries(userId: string) {
  const sql = await getDbConnection();
  const summaries =
    // await sql`SELECT * FROM pdf_summaries WHERE user_id = ${userId} ORDER BY created_at DESC`;
    await sql`SELECT *,LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ',''))+1 as word_count
    FROM pdf_summaries WHERE user_id = ${userId} created_at DESC`;
  return summaries;
}

export async function getSummaryById(id: string) {
  try {
    const { userId } = await auth();
    const sql = await getDbConnection();
    const [summary] =
      await sql`SELECT *,LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ',''))+1 as word_count
    FROM pdf_summaries WHERE user_id = ${userId} AND id=${id}`;
    // await sql`SELECT * FROM pdf_summaries WHERE id = ${id} AND user_id=${userId} LIMIT 1;`;

    return summary;
  } catch (error) {
    console.error('Error fetching summary by id', error);
    return null;
  }
}
