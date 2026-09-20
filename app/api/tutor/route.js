export async function POST(request) {
  try {
    const body = await request.json();

    const scenario = body.scenario;
    const messages = body.messages || [];

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.6',
        instructions: `
You are a friendly French tutor helping a 9-year-old beginner learn French.

Keep your French simple and conversational.

When the student makes an important mistake:
- briefly explain the mistake in English
- show the correct French
- then continue the conversation in simple French

Be encouraging, but do not praise every single answer.
Ask one simple question at a time.
Keep responses short.
`,
        input: [
          {
            role: 'user',
            content: `Scenario: ${scenario}

Conversation so far:
${messages
  .map((message) => `${message.speaker}: ${message.text}`)
  .join('\n')}

Continue the conversation.`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      return Response.json(
        {
          error: data.error?.message || 'OpenAI request failed.',
        },
        { status: response.status }
      );
    }

    return Response.json({
      reply: data.output_text,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: 'Unable to contact the French tutor.',
      },
      { status: 500 }
    );
  }
}
