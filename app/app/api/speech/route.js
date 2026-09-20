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
      console.error(errorText);

      return Response.json(
        { error: 'Speech generation failed.' },
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
    console.error(error);

    return Response.json(
      { error: 'Unable to generate speech.' },
      { status: 500 }
    );
  }
}
