export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(
      'https://openrouter.ai/api/v1/audio/speech',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'hexgrad/kokoro-82m',
          input: body.text,
          voice: 'ff_siwis',
          response_format: 'mp3',
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error('OPENROUTER SPEECH ERROR:', errorText);

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
