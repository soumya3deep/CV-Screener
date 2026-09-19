import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Normalizes whitespace, removes repeated linebreaks, strips control characters
 * while preserving paragraph formatting.
 */
export function cleanText(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';

  return raw
    // Replace null bytes and non-printable control characters except \n, \r, \t
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize Windows/Mac linebreaks to Unix \n
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Collapse 3 or more consecutive newlines to 2
    .replace(/\n{3,}/g, '\n\n')
    // Trim each line
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim();
}

/**
 * Extracts raw textual content from buffer based on file extension / signature.
 */
export async function extractTextFromBuffer(buffer: Buffer, fileName: string): Promise<string> {
  if (!buffer || buffer.length === 0) {
    return '';
  }

  const lowerName = fileName.toLowerCase();

  try {
    // 1. PDF Documents
    if (lowerName.endsWith('.pdf')) {
      try {
        const parsed = await pdfParse(buffer);
        return cleanText(parsed.text || '');
      } catch (pdfErr) {
        console.warn(`[parsers] pdf-parse error on ${fileName}:`, pdfErr);
        // Fallback: try extracting ASCII/UTF-8 strings from raw buffer if standard parse fails
        const rawStr = buffer.toString('utf-8');
        const cleaned = cleanText(rawStr);
        if (cleaned.length > 50) {
          return cleaned;
        }
        return '';
      }
    }

    // 2. Microsoft Word DOCX
    if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        return cleanText(result.value || '');
      } catch (docxErr) {
        console.warn(`[parsers] mammoth error on ${fileName}:`, docxErr);
        return '';
      }
    }

    // 3. Text, Markdown, CSV, JSON, or standard textual files
    try {
      // Try UTF-8 first
      const utf8Text = buffer.toString('utf-8');
      // If it has valid characters, return it
      return cleanText(utf8Text);
    } catch {
      // Fallback to latin1 if utf-8 fails
      return cleanText(buffer.toString('latin1'));
    }
  } catch (err) {
    console.error(`[parsers] Unhandled error extracting text from ${fileName}:`, err);
    return '';
  }
}
