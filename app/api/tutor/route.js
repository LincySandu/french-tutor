export async function POST(request) {
  try {
    const body = await request.json();

    /*
     * ==========================================================
     * BASIC REQUEST DATA
     * ==========================================================
     */

    const scenario = body.scenario || 'general';

    const messages = Array.isArray(body.messages)
      ? body.messages
      : [];

    const isStarting =
      body.start === true || messages.length === 0;

    /*
     * ==========================================================
     * LANGUAGE SETUP
     * ==========================================================
     *
     * French is ALWAYS the language being learned.
     *
     * The selected language is the SUPPORT language.
     *
     * Mimi speaks French unless she needs a very short
     * explanation/translation in the support language.
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
     * SCENARIO DEFINITIONS
     * ==========================================================
     *
     * The frontend currently sends scenario IDs.
     * Giving Mimi actual topic context is much better than
     * simply passing "animals" or "school" as a raw string.
     */

    const scenarioDefinitions = {
      school: {
        title: 'School',
        description:
          'School, classmates, teachers, subjects and things children do at school.',
        vocabulary:
          'classe, école, professeur, ami, livre, cahier, stylo, cours, récréation',
      },

      sports: {
        title: 'Sports',
        description:
          'Sports, movement, favourite sports, teams, playing and watching sport.',
        vocabulary:
          'football, tennis, natation, courir, jouer, équipe, ballon, gagner',
      },

      animals: {
        title: 'Animals',
        description:
          'Animals, pets, favourite animals, what animals look like and what they do.',
        vocabulary:
          'chien, chat, cheval, oiseau, poisson, animal, grand, petit',
      },

      hobbies: {
        title: 'Hobbies',
        description:
          'Hobbies and free-time activities such as games, music, drawing, reading and watching things.',
        vocabulary:
          'jouer, lire, dessiner, écouter, regarder, musique, jeu, livre',
      },

      family: {
        title: 'Family',
        description:
          'Family members, relationships, things families do together and simple descriptions.',
        vocabulary:
          'famille, maman, papa, frère, sœur, parents, maison, ensemble',
      },

      birthday: {
        title: 'Birthday',
        description:
          'Birthdays, presents, parties, cake, friends and things children like to do at a birthday party.',
        vocabulary:
          'anniversaire, gâteau, cadeau, fête, ami, bougie, jouer, chanter',
      },

      park: {
        title: 'The Park',
        description:
          'Being outside in a French park, things children can see and activities they can do.',
        vocabulary:
          'parc, arbre, fleur, ballon, vélo, courir, jouer, marcher',
      },

      shopping: {
        title: 'Shopping',
        description:
          'Going shopping, asking for things, colours, clothes, food, prices and simple choices.',
        vocabulary:
          'acheter, magasin, prix, combien, rouge, bleu, grand, petit',
      },

      general: {
        title: 'General French conversation',
        description:
          'Simple everyday French conversation for a child learning French.',
        vocabulary:
          'bonjour, merci, aimer, avoir, être, faire, aller',
      },
    };

    const currentScenario =
      scenarioDefinitions[scenario] ||
      scenarioDefinitions.general;

    /*
     * ==========================================================
     * CONVERSATION HISTORY
     * ==========================================================
     *
     * We keep the history readable for the model.
     *
     * Only actual CHILD and MIMI messages are included.
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
     * FIND THE LATEST CHILD MESSAGE
     * ==========================================================
     */

    let latestChildMessage = '';

    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (
        messages[i]?.role === 'user' &&
        typeof messages[i]?.text === 'string'
      ) {
        latestChildMessage = messages[i].text.trim();
        break;
      }
    }

    /*
     * ==========================================================
     * MIMI V2 SYSTEM PROMPT
     * ==========================================================
     *
     * This is the major change.
     *
     * Mimi is no longer instructed to behave like a question
     * generator.
     *
     * She is instructed to behave like an actual tutor.
     */

    const systemPrompt = `
You are Mimi, a warm, intelligent and patient French tutor for children.

You are talking to a 9-year-old child who is learning French as a beginner.

Your job is NOT simply to ask questions.

Your job is to have a natural conversation while actively helping the child learn French.

==================================================
CORE LANGUAGE RULE
==================================================

French is ALWAYS the language being learned.

Mimi normally speaks French.

The child's support language is ${selectedLanguage}.

The support language may be used for:
- short meanings
- translations
- very short explanations
- simple correction explanations
- vocabulary translations

Do NOT turn the conversation into a conversation in the support language.

==================================================
WHO MIMI IS
==================================================

Mimi is:
- friendly
- curious
- patient
- encouraging
- intelligent
- natural
- age-appropriate
- never patronising

Mimi should feel like a real tutor who is listening to the child.

Do NOT sound like a repetitive language-learning exercise.

Do NOT repeatedly use phrases such as:
"Très bien !"
"Super !"
"Excellent !"
unless they genuinely fit the moment.

Avoid repetitive praise.

==================================================
MOST IMPORTANT RULE: LISTEN FIRST
==================================================

Always understand what the child actually said before deciding what to do.

The child's latest message may be:

- an answer to Mimi
- a question for Mimi
- a correction
- an opinion
- a joke
- something unexpected
- a mistake in French
- a very short answer
- a statement rather than an answer
- something unrelated to the current topic
- something you do not understand

Respond to the child's actual message.

NEVER ignore the meaning of the child's message just because the scenario expects a particular question.

==================================================
TUTOR DECISION
==================================================

Before writing the response, silently decide what Mimi should do.

Choose the most appropriate response type:

ANSWER
Use when the child asks Mimi a question or needs information.

CONTINUE
Use when the child has answered naturally and the conversation should continue.

CORRECT
Use when the child has made a meaningful French mistake that is useful to correct.

EXPLAIN
Use when the child asks about French vocabulary, grammar, pronunciation or meaning.

ENCOURAGE
Use when the child's contribution deserves a brief natural reaction before continuing.

CLARIFY
Use when the child's message is unclear or Mimi genuinely needs clarification.

REDIRECT
Use when the child moves away from the scenario but the conversation can naturally return to it.

SAFE_REDIRECT
Use when the child asks for something inappropriate, dangerous, sexual, exploitative, or otherwise unsuitable for a child.

Do NOT force a question after every response.

A response can end naturally without a question.

==================================================
ANSWERING CHILDREN'S QUESTIONS
==================================================

This is extremely important.

If the child asks Mimi something, ANSWER THE QUESTION.

Do not ignore it and ask another question.

For example:

CHILD:
Pourquoi on dit "un chien" ?

Good behaviour:

"On dit « un chien » parce que « chien » est un nom masculin. On utilise « un » avec ce mot."

Then, if natural:

"Tu connais un autre animal ?"

Bad behaviour:

"Très bien ! Quel est ton animal préféré ?"

The child asked a question. Mimi must answer it first.

==================================================
CORRECTIONS
==================================================

Do not correct every tiny mistake.

Prioritise:
- mistakes that affect meaning
- mistakes that are important for a beginner
- mistakes directly related to what Mimi is teaching

When correcting, keep it short and friendly.

Example:

CHILD:
J'aime les chien.

MIMI:
"J'aime les chiens ! On met un « s » à « chiens » parce qu'il y en a plusieurs."

Do not shame the child.

Do not say:
"That's wrong."
"You made a mistake."
"Your French is bad."

The child should feel comfortable trying.

==================================================
EXPLANATIONS
==================================================

Explain French concepts at the level of a 9-year-old beginner.

Prefer:
- one simple idea
- one or two examples
- simple language

Avoid long grammar lessons.

If a concept is complicated, explain only the part needed for the current conversation.

==================================================
CONVERSATION FLOW
==================================================

Mimi should not behave like a questionnaire.

She can:
- answer
- react
- explain
- correct
- ask
- comment
- introduce useful vocabulary
- make a natural follow-up

Use one question at a time when asking a question.

Do not ask a question if a question is not useful.

Do not restart the conversation.

Do not repeatedly introduce the scenario.

Do not say "Bonjour !" again in the middle of an existing conversation.

==================================================
BEGINNING OF A NEW CONVERSATION
==================================================

If this is the first message:

- introduce the scenario naturally
- use simple French
- make the child feel welcome
- ask one simple question when appropriate
- provide useful beginner vocabulary

==================================================
SCENARIO
==================================================

Current scenario:
${currentScenario.title}

Scenario description:
${currentScenario.description}

Useful vocabulary area:
${currentScenario.vocabulary}

Stay generally within this scenario, but follow the child's actual conversation.

If the child asks a reasonable question that is slightly outside the scenario, answer it rather than refusing simply because it is outside the scenario.

==================================================
CHILD AGE AND LEVEL
==================================================

The child is approximately 9 years old.

The child is a complete beginner.

Use:
- short sentences
- common vocabulary
- concrete examples
- natural children's language

But do NOT make Mimi sound stupid or artificially simplistic.

The child may sometimes know more than the assumed level.

Adapt to what the child demonstrates.

==================================================
CHILD SAFETY
==================================================

Mimi is talking to a child.

Never provide instructions that could help a child:
- hurt themselves
- hurt another person
- make dangerous weapons
- commit crimes
- bypass safety protections
- engage in sexual activity
- access sexual content
- exploit or manipulate other people
- reveal private personal information

Do not ask the child for:
- full name
- home address
- school address
- phone number
- passwords
- financial information
- exact location
- private identifying information

If the child shares private information, do not encourage them to provide more.

For ordinary difficult questions, answer in an age-appropriate educational way.

Do not treat normal curiosity as unsafe.

If a request is genuinely inappropriate or dangerous, briefly explain that Mimi cannot help with that and redirect to a safe topic.

==================================================
SUPPORT LANGUAGE
==================================================

The support language is ${selectedLanguage}.

Use it only where useful.

MEANING:
Explain the meaning of Mimi's response in ${selectedLanguage}.

CORRECTION:
If a correction is necessary, explain it briefly in ${selectedLanguage}.

VOCABULARY:
Provide useful French words from the response with ${selectedLanguage} translations.

OPTIONS:
Only provide answer options when they are genuinely useful.

Do NOT invent answer options merely to satisfy a fixed format.

For example, if Mimi answers a child's question, there may be no useful multiple-choice answers.

==================================================
SPEECH
==================================================

SPEECH should contain the French words Mimi should actually say aloud.

Normally it should match the French response.

Do not put translation text into SPEECH.

Do not put internal explanations into SPEECH.

==================================================
RESPONSE LENGTH
==================================================

Keep Mimi's responses appropriate for a child.

Most responses should be around 1-4 short sentences.

A slightly longer explanation is acceptable when the child genuinely asks for an explanation.

Do not produce essays.

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

Do not use Markdown.

Do not use code fences.

Use exactly this structure:

{
  "responseType": "ANSWER | CONTINUE | CORRECT | EXPLAIN | ENCOURAGE | CLARIFY | REDIRECT | SAFE_REDIRECT",
  "reply": "Mimi's visible French response",
  "speechText": "French text to speak aloud",
  "meaning": "Complete meaning of the response in ${selectedLanguage}",
  "correction": "Correction in French, or null",
  "correctionExplanation": "Short explanation in ${selectedLanguage}, or null",
  "options": [
    {
      "french": "French answer",
      "translation": "${selectedLanguage} translation"
    }
  ],
  "vocabulary": [
    {
      "french": "French word or phrase",
      "translation": "${selectedLanguage} meaning"
    }
  ]
}

Rules for OPTIONS:
- 0 to 3 options
- only include options when useful
- each option must be a natural French answer
- translations must be in ${selectedLanguage}

Rules for VOCABULARY:
- 0 to 3 items
- choose useful words or phrases
- do not choose tiny grammar words such as "le", "la", "un", "une", "je", "tu"
- do not repeat the same vocabulary unnecessarily

If correction is not needed:
"correction": null
"correctionExplanation": null

Never include extra fields.

Never include commentary outside the JSON.
`;

    /*
     * ==========================================================
     * USER INSTRUCTION
     * ==========================================================
     */

    const userInstruction = isStarting
      ? `
Start the French-learning conversation.

Scenario:
${currentScenario.title}

Introduce the topic naturally in simple French.

The child has not said anything yet.

Choose a natural opening rather than a rigid template.

Ask one simple question if appropriate.
`
      : `
Continue the existing conversation.

Here is the conversation so far:

${conversationHistory || '(No previous conversation.)'}

The latest child message is:

${latestChildMessage || '(No latest child message found.)'}

Respond specifically to the child's latest message.

Do not restart the conversation.

Do not ignore the child's message.

Decide what a good tutor should do next: answer, continue, correct, explain, encourage, clarify, redirect, or safely redirect.

Return only the required JSON.
`;

    /*
     * ==========================================================
     * OPENROUTER CONFIGURATION
     * ==========================================================
     *
     * We allow the model to be configured through an environment
     * variable rather than permanently hard-coding one model.
     *
     * If no model is configured, retain the current free router
     * so the app continues working.
     */

    const model =
      process.env.OPENROUTER_MODEL ||
      'openrouter/free';

    const apiKey =
      process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error(
        'OPENROUTER_API_KEY is missing.'
      );

      return Response.json(
        {
          error:
            'The French tutor is not configured correctly. Missing OpenRouter API key.',
        },
        {
          status: 500,
        }
      );
    }

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
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer':
            process.env.NEXT_PUBLIC_APP_URL ||
            'http://localhost:3000',
          'X-Title':
            'Mimi French Tutor',
        },

        body: JSON.stringify({
          model,

          temperature: 0.7,

          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },

            {
              role: 'user',
              content: userInstruction,
            },
          ],

          /*
           * Ask OpenRouter for JSON where supported.
           * The parser below remains defensive in case the
           * selected model ignores this instruction.
           */
          response_format: {
            type: 'json_object',
          },
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
      data?.choices?.[0]?.message?.content?.trim() ||
      '';

    console.log(
      'Mimi V2 model:',
      model
    );

    console.log(
      'Mimi V2 raw response:',
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
     * ROBUST JSON EXTRACTION
     * ==========================================================
     *
     * Models can occasionally wrap JSON in Markdown despite
     * instructions. We remove common wrappers.
     */

    function extractJson(text) {
      let cleaned = text.trim();

      cleaned = cleaned
        .replace(/^```json\s*/i, '')
        .replace(/^```javascript\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      /*
       * First attempt: entire response is JSON.
       */
      try {
        return JSON.parse(cleaned);
      } catch {
        // Continue below.
      }

      /*
       * Second attempt: find the first JSON object.
       */
      const firstBrace =
        cleaned.indexOf('{');

      const lastBrace =
        cleaned.lastIndexOf('}');

      if (
        firstBrace !== -1 &&
        lastBrace !== -1 &&
        lastBrace > firstBrace
      ) {
        const possibleJson =
          cleaned.slice(
            firstBrace,
            lastBrace + 1
          );

        try {
          return JSON.parse(possibleJson);
        } catch {
          return null;
        }
      }

      return null;
    }

    const parsed = extractJson(rawReply);

    if (!parsed || typeof parsed !== 'object') {
      console.error(
        'Mimi V2 JSON parsing failed.'
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
     * NORMALISE RESPONSE TYPE
     * ==========================================================
     */

    const allowedResponseTypes = [
      'ANSWER',
      'CONTINUE',
      'CORRECT',
      'EXPLAIN',
      'ENCOURAGE',
      'CLARIFY',
      'REDIRECT',
      'SAFE_REDIRECT',
    ];

    const responseType =
      allowedResponseTypes.includes(
        String(parsed.responseType || '').toUpperCase()
      )
        ? String(parsed.responseType).toUpperCase()
        : 'CONTINUE';

    /*
     * ==========================================================
     * NORMALISE TEXT
     * ==========================================================
     */

    const reply =
      typeof parsed.reply === 'string'
        ? parsed.reply.trim()
        : '';

    const speechText =
      typeof parsed.speechText === 'string'
        ? parsed.speechText.trim()
        : reply;

    const meaning =
      typeof parsed.meaning === 'string'
        ? parsed.meaning.trim()
        : '';

    /*
     * ==========================================================
     * NORMALISE CORRECTION
     * ==========================================================
     */

    const correction =
      typeof parsed.correction === 'string' &&
      parsed.correction.trim()
        ? parsed.correction.trim()
        : null;

    const correctionExplanation =
      typeof parsed.correctionExplanation === 'string' &&
      parsed.correctionExplanation.trim()
        ? parsed.correctionExplanation.trim()
        : null;

    /*
     * ==========================================================
     * NORMALISE OPTIONS
     * ==========================================================
     */

    const options = Array.isArray(parsed.options)
      ? parsed.options
          .map((option) => {
            if (!option || typeof option !== 'object') {
              return null;
            }

            const french =
              typeof option.french === 'string'
                ? option.french.trim()
                : '';

            const translation =
              typeof option.translation === 'string'
                ? option.translation.trim()
                : '';

            if (!french || !translation) {
              return null;
            }

            return {
              french,
              translation,
            };
          })
          .filter(Boolean)
          .slice(0, 3)
      : [];

    /*
     * ==========================================================
     * NORMALISE VOCABULARY
     * ==========================================================
     */

    const vocabulary = Array.isArray(
      parsed.vocabulary
    )
      ? parsed.vocabulary
          .map((item) => {
            if (!item || typeof item !== 'object') {
              return null;
            }

            const french =
              typeof item.french === 'string'
                ? item.french.trim()
                : '';

            const translation =
              typeof item.translation === 'string'
                ? item.translation.trim()
                : '';

            if (!french || !translation) {
              return null;
            }

            return {
              french,
              translation,
            };
          })
          .filter(Boolean)
          .slice(0, 3)
      : [];

    /*
     * ==========================================================
     * FINAL VALIDATION
     * ==========================================================
     */

    if (!reply) {
      console.error(
        'Mimi V2 returned no reply:',
        parsed
      );

      return Response.json(
        {
          error:
            'Mimi returned an empty tutor response.',
        },
        {
          status: 502,
        }
      );
    }

    /*
     * ==========================================================
     * LOGGING
     * ==========================================================
     */

    console.log(
      'Mimi V2 response type:',
      responseType
    );

    console.log(
      'Mimi V2 reply:',
      reply
    );

    console.log(
      'Mimi V2 correction:',
      correction
    );

    console.log(
      'Mimi V2 options:',
      options
    );

    console.log(
      'Mimi V2 vocabulary:',
      vocabulary
    );

    /*
     * ==========================================================
     * RETURN TO PAGE.JSX
     * ==========================================================
     *
     * We keep the existing frontend contract:
     *
     * reply
     * speechText
     * meaning
     * options
     * vocabulary
     *
     * New fields are included as well.
     */

    return Response.json({
      reply,
      speechText: speechText || reply,
      meaning,
      options,
      vocabulary,

      /*
       * New Mimi V2 fields.
       */
      responseType,
      correction,
      correctionExplanation,
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
