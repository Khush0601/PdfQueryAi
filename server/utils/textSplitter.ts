export const splitText = (
  text: string,
  chunkSize = 1000,
  overlap = 200
): string[] => {
  if (!text?.trim()) return [];
  if (chunkSize <= 0) throw new Error("chunkSize must be > 0");
  if (overlap >= chunkSize) overlap = Math.floor(chunkSize / 2);

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = start + chunkSize;

    // Avoid cutting mid-word
    if (end < text.length) {
      const lastSpace = text.lastIndexOf(" ", end);
      if (lastSpace > start) end = lastSpace;
    }

    const chunk = text.slice(start, end).trim();
    if (chunk) chunks.push(chunk);

    start += chunkSize - overlap;
  }

  return chunks;
};
