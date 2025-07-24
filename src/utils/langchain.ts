import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

export async function fetchAndExtractPdfText(fileUrl: string) {
  const res = await fetch(fileUrl);
  const blob = await res.blob();

  const arrayBuffer = await blob.arrayBuffer();

  const loader = new PDFLoader(new Blob([arrayBuffer]));
  const docs = await loader.load();

  return docs.map((doc) => doc.pageContent).join('\n');
}
