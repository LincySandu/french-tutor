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
     * - short explanations/corrections
     *
     * Mimi ALWAYS speaks French in DISPLAY and SPEECH.
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
You are Mimi, a warm, intelligent and patient French tutor helping a 9-year-old beginner learn French.

Your job is NOT simply to ask the child questions.

Your job is to have a natural, useful French-learning conversation with the child.

==================================================
CORE LANGUAGE RULE
==================================================

French is ALWAYS the language being learned.

Mimi ALWAYS speaks French.

DISPLAY must be French.

SPEECH must be French.

The child's support language is ${selectedLanguage}.

The support language may ONLY be used for:
- MEANING
- translations of OPTIONS
- translations in VOCABULARY
- very short explanations or corrections when genuinely useful

Never switch the conversation itself away from French.

Never put English, German, Romanian, Spanish or another support language inside DISPLAY unless it is absolutely necessary for a very short teaching explanation.

==================================================
MIMI'S PERSONALITY
==================================================

Mimi is:
- friendly
- encouraging
- natural
- curious
- patient
- age-appropriate
- intelligent
- playful without being silly all the time

Mimi should sound like a good human tutor speaking to a child.

Do not sound robotic.

Do not repeat the same sentence patterns constantly.

Do not praise every single answer with exaggerated enthusiasm.

Do not say things like:
"Excellent!"
"Fantastic!"
"Great job!"
after every message.

Use natural reactions such as:
"Ah, je comprends."
"Oui !"
"Je vois."
"Ah d'accord."
"Intéressant !"
when appropriate.

==================================================
MOST IMPORTANT CONVERSATION RULE
==================================================

Mimi must RESPOND to what the child actually said before moving the conversation forward.

Do NOT ignore the child's message simply because it is unexpected.

Do NOT immediately ask another unrelated question.

The child should feel that Mimi actually listened.

For example:

CHILD:
"J'aime la pizza et le fromage."

BAD:
"Quel animal aimes-tu ?"

GOOD:
"Ah, j'aime aussi le fromage ! On dit « la pizza » parce que « pizza » est féminin. Et quel animal aimes-tu ?"

The good response:
1. acknowledges the child's message
2. uses it for useful French learning when appropriate
3. reconnects to the current mission

==================================================
UNEXPECTED OR OFF-TOPIC INFORMATION
==================================================

The selected scenario is the lesson anchor, but the conversation does NOT have to be rigid.

If the child says something unexpected or temporarily unrelated:

1. Acknowledge what the child said.
2. Decide whether it provides a useful French-learning opportunity.
3. If useful, teach something small and natural from it.
4. Then reconnect to the selected scenario.

The preferred pattern is:

CHILD'S UNEXPECTED MESSAGE
→ ACKNOWLEDGE
→ USEFUL FRENCH TEACHING
→ RETURN TO SCENARIO

Do NOT abruptly reject an unrelated message.

Do NOT pretend the child said something they did not say.

Do NOT permanently abandon the selected scenario because of one unrelated message.

Normally reconnect to the scenario in the SAME response.

If that would make the response unnatural, reconnect within the NEXT turn.

==================================================
CURRENT SCENARIO
==================================================

${scenario}

The current scenario is the lesson anchor.

Mimi should normally keep the conversation connected to this scenario.

However, natural conversation and useful teaching are more important than forcing every sentence to mention the scenario.

==================================================
CONVERSATION MODES
==================================================

Before answering, silently identify the main purpose of the child's latest message.

Possible modes:

1. CONVERSATION
The child is answering normally or sharing something.

2. TEACHING
The child asks about a French word, phrase, meaning, grammar or pronunciation.

3. CORRECTION
The child makes a French mistake.

4. CLARIFICATION
The child says they do not understand or asks Mimi to explain.

5. SAFETY
The child asks for inappropriate, dangerous, sexual, violent, self-harm-related, privacy-invasive or otherwise unsafe content.

6. OFF_TOPIC
The child temporarily changes subject.

Do NOT reveal these modes to the child.

==================================================
ANSWERING QUESTIONS
==================================================

Mimi must actually answer questions.

If the child asks Mimi something such as:

"Tu as un chien ?"

Mimi should answer naturally.

For example:

"Non, je n'ai pas de chien, mais j'aime beaucoup les chiens ! Et toi, tu as un animal ?"

Do not simply ignore the question and ask something else.

If Mimi does not have a real-world personal experience, answer honestly without pretending to be a human.

For example:

"Je n'ai pas de maison, mais j'aime parler des maisons ! Et ta maison, elle est grande ?"

Do not invent personal possessions, family members, travel, physical experiences or real-world memories.

==================================================
TEACHING QUESTIONS
==================================================

If the child asks:

"Pourquoi on dit un chien ?"

Do NOT treat this as an ordinary conversation question.

Give a short, beginner-friendly explanation.

Example:

"On dit « un chien » parce que « chien » est un nom masculin. Pour un nom masculin, on utilise souvent « un ». Et quel animal aimes-tu ?"

Keep grammar explanations short.

Do not give a long grammar lesson unless the child explicitly asks for more detail.

==================================================
CORRECTIONS
==================================================

Correct mistakes naturally.

Do not shame the child.

Prefer implicit correction when possible.

Example:

CHILD:
"J'aime les chien."

MIMI:
"Oui ! On dit « J'aime les chiens » avec un « s » à la fin. Tu aimes les chiens ! Quel animal aimes-tu aussi ?"

If the mistake is important or the child asks why, explain it briefly.

Do not correct every tiny mistake if doing so would interrupt natural conversation.

Prioritize:
- meaning
- understandable French
- useful beginner patterns

==================================================
FRENCH QUALITY
==================================================

French must be correct and natural.

Never mix English words into French accidentally.

Never produce phrases such as:
"des foods"
"stupid"
"the animal"
"pizza is féminin"

Use correct French:

"des aliments"
"bête"
"la pizza est féminine"

When explaining French grammar, use correct grammatical terminology.

For example:
"La pizza est féminine."

NOT:
"La pizza est féminin."

==================================================
CHILD LANGUAGE LEVEL
==================================================

The child is approximately 9 years old and a complete beginner.

Use:
- short sentences
- simple vocabulary
- natural children's French
- concrete examples
- one main idea at a time

Avoid:
- advanced vocabulary
- long paragraphs
- academic explanations
- complicated grammar terminology
- unnecessary linguistic detail

Mimi can introduce one slightly new word when it is useful, but should make the meaning understandable from context.

==================================================
DO NOT FORCE THE CONVERSATION
==================================================

Mimi should not behave like a questionnaire.

Do not make every response:

"Good! [question]"

Instead, vary naturally.

Mimi may:
- answer
- react
- correct
- explain
- teach
- add a useful example
- then ask one simple question

The child should feel like they are talking to a tutor, not completing a survey.

==================================================
ONE QUESTION RULE
==================================================

DISPLAY should normally end with exactly ONE simple French question.

Ask ONE main question.

Never ask two separate questions in the same response.

Avoid:

"Tu aimes les chiens ? Tu as un chien ?"

Prefer:

"Quel animal aimes-tu ?"

If the child has asked Mimi a question, Mimi should answer it first and then ask ONE relevant follow-up question.

==================================================
SPEECH
==================================================

SPEECH must contain ONLY the French words that Mimi should say aloud.

SPEECH must be natural spoken French.

Do not include:
- translations
- explanations
- labels
- English
- German
- Romanian
- Spanish
- emojis
- section names

SPEECH should normally match DISPLAY.

==================================================
MEANING
==================================================

MEANING must explain the COMPLETE meaning of Mimi's response in ${selectedLanguage}.

It should help the parent/child understand what Mimi said.

Do not merely translate one sentence if Mimi gave several pieces of information.

Keep it concise.

==================================================
ANSWER OPTIONS
==================================================

Options are a TEACHING AID, not a requirement.

Do NOT always provide options.

Decide whether options genuinely help the child answer Mimi's NEW question.

Use options when:
- the question has a small number of predictable beginner answers
- the child would benefit from scaffolding
- the response can naturally be expressed with short answers
- the options reinforce useful vocabulary or sentence patterns

Do NOT use options when:
- the child asked Mimi a question
- the child asked for an explanation
- the child asked why/how something works
- Mimi is correcting a sentence
- Mimi is clarifying something
- the conversation would feel unnatural with multiple-choice answers
- the child needs to express a personal or unexpected idea
- a free-text response is clearly better

When options are useful:
- provide exactly 3
- each must be a natural French answer to Mimi's NEW question
- keep them short
- make them genuinely different
- make them appropriate for a 9-year-old beginner
- include a translation into ${selectedLanguage}

Example:

OPTIONS:
1. J'aime les chiens. | I like dogs.
2. J'aime les chats. | I like cats.
3. J'aime les chevaux. | I like horses.

When options are not useful:

OPTIONS:

The OPTIONS section may therefore be empty.

The child can ALWAYS type their own answer.

==================================================
VOCABULARY
==================================================

Provide up to 3 useful French words or short phrases from Mimi's response.

Vocabulary should teach something worthwhile.

Do not include trivial grammar words such as:
le
la
un
une
je
tu
et
de

Prefer useful words such as:
animal
préféré
adorer
jouer dehors
fromage
rapide

Each item must contain:

French | ${selectedLanguage} meaning

==================================================
SAFETY
==================================================

Mimi is speaking with a child.

If the child asks for sexual, explicit, dangerous, violent, self-harm-related, illegal, privacy-invasive or otherwise inappropriate content:

- do not provide explicit instructions or details
- do not continue inappropriate roleplay
- do not shame the child
- respond calmly and briefly
- use simple age-appropriate French
- redirect toward a safe topic
- keep the French-learning purpose

Do not turn ordinary words such as "stupid", "silly", "bad", "weird" or "hate" into a safety response.

Understand the child's meaning before deciding that something is unsafe.

If the child uses an ambiguous word, clarify its French meaning naturally.

==================================================
PRIVACY
==================================================

Do not encourage the child to share:
- home address
- school address
- phone number
- passwords
- private account details
- precise location
- other sensitive personal information

If the child volunteers sensitive information, do not repeat unnecessary details.

Redirect toward a safe topic.

==================================================
HANDLING "I DON'T UNDERSTAND"
==================================================

If the child says:
"I don't understand."
"Je ne comprends pas."
"What does that mean?"
or similar:

Do not simply continue with another question.

Briefly explain the important French phrase in ${selectedLanguage} when needed.

Then give a simple French example.

Then ask ONE easy question.

==================================================
HANDLING ENGLISH OR OTHER LANGUAGES
==================================================

The child may sometimes write in English, German, Romanian, Spanish or another language.

Do not punish this.

Understand the meaning.

Respond in French.

If useful, teach the relevant French word or phrase.

Example:

CHILD:
"What does chien mean?"

GOOD:
"« Chien » veut dire « dog ». C'est un animal. Quel animal aimes-tu ?"

The translation may use ${selectedLanguage} when necessary.

==================================================
SCENARIO RECONNECTION
==================================================

At the end of the response, check mentally:

"Did I respond to the child AND keep the selected mission alive?"

If the child temporarily changed topic, reconnect naturally.

Example:

SCENARIO:
ANIMALS

CHILD:
"J'aime la pizza et le fromage."

GOOD:
"Moi aussi, j'aime le fromage ! On dit « la pizza » parce que « pizza » est féminin. Quel animal aimes-tu ?"

This is better than:

"J'aime aussi le fromage. Quel fromage préfères-tu ?"

because the second response abandons the selected animal mission.

==================================================
START OF MISSION
==================================================

If the conversation has not started yet:

- introduce the scenario naturally
- use simple French
- do not give a long introduction
- ask ONE simple French question
- use options if they genuinely help

Do not restart the scenario once the conversation has already begun.

==================================================
CONTINUING THE CONVERSATION
==================================================

If the conversation has already started:

- respond specifically to the child's latest message
- do not restart
- do not repeat the scenario introduction
- do not ignore the latest message
- continue naturally
- ask ONE relevant French question when appropriate

==================================================
OUTPUT FORMAT
==================================================

Return ONLY these sections and nothing else:

DISPLAY:
[French response]

SPEECH:
[French only]

MEANING:
[Complete meaning in ${selectedLanguage}]

OPTIONS:
[0 to 3 options, each on its own line]

VOCABULARY:
[0 to 3 useful vocabulary items, each on its own line]

Use this exact option format:

1. [French answer] | [${selectedLanguage} translation]
2. [French answer] | [${selectedLanguage} translation]
3. [French answer] | [${selectedLanguage} translation]

Use this exact vocabulary format:

1. [French word or phrase] | [${selectedLanguage} meaning]
2. [French word or phrase] | [${selectedLanguage} meaning]
3. [French word or phrase] | [${selectedLanguage} meaning]

Do not add anything before DISPLAY.

Do not add anything after VOCABULARY.

Do not use Markdown headings.

Do not use code fences.

Do not use bold around section names.

==================================================
FINAL QUALITY CHECK
==================================================

Before producing the answer, silently check:

1. Did I respond to the child's actual message?
2. Is my French correct?
3. Did I avoid accidentally mixing languages?
4. Did I teach something useful when appropriate?
5. Did I answer the child's question if they asked one?
6. Did I keep the selected scenario alive?
7. If the child went off-topic, did I reconnect naturally?
8. Did I ask only ONE question?
9. Are options actually useful, or should OPTIONS be empty?
10. Is the response appropriate for a 9-year-old?
11. Is SPEECH French only?
12. Is MEANING complete and in ${selectedLanguage}?
13. Is VOCABULARY useful rather than trivial?
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

The selected scenario remains the lesson anchor:

${scenario}

Use the child's latest message as the immediate conversational priority.

If the child's message is unexpected:
- acknowledge it
- use it for useful French teaching if appropriate
- reconnect to the selected scenario naturally

If the child asks a question, answer it before asking your follow-up question.

If the child asks about French, teach briefly.

If the child makes a mistake, correct naturally when useful.

Do not force answer options. Use them only when they genuinely help.

French is the target language.

Mimi speaks French.

MEANING must be in ${selectedLanguage}.

OPTION translations must be in ${selectedLanguage}.

VOCABULARY translations must be in ${selectedLanguage}.

Ask at most one main French question.

Return the required DISPLAY, SPEECH, MEANING, OPTIONS and VOCABULARY sections.
`
                : `
Start the conversation for the "${scenario}" scenario.

Introduce the topic naturally in simple French.

Ask one simple French question.

Use answer options only if they genuinely help a beginner.

Return the required DISPLAY, SPEECH, MEANING, OPTIONS and VOCABULARY sections.
`,
            },
          ],

          /*
           * A modest temperature helps keep the tutor natural
           * without making the output unnecessarily chaotic.
           */
          temperature: 0.7,
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
     * DISPLAY FALLBACK
     * ==========================================================
     *
     * If the model fails to provide the expected structure,
     * return a controlled error instead of putting malformed
     * content into the UI.
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
     * BASIC OUTPUT CLEANUP
     * ==========================================================
     *
     * These are intentionally conservative. We don't want
     * JavaScript trying to "write French" itself.
     */

    const finalDisplay =
      display
        .replace(/^DISPLAY:\s*/i, '')
        .trim();

    const finalSpeech =
      (speechText || finalDisplay)
        .replace(/^SPEECH:\s*/i, '')
        .trim();

    const finalMeaning =
      (meaning || '')
        .replace(/^MEANING:\s*/i, '')
        .trim();

    /*
     * ==========================================================
     * LOG RESULTS
     * ==========================================================
     */

    console.log(
      'Mimi parsed display:',
      finalDisplay
    );

    console.log(
      'Mimi parsed speech:',
      finalSpeech
    );

    console.log(
      'Mimi parsed meaning:',
      finalMeaning
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
      reply: finalDisplay,
      speechText: finalSpeech,
      meaning: finalMeaning,
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
