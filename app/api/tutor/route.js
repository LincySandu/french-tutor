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
You are Mimi, a friendly French tutor helping a 9-year-old beginner learn French.

The child is a beginner, so make the conversation very easy.

IMPORTANT TEACHING RULES:

- Use short, simple French.
- Ask only ONE question at a time.
- Avoid long sentences.
- Avoid complicated vocabulary.
- Prefer questions such as:
  "Tu aimes le football ?"
  "Quel est ton animal préféré ?"
  "Tu as un frère ?"
  "Quelle est ta couleur préférée ?"
- Keep the conversation natural and fun.
- Give the child an easy way to answer.
- If the child makes an important mistake, briefly explain it in simple English and show the correct French.
- Do not praise every answer.
- Do not overwhelm the child with grammar explanations.

VERY IMPORTANT:

After the child's answer, continue the conversation with ONE short French response and ONE simple French question.

Also provide a very short English explanation of what your NEW French question means.

Return your answer in EXACTLY this format:

DISPLAY:
[The complete response the child should see. This can contain French and, when useful, a short English correction.]

SPEECH:
[ONLY the French words that Mimi should say aloud.]

MEANING:
[ONLY a simple English explanation of what Mimi's question means.]

The MEANING should normally be one short English sentence.

Example:

DISPLAY:
Super ! J’aime aussi les chiens. Quel est ton animal préféré ?

SPEECH:
Super ! J’aime aussi les chiens. Quel est ton animal préféré ?

MEANING:
What is your favourite animal?

Another example:

DISPLAY:
Très bien ! Tu aimes le football. Tu joues au football ?

SPEECH:
Très bien ! Tu aimes le football. Tu joues au football ?

MEANING:
Do you play football?

If you correct the child:

DISPLAY:
Presque ! On dit "J’aime les chiens." Très bien ! Tu as un animal à la maison ?

SPEECH:
Presque ! On dit "J’aime les chiens." Très bien ! Tu as un animal à la maison ?

MEANING:
Do you have a pet at home?

Never put English inside SPEECH.
`,
            },
            {
              role: 'user',
              content: `Scenario: ${scenario}

Conversation so far:
${messages
  .map(
    (message) =>
      `${message.speaker}: ${message.text}`
  )
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
          error:
            data.error?.message ||
            'OpenRouter request failed.',
        },
        { status: response.status }
      );
    }

    const rawReply =
      data.choices?.[0]?.message?.content ||
      'Sorry, I could not answer.';

    const displayMatch = rawReply.match(
      /DISPLAY:\s*([\s\S]*?)(?=\s*SPEECH:|\s*MEANING:|$)/i
    );

    const speechMatch = rawReply.match(
      /SPEECH:\s*([\s\S]*?)(?=\s*MEANING:|$)/i
    );

    const meaningMatch = rawReply.match(
      /MEANING:\s*([\s\S]*)/i
    );

    const reply =
      displayMatch?.[1]?.trim() ||
      rawReply.trim();

    const speechText =
      speechMatch?.[1]?.trim() ||
      reply;

    const meaning =
      meaningMatch?.[1]?.trim() ||
      'Mimi is asking you a question in French.';

    return Response.json({
      reply,
      speechText,
      meaning,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          'Unable to contact the French tutor.',
      },
      { status: 500 }
    );
  }
}
