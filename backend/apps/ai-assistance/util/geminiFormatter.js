import axios from 'axios';

/**
 * Convert internal message format to Gemini-compatible format.
 * @param {Array} messages - Array of messages with { role, text, files }
 * @returns {Promise<Array>} Gemini-compatible content array
 */
export const convertToGeminiFormat = async (messages) => {
    console.log('convertToGeminiFormat got task', messages);
  return Promise.all(
    messages.map(async ({ role, text, files }) => {
      const parts = [];

      if (text) parts.push({ text });

      if (files?.length) {
        for (const url of files) {
          const base64 = await fetchImageAsBase64(url);
          parts.push({
            inlineData: {
              mimeType: 'image/png', // Optional: auto detect later
              data: base64,
            },
          });
        }
      }

      return { role, parts };
    })
  );
};

/**
 * Fetch image from URL and return as base64 string.
 * @param {string} url - Public image URL (e.g., Firebase Storage)
 * @returns {Promise<string>} base64 string
 */
export const fetchImageAsBase64 = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data).toString('base64');
  } catch (error) {
    console.error(' Error fetching image:', error.message);
    throw new Error('Image fetch failed');
  }
};
