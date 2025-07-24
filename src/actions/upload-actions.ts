'use server';

import { fetchAndExtractPdfText } from '~/utils/langchain';
import { generateSummary } from '~/utils/openai';

const errorData = {
  success: false,
  message: 'File upload failed',
  data: null,
};

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
      console.log({ summary });
    } catch (error) {
      console.log(error);
    }
    if (!summary) {
      return {
        success: false,
        message: 'Failed to generate summary',
        data: null,
      };
    }
  } catch (err) {
    console.log(err);
    return errorData;
  }
}
