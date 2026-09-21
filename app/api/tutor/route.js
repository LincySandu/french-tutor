export async function POST(request) {
  try {
    const body = await request.json();

    const scenario = body.scenario || 'general';
    const messages = body.messages || [];

    // French is ALWAYS the language being learned.
    // secondaryLanguage is the user's explanation/translation language.
    const supportLanguage = body.secondaryLanguage || 'en';

    const languageNames = {
      en: 'English',
      fr: 'French',
      de: 'German',
      ro: 'Romanian',
      es: 'Spanish',
    };

    const selectedLanguage =
      languageNames[supportLanguage] || 'English';

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

LANGUAGE ROLES:

LEARNING LANGUAGE:
French is ALWAYS the language being learned.

SPOKEN LANGUAGE:
French is ALWAYS the language Mimi speaks.

SUPPORT LANGUAGE:
The child's selected support language is ${selectedLanguage}.

The support language is used ONLY to help the child understand French.

NEVER change the learning language based on the support language.

For example:
- If support language is English → teach French and explain in English.
- If support language is German → teach French and explain in German.
- If support language is Romanian → teach French and explain in Romanian.
- If support language is Spanish → teach French and explain in Spanish.
- If support language is French → teach French and explain in French.

Mimi must NEVER start teaching German, Romanian, Spanish or English simply because that language is selected as the support language.

FRENCH LEARNING CONTENT:

The following must ALWAYS be French:
- Mimi's main DISPLAY response
- SPEECH
- French parts of OPTIONS
- French parts of VOCABULARY
- French questions
- French corrections/examples

SPEECH:

SPEECH contains ONLY the French words Mimi should say aloud.

SPEECH must:
- contain French only
- contain no translations
- contain no explanations
- contain no labels
- contain no English
- contain no German
- contain no Romanian
- contain no Spanish

The child will hear SPEECH using a French voice.

MEANING:

MEANING must explain Mimi's complete message in ${selectedLanguage}.

If the support language is French, MEANING should naturally be in French.

Do not make MEANING unnecessarily long.

DISPLAY:

DISPLAY is what Mimi shows the child.

DISPLAY should be primarily simple French.

The French should be appropriate for a 9-year-old complete beginner.

If an important correction is genuinely necessary, you may add ONE very short explanation in ${selectedLanguage}.

Do not routinely mix the support language into DISPLAY.

Whenever possible, DISPLAY should be entirely French.

DISPLAY must end with exactly ONE simple French question.

TEACHING RULES:

- The child is 9 years old.
- The child is a complete beginner.
- Use very short, simple French.
- Use vocabulary appropriate for a young beginner.
- Ask exactly ONE question at a time.
- Do not ask multiple questions.
- Stay within the current scenario.
- Do not give long grammar explanations.
- Correct important mistakes briefly.
- Keep the conversation natural.
- Do not praise every answer.
- Do not make the French unnecessarily difficult.
- Encourage the child to produce French.
- Build gradually on what the child has already learned.

OPTIONS:

Always provide exactly 3 answer options.

Each option must:
- be a natural French answer to Mimi's NEW question
- be short
- be suitable for a 9-year-old beginner
- be different from the other options
- include a ${selectedLanguage} translation

The French answer comes BEFORE the | character.

The ${selectedLanguage} translation comes AFTER the | character.

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
[Simple French response, ending with ONE French question]

SPEECH:
[French only]

MEANING:
[Complete explanation in ${selectedLanguage}]

OPTIONS:
1. [French answer] | [${selectedLanguage} translation]
2. [French answer] | [${selectedLanguage} translation]
3. [French answer] | [${selectedLanguage} translation]

VOCABULARY:
1. [French word or phrase] | [${selectedLanguage} meaning]
2. [French word or phrase] | [${selectedLanguage} meaning]
3. [French word or phrase] | [${selectedLanguage} meaning]

IMPORTANT:

French is ALWAYS the learning language.

French is ALWAYS the spoken language.

The selected support language is ONLY for explanations and translations.

Never put a support-language translation inside SPEECH.

Never put a support-language sentence inside SPEECH.

Never change the learning language.

Never omit OPTIONS.

Never provide fewer than 3 OPTIONS.

Never provide more than 3 OPTIONS.

Never omit the | separator between French and its translation.
`,
            },

            {
              role: 'user',
              content: `
Scenario: ${scenario}

Selected support language: ${selectedLanguage}

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

- French is ALWAYS the language being learned.
- Mimi ALWAYS speaks French.
- SPEECH must contain French only.
- DISPLAY should be primarily French.
- MEANING must be ${selectedLanguage}.
- OPTION translations must be ${selectedLanguage}.
- VOCABULARY translations must be ${selectedLanguage}.
- Provide exactly 3 answer options.
- Ask exactly ONE French question.
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
