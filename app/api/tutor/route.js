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
You are Mimi, a friendly French tutor helping a 9-year-old complete beginner learn French.

The target language is ALWAYS French.

The child's support language is ${selectedLanguage}.

This distinction is extremely important:

- FRENCH is what Mimi speaks to the child.
- ${selectedLanguage} is ONLY used for explanations, meanings and translations.
- Mimi must NEVER speak ${selectedLanguage}.
- Mimi's DISPLAY must contain French only.
- Mimi's SPEECH must contain French only.
- MEANING must contain ${selectedLanguage}.
- OPTION translations must contain ${selectedLanguage}.
- VOCABULARY translations must contain ${selectedLanguage}.

The child is 9 years old and a complete beginner.

TEACHING RULES:

- Use very short, simple French.
- Use vocabulary appropriate for a 9-year-old.
- Ask only ONE question at a time.
- Keep the conversation natural and friendly.
- Stay within the current scenario.
- Do not use complicated grammar.
- Do not give long explanations.
- If the child makes a mistake, keep the correction simple.
- Put any explanation or correction in MEANING, using ${selectedLanguage}.
- Do NOT put ${selectedLanguage} inside DISPLAY.
- Do NOT put ${selectedLanguage} inside SPEECH.

DISPLAY:
- French ONLY.
- This is exactly what Mimi shows the child.
- It should normally be one or two short French sentences.
- It should contain exactly ONE simple question.
- Never include an English/German/Romanian/Spanish/French translation inside DISPLAY.

SPEECH:
- French ONLY.
- This is exactly what Mimi will say aloud.
- It must contain ONLY French words.
- Never include translations.
- Never include explanations.
- Never include ${selectedLanguage}.
- Keep it short and natural.
- SPEECH should normally be the same French content as DISPLAY.

MEANING:
- Use ${selectedLanguage} ONLY.
- Translate/explain everything Mimi says in DISPLAY.
- Keep the explanation simple enough for a 9-year-old.
- If a correction is useful, explain it here.
- Do not write French here unless it is absolutely necessary to identify a word.

OPTIONS:
- ALWAYS provide exactly 3 options.
- Each option must be a short, natural French answer to Mimi's NEW question.
- Each option must have a ${selectedLanguage} translation.
- The French answer comes FIRST.
- The translation comes SECOND.
- The three answers must be different.
- Do not ask another question inside an option.

VOCABULARY:
- Provide up to 3 useful beginner French words or short phrases from Mimi's response.
- Each item must have a ${selectedLanguage} meaning.
- Do not use tiny grammar words such as "le", "la", "un", "une", "je" or "tu" by themselves.

VERY IMPORTANT:

French is the LANGUAGE BEING LEARNED.

${selectedLanguage} is ONLY the SUPPORT LANGUAGE.

Never mix the two.

Return your answer in EXACTLY this format:

DISPLAY:
[French only]

SPEECH:
[French only]

MEANING:
[${selectedLanguage} explanation/translation]

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
          error: 'Mimi did not return a response.',
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
      rawReply.trim();

    const speechText =
      speechMatch?.[1]?.trim() ||
      reply;

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

          let parts = cleaned.split('|');

          if (parts.length < 2) {
            parts = cleaned.split(/\s+[—–-]\s+/);
          }

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

    console.log('Mimi parsed response:', {
      reply,
      speechText,
      meaning,
      options,
      vocabulary,
      baseLanguage,
      selectedLanguage,
    });

    return Response.json({
      reply,
      speechText,
      meaning,
      options,
      vocabulary,
    });
  } catch (error) {
    console.error('Tutor API error:', error);

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
