'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { getDbConnection } from '~/utils/db';
import { fetchAndExtractPdfText } from '~/utils/langchain';
import { generateSummary } from '~/utils/openai';

const errorData = {
  success: false,
  message: 'File upload failed',
  data: null,
};

interface PdfSummaryType {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

export async function generatePdfSummary(
  uploadResponse: [
    {
      serverData: { userId: string; file: { url: string; name: string } };
    },
  ],
) {
  if (!uploadResponse) return errorData;

  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: fileName },
    },
  } = uploadResponse[0];

  if (!pdfUrl) return errorData;

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    let summary: any;

    try {
      summary = await generateSummary(pdfText);
    } catch (error) {
      console.error(error);
    }
    if (!summary) {
      return {
        success: false,
        message: 'Failed to generate summary',
        data: null,
      };
    }

    // const formattedFileName  = formatFileNameAsTitle(fileName)
    return {
      success: true,
      message: 'Summary generated successfully',
      data: { title: fileName, summary },
    };
  } catch (err) {
    console.error(err);
    return errorData;
  }
}

export async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  try {
    const sql = await getDbConnection();
    const [savedSummary] = await sql`
    INSERT INTO pdf_summaries (
      user_id,
      original_file_url,
      summary_text,
      title,
      file_name
    )
    VALUES (${userId}, ${fileUrl}, ${summary}, ${title}, ${fileName})
    RETURNING id;
  `;

    return savedSummary;
  } catch (error) {
    console.error('error saving PDF summary', error);
    throw error;
  }
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  let savedSummary: any;
  try {
    const { userId } = await auth();
    if (!userId)
      return {
        success: false,
        message: 'User not authenticated/found',
      };

    savedSummary = await savePdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });
    if (!savedSummary)
      return {
        success: false,
        message: 'Error saving PDF summary',
      };
  } catch (error) {
    return {
      success: false,
      message: 'Error storing PDF summary',
    };
  }

  // Revalidate our cache
  revalidatePath(`/summaries/${savedSummary.id}`);

  return {
    success: true,
    message: 'PDF summary saved successfully',
    data: { id: savedSummary.id },
  };
}
