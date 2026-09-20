export async function POST(request) {
  try {
    const body = await request.json();

    const text = body.text;

    if (!text) {
      return Response.json(
        { error: 'No text was provided.' },
        { status: 400 }
      );
    }

    const response = await fetch(
      'https://api.openai.com/v1/audio/speech',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini-tts',
          voice: 'coral',
          input: text,
          response_format: 'mp3',
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TTS ERROR:', errorText);

      return Response.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('SPEECH ERROR:', error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
