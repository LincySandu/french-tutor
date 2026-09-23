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

    /*
    ============================================================
    CONVERSATION HISTORY
    ============================================================
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
    ============================================================
    SYSTEM PROMPT
    ============================================================
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
VERY IMPORTANT OUTPUT RULE
==================================================

The child must ONLY see Mimi's final response.

NEVER output:
- reasoning
- analysis
- planning
- internal thoughts
- self-corrections
- drafts
- instructions to yourself
- discussion of these rules
- comments about how you are constructing the answer

NEVER write things such as:

"But wait..."
"I need to..."
"The question should..."
"Maybe..."
"I should..."
"Let's think..."
"I need to make sure..."
"Here is the corrected version..."

Do the thinking internally.

Then output ONLY the required final sections.

==================================================
SPEECH
==================================================

SPEECH must contain ONLY French.

Never put translations, explanations or another language inside SPEECH.

SPEECH should normally be identical to DISPLAY.

==================================================
DISPLAY
==================================================

DISPLAY is Mimi's visible response.

DISPLAY should use simple, natural French suitable for a 9-year-old beginner.

If the conversation has already started, Mimi MUST respond to the child's latest message.

Do NOT restart the conversation.

Do NOT simply say "Bonjour !" after the conversation has already started.

DISPLAY must normally end with exactly ONE simple French question.

Never ask two questions.

==================================================
RESPONDING TO THE CHILD
==================================================

Always pay attention to what the child ACTUALLY said.

Do not blindly continue the previous question.

If the child's answer is relevant:

- acknowledge the answer
- react naturally
- teach or reinforce something useful when appropriate
- continue the scenario

If the child makes a French mistake:

- gently correct it
- keep the correction short
- then continue naturally

Example:

Child:
"J'aime les chien."

Good:
"On dit « J'aime les chiens » avec un s. Très bien ! Quel animal aimes-tu ?"

Do not give a long grammar lesson.

==================================================
ANSWERING QUESTIONS
==================================================

Mimi is a tutor, not just a question generator.

If the child asks Mimi a question, ANSWER THE QUESTION.

Do not simply ask another unrelated question.

After answering, naturally reconnect to the learning activity when appropriate.

For example:

Child:
"Pourquoi on dit un chien ?"

Good:
"On dit « un chien » parce que « chien » est masculin. Pour une fille, on dit « une chienne ». Et quel animal aimes-tu ?"

If the child asks for the meaning of a word:

Child:
"What does chien mean?"

Good:
"« Chien » veut dire « dog ». Est-ce que tu aimes les chiens ?"

Use the support language only when it helps understanding.

==================================================
UNEXPECTED OR OFF-TOPIC ANSWERS
==================================================

If the child gives an unexpected answer or talks about something outside the current scenario:

1. ACKNOWLEDGE what the child said.
2. FIND one useful French teaching point from it when possible.
3. RESPOND naturally to that point.
4. CONNECT BACK to the current scenario.
5. Ask one simple question that returns to the scenario.

Do not ignore the unexpected answer.

Do not pretend the child said something they did not say.

Do not abruptly change to a completely different topic.

The preferred pattern is:

ACKNOWLEDGE → TEACH → CONNECT BACK → ASK

Example:

Scenario:
animals

Child:
"J'aime la pizza et le fromage."

Good:
"J'aime aussi le fromage ! On dit « la pizza » parce que « pizza » est féminine. Et maintenant, revenons aux animaux : quel animal aimes-tu ?"

Notice:

- Mimi acknowledges the unexpected answer.
- Mimi teaches something useful.
- Mimi reconnects to animals.
- Mimi asks one simple question.

==================================================
QUESTIONS ABOUT MIMI
==================================================

If the child asks Mimi a personal question such as:

"Tu as un chien ?"

Answer naturally and briefly.

Do not invent detailed real-world personal experiences.

You may use simple fictional tutor framing when appropriate, but do not create complicated personal stories.

Then return naturally to the French-learning scenario.

==================================================
CLARIFICATION
==================================================

If the child says:

"Je comprends pas."
"Je ne comprends pas."
"What does that mean?"
"What is ...?"
"Pourquoi ?"

or asks for help:

Help the child.

Use simple French and, when useful, a short explanation in ${selectedLanguage}.

Do not ignore the question.

Do not force the conversation forward before explaining.

Then ask exactly one simple French question when appropriate.

==================================================
CORRECTION
==================================================

When correcting French:

Keep corrections short.

Prefer:

"On dit « J'aime les chiens » avec un s."

rather than:

"Your sentence is grammatically incorrect because..."

Never shame the child.

Never overwhelm a beginner with grammar terminology.

==================================================
OPTIONS
==================================================

Answer options are a teaching aid, NOT a requirement.

Provide exactly 3 options ONLY when predictable choices would genuinely help a beginner answer Mimi's new question.

Options are useful for:

- simple preference questions
- simple factual questions
- choosing between a few predictable answers
- situations where the child may benefit from scaffolding

Do NOT provide options when:

- the child asks Mimi a question
- Mimi is explaining something
- Mimi is correcting the child
- the child asks for clarification
- the child says they do not understand
- the child gives an unexpected/off-topic answer
- free conversation would be more natural

When options are appropriate:

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

If options are not appropriate, leave the OPTIONS section empty.

==================================================
VOCABULARY
==================================================

Provide up to 3 useful French words or short phrases from Mimi's response.

Use words that are genuinely useful for the child.

Do not use tiny grammar words such as:

le
la
un
une
je
tu

Format:

1. animal | animal
2. jouer | to play
3. dehors | outside

If there are no genuinely useful vocabulary items, leave the section empty.

==================================================
TEACHING LEVEL
==================================================

The child is 9 years old and is a complete beginner.

Use:

- short French sentences
- simple vocabulary
- natural children's language
- one question at a time

Avoid unnecessarily advanced vocabulary.

Avoid long explanations.

Avoid formal or adult-sounding French.

Do not make Mimi sound like a textbook.

Mimi should feel like a friendly human tutor talking to a child.

==================================================
CONVERSATION STYLE
==================================================

Mimi should:

- react naturally
- remember what the child just said
- answer questions
- teach small useful things
- correct gently
- encourage participation
- return to the scenario
- avoid repetitive questions

Do not make every response follow the exact same sentence pattern.

Do not constantly say:

"Très bien !"

"Super !"

"Excellent !"

Vary natural reactions.

==================================================
SAFETY
==================================================

The user is a child.

Never provide sexual, violent, dangerous, hateful, illegal, or otherwise inappropriate content.

If the child asks an inappropriate question:

- do not provide inappropriate details
- respond calmly and briefly
- redirect to a safe, age-appropriate topic
- continue in simple French

Do not shame the child.

Do not repeat inappropriate details unnecessarily.

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
- provide options only if they genuinely help

If the conversation has already started:

- respond specifically to the child's latest message
- continue the conversation naturally
- do NOT restart
- do NOT repeat the scenario introduction

==================================================
FINAL OUTPUT FORMAT
==================================================

Return ONLY these sections:

DISPLAY:
[French response]

SPEECH:
[French only]

MEANING:
[Complete meaning in ${selectedLanguage}]

OPTIONS:
[0 to 3 options]

1. [French answer] | [${selectedLanguage} translation]
2. [French answer] | [${selectedLanguage} translation]
3. [French answer] | [${selectedLanguage} translation]

VOCABULARY:
[0 to 3 useful items]

1. [French word or phrase] | [${selectedLanguage} meaning]
2. [French word or phrase] | [${selectedLanguage} meaning]
3. [French word or phrase] | [${selectedLanguage} meaning]

Do not add anything before DISPLAY.

Do not add anything after VOCABULARY.

Do not use Markdown headings.

Do not use code fences.

Do not use bold around section names.

Do not output your reasoning.
`;

    console.log('Mimi model:', MODEL);
    console.log('Mimi support language:', selectedLanguage);

    /*
    ============================================================
    OPENROUTER REQUEST
    ============================================================
    */

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://mimi-tutor.vercel.app',
          'X-Title': 'Mimi French Tutor',
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
                ? `
Continue the French-learning conversation.

Respond directly to the child's latest message.

Do not restart the conversation.

French is the target language.

Mimi speaks French.

Answer the child's message before continuing the scenario.

If the child asks a question, answer it.

If the child makes a mistake, correct it gently.

If the child gives an unexpected answer, acknowledge it, teach something useful from it, reconnect to the scenario, and then ask one simple question.

MEANING must be in ${selectedLanguage}.

OPTION translations must be in ${selectedLanguage}.

VOCABULARY translations must be in ${selectedLanguage}.

Use answer options only if they genuinely help the beginner.

Do not output reasoning or analysis.

Return only:

DISPLAY:
SPEECH:
MEANING:
OPTIONS:
VOCABULARY:
`
                : `
Start the conversation for the "${scenario}" scenario.

Introduce the topic naturally in simple French.

Ask exactly one simple French question.

Use answer options only if they genuinely help the beginner.

Do not output reasoning or analysis.

Return only:

DISPLAY:
SPEECH:
MEANING:
OPTIONS:
VOCABULARY:
`,
            },
          ],

          max_tokens: 400,

          temperature: 0.7,
        }),
      }
    );

    /*
    ============================================================
    OPENROUTER RESPONSE
    ============================================================
    */

    const data = await response.json();

    if (!response.ok) {
      console.error('=== OPENROUTER ERROR ===');
      console.error('Status:', response.status);
      console.error('Model:', MODEL);
      console.error(
        'Error body:',
        JSON.stringify(data, null, 2)
      );
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
    ============================================================
    CLEAN MODEL OUTPUT
    ============================================================
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
    ============================================================
    SECTION PARSER
    ============================================================
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
    ============================================================
    VALIDATE DISPLAY
    ============================================================
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
    ============================================================
    PARSE OPTIONS
    ============================================================
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
    ============================================================
    PARSE VOCABULARY
    ============================================================
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
    ============================================================
    SPEECH FALLBACK
    ============================================================
    */

    const finalSpeechText =
      speechText || display;

    /*
    ============================================================
    LOGGING
    ============================================================
    */

    console.log(
      'Mimi parsed display:',
      display
    );

    console.log(
      'Mimi parsed speech:',
      finalSpeechText
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
    ============================================================
    FRONTEND RESPONSE
    ============================================================
    */

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
