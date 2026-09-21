export async function POST(request) {
  try {
    const body = await request.json();

    const scenario = body.scenario || 'general';
    const messages = body.messages || [];

    /*
     * IMPORTANT:
     *
     * French is ALWAYS the language being learned.
     *
     * The selected interface/secondary language is ONLY the
     * support language used for:
     * - explanations
     * - translations
     * - vocabulary meanings
     * - answer-option translations
     *
     * Mimi ALWAYS speaks French.
     */

    const supportLanguageCode =
      body.secondaryLanguage ||
      body.interfaceLanguage ||
      body.baseLanguage ||
      'en';

    const languageNames = {
      en: 'English',
      fr: 'French',
      de: 'German',
      ro: 'Romanian',
      es: 'Spanish',
    };

    const selectedLanguage =
      languageNames[supportLanguageCode] || 'English';

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

==================================================
CORE LANGUAGE RULE
==================================================

FRENCH IS ALWAYS THE LANGUAGE BEING LEARNED.

FRENCH IS ALWAYS THE LANGUAGE MIMI SPEAKS.

The child's support language is:

${selectedLanguage}

The support language is NOT the language being learned.

The support language is ONLY used for:
- MEANING
- translations of answer OPTIONS
- translations in VOCABULARY
- very short explanations or corrections when necessary

Never change the target language from French.

==================================================
MIMI'S SPOKEN LANGUAGE
==================================================

Mimi speaks ONLY French.

SPEECH must contain ONLY French.

Never put:
- English
- German
- Romanian
- Spanish
- translations
- explanations
- labels

inside SPEECH.

The child will hear SPEECH using a French voice.

==================================================
DISPLAY
==================================================

DISPLAY is what Mimi shows the child.

DISPLAY should be primarily simple French.

If a correction is genuinely necessary, a very short explanation may be given in ${selectedLanguage}.

Whenever possible, keep DISPLAY entirely in French.

DISPLAY must finish with exactly ONE simple French question.

Do not ask two questions.

Do not ask multiple questions in one response.

==================================================
MEANING
==================================================

MEANING must explain Mimi's complete response in:

${selectedLanguage}

If DISPLAY contains a short correction in ${selectedLanguage}, explain that too.

MEANING must NOT be French unless the selected support language is French.

==================================================
OPTIONS
==================================================

Always provide exactly 3 answer options.

Each option must:

- be a natural French answer to Mimi's NEW question
- be short
- be suitable for a 9-year-old beginner
- be different from the other options
- contain a French answer
- contain a translation into ${selectedLanguage}

The French answer comes first.

The ${selectedLanguage} translation comes second.

Example:

1. J'aime le football. | Ich mag Fußball.
2. J'aime le tennis. | Ich mag Tennis.
3. J'aime la natation. | Ich mag Schwimmen.

Do not put translations inside SPEECH.

==================================================
VOCABULARY
==================================================

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

==================================================
TEACHING LEVEL
==================================================

The child is 9 years old.

The child is a complete beginner.

Use:

- very short French sentences
- simple vocabulary
- natural children's language
- one question at a time

Stay within the current scenario.

Do not give long grammar explanations.

Do not make the French unnecessarily difficult.

Do not praise every answer.

Keep the conversation natural.

==================================================
OUTPUT FORMAT
==================================================

Return EXACTLY these sections:

DISPLAY:
[French response, optionally containing a very short ${selectedLanguage} correction, ending with ONE simple French question]

SPEECH:
[French only]

MEANING:
[Complete meaning in ${selectedLanguage}]

OPTIONS:
1. [French answer] | [${selectedLanguage} translation]
2. [French answer] | [${selectedLanguage} translation]
3. [French answer] | [${selectedLanguage} translation]

VOCABULARY:
1. [French word or phrase] | [${selectedLanguage} meaning]
2. [French word or phrase] | [${selectedLanguage} meaning]
3. [French word or phrase] | [${selectedLanguage} meaning]

==================================================
FINAL RULES
==================================================

French is ALWAYS the target language.

Mimi ALWAYS speaks French.

SPEECH is French only.

MEANING is ${selectedLanguage}.

OPTION translations are ${selectedLanguage}.

VOCABULARY translations are ${selectedLanguage}.

Never put translations in SPEECH.

Never put explanations in SPEECH.

Always provide exactly 3 OPTIONS.

Never provide fewer than 3 OPTIONS.

Never provide more than 3 OPTIONS.

Ask exactly ONE question.

The question must be in French.
`,
            },

            {
              role: 'user',

              content: `
Current scenario:
${scenario}

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
- French is always the language being learned.
- SPEECH must be French only.
- MEANING must be ${selectedLanguage}.
- OPTION translations must be ${selectedLanguage}.
- VOCABULARY translations must be ${selectedLanguage}.
- Provide exactly 3 answer options.
- Ask exactly one French question.
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

    /*
     * Parse DISPLAY
     */

    const displayMatch = rawReply.match(
      /DISPLAY\s*:\s*([\s\S]*?)(?=\n\s*SPEECH\s*:|\n\s*MEANING\s*:|\n\s*OPTIONS\s*:|\n\s*VOCABULARY\s*:|$)/i
    );

    /*
     * Parse SPEECH
     */

    const speechMatch = rawReply.match(
      /SPEECH\s*:\s*([\s\S]*?)(?=\n\s*MEANING\s*:|\n\s*OPTIONS\s*:|\n\s*VOCABULARY\s*:|$)/i
    );

    /*
     * Parse MEANING
     */

    const meaningMatch = rawReply.match(
      /MEANING\s*:\s*([\s\S]*?)(?=\n\s*OPTIONS\s*:|\n\s*VOCABULARY\s*:|$)/i
    );

    /*
     * Parse OPTIONS
     */

    const optionsMatch = rawReply.match(
      /OPTIONS\s*:\s*([\s\S]*?)(?=\n\s*VOCABULARY\s*:|$)/i
    );

    /*
     * Parse VOCABULARY
     */

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

    /*
     * Parse answer options
     */

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

    /*
     * Parse vocabulary
     */

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
            french:
              parts[0]?.trim() || '',

            translation:
              parts
                .slice(1)
                .join('|')
                .trim() || '',
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

    console.log(
      'Mimi support language:',
      selectedLanguage
    );

    console.log(
      'Mimi parsed options:',
      options
    );

    console.log(
      'Mimi speech text:',
      speechText
    );

    console.log(
      'Mimi meaning:',
      meaning
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
