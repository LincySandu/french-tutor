export async function POST(request) {
  try {
    const body = await request.json();

    const scenario = body.scenario || 'general';
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

TARGET LANGUAGE:
French is ALWAYS the language being learned.

SUPPORT LANGUAGE:
The child's support language is ${selectedLanguage}.

VERY IMPORTANT LANGUAGE RULE:

Mimi speaks ONLY French.

The following must be French only:
- DISPLAY
- SPEECH
- French answers in OPTIONS
- French words in VOCABULARY

The following must use ONLY ${selectedLanguage}:
- MEANING
- translations of OPTIONS
- meanings/translations in VOCABULARY

Never put ${selectedLanguage} inside SPEECH.

Never put an English, German, Romanian or Spanish sentence inside SPEECH unless ${selectedLanguage} itself is French.

SPEECH must contain ONLY the French words that Mimi says aloud.

The child will hear SPEECH using a French voice.

TEACHING RULES:

- The child is a complete beginner.
- The child is 9 years old.
- Use very short, simple French.
- Use vocabulary appropriate for a young beginner.
- Ask exactly ONE question at a time.
- Do not ask multiple questions.
- Stay within the current scenario.
- Do not give long grammar explanations.
- If the child makes an important mistake, give a very short correction in ${selectedLanguage}, but keep DISPLAY primarily French.
- Keep the conversation natural.
- Do not praise every answer.
- Do not make the French unnecessarily difficult.

DISPLAY:

DISPLAY is what Mimi shows the child.

DISPLAY must contain:
1. Simple French that Mimi says.
2. If a correction is genuinely necessary, a short ${selectedLanguage} explanation may be included.

However, whenever possible, keep DISPLAY mostly or entirely French.

DISPLAY must end with exactly ONE simple French question.

SPEECH:

SPEECH contains ONLY what Mimi should say aloud.

SPEECH must be French only.

Do not include:
- translations
- explanations
- labels
- English
- German
- Romanian
- Spanish

MEANING:

MEANING must explain the complete Mimi message in ${selectedLanguage}.

If DISPLAY contains a short correction in ${selectedLanguage}, include that meaning as well.

OPTIONS:

Always provide exactly 3 answer options.

Each option must:
- be a natural French answer to Mimi's NEW question
- be short
- be suitable for a 9-year-old beginner
- be different from the other options
- include a ${selectedLanguage} translation

VOCABULARY:

Provide up to 3 useful French words or short phrases from Mimi's response.

Each vocabulary item must contain:
- the French word or phrase
- its ${selectedLanguage} meaning

Do not use tiny grammar words such as:
- le
- la
- un
- une
- je
- tu

OUTPUT FORMAT:

Return EXACTLY these sections:

DISPLAY:
[French response, with an optional very short ${selectedLanguage} correction if necessary, ending with ONE French question]

SPEECH:
[French only]

MEANING:
[Complete ${selectedLanguage} meaning]

OPTIONS:
1. [French answer] | [${selectedLanguage} translation]
2. [French answer] | [${selectedLanguage} translation]
3. [French answer] | [${selectedLanguage} translation]

VOCABULARY:
1. [French word or phrase] | [${selectedLanguage} meaning]
2. [French word or phrase] | [${selectedLanguage} meaning]
3. [French word or phrase] | [${selectedLanguage} meaning]

IMPORTANT:
Never omit OPTIONS.
Never provide fewer than 3 OPTIONS.
Never provide more than 3 OPTIONS.
Never put a translation inside SPEECH.
Never put ${selectedLanguage} inside SPEECH.
French is always the spoken language.
`,
            },

            {
              role: 'user',
              content: `
Scenario: ${scenario}

Conversation so far:

${messages
  .map(
    (message) =>
      `${message.role || message.speaker}: ${
        message.text || ''
      }`
  )
  .join('\n')}

Continue the conversation.

Remember:
- Mimi speaks French.
- SPEECH must be French only.
- MEANING must be ${selectedLanguage}.
- OPTION translations must be ${selectedLanguage}.
- VOCABULARY translations must be ${selectedLanguage}.
- Provide exactly 3 options.
`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter error:', data);

      return Response.json(
        {
          error:
            data.error?.message ||
            'OpenRouter request failed.',
        },
        {
          status: response.status,
        }
      );
    }

    const rawReply =
      data.choices?.[0]?.message?.content || '';

    console.log('Mimi raw response:', rawReply);

    if (!rawReply) {
      return Response.json(
        {
          error: 'Mimi returned an empty response.',
        },
        {
          status: 500,
        }
      );
    }

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
      'Bonjour !';

    const speechText =
      speechMatch?.[1]?.trim() ||
      '';

    const meaning =
      meaningMatch?.[1]?.trim() ||
      '';

    let options = [];

    if (optionsMatch?.[1]) {
      options = optionsMatch[1]
        .split(/\r?\n/)
        .map((line) => {
          const cleaned = line
            .replace(
              /^\s*(?:\d+[\.\):\-]|\-|\•)\s*/,
              ''
            )
            .trim();

          if (!cleaned) {
            return null;
          }

          const parts = cleaned.split('|');

          if (parts.length < 2) {
            return null;
          }

          return {
            french: parts[0].trim(),
            translation: parts
              .slice(1)
              .join('|')
              .trim(),
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

    let vocabulary = [];

    if (vocabularyMatch?.[1]) {
      vocabulary = vocabularyMatch[1]
        .split(/\r?\n/)
        .map((line) => {
          const cleaned = line
            .replace(
              /^\s*(?:\d+[\.\):\-]|\-|\•)\s*/,
              ''
            )
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

    console.log('Mimi parsed options:', options);
    console.log(
      'Mimi speech text:',
      speechText
    );

    return Response.json({
      reply,
      speechText,
      meaning,
      options,
      vocabulary,
    });
  } catch (error) {
    console.error(
      'Tutor API error:',
      error
    );

    return Response.json(
      {
        error:
          'Unable to contact the French tutor.',
      },
      {
        status: 500,
      }
    );
  }
}
