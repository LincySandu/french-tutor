export async function POST(request) {
  try {
    const body = await request.json();

    const scenario = body.scenario;
    const messages = body.messages || [];

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'openrouter/free',
          messages: [
            {
              role: 'system',
              content: `
You are a friendly French tutor helping a 9-year-old beginner learn French.

Keep the French simple and conversational.

When the student makes an important mistake:
- briefly explain the mistake in English
- show the correct French
- then continue the conversation in simple French

Be encouraging, but do not praise every single answer.
Ask one simple question at a time.
Keep responses short.

IMPORTANT:
Return your answer in exactly this format:

DISPLAY:
[The complete response the student should see. This can contain English explanations and French.]

SPEECH:
[ONLY the French words/sentences that should be read aloud. NEVER put English in SPEECH.]

If there is no English explanation needed, DISPLAY and SPEECH can contain the same French text.
`,
            },
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
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      return Response.json(
        {
          error: data.error?.message || 'OpenRouter request failed.',
        },
        { status: response.status }
      );
    }

    const rawReply =
      data.choices?.[0]?.message?.content ||
      'Sorry, I could not answer.';

    const displayMatch = rawReply.match(
      /DISPLAY:\s*([\s\S]*?)\s*SPEECH:\s*([\s\S]*)/i
    );

    if (displayMatch) {
      return Response.json({
        reply: displayMatch[1].trim(),
        speechText: displayMatch[2].trim(),
      });
    }

    // Fallback if the AI does not follow the format
    return Response.json({
      reply: rawReply,
      speechText: rawReply,
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
