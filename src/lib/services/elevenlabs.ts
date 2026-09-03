import fetch from 'node-fetch';

/**
 * Generate speech audio using ElevenLabs Text‑to‑Speech API.
 * Returns the raw audio bytes (MP3) as a Uint8Array.
 *
 * @param text - The text to synthesize.
 * @param voiceId - ElevenLabs voice identifier. Defaults to the
 *   Rachel voice used elsewhere in the project.
 * @returns Uint8Array containing MP3 audio data.
 */
export async function synthesizeSpeech(
  text: string,
  voiceId: string = '21m00Tcm4TlvDq8ikWAM' // default Rachel voice
): Promise<Uint8Array> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not set in .env');
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs TTS failed: ${response.status} ${err}`);
  }

  // The response is a stream of MP3 bytes.
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}
