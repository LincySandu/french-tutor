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
     *
     * Convert the frontend messages into a clean transcript.
     *
     * We deliberately do NOT send the UI-only meaning,
     * speechText, options, etc. back to the model.
     *
     * The model needs to know what Mimi said and what
     * the child said.
     */

    const conversationHistory =
      messages
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

==================================================
ABSOLUTE LANGUAGE RULE
==================================================

French is ALWAYS the language being learned.

Mimi ALWAYS speaks French.

The child's support language is:

${selectedLanguage}

The support language is NOT the language being learned.

The support language is ONLY used for:

- MEANING
- translations of OPTIONS
- translations in VOCABULARY
- very short explanations or corrections

Never switch the target language away from French.

==================================================
SPEECH
==================================================

SPEECH must contain ONLY French.

Never put English, Spanish, German, Romanian, translations,
explanations or labels inside SPEECH.

==================================================
DISPLAY
==================================================

DISPLAY is Mimi's visible response.

DISPLAY should be simple French.

Mimi should respond naturally to the child's previous message.

Do NOT restart the conversation.

Do NOT say "Bonjour !" as a generic fallback.

Do NOT ignore the child's previous answer.

If the child says:

"J'aime la musique."

Mimi should respond to that information.

For example:

"Super ! Moi aussi, j'aime la musique. Quel type de musique aimes-tu ?"

DISPLAY must end with exactly ONE simple French question.

Never ask two questions.

==================================================
MEANING
==================================================

MEANING explains Mimi's complete response in:

${selectedLanguage}

MEANING must be in ${selectedLanguage}.

If the support language is Spanish, MEANING must be Spanish.

If the support language is German, MEANING must be German.

If the support language is Romanian, MEANING must be Romanian.

If the support language is English, MEANING must be English.

If the support language is French, MEANING may be French.

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
- contain a translation into ${selectedLanguage} second

Use this exact format:

1. J'aime le rock. | Me gusta el rock.
2. J'aime la pop. | Me gusta el pop.
3. J'aime le rap. | Me gusta el rap.

Never put translations inside SPEECH.

==================================================
VOCABULARY
==================================================

Provide up to 3 useful French words or short phrases
from Mimi's NEW response.

Each item must contain:

French | ${selectedLanguage}

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

The child is 9 years old.

The child is a complete beginner.

Use:

- very short French sentences
- simple vocabulary
- natural children's language
- one question at a time

Stay within the current scenario.

Do not give long grammar explanations.

Do not make French unnecessarily difficult.

Do not praise every answer.

Keep the conversation natural.

Most importantly:

RESPOND TO THE CHILD'S ACTUAL PREVIOUS MESSAGE.

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
FIRST MESSAGE RULE
==================================================

If the conversation has not started yet:

- introduce the scenario naturally
- speak French
- ask one simple French question

If the conversation has already started:

- continue naturally
- respond specifically to the child's latest answer
- do NOT restart with "Bonjour !"

==================================================
OUTPUT FORMAT
==================================================

Return ONLY these five sections.

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

Do not add any text before DISPLAY.

Do not add any text after VOCABULARY.

Do not use Markdown headings.

Do not use code fences.

Do not use bold around the section names.

The section names must be exactly:

DISPLAY:
SPEECH:
MEANING:
OPTIONS:
VOCABULARY:
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

              content:
                conversationHistory
                  ? `
Continue the French-learning conversation.

The child's latest message is the last CHILD message
in the conversation above.

Respond directly to that message.

Do not restart the conversation.

Remember:
- French is the target language.
- Mimi speaks French.
- MEANING is ${selectedLanguage}.
- OPTION translations are ${selectedLanguage}.
- VOCABULARY translations are ${selectedLanguage}.
- Ask exactly one French question.
- Provide exactly three options.
`
                  : `
Start the conversation for the "${scenario}" scenario.

Introduce the topic naturally in simple French.

Ask exactly one simple French question.
`,
            },
          ],
        }),
      }
    );

    /*
     * ==========================================================
     * OPENROUTER ERROR
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

    /*
     * ==========================================================
     * GET RAW MODEL RESPONSE
     * ==========================================================
     */

    const rawReply =
      data?.choices?.[0]?.message?.content?.trim() || '';

    console.log(
      'Mimi support language:',
      selectedLanguage
    );

    console.log(
      'Mimi conversation history:',
      conversationHistory
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
     * NORMALISE MODEL OUTPUT
     * ==========================================================
     *
     * Some models occasionally return:
     *
     * **DISPLAY:**
     *
     * or:
     *
     * ```text
     * DISPLAY:
     *
     * We normalise those before parsing.
     */

    const normalisedReply = rawReply
      .replace(/```(?:text|markdown)?/gi, '')
      .replace(/```/g, '')
      .replace(/\*\*(DISPLAY|SPEECH|MEANING|OPTIONS|VOCABULARY):\*\*/gi, '$1:')
      .replace(/^#+\s*(DISPLAY|SPEECH|MEANING|OPTIONS|VOCABULARY)\s*:?/gim, '$1:')
      .trim();

    /*
     * ==========================================================
     * SECTION PARSER
     * ==========================================================
     */

    function extractSection(text, sectionName, nextSections) {
      const escapedName =
        sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      const escapedNext =
        nextSections
          .map((section) =>
            section.replace(
              /[.*+?^${}()|[\]\\]/g,
              '\\$&'
            )
          )
          .join('|');

      const regex = new RegExp(
        `${escapedName}\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*(?:${escapedNext})\\s*:|$)`,
        'i'
      );

      const match = text.match(regex);

      return match?.[1]?.trim() || '';
    }

    const sectionNames = [
      'DISPLAY',
      'SPEECH',
      'MEANING',
      'OPTIONS',
      'VOCABULARY',
    ];

    const display = extractSection(
      normalisedReply,
      'DISPLAY',
      sectionNames.filter(
        (section) => section !== 'DISPLAY'
      )
    );

    const speechText = extractSection(
      normalisedReply,
      'SPEECH',
      sectionNames.filter(
        (section) => section !== 'SPEECH'
      )
    );

    const meaning = extractSection(
      normalisedReply,
      'MEANING',
      sectionNames.filter(
        (section) => section !== 'MEANING'
      )
    );

    const optionsText = extractSection(
      normalisedReply,
      'OPTIONS',
      sectionNames.filter(
        (section) => section !== 'OPTIONS'
      )
    );

    const vocabularyText = extractSection(
      normalisedReply,
      'VOCABULARY',
      sectionNames.filter(
        (section) => section !== 'VOCABULARY'
      )
    );

    /*
     * ==========================================================
     * DO NOT HIDE PARSING FAILURES
     * ==========================================================
     *
     * Previously this was:
     *
     * display || "Bonjour !"
     *
     * That masked API problems.
     */

    if (!display) {
      console.error(
        'Mimi parsing failed. Raw response was:',
        rawReply
      );

      return Response.json(
        {
          error:
            'Mimi returned an unexpected response format.',
          rawResponse: rawReply,
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
     * VALIDATION
     * ==========================================================
     */

    if (options.length !== 3) {
      console.warn(
        'Mimi returned fewer than 3 valid options:',
        options
      );
    }

    /*
     * ==========================================================
     * FINAL RESPONSE
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
