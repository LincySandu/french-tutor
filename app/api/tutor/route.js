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

OUTPUT RULES:

DISPLAY:
- This is what Mimi shows the child.
- Keep the French simple and beginner-friendly.
- It may contain a brief correction in ${selectedLanguage} if necessary.
- Ask only ONE question.

SPEECH:
- ONLY French.
- Only include the French words Mimi should say aloud.
- Never include translations.

MEANING:
- Give a complete and simple ${selectedLanguage} translation of everything Mimi says in DISPLAY.

OPTIONS:
- ALWAYS provide exactly 3 options.
- Each option must be a short, natural French answer to Mimi's NEW question.
- Each option must have a ${selectedLanguage} translation.
- The three answers must be different.
- Do not use the same answer three times.

VOCABULARY:
- Provide up to 3 useful beginner French words or short phrases from Mimi's response.
- Give the ${selectedLanguage} meaning for each.
- Do not use tiny grammar words such as "le", "la", "un", "une", "je", "tu" by themselves.

VERY IMPORTANT:
- Never leave OPTIONS empty.
- Always provide exactly 3 numbered OPTIONS.
- Never ask more than one question.
- French is the target language.
- ${selectedLanguage} is the support language.
- Keep everything appropriate for a 9-year-old beginner.

Return your answer in EXACTLY this format:

DISPLAY:
[Complete response Mimi should show]

SPEECH:
[Only French words Mimi should say]

MEANING:
[Complete ${selectedLanguage} translation of DISPLAY]

OPTIONS:
1. [French answer] | [${selectedLanguage} translation]
2. [French answer] | [${selectedLanguage} translation]
3. [French answer] | [${selectedLanguage} translation]

VOCABULARY:
1. [French word or phrase] | [${selectedLanguage} meaning]
2. [French word or phrase] | [${selectedLanguage} meaning]
3. [French word or phrase] | [${selectedLanguage} meaning]
`,
            },
            {
              role: 'user',
              content: `Scenario: ${scenario}

Conversation so far:
${messages
  .map(
    (message) =>
      `${message.role || message.speaker}: ${message.text}`
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

    console.log('Mimi raw response:', rawReply);

    const displayMatch = rawReply.match(
      /DISPLAY\s*:\s*([\s\S]*?)(?=\n\s*SPEECH\s*:|\n\s*MEANING\s*:|\n\s*OPTIONS\s*:|\n\s*VOCABULARY\s*:|$)/i
    );

    const speechMatch = rawReply.match(
      /SPEECH\s*:\s*([\s\S]*?)(?=\n\s*MEANING\s*:|\n\s*OPTIONS\s*:|\n\s*VOCABULARY\s*:|$)/i
    );

    const meaningMatch = rawReply.match(
      /MEANING\s*:\s*([\s\S]*?)(?=\n\s*OPTIONS\s*:|\n\s*VOCABULARY\s*:|$)/i
    );

    const optionsMatch = rawReply.match(
      /OPTIONS\s*:\s*([\s\S]*?)(?=\n\s*VOCABULARY\s*:|$)/i
    );

    const vocabularyMatch = rawReply.match(
      /VOCABULARY\s*:\s*([\s\S]*)/i
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

    /*
     * Parse OPTIONS.
     *
     * We deliberately accept several separators because free models
     * sometimes return:
     *
     * 1. Bonjour | Hello
     * 1. Bonjour - Hello
     * 1. Bonjour — Hello
     *
     * The preferred format remains:
     *
     * French | Translation
     */
    let options = [];

    if (optionsMatch?.[1]) {
      options = optionsMatch[1]
        .split(/\r?\n/)
        .map((line) => {
          const cleaned = line
            .replace(/^\s*(?:\d+[\.\):\-]|\-|\•)\s*/, '')
            .trim();

          if (!cleaned) {
            return null;
          }

          let parts = cleaned.split('|');

          if (parts.length < 2) {
            parts = cleaned.split(/\s+[—–-]\s+/);
          }

          if (parts.length < 2) {
            return null;
          }

          return {
            french: parts[0].trim(),
            translation: parts.slice(1).join('|').trim(),
          };
        })
        .filter(
          (option) =>
            option &&
            option.french &&
            option.translation
        )
        .slice(0, 3);
    }

    /*
     * Fallback:
     * If the model ignored the formatting slightly, look for lines
     * containing a pipe anywhere in the raw response's OPTIONS area.
     */
    if (options.length < 3 && optionsMatch?.[1]) {
      const fallbackOptions = optionsMatch[1]
        .match(/[^\r\n]+/g)
        ?.map((line) => line.trim())
        .filter((line) => line.includes('|'))
        .map((line) => {
          const cleaned = line
            .replace(/^\s*(?:\d+[\.\):\-]|\-|\•)\s*/, '')
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
        ) || [];

      options = fallbackOptions.slice(0, 3);
    }

    let vocabulary = [];

    if (vocabularyMatch?.[1]) {
      vocabulary = vocabularyMatch[1]
        .split(/\r?\n/)
        .map((line) => {
          const cleaned = line
            .replace(/^\s*(?:\d+[\.\):\-]|\-|\•)\s*/, '')
            .trim();

          if (!cleaned) {
            return null;
          }

          const parts = cleaned.split('|');

          return {
            french: parts[0]?.trim() || '',
            translation:
              parts.slice(1).join('|').trim() || '',
          };
        })
        .filter(
          (item) =>
            item &&
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
