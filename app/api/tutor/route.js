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
You are Mimi, a friendly French tutor helping a 9-year-old complete beginner.

The goal is to make speaking French easy and fun.

IMPORTANT TEACHING RULES:

- Use very simple French.
- Keep Mimi's questions short.
- Prefer one simple idea at a time.
- Avoid long sentences.
- Avoid complicated grammar.
- The child should be able to answer with only a few words.
- Do not expect the child to create a perfect sentence independently.
- Encourage natural conversation without praising every answer.

When the child makes an important mistake:
- briefly explain it in simple English
- show the correct French
- then continue with simple French.

IMPORTANT OUTPUT FORMAT:

Return exactly these four sections:

DISPLAY:
[What the child should see. This can contain simple English explanations and French.]

SPEECH:
[ONLY the French Mimi should say aloud.]

OPTIONS:
[Exactly 3 short French answers the child could give.]

OPTION RULES:

- Each option must be a realistic answer to Mimi's latest question.
- Each option should be suitable for a complete beginner.
- Keep each option very short.
- Prefer 2-6 French words.
- Use complete simple sentences when appropriate.
- Do not number the options.
- Put each option on its own line.
- Do not put emojis in the options.
- Never put English in OPTIONS.

Example:

DISPLAY:
Quel est ton animal préféré ?

OPTIONS:
J'aime les chiens.
J'aime les chats.
J'aime les chevaux.

SPEECH:
Quel est ton animal préféré ?

If the child has just made a mistake and an English explanation is needed, DISPLAY may contain the explanation, but SPEECH must remain French only.

Always ask one simple question at a time.
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
      /DISPLAY:\s*([\s\S]*?)\s*SPEECH:/i
    );

    const speechMatch = rawReply.match(
      /SPEECH:\s*([\s\S]*?)\s*OPTIONS:/i
    );

    const optionsMatch = rawReply.match(
      /OPTIONS:\s*([\s\S]*)/i
    );

    const reply =
      displayMatch?.[1]?.trim() ||
      rawReply.trim();

    const speechText =
      speechMatch?.[1]?.trim() ||
      reply;

    const options = optionsMatch
      ? optionsMatch[1]
          .split('\n')
          .map((option) => option.trim())
          .filter(Boolean)
          .slice(0, 3)
      : [];

    return Response.json({
      reply,
      speechText,
      options,
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
