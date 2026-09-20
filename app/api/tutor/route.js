import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();

    const scenario = body.scenario;
    const messages = body.messages || [];

    const response = await openai.responses.create({
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
    });

    return Response.json({
      reply: response.output_text,
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
