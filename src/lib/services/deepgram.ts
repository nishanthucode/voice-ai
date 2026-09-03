import fetch from 'node-fetch';

/**
 * Simple Deepgram Speech‑to‑Text wrapper.
 * It expects a raw audio Uint8Array (e.g., PCM or WebM) and returns the transcript.
 * The function uses the DEEPGRAM_API_KEY environment variable.
 * If the key is missing, it throws an informative error – callers should handle it gracefully.
 */
export async function transcribeAudio(audio: Uint8Array, mimeType: string = 'audio/webm'): Promise<string> {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPGRAM_API_KEY is not set in .env');
  }

  const url = `https://api.deepgram.com/v1/listen?model=general`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': mimeType,
    },
    body: Buffer.from(audio),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Deepgram transcription failed: ${response.status} ${err}`);
  }

  const data: any = await response.json();
  // Deepgram returns an array of transcripts; we take the most confident result.
  const transcript = data?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? '';
  return transcript;
}