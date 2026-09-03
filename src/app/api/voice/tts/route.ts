import { NextResponse } from 'next/server';
import { synthesizeSpeech } from '@/lib/services/elevenlabs';

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const audioData = await synthesizeSpeech(text, voiceId);

    // Return the audio as a stream/blob response
    return new NextResponse(audioData as any, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioData.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('TTS Route Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to synthesize speech' }, { status: 500 });
  }
}
