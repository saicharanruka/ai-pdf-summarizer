'use server';

import { neon } from '@neondatabase/serverless';

export async function getDbConnection() {
  if (!process.env.NEON_DATABASE_URL)
    throw new Error('NEON_DATABASE_URL is not set');

  const sql = neon(process.env.NEON_DATABASE_URL);

  return sql;
}
