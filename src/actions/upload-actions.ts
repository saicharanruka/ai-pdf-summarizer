'use server';

import { fetchAndExtractPdfText } from '~/utils/langchain';

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
    console.log({ pdfText });
  } catch (err) {
    console.log(err);
    return errorData;
  }
}
