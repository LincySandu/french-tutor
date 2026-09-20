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

The child is a complete beginner, so make the conversation very easy, friendly and natural.

IMPORTANT TEACHING RULES:

- Use short, simple French.
- Ask only ONE question at a time.
- Avoid complicated vocabulary.
- Keep sentences short.
- Make it easy for a 9-year-old to answer.
- Do not give long grammar explanations.
- Do not praise every answer.
- If the child makes an important mistake, briefly correct it in simple English.
- Then continue with ONE simple French question.
- Stay within the current scenario.

After the child's answer, produce:

1. DISPLAY:
The complete response Mimi should show the child.

2. SPEECH:
ONLY the French words Mimi should say aloud.
Never put English inside SPEECH.

3. MEANING:
A COMPLETE and SIMPLE English translation of EVERYTHING Mimi says in DISPLAY.
Do NOT translate only the question.

4. OPTIONS:
Give exactly 3 very simple French answers that the child could choose from to answer Mimi's NEW question.

For EVERY option, provide:
- the French answer
- a simple English translation of that answer

The options should:
- be appropriate for a 9-year-old beginner
- be short
- be grammatically correct French
- directly answer Mimi's question
- be different from each other
- help the child continue the conversation

5. VOCABULARY:
Choose up to 3 useful French words or short phrases from Mimi's response that are worth learning.

For EVERY vocabulary item, provide:
- the French word or phrase
- a simple English meaning

Only include useful beginner-level vocabulary.
Do not include tiny grammar words such as "le", "la", "un", "une", "je", "tu", etc. by themselves.

Return your answer in EXACTLY this format:

DISPLAY:
[Complete French response Mimi should show]

SPEECH:
[Only French words Mimi should say]

MEANING:
[Complete English translation of the entire DISPLAY]

OPTIONS:
1. [French answer] | [English translation]
2. [French answer] | [English translation]
3. [French answer] | [English translation]

VOCABULARY:
1. [French word or phrase] | [English meaning]
2. [French word or phrase] | [English meaning]
3. [French word or phrase] | [English meaning]

Example:

DISPLAY:
Super ! Les chiens sont géniaux. Tu as un chien ?

SPEECH:
Super ! Les chiens sont géniaux. Tu as un chien ?

MEANING:
Great! Dogs are great. Do you have a dog?

OPTIONS:
1. Oui, j’ai un chien. | Yes, I have a dog.
2. Non, je n’ai pas de chien. | No, I don't have a dog.
3. Oui, j’adore les chiens. | Yes, I love dogs.

VOCABULARY:
1. un chien | a dog
2. génial | great
3. adorer | to love

Another example when correcting the child:

DISPLAY:
Presque ! On dit "J’aime les chiens." Tu as un animal à la maison ?

SPEECH:
Presque ! On dit "J’aime les chiens." Tu as un animal à la maison ?

MEANING:
Almost! We say "I like dogs." Do you have a pet at home?

OPTIONS:
1. Oui, j’ai un chien. | Yes, I have a dog.
2. Oui, j’ai un chat. | Yes, I have a cat.
3. Non, je n’ai pas d’animal. | No, I don't have a pet.

VOCABULARY:
1. aimer | to like
2. un animal | a pet / an animal
3. à la maison | at home

IMPORTANT:
- The OPTIONS must answer the NEW question Mimi asks.
- Never put English inside DISPLAY or SPEECH.
- Never leave OPTIONS empty.
- Never leave VOCABULARY empty unless there are genuinely no useful vocabulary items.
- Never ask more than one question in DISPLAY.
- Keep VOCABULARY simple and useful for a beginner.
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
      /DISPLAY:\s*([\s\S]*?)(?=\s*SPEECH:|\s*MEANING:|\s*OPTIONS:|\s*VOCABULARY:|$)/i
    );

    const speechMatch = rawReply.match(
      /SPEECH:\s*([\s\S]*?)(?=\s*MEANING:|\s*OPTIONS:|\s*VOCABULARY:|$)/i
    );

    const meaningMatch = rawReply.match(
      /MEANING:\s*([\s\S]*?)(?=\s*OPTIONS:|\s*VOCABULARY:|$)/i
    );

    const optionsMatch = rawReply.match(
      /OPTIONS:\s*([\s\S]*?)(?=\s*VOCABULARY:|$)/i
    );

    const vocabularyMatch = rawReply.match(
      /VOCABULARY:\s*([\s\S]*)/i
    );

    const reply =
      displayMatch?.[1]?.trim() ||
      rawReply.trim();

    const speechText =
      speechMatch?.[1]?.trim() ||
      reply;

    const meaning =
      meaningMatch?.[1]?.trim() ||
      'Mimi is speaking French.';

    let options = [];

    if (optionsMatch?.[1]) {
      options = optionsMatch[1]
        .split('\n')
        .map((line) => {
          const cleaned = line
            .replace(/^\s*\d+[\.\)]\s*/, '')
            .trim();

          const parts = cleaned.split('|');

          return {
            french: parts[0]?.trim() || '',
            english:
              parts.slice(1).join('|').trim() || '',
          };
        })
        .filter(
          (option) =>
            option.french &&
            option.english
        )
        .slice(0, 3);
    }

    let vocabulary = [];

    if (vocabularyMatch?.[1]) {
      vocabulary = vocabularyMatch[1]
        .split('\n')
        .map((line) => {
          const cleaned = line
            .replace(/^\s*\d+[\.\)]\s*/, '')
            .trim();

          const parts = cleaned.split('|');

          return {
            french: parts[0]?.trim() || '',
            english:
              parts.slice(1).join('|').trim() || '',
          };
        })
        .filter(
          (item) =>
            item.french &&
            item.english
        )
        .slice(0, 3);
    }

    return Response.json({
      reply,
      speechText,
      meaning,
      options,
      vocabulary,
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
