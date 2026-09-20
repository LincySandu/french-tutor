export async function POST(request) {
  try {
    const body = await request.json();

    const scenario = body.scenario;
    const messages = body.messages || [];
    const baseLanguage = body.baseLanguage || 'en';

    const languageNames = {
      en: 'English',
      fr: 'French',
      de: 'German',
      ro: 'Romanian',
      es: 'Spanish',
    };

    const selectedLanguage =
      languageNames[baseLanguage] || 'English';

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

The child's support/base language is ${selectedLanguage}.

French is ALWAYS the language being learned.

The child is a complete beginner, so make the conversation very easy, friendly and natural.

IMPORTANT TEACHING RULES:

- Use short, simple French.
- Ask only ONE question at a time.
- Avoid complicated vocabulary.
- Keep French sentences short.
- Make it easy for a 9-year-old to answer.
- Do not give long grammar explanations.
- Do not praise every answer.
- If the child makes an important mistake, briefly correct it in ${selectedLanguage}.
- Then continue with ONE simple French question.
- Stay within the current scenario.
- DISPLAY must contain French only.
- SPEECH must contain French only.
- MEANING must be written completely in ${selectedLanguage}.
- OPTION translations must be written in ${selectedLanguage}.
- VOCABULARY meanings must be written in ${selectedLanguage}.

After the child's answer, produce:

1. DISPLAY:
The complete response Mimi should show the child.

The French part of the response must be in simple beginner-level French.

If a correction is needed, explain the correction briefly in French or, when necessary, in ${selectedLanguage}, but keep the response easy for a 9-year-old.

IMPORTANT:
Never put English into DISPLAY unless English is the child's selected support language.

2. SPEECH:
ONLY the French words Mimi should say aloud.

Never put ${selectedLanguage} translation inside SPEECH.

3. MEANING:
A COMPLETE and SIMPLE ${selectedLanguage} translation of EVERYTHING Mimi says in DISPLAY.

Do NOT translate only the question.

4. OPTIONS:
Give exactly 3 very simple French answers that the child could choose from to answer Mimi's NEW question.

For EVERY option, provide:
- the French answer
- a simple ${selectedLanguage} translation of that answer

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
- a simple ${selectedLanguage} meaning

Only include useful beginner-level vocabulary.

Do not include tiny grammar words such as "le", "la", "un", "une", "je", "tu", etc. by themselves.

Return your answer in EXACTLY this format:

DISPLAY:
[Complete French response Mimi should show]

SPEECH:
[Only French words Mimi should say]

MEANING:
[Complete ${selectedLanguage} translation of the entire DISPLAY]

OPTIONS:
1. [French answer] | [${selectedLanguage} translation]
2. [French answer] | [${selectedLanguage} translation]
3. [French answer] | [${selectedLanguage} translation]

VOCABULARY:
1. [French word or phrase] | [${selectedLanguage} meaning]
2. [French word or phrase] | [${selectedLanguage} meaning]
3. [French word or phrase] | [${selectedLanguage} meaning]

IMPORTANT:
- The OPTIONS must answer the NEW question Mimi asks.
- Never put translations inside SPEECH.
- Never leave OPTIONS empty.
- Never leave VOCABULARY empty unless there are genuinely no useful vocabulary items.
- Never ask more than one question in DISPLAY.
- Keep VOCABULARY simple and useful for a beginner.
- Always use ${selectedLanguage} for MEANING, option translations and vocabulary translations.
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
            translation:
              parts.slice(1).join('|').trim() || '',
          };
        })
        .filter(
          (option) =>
            option.french &&
            option.translation
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
            translation:
              parts.slice(1).join('|').trim() || '',
          };
        })
        .filter(
          (item) =>
            item.french &&
            item.translation
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
