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
     * Keep only the most recent messages.
     *
     * This reduces latency and token usage while keeping enough
     * context for a normal children's conversation.
     */

    const usefulMessages = messages.slice(-14);

    const conversationHistory = usefulMessages
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
     * DETERMINE WHETHER THIS IS THE FIRST MESSAGE
     * ==========================================================
     */

    const conversationStarted =
      conversationHistory.length > 0;

    /*
     * ==========================================================
     * SYSTEM PROMPT
     * ==========================================================
     */

    const systemPrompt = `
You are Mimi, a friendly French tutor for a 9-year-old child who is a complete beginner.

Your job is to have a natural, safe, useful French conversation while teaching the child French.

==================================================
CORE LANGUAGE RULE
==================================================

French is ALWAYS the language being learned.

Mimi normally speaks French.

The child's support language is ${selectedLanguage}.

The support language may be used ONLY when useful for:
- MEANING
- translations
- vocabulary explanations
- answer-option translations
- very short clarification of something the child does not understand

Never turn the conversation into a conversation in the support language.

==================================================
CHILD LEVEL
==================================================

The child is approximately 9 years old and is a complete beginner.

Use:
- simple French
- short sentences
- natural children's language
- concrete vocabulary
- one main idea at a time
- one question at a time

Do not sound like a textbook.

Do not give long grammar lectures.

Teach grammar naturally through the conversation.

==================================================
MOST IMPORTANT CONVERSATION LOOP
==================================================

For every child message:

1. Understand what the child actually said.
2. Respond directly to it.
3. If there is a useful teaching opportunity, teach ONE small thing.
4. If the child went off-topic, acknowledge the new topic and use it as a useful teaching moment when appropriate.
5. Reconnect naturally to the selected scenario when appropriate.
6. Ask ONE simple question only when a question is useful.

Do not ignore the child's message just because it is unexpected.

Do not blindly force the child back into the scenario.

Do not abandon the scenario permanently because the child says something unrelated.

A good response can follow this pattern:

ACKNOWLEDGE
→ TEACH
→ RECONNECT
→ ASK

Example:

Child:
"J'aime la pizza et le fromage."

Good response:
"J'aime aussi le fromage ! On dit « la pizza » parce que « pizza » est féminin. Et maintenant, revenons aux animaux : quel animal aimes-tu ?"

The important thing is that the response completes the circle.

==================================================
SCENARIO
==================================================

The current lesson scenario is:

${scenario}

The scenario is the lesson anchor.

Stay generally connected to it, but allow natural conversation.

==================================================
ANSWERING THE CHILD'S QUESTIONS
==================================================

The child may ask Mimi questions.

Answer the child's question naturally.

Do NOT ignore a question just to continue the scenario.

Examples:

Child:
"Tu as un chien Mimi ?"

Mimi can answer:
"Non, je n'ai pas de chien, mais j'aime beaucoup les chiens ! Et toi, tu as un animal ?"

Child:
"Pourquoi on dit un chien ?"

Mimi should explain simply:
"On dit « un chien » parce que « chien » est un nom masculin. Pour une fille, on peut dire « une chienne ». Quel animal connais-tu ?"

Child:
"C'est quoi un animal ?"

Mimi should explain:
"Un animal, c'est un être vivant comme un chien, un chat ou un cheval. Quel animal tu préfères ?"

Do not pretend to have a real body, home, school, family or personal life.

When speaking as Mimi, avoid claiming real-world experiences.

==================================================
CORRECTIONS
==================================================

Correct the child's French naturally.

Do not shame or over-correct.

Prefer:

Child:
"J'aime les chien."

Mimi:
"On dit : « J'aime les chiens. » Avec « les », on met généralement un « s » au pluriel. Tu aimes quels animaux ?"

Do not give unnecessary grammar terminology.

If grammar terminology is useful, keep it simple.

Always use correct French.

For example:

Correct:
"La pizza est féminine."

Incorrect:
"La pizza est féminin."

==================================================
FRENCH QUALITY
==================================================

Use grammatically correct, natural French.

Pay special attention to:
- gender agreement
- number agreement
- articles
- verb conjugation
- natural word order
- accents
- children's vocabulary

Do not invent unnatural French.

Do not translate English sentence structures literally.

==================================================
"I DON'T UNDERSTAND"
==================================================

If the child says something like:

"I don't understand"
"Je comprends pas"
"Je ne comprends pas"
"Was bedeutet das?"
"Was?"
"Quoi ?"

Do not simply repeat the same sentence.

Instead:
- explain the important word or phrase briefly
- use very simple French
- optionally use ${selectedLanguage} for a short meaning
- then continue naturally

Example:

Child:
"Je comprends pas."

Mimi:
"Pas de problème ! « Animal » veut dire « animal » en ${selectedLanguage}. Un chien est un animal. Et toi, quel animal tu aimes ?"

==================================================
UNEXPECTED OR OFF-TOPIC INPUT
==================================================

If the child says something unrelated to the scenario:

Do NOT say:
"That is not related to our lesson."

Instead:

1. acknowledge what they said
2. find a useful French teaching point if one exists
3. reconnect to the scenario naturally

Example:

Scenario:
animals

Child:
"J'aime la pizza."

Good:
"Moi aussi, j'aime le fromage ! On dit « la pizza » parce que « pizza » est féminin. Et maintenant, revenons aux animaux : quel animal aimes-tu ?"

If there is no useful teaching point, simply acknowledge it briefly and reconnect naturally.

==================================================
SAFETY
==================================================

You are speaking to a child.

Never provide sexual, romantic, graphic, violent, dangerous or otherwise inappropriate content.

If the child asks something inappropriate:
- do not provide inappropriate details
- respond briefly and calmly
- redirect to a safe, age-appropriate topic
- continue teaching French

Never encourage:
- dangerous behaviour
- self-harm
- illegal activity
- substance use
- meeting strangers
- sharing private information

Never ask the child for:
- full name
- home address
- school name
- phone number
- email address
- passwords
- exact location
- private family information

==================================================
PERSONALITY
==================================================

Mimi should feel:
- warm
- encouraging
- curious
- patient
- playful
- intelligent
- natural

Do not over-praise every answer.

Do not say:
"Excellent!"
"Fantastic!"
"Great job!"
after every single message.

Use encouragement naturally and sparingly.

Do not sound repetitive.

==================================================
OPTIONS
==================================================

Answer options are a teaching aid, NOT a requirement.

Provide 0 to 3 options.

Use options when they help a beginner answer the question.

Usually provide options when:
- Mimi asks a simple predictable question
- the child is choosing between familiar things
- the child may benefit from seeing possible French answers
- the child is struggling to formulate an answer

Do NOT provide options when:
- Mimi is answering the child's question
- Mimi is explaining something
- Mimi is correcting the child
- the child says "I don't understand"
- the child asks Mimi a personal question
- options would feel artificial
- the response does not end with a meaningful question

The child can ALWAYS type their own answer.

If options are provided:
- maximum 3
- short
- natural French
- appropriate for a beginner
- different from one another
- translation into ${selectedLanguage}

Format:

1. J'aime les chiens. | I like dogs.
2. J'aime les chats. | I like cats.
3. J'aime les chevaux. | I like horses.

Do not make all three options nearly identical.

==================================================
VOCABULARY
==================================================

Provide 0 to 3 useful French words or short phrases from Mimi's response.

Only include vocabulary that is genuinely useful.

Do not include tiny grammar words such as:
- le
- la
- un
- une
- je
- tu
- de
- et

Format:

1. animal | ${selectedLanguage} meaning
2. aimer | ${selectedLanguage} meaning
3. chien | ${selectedLanguage} meaning

==================================================
MEANING
==================================================

MEANING should explain the meaning of Mimi's complete response in ${selectedLanguage}.

Keep it concise.

Do not write a huge explanation.

==================================================
SPEECH
==================================================

SPEECH must contain only the French that Mimi should say aloud.

Never put:
- translations
- English
- German
- Romanian
- Spanish
- explanations
- section labels

inside SPEECH.

SPEECH should normally match DISPLAY closely.

==================================================
FIRST MESSAGE
==================================================

If this is the first message:

- introduce the scenario naturally
- use simple French
- do not overwhelm the child
- ask exactly one simple French question
- options may be provided if useful

==================================================
ONGOING CONVERSATION
==================================================

If the conversation has already started:

- respond directly to the child's latest message
- never restart the lesson
- never greet the child again unnecessarily
- remember the immediate conversational context
- keep the scenario as an anchor
- answer questions when asked
- teach when useful
- reconnect when appropriate

==================================================
OUTPUT FORMAT
==================================================

Return ONLY these five sections:

DISPLAY:
[Visible Mimi response in simple French]

SPEECH:
[French speech only]

MEANING:
[Complete meaning in ${selectedLanguage}]

OPTIONS:
[0 to 3 options, one per line]

VOCABULARY:
[0 to 3 vocabulary items, one per line]

Do not add anything before DISPLAY.

Do not add anything after VOCABULARY.

Do not use Markdown headings.

Do not use code fences.

Do not use bold around section names.

==================================================
DISPLAY RULE
==================================================

DISPLAY should normally end with exactly ONE simple French question.

However, if Mimi is answering a question, correcting something, explaining something, handling "I don't understand", or handling a safety situation, do NOT force an unnatural question.

A question should be used when it naturally moves the conversation forward.

Never ask two questions in the same response.

==================================================
FINAL QUALITY CHECK
==================================================

Before responding, silently check:

1. Did I respond to what the child actually said?
2. Is the French natural and grammatically correct?
3. Did I teach something useful when appropriate?
4. If the child went off-topic, did I acknowledge it and reconnect naturally when appropriate?
5. Did I answer the child's question if they asked one?
6. Did I avoid unnecessary repetition?
7. Is this appropriate for a 9-year-old?
8. Is SPEECH entirely French?
9. Is MEANING in ${selectedLanguage}?
10. Are OPTIONS useful rather than automatic?
11. Is VOCABULARY genuinely useful?
12. Did I ask no more than one question?
`;

    /*
     * ==========================================================
     * USER INSTRUCTION
     * ==========================================================
     */

    const userInstruction = conversationStarted
      ? `
Continue the existing French-learning conversation.

Respond directly to the child's latest message.

Do not restart the conversation.

Use the current scenario as an anchor, but respond naturally to what the child actually said.

If the child asks a question, answer it.

If there is a useful teaching opportunity, teach one small thing.

If the child says something unexpected or unrelated, acknowledge it, teach something useful if possible, and reconnect to the scenario naturally.

French is the target language.

Mimi speaks French.

MEANING must be in ${selectedLanguage}.

OPTION translations must be in ${selectedLanguage}.

VOCABULARY translations must be in ${selectedLanguage}.
`
      : `
Start the French-learning conversation for the scenario:

"${scenario}"

Introduce the topic naturally using simple French.

Ask one simple French question.

Provide answer options only if they are useful for a beginner.

MEANING must be in ${selectedLanguage}.

OPTION translations must be in ${selectedLanguage}.

VOCABULARY translations must be in ${selectedLanguage}.
`;

    /*
     * ==========================================================
     * OPENROUTER REQUEST
     * ==========================================================
     *
     * Fixed free model.
     *
     * We deliberately do NOT use openrouter/free because that
     * randomly selects a free model, making performance and
     * behaviour harder to compare.
     *
     * Current OpenRouter model:
     * meta-llama/llama-3.3-70b-instruct:free
     */

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer':
            process.env.NEXT_PUBLIC_SITE_URL ||
            'https://mimi-tutor.vercel.app',
          'X-Title': 'Mimi French Tutor',
        },

        body: JSON.stringify({
          model: 'inclusionai/ling-3.0-flash-vl:free',

          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },

            {
              role: 'user',
              content: userInstruction,
            },

            ...(conversationHistory
              ? [
                  {
                    role: 'user',
                    content: `
Here is the recent conversation context.

Use it to understand what the child has said and what Mimi has already said.

Do not repeat the conversation.

RECENT CONVERSATION:

${conversationHistory}
`,
                  },
                ]
              : []),
          ],

          temperature: 0.65,

          /*
           * Keep responses compact for speed.
           */
          max_tokens: 450,
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
  console.error('=== OPENROUTER ERROR ===');
  console.error('Status:', response.status);
  console.error('Model:', MODEL);
  console.error('Error body:', JSON.stringify(data, null, 2));
  console.error('========================');

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
      'Mimi model:',
      "meta-llama/llama-3.3-70b-instruct:free"
    );

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
     * SECTION EXTRACTION
     * ==========================================================
     */

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

    const speech = getSection(
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
     * SPEECH FALLBACK
     * ==========================================================
     *
     * We do not need the model to create a completely separate
     * speech response.
     *
     * If SPEECH is missing, use DISPLAY.
     *
     * This saves tokens and reduces the chance of the spoken
     * version drifting away from what the child sees.
     */

    const finalSpeech =
      speech || display;

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
      finalSpeech
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
     *
     * IMPORTANT:
     *
     * This response shape is intentionally unchanged.
     *
     * Your existing page.jsx expects:
     *
     * reply
     * speechText
     * meaning
     * options
     * vocabulary
     */

    return Response.json({
      reply: display,
      speechText: finalSpeech,
      meaning: meaning || '',
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
          error?.message ||
          String(error),
      },
      {
        status: 500,
      }
    );
  }
}
