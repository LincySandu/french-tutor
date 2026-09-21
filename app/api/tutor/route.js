export async function POST(request) {
  try {
    const body = await request.json();

    const scenario = body.scenario || 'general';

    const messages = Array.isArray(body.messages)
      ? body.messages
      : [];

    /*
     * ==========================================================
     * LANGUAGE SETUP
     * ==========================================================
     *
     * French is ALWAYS the language being learned.
     *
     * The selected language is ONLY the support language:
     * - meanings
     * - translations
     * - vocabulary
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

    /*
     * ==========================================================
     * CONVERSATION HISTORY
     * ==========================================================
     */

    const conversationHistory = messages
      .map((message) => {
        const role =
          message.role === 'user'
            ? 'CHILD'
            : 'MIMI';

        const text =
          typeof message.text === 'string'
            ? message.text.trim()
            : '';

        if (!text) {
          return '';
        }

        return `${role}: ${text}`;
      })
      .filter(Boolean)
      .join('\n');

    /*
     * ==========================================================
     * SYSTEM PROMPT
     * ==========================================================
     */

    const systemPrompt = `
You are Mimi, a friendly French tutor helping a 9-year-old beginner learn French.

FRENCH IS ALWAYS THE LANGUAGE BEING LEARNED.

Mimi ALWAYS speaks French.

The child's support language is ${selectedLanguage}.

The support language is ONLY used for:
- MEANING
- translations of answer OPTIONS
- translations in VOCABULARY
- very short explanations or corrections

Never change the target language away from French.

==================================================
SPEECH
==================================================

SPEECH must contain ONLY French.

Never put translations, explanations or another language inside SPEECH.

==================================================
DISPLAY
==================================================

DISPLAY is Mimi's visible response.

DISPLAY should use simple French.

If the conversation has already started, Mimi MUST respond to the child's latest answer.

Do NOT restart the conversation.

Do NOT simply say "Bonjour !".

DISPLAY must end with exactly ONE simple French question.

Never ask two questions.

==================================================
MEANING
==================================================

MEANING must explain Mimi's complete response in ${selectedLanguage}.

==================================================
OPTIONS
==================================================

Always provide exactly 3 answer options.

Each option must:
- be a natural French answer to Mimi's NEW question
- be short
- be suitable for a 9-year-old beginner
- be different from the other options
- contain French first
- contain a translation into ${selectedLanguage}

Format:

1. J'aime le football. | I like football.
2. J'aime le tennis. | I like tennis.
3. J'aime la natation. | I like swimming.

==================================================
VOCABULARY
==================================================

Provide up to 3 useful French words or short phrases from Mimi's response.

Format:

1. mot français | ${selectedLanguage} meaning
2. mot français | ${selectedLanguage} meaning
3. mot français | ${selectedLanguage} meaning

Do not use tiny grammar words such as:
le
la
un
une
je
tu

==================================================
TEACHING LEVEL
==================================================

The child is 9 years old and is a complete beginner.

Use:
- short French sentences
- simple vocabulary
- natural children's language
- one question at a time

Stay within the current scenario.

Do not give long grammar explanations.

Respond naturally to what the child actually said.

==================================================
CURRENT SCENARIO
==================================================

${scenario}

==================================================
CONVERSATION SO FAR
==================================================

${
  conversationHistory ||
  '(The conversation has not started yet.)'
}

==================================================
FIRST MESSAGE
==================================================

If the conversation has not started yet:

- introduce the scenario naturally
- speak French
- ask one simple French question

If the conversation has already started:

- respond specifically to the child's latest message
- continue the conversation naturally
- do NOT restart

==================================================
OUTPUT FORMAT
==================================================

Return ONLY these sections:

DISPLAY:
[French response ending with exactly ONE French question]

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

Do not add anything before DISPLAY.

Do not add anything after VOCABULARY.

Do not use Markdown headings.

Do not use code fences.

Do not use bold around section names.
`;

    /*
     * ==========================================================
     * OPENROUTER REQUEST
     * ==========================================================
     */

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
              content: systemPrompt,
            },

            {
              role: 'user',

              content: conversationHistory
                ? `
Continue the French-learning conversation.

Respond directly to the child's latest message.

Do not restart the conversation.

French is the target language.

Mimi speaks French.

MEANING must be in ${selectedLanguage}.

OPTION translations must be in ${selectedLanguage}.

VOCABULARY translations must be in ${selectedLanguage}.

Ask exactly one French question.

Provide exactly three answer options.
`
                : `
Start the conversation for the "${scenario}" scenario.

Introduce the topic naturally in simple French.

Ask exactly one simple French question.

Provide exactly three answer options.
`,
            },
          ],
        }),
      }
    );

    /*
     * ==========================================================
     * OPENROUTER RESPONSE
     * ==========================================================
     */

    const data = await response.json();

    if (!response.ok) {
      console.error(
        'OpenRouter HTTP error:',
        response.status,
        data
      );

      return Response.json(
        {
          error:
            data?.error?.message ||
            `OpenRouter request failed with status ${response.status}.`,
        },
        {
          status: response.status,
        }
      );
    }

    const rawReply =
      data?.choices?.[0]?.message?.content?.trim() || '';

    console.log(
      'Mimi support language:',
      selectedLanguage
    );

    console.log(
      'Mimi raw response:',
      rawReply
    );

    if (!rawReply) {
      return Response.json(
        {
          error:
            'Mimi returned an empty response from OpenRouter.',
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ==========================================================
     * CLEAN MODEL RESPONSE
     * ==========================================================
     */

    const cleanedReply = rawReply
      .replace(/```text/gi, '')
      .replace(/```markdown/gi, '')
      .replace(/```/g, '')
      .replace(
        /\*\*(DISPLAY|SPEECH|MEANING|OPTIONS|VOCABULARY):\*\*/gi,
        '$1:'
      )
      .replace(
        /^#+\s*(DISPLAY|SPEECH|MEANING|OPTIONS|VOCABULARY)\s*:?\s*$/gim,
        '$1:'
      )
      .trim();

    /*
     * ==========================================================
     * SIMPLE SECTION EXTRACTION
     * ==========================================================
     */

    function getSection(text, sectionName, nextSectionNames) {
      const startRegex = new RegExp(
        '^\\s*' + sectionName + '\\s*:\\s*',
        'im'
      );

      const startMatch = startRegex.exec(text);

      if (!startMatch) {
        return '';
      }

      const startIndex =
        startMatch.index + startMatch[0].length;

      let endIndex = text.length;

      for (const nextName of nextSectionNames) {
        const nextRegex = new RegExp(
          '^\\s*' + nextName + '\\s*:\\s*',
          'im'
        );

        const nextMatch = nextRegex.exec(
          text.slice(startIndex)
        );

        if (nextMatch) {
          const candidate =
            startIndex + nextMatch.index;

          if (candidate < endIndex) {
            endIndex = candidate;
          }
        }
      }

      return text
        .slice(startIndex, endIndex)
        .trim();
    }

    const sections = [
      'DISPLAY',
      'SPEECH',
      'MEANING',
      'OPTIONS',
      'VOCABULARY',
    ];

    const display = getSection(
      cleanedReply,
      'DISPLAY',
      sections.filter(
        (name) => name !== 'DISPLAY'
      )
    );

    const speechText = getSection(
      cleanedReply,
      'SPEECH',
      sections.filter(
        (name) => name !== 'SPEECH'
      )
    );

    const meaning = getSection(
      cleanedReply,
      'MEANING',
      sections.filter(
        (name) => name !== 'MEANING'
      )
    );

    const optionsText = getSection(
      cleanedReply,
      'OPTIONS',
      sections.filter(
        (name) => name !== 'OPTIONS'
      )
    );

    const vocabularyText = getSection(
      cleanedReply,
      'VOCABULARY',
      sections.filter(
        (name) => name !== 'VOCABULARY'
      )
    );

    /*
     * ==========================================================
     * CHECK DISPLAY
     * ==========================================================
     */

    if (!display) {
      console.error(
        'Mimi parsing failed.'
      );

      console.error(
        'Raw response:',
        rawReply
      );

      return Response.json(
        {
          error:
            'Mimi returned an unexpected response format.',
        },
        {
          status: 502,
        }
      );
    }

    /*
     * ==========================================================
     * PARSE OPTIONS
     * ==========================================================
     */

    let options = [];

    if (optionsText) {
      options = optionsText
        .split(/\r?\n/)
        .map((line) => {
          const cleaned = line
            .replace(
              /^\s*(?:\d+[\.\):\-]|\-|\•|\*)\s*/,
              ''
            )
            .trim();

          if (!cleaned) {
            return null;
          }

          const parts = cleaned
            .split('|')
            .map((part) => part.trim());

          if (parts.length < 2) {
            return null;
          }

          return {
            french: parts[0],

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
     * ==========================================================
     * PARSE VOCABULARY
     * ==========================================================
     */

    let vocabulary = [];

    if (vocabularyText) {
      vocabulary = vocabularyText
        .split(/\r?\n/)
        .map((line) => {
          const cleaned = line
            .replace(
              /^\s*(?:\d+[\.\):\-]|\-|\•|\*)\s*/,
              ''
            )
            .trim();

          if (!cleaned) {
            return null;
          }

          const parts = cleaned
            .split('|')
            .map((part) => part.trim());

          if (parts.length < 2) {
            return null;
          }

          return {
            french: parts[0],

            translation: parts
              .slice(1)
              .join('|')
              .trim(),
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

    /*
     * ==========================================================
     * LOG RESULTS
     * ==========================================================
     */

    console.log(
      'Mimi parsed display:',
      display
    );

    console.log(
      'Mimi parsed speech:',
      speechText
    );

    console.log(
      'Mimi parsed meaning:',
      meaning
    );

    console.log(
      'Mimi parsed options:',
      options
    );

    console.log(
      'Mimi parsed vocabulary:',
      vocabulary
    );

    /*
     * ==========================================================
     * RETURN TO PAGE.JSX
     * ==========================================================
     */

    return Response.json({
      reply: display,
      speechText,
      meaning,
      options,
      vocabulary,
    });
  } catch (error) {
    console.error(
      'Tutor API fatal error:',
      error
    );

    return Response.json(
      {
        error:
          'Unable to contact the French tutor.',
        details:
          error?.message || String(error),
      },
      {
        status: 500,
      }
    );
  }
}
