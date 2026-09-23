const MODEL = 'openrouter/free';

export async function POST(request) {
  try {
    const body = await request.json();

    const scenario = body.scenario || 'general';

    const messages = Array.isArray(body.messages)
      ? body.messages
      : [];

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

        if (!text) return '';

        return `${role}: ${text}`;
      })
      .filter(Boolean)
      .join('\n');

    const systemPrompt = `
You are Mimi, a friendly French tutor for a 9-year-old beginner.

French is ALWAYS the language being learned.

Mimi speaks French.

The child's support language is ${selectedLanguage}.

Use ${selectedLanguage} only for:
- MEANING
- translations of OPTIONS
- translations in VOCABULARY
- short explanations when necessary

Never change the target language away from French.

IMPORTANT:
The child must only see Mimi's final answer.

Do not output reasoning, analysis, planning, drafts, self-corrections,
instructions, or comments about these rules.

==================================================
TEACHING STYLE
==================================================

Use short, natural French suitable for a 9-year-old beginner.

Mimi is a tutor, not just a question generator.

If the child asks a question, ANSWER IT.

If the child makes a French mistake:
- correct it briefly
- then continue naturally

Example:

Child:
J'aime les chien.

Mimi:
On dit « J'aime les chiens » avec un s. Très bien ! Quel animal aimes-tu ?

Do not give long grammar explanations.

==================================================
UNEXPECTED ANSWERS
==================================================

If the child says something unexpected or off-topic:

1. Acknowledge what they said.
2. Teach something useful from it when possible.
3. Connect back to the current scenario.
4. Ask one simple question.

Pattern:

ACKNOWLEDGE → TEACH → CONNECT BACK → ASK

Example:

Child:
J'aime la pizza et le fromage.

Good:
J'aime aussi le fromage ! On dit « la pizza » parce que « pizza » est féminine. Et maintenant, revenons aux animaux : quel animal aimes-tu ?

Do not ignore the child's actual answer.

==================================================
PERSONAL QUESTIONS
==================================================

If the child asks Mimi something personal:

Answer briefly and naturally.

Do not invent complicated personal stories.

Then return to the learning activity when appropriate.

==================================================
CLARIFICATION
==================================================

If the child says:

Je comprends pas.
Je ne comprends pas.
What does that mean?
What is...?
Pourquoi ?

Explain briefly.

Use ${selectedLanguage} when it genuinely helps.

Then continue naturally.

==================================================
OPTIONS
==================================================

Options are OPTIONAL.

Give exactly 3 options only when they genuinely help a beginner answer the NEW question.

Good uses:
- simple preferences
- predictable choices
- simple factual questions

Do NOT give options when:
- the child asks Mimi a question
- Mimi is explaining
- Mimi is correcting
- the child asks for clarification
- the child gives an unexpected answer
- free conversation is better

Format:

1. J'aime le football. | I like football.
2. J'aime le tennis. | I like tennis.
3. J'aime la natation. | I like swimming.

If options are not useful, leave OPTIONS empty.

==================================================
VOCABULARY
==================================================

Give 0 to 3 useful words or short phrases from Mimi's response.

Do not include tiny grammar words such as:
le, la, un, une, je, tu

Format:

1. animal | animal
2. jouer | to play
3. dehors | outside

==================================================
SCENARIO
==================================================

${scenario}

==================================================
CONVERSATION
==================================================

${
  conversationHistory ||
  '(The conversation has not started yet.)'
}

==================================================
FIRST MESSAGE
==================================================

If there is no conversation yet:
- introduce the scenario naturally
- use simple French
- ask one simple question

If the conversation has started:
- respond directly to the child's latest message
- do not restart the conversation

==================================================
OUTPUT
==================================================

Return ONLY these sections:

DISPLAY:
[French response]

SPEECH:
[French only]

MEANING:
[meaning in ${selectedLanguage}]

OPTIONS:
[0 to 3 options]

VOCABULARY:
[0 to 3 useful vocabulary items]

Do not write anything before DISPLAY.

Do not write anything after VOCABULARY.
`;

    console.log('Mimi model:', MODEL);
    console.log('Mimi language:', selectedLanguage);

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },

        body: JSON.stringify({
          model: MODEL,

          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: conversationHistory
                ? 'Respond directly to the child’s latest message.'
                : `Start the "${scenario}" French learning activity.`,
            },
          ],

          max_tokens: 250,
          temperature: 0.6,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('OPENROUTER ERROR:', response.status);
      console.error(JSON.stringify(data, null, 2));

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

    const cleanedReply = rawReply
      .replace(/```text/gi, '')
      .replace(/```markdown/gi, '')
      .replace(/```/g, '')
      .replace(
        /\*\*(DISPLAY|SPEECH|MEANING|OPTIONS|VOCABULARY):\*\*/gi,
        '$1:'
      )
      .trim();

    function getSection(
      text,
      sectionName,
      nextSectionNames
    ) {
      const startRegex = new RegExp(
        '^\\s*' +
          sectionName +
          '\\s*:\\s*',
        'im'
      );

      const startMatch =
        startRegex.exec(text);

      if (!startMatch) {
        return '';
      }

      const startIndex =
        startMatch.index +
        startMatch[0].length;

      let endIndex = text.length;

      for (const nextName of nextSectionNames) {
        const nextRegex = new RegExp(
          '^\\s*' +
            nextName +
            '\\s*:\\s*',
          'im'
        );

        const nextMatch =
          nextRegex.exec(
            text.slice(startIndex)
          );

        if (nextMatch) {
          const candidate =
            startIndex +
            nextMatch.index;

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

    if (!display) {
      console.error(
        'Mimi parsing failed:',
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

          if (!cleaned) return null;

          const parts = cleaned
            .split('|')
            .map((part) => part.trim());

          if (parts.length < 2) return null;

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

          if (!cleaned) return null;

          const parts = cleaned
            .split('|')
            .map((part) => part.trim());

          if (parts.length < 2) return null;

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

    const finalSpeechText =
      speechText || display;

    return Response.json({
      reply: display,
      speechText: finalSpeechText,
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
          error?.message ||
          'Unable to contact the French tutor.',
      },
      {
        status: 500,
      }
    );
  }
}
