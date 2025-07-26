'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { getDbConnection } from '~/utils/db';

export async function deleteSummaryAction({
  summaryId,
}: {
  summaryId: string;
}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('User not found');

    const sql = await getDbConnection();
    const res =
      await sql`DELETE FROM pdf_summaries WHERE id = ${summaryId} AND user_id=${userId} RETURNING id`;

    if (res.length > 0) {
      revalidatePath('/dashboard');
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error('Failed to delete summary from db', error);
    return { success: false };
  }
}
