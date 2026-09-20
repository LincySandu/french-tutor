'use client';

import { useEffect, useRef, useState } from 'react';

const scenarios = [
  {
    id: 'school',
    number: '01',
    name: 'At School',
    description:
      'Talk about school, friends and your favourite subjects.',
    color: '#79D9EA',
    category: 'EVERYDAY LIFE',
  },
  {
    id: 'sports',
    number: '02',
    name: 'Sports & Games',
    description:
      'Talk about football, swimming and your favourite games.',
    color: '#A9D982',
    category: 'ACTIVITIES',
  },
  {
    id: 'animals',
    number: '03',
    name: 'Animals',
    description:
      'Discover animals and talk about your favourites.',
    color: '#B8A9F5',
    category: 'THE WORLD',
  },
  {
    id: 'hobbies',
    number: '04',
    name: 'Games & Hobbies',
    description:
      'Talk about games, music, drawing and things you love.',
    color: '#F3AFC2',
    category: 'FREE TIME',
  },
  {
    id: 'family',
    number: '05',
    name: 'My Family',
    description:
      'Tell Mimi about your family and the people you know.',
    color: '#F5D06F',
    category: 'EVERYDAY LIFE',
  },
  {
    id: 'birthday',
    number: '06',
    name: 'My Birthday',
    description:
      'Talk about your birthday, presents and cake.',
    color: '#F39BAA',
    category: 'SPECIAL DAYS',
  },
  {
    id: 'park',
    number: '07',
    name: 'At the Park',
    description:
      'Talk about playing outside and things you like to do.',
    color: '#8FD6A5',
    category: 'ACTIVITIES',
  },
  {
    id: 'shopping',
    number: '08',
    name: 'Shopping',
    description:
      'Choose toys, clothes and your favourite colours.',
    color: '#9BCBF2',
    category: 'EVERYDAY LIFE',
  },
];

function getScenarioText(id) {
  const greetings = {
    school:
      'Salut ! Bienvenue à l’école ! Quelle est ta matière préférée ?',
    sports:
      'Salut ! Tu aimes le sport ? Quel est ton sport préféré ?',
    animals:
      'Salut ! J’adore les animaux ! Quel est ton animal préféré ?',
    hobbies:
      'Salut ! Qu’est-ce que tu aimes faire après l’école ?',
    family:
      'Bonjour ! Parle-moi de ta famille. Tu as des frères ou des sœurs ?',
    birthday:
      'Salut ! C’est bientôt ton anniversaire ? Qu’est-ce que tu voudrais comme cadeau ?',
    park:
      'Salut ! Tu veux jouer au parc ? Qu’est-ce que tu aimes faire dehors ?',
    shopping:
      'Bonjour ! Tu veux acheter quelque chose ? Quelle est ta couleur préférée ?',
  };

  return (
    greetings[id] ||
    'Bonjour ! Commençons à parler français !'
  );
}

function getInitialMeaning(id) {
  const meanings = {
    school:
      'What is your favourite school subject?',
    sports:
      'What is your favourite sport?',
    animals:
      'What is your favourite animal?',
    hobbies:
      'What do you like to do after school?',
    family:
      'Do you have any brothers or sisters?',
    birthday:
      'Is your birthday soon? What would you like as a present?',
    park:
      'Do you want to play at the park? What do you like to do outside?',
    shopping:
      'Do you want to buy something? What is your favourite colour?',
  };

  return (
    meanings[id] ||
    'Mimi is asking you a question in French.'
  );
}

function getFrenchVoice() {
  if (
    typeof window === 'undefined' ||
    !window.speechSynthesis
  ) {
    return null;
  }

  const voices =
    window.speechSynthesis.getVoices();

  return (
    voices.find((voice) =>
      voice.lang
        .toLowerCase()
        .startsWith('fr')
    ) || null
  );
}

function speakFrench(text) {
  if (typeof window === 'undefined') return;
  if (!window.speechSynthesis) return;
  if (!text) return;

  window.speechSynthesis.cancel();

  const speak = () => {
    const frenchVoice = getFrenchVoice();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = 'fr-FR';
    utterance.rate = 0.88;
    utterance.pitch = 1.05;

    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    window.speechSynthesis.speak(
      utterance
    );
  };

  if (getFrenchVoice()) {
    speak();
    return;
  }

  let hasSpoken = false;

  const speakOnce = () => {
    if (hasSpoken) return;

    hasSpoken = true;

    window.speechSynthesis.onvoiceschanged =
      null;

    speak();
  };

  window.speechSynthesis.onvoiceschanged =
    speakOnce;

  setTimeout(() => {
    speakOnce();
  }, 1000);
}

export default function Home() {
  const [selectedScenario, setSelectedScenario] =
    useState(null);

  const [showIntro, setShowIntro] =
    useState(false);

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [xp, setXp] =
    useState(0);

  const [answerOptions, setAnswerOptions] =
    useState([]);

  const [vocabulary, setVocabulary] =
    useState([]);

  const [showMeaning, setShowMeaning] =
    useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!selectedScenario || showIntro) return;

    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [messages, loading, selectedScenario, showIntro]);

  function selectScenario(scenario) {
    setSelectedScenario(scenario);
    setShowIntro(true);
    setMessages([]);
    setAnswerOptions([]);
    setVocabulary([]);
    setInput('');
    setShowMeaning(false);
  }

  function beginMission() {
    setShowIntro(false);
    setAnswerOptions([]);
    setVocabulary([]);
    setShowMeaning(false);

    const scenarioText =
      getScenarioText(selectedScenario.id);

    setMessages([
      {
        speaker: 'tutor',
        text: scenarioText,
        speechText: scenarioText,
        meaning: getInitialMeaning(
          selectedScenario.id
        ),
      },
    ]);

    setTimeout(() => {
      speakFrench(scenarioText);
    }, 300);

    const starterOptions = {
      school: [
        {
          french: 'J’aime les maths.',
          english: 'I like maths.',
        },
        {
          french: 'J’aime le français.',
          english: 'I like French.',
        },
        {
          french: 'J’aime le sport.',
          english: 'I like sport.',
        },
      ],
      sports: [
        {
          french: 'J’aime le football.',
          english: 'I like football.',
        },
        {
          french: 'J’aime la natation.',
          english: 'I like swimming.',
        },
        {
          french: 'J’aime le tennis.',
          english: 'I like tennis.',
        },
      ],
      animals: [
        {
          french: 'J’aime les chiens.',
          english: 'I like dogs.',
        },
        {
          french: 'J’aime les chats.',
          english: 'I like cats.',
        },
        {
          french: 'J’aime les chevaux.',
          english: 'I like horses.',
        },
      ],
      hobbies: [
        {
          french: 'J’aime jouer.',
          english: 'I like playing.',
        },
        {
          french: 'J’aime dessiner.',
          english: 'I like drawing.',
        },
        {
          french:
            'J’aime écouter de la musique.',
          english:
            'I like listening to music.',
        },
      ],
      family: [
        {
          french: 'Oui, j’ai un frère.',
          english: 'Yes, I have a brother.',
        },
        {
          french: 'Oui, j’ai une sœur.',
          english: 'Yes, I have a sister.',
        },
        {
          french:
            'Non, je suis enfant unique.',
          english:
            'No, I am an only child.',
        },
      ],
      birthday: [
        {
          french: 'Oui, bientôt !',
          english: 'Yes, soon!',
        },
        {
          french: 'Je voudrais un vélo.',
          english: 'I would like a bike.',
        },
        {
          french: 'Je voudrais un jeu.',
          english: 'I would like a game.',
        },
      ],
      park: [
        {
          french: 'J’aime jouer.',
          english: 'I like playing.',
        },
        {
          french: 'J’aime courir.',
          english: 'I like running.',
        },
        {
          french:
            'J’aime faire du vélo.',
          english:
            'I like riding a bike.',
        },
      ],
      shopping: [
        {
          french: 'J’aime le bleu.',
          english: 'I like blue.',
        },
        {
          french: 'J’aime le rouge.',
          english: 'I like red.',
        },
        {
          french: 'J’aime le vert.',
          english: 'I like green.',
        },
      ],
    };

    setAnswerOptions(
      starterOptions[selectedScenario.id] || []
    );
  }

  function chooseAnswer(answer) {
    if (loading || !answer) return;

    sendMessage(answer);
  }

  async function sendMessage(answerText = input) {
    if (
      !answerText.trim() ||
      loading ||
      !selectedScenario
    ) {
      return;
    }

    const userMessage = {
      speaker: 'you',
      text: answerText.trim(),
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput('');
    setAnswerOptions([]);
    setShowMeaning(false);
    setLoading(true);

    try {
      const response = await fetch(
        '/api/tutor',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scenario:
              selectedScenario.name,
            messages: [
              ...messages,
              userMessage,
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Something went wrong.'
        );
      }

      const tutorMessage = {
        speaker: 'tutor',
        text: data.reply,
        speechText:
          data.speechText ||
          data.reply,
        meaning:
          data.meaning ||
          'Mimi is asking you a question in French.',
      };

      setMessages((current) => [
        ...current,
        tutorMessage,
      ]);

      setAnswerOptions(
        data.options || []
      );

      setVocabulary((current) => {
        const newWords =
          data.vocabulary || [];

        const combined = [
          ...current,
          ...newWords,
        ];

        const unique = combined.filter(
          (item, index, array) =>
            index ===
            array.findIndex(
              (existing) =>
                existing.french.toLowerCase() ===
                item.french.toLowerCase()
            )
        );

        return unique;
      });

      setShowMeaning(false);

      speakFrench(
        data.speechText ||
          data.reply
      );

      setXp((current) =>
        Math.min(current + 10, 9999)
      );
    } catch (error) {
      console.error(error);

      const errorMessage = {
        speaker: 'tutor',
        text:
          'Oops! Let’s try that again.',
        speechText:
          'Oups ! Essayons encore !',
        meaning:
          'Mimi wants you to try again.',
      };

      setMessages((current) => [
        ...current,
        errorMessage,
      ]);

      setAnswerOptions([]);
      setShowMeaning(false);

      speakFrench(
        errorMessage.speechText
      );
    } finally {
      setLoading(false);
    }
  }

  function goHome() {
    setSelectedScenario(null);
    setShowIntro(false);
    setMessages([]);
    setAnswerOptions([]);
    setVocabulary([]);
    setInput('');
    setShowMeaning(false);
  }

  const currentLevel =
    Math.floor(xp / 50) + 1;

  const levelProgress =
    xp % 50;

  const latestTutorMessage =
    [...messages]
      .reverse()
      .find(
        (message) =>
          message.speaker ===
          'tutor'
      );

  return (
    <main className="page">
      <style>{styles}</style>

      <header className="header">
        <div
          className="logo"
          onClick={goHome}
        >
          <div className="flagMark">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div>
            <div className="logoTitle">
              FRENCH
            </div>

            <div className="logoSubtitle">
              ADVENTURE
            </div>
          </div>
        </div>

        <div className="headerProgress">
          <div className="headerLevel">
            LEVEL {currentLevel}
          </div>

          <div className="headerXp">
            <span>{xp} XP</span>

            <div className="headerProgressTrack">
              <div
                className="headerProgressFill"
                style={{
                  width: `${(levelProgress / 50) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {!selectedScenario && (
        <section className="homeScreen">
          <div className="hero">
            <div className="heroDecor heroDecorOne"></div>
            <div className="heroDecor heroDecorTwo"></div>

            <div className="heroContent">
              <div className="heroEyebrow">
                <span className="eyebrowLine"></span>
                YOUR FRENCH ADVENTURE
                <span className="eyebrowLine"></span>
              </div>

              <h1>
                Bonjour,
                <br />
                explorer.
              </h1>

              <p>
                Practise French through
                conversations, discover new
                words and earn XP along the way.
              </p>

              <div className="heroProgress">
                <div className="heroProgressTop">
                  <span>
                    LEVEL {currentLevel}
                  </span>

                  <strong>
                    {xp} / 50 XP
                  </strong>
                </div>

                <div className="heroProgressTrack">
                  <div
                    className="heroProgressFill"
                    style={{
                      width: `${(levelProgress / 50) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="heroMimi">
              <div className="mimiOrb">
                <div className="mimiLetter">
                  M
                </div>

                <div className="mimiAccent"></div>
              </div>

              <div className="heroMimiLabel">
                <strong>
                  Mimi
                </strong>

                <span>
                  Your French tutor
                </span>
              </div>
            </div>
          </div>

          <div className="missionsHeader">
            <div>
              <div className="sectionEyebrow">
                YOUR ADVENTURE
              </div>

              <h2>
                Choose a mission
              </h2>
            </div>

            <div className="missionCount">
              <strong>08</strong>
              <span>missions</span>
            </div>
          </div>

          <div className="missionGrid">
            {scenarios.map(
              (scenario) => (
                <button
                  key={scenario.id}
                  className="missionCard"
                  onClick={() =>
                    selectScenario(
                      scenario
                    )
                  }
                  style={{
                    '--card-color':
                      scenario.color,
                  }}
                >
                  <div className="missionTop">
                    <span className="missionNumber">
                      MISSION {scenario.number}
                    </span>

                    <span className="missionArrow">
                      →
                    </span>
                  </div>

                  <div className="missionBody">
                    <div className="missionVisual">
                      <div className="missionVisualInner">
                        {scenario.number}
                      </div>
                    </div>

                    <div className="missionInfo">
                      <div className="missionCategory">
                        {scenario.category}
                      </div>

                      <h3>
                        {scenario.name}
                      </h3>

                      <p>
                        {scenario.description}
                      </p>
                    </div>
                  </div>

                  <div className="missionBottom">
                    <span>
                      BEGINNER
                    </span>

                    <span className="missionDot">
                      •
                    </span>

                    <span>
                      FRENCH CONVERSATION
                    </span>
                  </div>
                </button>
              )
            )}
          </div>

          <div className="homeTip">
            <div className="tipMark">
              M
            </div>

            <div>
              <strong>
                Mimi's tip
              </strong>

              <p>
                You don't need to be perfect.
                Just try speaking French!
              </p>
            </div>
          </div>
        </section>
      )}

      {selectedScenario &&
        showIntro && (
          <section className="introScreen">
            <button
              className="backButton"
              onClick={goHome}
            >
              <span>←</span>
              Back to missions
            </button>

            <div
              className="introCard"
              style={{
                '--card-color':
                  selectedScenario.color,
              }}
            >
              <div className="introHeader">
                <div className="introNumber">
                  MISSION {selectedScenario.number}
                </div>

                <div className="introCategory">
                  {selectedScenario.category}
                </div>
              </div>

              <div className="introVisual">
                <div className="introVisualNumber">
                  {selectedScenario.number}
                </div>
              </div>

              <h1>
                {selectedScenario.name}
              </h1>

              <p className="introDescription">
                {selectedScenario.description}
              </p>

              <div className="mimiBubble">
                <div className="mimiFace">
                  M
                </div>

                <div>
                  <strong>
                    Mimi says
                  </strong>

                  <p>
                    Let's practise French
                    together.
                  </p>
                </div>
              </div>

              <button
                className="startButton"
                onClick={beginMission}
              >
                Start Mission
                <span>→</span>
              </button>
            </div>
          </section>
        )}

      {selectedScenario &&
        !showIntro && (
          <section className="conversationScreen">
            <div className="conversationHeader">
              <button
                className="backButton"
                onClick={goHome}
              >
                <span>←</span>
                Missions
              </button>

              <div className="conversationTitle">
                <div
                  className="conversationMissionMark"
                  style={{
                    '--card-color':
                      selectedScenario.color,
                  }}
                >
                  {selectedScenario.number}
                </div>

                <div>
                  <strong>
                    {selectedScenario.name}
                  </strong>

                  <small>
                    French conversation
                  </small>
                </div>
              </div>

              <div className="missionXp">
                +10 XP
              </div>
            </div>

            <div className="conversationCard">
              <div className="mimiHeader">
                <div className="mimiAvatar">
                  M
                </div>

                <div className="mimiIdentity">
                  <strong>
                    Mimi
                  </strong>

                  <span>
                    French tutor
                  </span>
                </div>

                <div className="onlineStatus">
                  <span></span>
                  READY
                </div>
              </div>

              <div className="messages">
                {messages.map(
                  (message, index) => (
                    <div
                      key={index}
                      className={
                        message.speaker ===
                        'tutor'
                          ? 'messageRow tutorRow'
                          : 'messageRow userRow'
                      }
                    >
                      {message.speaker ===
                        'tutor' && (
                        <div className="smallAvatar">
                          M
                        </div>
                      )}

                      <div
                        className={
                          message.speaker ===
                          'tutor'
                            ? 'message tutorMessage'
                            : 'message userMessage'
                        }
                      >
                        <div className="messageText">
                          {message.text}
                        </div>

                        {message.speaker ===
                          'tutor' && (
                          <button
                            className="listenButton"
                            onClick={() =>
                              speakFrench(
                                message.speechText ||
                                  message.text
                              )
                            }
                          >
                            <span className="speakerIcon">
                              ◖
                            </span>
                            Listen
                          </button>
                        )}
                      </div>
                    </div>
                  )
                )}

                {loading && (
                  <div className="messageRow tutorRow">
                    <div className="smallAvatar">
                      M
                    </div>

                    <div className="message tutorMessage">
                      <div className="typing">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {!loading &&
                latestTutorMessage && (
                  <div className="meaningArea">
                    <button
                      className="meaningButton"
                      onClick={() =>
                        setShowMeaning(
                          (current) =>
                            !current
                        )
                      }
                    >
                      <span>
                        <span className="meaningMark">
                          ?
                        </span>

                        What does this mean?
                      </span>

                      <span>
                        {showMeaning
                          ? '▲'
                          : '▼'}
                      </span>
                    </button>

                    {showMeaning && (
                      <div className="meaningBox">
                        <div className="meaningLabel">
                          ENGLISH
                        </div>

                        <div className="meaningText">
                          {
                            latestTutorMessage.meaning
                          }
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {!loading &&
                vocabulary.length > 0 && (
                  <div className="vocabularyBox">
                    <div className="vocabularyHeader">
                      <div>
                        <div className="vocabularyTitle">
                          Words I've Learned
                        </div>

                        <div className="vocabularySubtitle">
                          New words from Mimi
                        </div>
                      </div>

                      <div className="vocabularyCount">
                        {vocabulary.length}
                      </div>
                    </div>

                    <div className="vocabularyList">
                      {vocabulary.map(
                        (word, index) => (
                          <div
                            key={index}
                            className="vocabularyItem"
                          >
                            <div className="vocabularyFrench">
                              {word.french}
                            </div>

                            <div className="vocabularyEnglish">
                              {word.english}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {!loading &&
                answerOptions.length > 0 && (
                  <div className="suggestedAnswers">
                    <div className="suggestedHeader">
                      <div>
                        <div className="suggestedTitle">
                          Your turn
                        </div>

                        <div className="suggestedSubtitle">
                          Choose an answer
                        </div>
                      </div>

                      <div className="suggestedNumber">
                        {answerOptions.length}
                      </div>
                    </div>

                    <div className="answerOptions">
                      {answerOptions.map(
                        (
                          option,
                          index
                        ) => (
                          <button
                            key={index}
                            className="answerOption"
                            onClick={() =>
                              chooseAnswer(
                                option.french
                              )
                            }
                          >
                            <span className="optionNumber">
                              {String(
                                index + 1
                              ).padStart(
                                2,
                                '0'
                              )}
                            </span>

                            <div>
                              <div className="optionFrench">
                                {option.french}
                              </div>

                              <div className="optionEnglish">
                                {option.english}
                              </div>
                            </div>

                            <span className="optionArrow">
                              →
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

              <div className="inputArea">
                <input
                  type="text"
                  value={input}
                  onChange={(event) =>
                    setInput(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                      'Enter'
                    ) {
                      sendMessage();
                    }
                  }}
                  placeholder="Or type your own answer..."
                  disabled={loading}
                />

                <button
                  className="sendButton"
                  onClick={() =>
                    sendMessage()
                  }
                  disabled={
                    loading ||
                    !input.trim()
                  }
                >
                  Send
                  <span>→</span>
                </button>
              </div>
            </div>
          </section>
        )}
    </main>
  );
}

const styles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family:
      Inter,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
    background:
      radial-gradient(
        circle at 10% 0%,
        rgba(184, 169, 245, 0.16),
        transparent 28%
      ),
      radial-gradient(
        circle at 90% 20%,
        rgba(121, 217, 234, 0.12),
        transparent 25%
      ),
      #f7f7fb;
    color: #29273b;
  }

  button,
  input {
    font-family: inherit;
  }

  button {
    cursor: pointer;
  }

  .page {
    min-height: 100vh;
    padding-bottom: 60px;
  }

  /* HEADER */

  .header {
    height: 76px;
    padding: 0 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255,255,255,0.90);
    border-bottom: 1px solid #eae9f1;
    position: sticky;
    top: 0;
    z-index: 20;
    backdrop-filter: blur(16px);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 11px;
    cursor: pointer;
  }

  .flagMark {
    width: 30px;
    height: 30px;
    border-radius: 9px;
    overflow: hidden;
    display: flex;
    box-shadow:
      0 4px 12px rgba(45, 40, 75, 0.10);
  }

  .flagMark span {
    flex: 1;
  }

  .flagMark span:nth-child(1) {
    background: #263f91;
  }

  .flagMark span:nth-child(2) {
    background: #ffffff;
  }

  .flagMark span:nth-child(3) {
    background: #e44c62;
  }

  .logoTitle {
    font-size: 17px;
    font-weight: 950;
    letter-spacing: 2px;
    line-height: 1;
  }

  .logoSubtitle {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 3px;
    color: #918da4;
    margin-top: 5px;
  }

  .headerProgress {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .headerLevel {
    padding: 8px 11px;
    border-radius: 10px;
    background: #efecff;
    color: #6554a9;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.5px;
  }

  .headerXp {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 12px;
    font-weight: 850;
    color: #666276;
  }

  .headerProgressTrack {
    width: 80px;
    height: 6px;
    background: #ebe9f1;
    border-radius: 20px;
    overflow: hidden;
  }

  .headerProgressFill {
    height: 100%;
    background: #6755d8;
    border-radius: 20px;
    transition: width 0.3s ease;
  }

  /* HOME */

  .homeScreen {
    width: min(1080px, 90%);
    margin: 0 auto;
    padding: 52px 0;
  }

  .hero {
    position: relative;
    min-height: 285px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 50px;
    padding: 45px 55px;
    margin-bottom: 50px;
    border-radius: 34px;
    background:
      linear-gradient(
        135deg,
        #ffffff 0%,
        #f8f6ff 100%
      );
    border: 1px solid #e8e5f2;
    box-shadow:
      0 20px 55px rgba(45, 40, 75, 0.07);
    overflow: hidden;
  }

  .heroDecor {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  .heroDecorOne {
    width: 190px;
    height: 190px;
    right: 115px;
    top: -100px;
    background: rgba(184, 169, 245, 0.18);
  }

  .heroDecorTwo {
    width: 100px;
    height: 100px;
    right: 30px;
    bottom: -50px;
    background: rgba(121, 217, 234, 0.18);
  }

  .heroContent {
    position: relative;
    z-index: 1;
    max-width: 570px;
  }

  .heroEyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #7266a9;
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 2.2px;
    margin-bottom: 14px;
  }

  .eyebrowLine {
    width: 24px;
    height: 2px;
    border-radius: 5px;
    background: #a99be8;
  }

  .hero h1 {
    margin: 0;
    font-size: clamp(42px, 6vw, 62px);
    line-height: 0.98;
    letter-spacing: -2.5px;
    font-weight: 950;
    color: #29273b;
  }

  .hero p {
    margin: 18px 0 24px;
    max-width: 500px;
    color: #777386;
    font-size: 16px;
    line-height: 1.6;
  }

  .heroProgress {
    width: min(410px, 100%);
  }

  .heroProgressTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 10px;
    font-weight: 900;
    color: #858095;
    letter-spacing: 0.8px;
  }

  .heroProgressTop strong {
    color: #5f548e;
  }

  .heroProgressTrack {
    height: 8px;
    background: #e9e7f0;
    border-radius: 20px;
    overflow: hidden;
  }

  .heroProgressFill {
    height: 100%;
    background:
      linear-gradient(
        90deg,
        #7564d8,
        #9b8be9
      );
    border-radius: 20px;
    transition: width 0.3s ease;
  }

  .heroMimi {
    position: relative;
    z-index: 1;
    width: 180px;
    flex-shrink: 0;
    text-align: center;
  }

  .mimiOrb {
    position: relative;
    width: 125px;
    height: 125px;
    margin: 0 auto 15px;
    border-radius: 38px;
    background:
      linear-gradient(
        145deg,
        #7867d8,
        #9d8fe7
      );
    box-shadow:
      0 18px 35px rgba(94, 78, 190, 0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(3deg);
  }

  .mimiLetter {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba(255,255,255,0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6655b6;
    font-size: 30px;
    font-weight: 950;
    transform: rotate(-3deg);
  }

  .mimiAccent {
    position: absolute;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    right: 14px;
    top: 14px;
    background: #ffd86d;
    border: 4px solid white;
  }

  .heroMimiLabel {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .heroMimiLabel strong {
    font-size: 16px;
    font-weight: 900;
  }

  .heroMimiLabel span {
    font-size: 11px;
    color: #8b8799;
  }

  /* MISSIONS */

  .missionsHeader {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .sectionEyebrow {
    font-size: 9px;
    font-weight: 950;
    letter-spacing: 2px;
    color: #908aa4;
    margin-bottom: 5px;
  }

  .missionsHeader h2 {
    margin: 0;
    font-size: 25px;
    font-weight: 950;
    letter-spacing: -0.5px;
  }

  .missionCount {
    display: flex;
    align-items: baseline;
    gap: 6px;
    color: #918c9e;
  }

  .missionCount strong {
    color: #50496b;
    font-size: 18px;
  }

  .missionCount span {
    font-size: 11px;
    font-weight: 750;
  }

  .missionGrid {
    display: grid;
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
    gap: 15px;
  }

  .missionCard {
    position: relative;
    min-height: 190px;
    border: 1px solid #e7e5ee;
    border-radius: 24px;
    padding: 20px;
    background: white;
    text-align: left;
    overflow: hidden;
    box-shadow:
      0 8px 24px rgba(45, 40, 75, 0.045);
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      border-color 0.18s ease;
  }

  .missionCard::after {
    content: "";
    position: absolute;
    width: 130px;
    height: 130px;
    right: -50px;
    bottom: -55px;
    border-radius: 50%;
    background: var(--card-color);
    opacity: 0.15;
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
  }

  .missionCard:hover {
    transform: translateY(-4px);
    border-color: #dcd8e8;
    box-shadow:
      0 18px 35px rgba(45, 40, 75, 0.10);
  }

  .missionCard:hover::after {
    transform: scale(1.25);
    opacity: 0.22;
  }

  .missionTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }

  .missionNumber {
    font-size: 9px;
    font-weight: 950;
    letter-spacing: 1.5px;
    color: #8e899a;
  }

  .missionArrow {
    width: 31px;
    height: 31px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f4f8;
    color: #625b76;
    font-size: 17px;
    font-weight: 900;
    transition:
      background 0.18s ease,
      transform 0.18s ease;
  }

  .missionCard:hover .missionArrow {
    background: var(--card-color);
    transform: translateX(2px);
  }

  .missionBody {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-top: 17px;
    position: relative;
    z-index: 2;
  }

  .missionVisual {
    width: 66px;
    height: 66px;
    flex-shrink: 0;
    border-radius: 20px;
    background:
      linear-gradient(
        145deg,
        var(--card-color),
        rgba(255,255,255,0.75)
      );
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .missionVisualInner {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: rgba(255,255,255,0.82);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4f4962;
    font-size: 13px;
    font-weight: 950;
    letter-spacing: 0.5px;
  }

  .missionInfo {
    min-width: 0;
  }

  .missionCategory {
    font-size: 8px;
    font-weight: 950;
    letter-spacing: 1.4px;
    color: #9a95a6;
    margin-bottom: 4px;
  }

  .missionInfo h3 {
    margin: 0 0 6px;
    font-size: 19px;
    font-weight: 900;
    color: #302d42;
  }

  .missionInfo p {
    margin: 0;
    color: #777285;
    font-size: 12px;
    line-height: 1.45;
  }

  .missionBottom {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 19px;
    position: relative;
    z-index: 2;
    font-size: 8px;
    font-weight: 950;
    letter-spacing: 1px;
    color: #9b96a7;
  }

  .missionDot {
    color: #c3becb;
  }

  .homeTip {
    display: flex;
    align-items: center;
    gap: 13px;
    width: fit-content;
    margin: 30px auto 0;
    padding: 13px 17px;
    border-radius: 17px;
    background: rgba(255,255,255,0.72);
    border: 1px solid #e9e7ef;
  }

  .tipMark {
    width: 31px;
    height: 31px;
    border-radius: 10px;
    background: #eeeaff;
    color: #6c5bc0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 950;
  }

  .homeTip strong {
    font-size: 11px;
    font-weight: 900;
  }

  .homeTip p {
    margin: 2px 0 0;
    font-size: 11px;
    color: #8a8597;
  }

  /* INTRO */

  .introScreen {
    width: min(650px, 90%);
    margin: 0 auto;
    padding: 35px 0;
  }

  .backButton {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: none;
    background: transparent;
    color: #716b83;
    font-weight: 800;
    font-size: 13px;
    padding: 8px 0;
  }

  .backButton:hover {
    color: #504966;
  }

  .introCard {
    position: relative;
    margin-top: 18px;
    padding: 34px;
    background: white;
    border: 1px solid #e6e3ed;
    border-radius: 30px;
    text-align: center;
    box-shadow:
      0 20px 55px rgba(45, 40, 75, 0.08);
    overflow: hidden;
  }

  .introCard::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 7px;
    background: var(--card-color);
  }

  .introHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
  }

  .introNumber,
  .introCategory {
    font-size: 9px;
    font-weight: 950;
    letter-spacing: 1.4px;
  }

  .introNumber {
    color: #69627f;
  }

  .introCategory {
    color: #9a95a5;
  }

  .introVisual {
    width: 100px;
    height: 100px;
    margin: 0 auto 20px;
    border-radius: 29px;
    background:
      linear-gradient(
        145deg,
        var(--card-color),
        #ffffff
      );
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .introVisualNumber {
    width: 58px;
    height: 58px;
    border-radius: 19px;
    background: rgba(255,255,255,0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 950;
    color: #504967;
  }

  .introCard h1 {
    font-size: 32px;
    margin: 0 0 9px;
    font-weight: 950;
    letter-spacing: -0.8px;
  }

  .introDescription {
    color: #767184;
    margin: 0 auto 25px;
    max-width: 480px;
    line-height: 1.55;
    font-size: 14px;
  }

  .mimiBubble {
    display: flex;
    align-items: center;
    gap: 14px;
    text-align: left;
    background: #f8f7fc;
    border: 1px solid #ebe8f2;
    border-radius: 19px;
    padding: 15px;
    max-width: 470px;
    margin: 0 auto 23px;
  }

  .mimiFace {
    width: 43px;
    height: 43px;
    border-radius: 14px;
    background: #7160cf;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 15px;
    font-weight: 950;
  }

  .mimiBubble strong {
    font-size: 12px;
    font-weight: 900;
  }

  .mimiBubble p {
    margin: 4px 0 0;
    color: #706b7d;
    font-size: 13px;
  }

  .startButton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    min-width: 190px;
    border: none;
    border-radius: 15px;
    background: #5f4ed1;
    color: white;
    padding: 14px 22px;
    font-size: 14px;
    font-weight: 900;
    box-shadow:
      0 9px 20px rgba(95, 78, 209, 0.22);
    transition:
      transform 0.15s ease,
      background 0.15s ease;
  }

  .startButton:hover {
    background: #5544c1;
    transform: translateY(-2px);
  }

  .startButton span {
    font-size: 19px;
  }

  /* CONVERSATION */

  .conversationScreen {
    width: min(850px, 92%);
    margin: 0 auto;
    padding: 25px 0 50px;
  }

  .conversationHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 17px;
  }

  .conversationTitle {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .conversationMissionMark {
    width: 39px;
    height: 39px;
    border-radius: 12px;
    background: var(--card-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 950;
    color: #4f4962;
  }

  .conversationTitle div:last-child {
    display: flex;
    flex-direction: column;
  }

  .conversationTitle strong {
    font-size: 16px;
    font-weight: 900;
  }

  .conversationTitle small {
    font-size: 10px;
    color: #8a859d;
    margin-top: 3px;
  }

  .missionXp {
    background: #fff3c5;
    color: #8b7742;
    padding: 9px 12px;
    border-radius: 11px;
    font-size: 11px;
    font-weight: 900;
  }

  .conversationCard {
    background: rgba(255,255,255,0.96);
    border: 1px solid #e7e5ed;
    border-radius: 28px;
    padding: 24px;
    box-shadow:
      0 18px 50px rgba(45, 40, 75, 0.075);
  }

  .mimiHeader {
    display: flex;
    align-items: center;
    gap: 11px;
    padding-bottom: 17px;
    border-bottom: 1px solid #eeeaf4;
  }

  .mimiAvatar {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: #6d5bc9;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 950;
    box-shadow:
      0 6px 15px rgba(109, 91, 201, 0.20);
  }

  .mimiIdentity {
    display: flex;
    flex-direction: column;
  }

  .mimiIdentity strong {
    font-size: 14px;
    font-weight: 900;
  }

  .mimiIdentity span {
    color: #8a859d;
    font-size: 10px;
    margin-top: 3px;
  }

  .onlineStatus {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    font-size: 8px;
    font-weight: 950;
    letter-spacing: 1px;
    color: #7e798d;
  }

  .onlineStatus span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #6cc78d;
    box-shadow:
      0 0 0 3px rgba(108, 199, 141, 0.13);
  }

  /* FIXED CHAT WINDOW */

  .messages {
    height: 420px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 22px 8px 10px 0;
    min-height: 0;
    scroll-behavior: smooth;
    overscroll-behavior: contain;
  }

  .messages::-webkit-scrollbar {
    width: 7px;
  }

  .messages::-webkit-scrollbar-track {
    background: #f5f3fa;
    border-radius: 10px;
  }

  .messages::-webkit-scrollbar-thumb {
    background: #d2cae8;
    border-radius: 10px;
  }

  .messages::-webkit-scrollbar-thumb:hover {
    background: #b9add9;
  }

  .messageRow {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin-bottom: 17px;
  }

  .userRow {
    justify-content: flex-end;
  }

  .smallAvatar {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    background: #eeeaff;
    color: #6958bd;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 10px;
    font-weight: 950;
  }

  .message {
    max-width: 78%;
    border-radius: 18px;
    padding: 13px 15px;
  }

  .tutorMessage {
    background: #f2f0fb;
    border-top-left-radius: 5px;
  }

  .userMessage {
    background: #e7f7fa;
    border-top-right-radius: 5px;
  }

  .messageText {
    white-space: pre-wrap;
    line-height: 1.5;
    font-size: 14px;
  }

  .listenButton {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: none;
    background: white;
    color: #6758a5;
    border-radius: 9px;
    padding: 6px 9px;
    margin-top: 9px;
    font-size: 10px;
    font-weight: 850;
  }

  .speakerIcon {
    font-size: 12px;
  }

  .meaningArea {
    margin: 0 0 12px;
  }

  .meaningButton {
    width: 100%;
    border: 1px solid #e6e0f6;
    background: #faf9fe;
    color: #6758a5;
    border-radius: 14px;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 850;
    text-align: left;
  }

  .meaningButton > span:first-child {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .meaningMark {
    width: 20px;
    height: 20px;
    border-radius: 7px;
    background: #ebe6fc;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 950;
  }

  .meaningButton > span:last-child {
    font-size: 9px;
  }

  .meaningBox {
    margin-top: 7px;
    padding: 12px 14px;
    background: #fffdf4;
    border: 1px solid #f0e7bd;
    border-radius: 14px;
  }

  .meaningLabel {
    font-size: 8px;
    font-weight: 950;
    letter-spacing: 1.2px;
    color: #a08d4e;
    margin-bottom: 5px;
  }

  .meaningText {
    font-size: 13px;
    line-height: 1.45;
    color: #625c4c;
  }

  .vocabularyBox {
    margin: 8px 0 12px;
    padding: 15px;
    background: #f8fbfd;
    border: 1px solid #e0edf3;
    border-radius: 19px;
  }

  .vocabularyHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 11px;
  }

  .vocabularyTitle {
    font-size: 12px;
    font-weight: 900;
    color: #4f596d;
  }

  .vocabularySubtitle {
    margin-top: 3px;
    font-size: 10px;
    color: #8b8797;
  }

  .vocabularyCount {
    min-width: 28px;
    height: 28px;
    padding: 0 7px;
    border-radius: 9px;
    background: #e5f3fa;
    color: #54718c;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 900;
  }

  .vocabularyList {
    display: grid;
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .vocabularyItem {
    background: white;
    border: 1px solid #e4edf2;
    border-radius: 12px;
    padding: 10px 11px;
  }

  .vocabularyFrench {
    font-size: 13px;
    font-weight: 900;
    color: #3f475c;
    line-height: 1.35;
  }

  .vocabularyEnglish {
    margin-top: 4px;
    font-size: 10px;
    color: #8a8595;
    line-height: 1.35;
  }

  .suggestedAnswers {
    background: #faf9fd;
    border: 1px solid #ebe8f3;
    border-radius: 20px;
    padding: 15px;
    margin: 8px 0 12px;
  }

  .suggestedHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 11px;
  }

  .suggestedTitle {
    font-size: 13px;
    font-weight: 900;
    color: #4e4961;
  }

  .suggestedSubtitle {
    margin-top: 2px;
    font-size: 10px;
    color: #8b8798;
  }

  .suggestedNumber {
    width: 27px;
    height: 27px;
    border-radius: 9px;
    background: #ece9fa;
    color: #6c5bb8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 950;
  }

  .answerOptions {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .answerOption {
    display: flex;
    align-items: center;
    gap: 11px;
    width: 100%;
    border: 1px solid #e4e0f0;
    background: white;
    color: #302d4b;
    border-radius: 14px;
    padding: 11px 12px;
    text-align: left;
    box-shadow:
      0 3px 9px rgba(60, 50, 80, 0.035);
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease,
      border-color 0.15s ease;
  }

  .answerOption:hover {
    transform: translateX(2px);
    border-color: #b8ace8;
    box-shadow:
      0 6px 15px rgba(60, 50, 80, 0.08);
  }

  .optionNumber {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    background: #f3f1f9;
    color: #777084;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 9px;
    font-weight: 950;
  }

  .optionFrench {
    font-size: 13px;
    font-weight: 850;
    line-height: 1.4;
  }

  .optionEnglish {
    margin-top: 2px;
    font-size: 10px;
    color: #8b8798;
    line-height: 1.35;
  }

  .optionArrow {
    margin-left: auto;
    color: #a39cab;
    font-size: 15px;
    font-weight: 900;
  }

  .inputArea {
    display: flex;
    gap: 8px;
    padding-top: 6px;
  }

  .inputArea input {
    flex: 1;
    min-width: 0;
    border: 1px solid #dfdce8;
    border-radius: 14px;
    padding: 12px 13px;
    outline: none;
    font-size: 13px;
    background: white;
    color: #302d4b;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .inputArea input::placeholder {
    color: #aaa6b4;
  }

  .inputArea input:focus {
    border-color: #a99be8;
    box-shadow:
      0 0 0 3px rgba(169, 155, 232, 0.10);
  }

  .sendButton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    border: none;
    border-radius: 14px;
    background: #5d4bd0;
    color: white;
    padding: 0 18px;
    font-size: 12px;
    font-weight: 900;
    transition:
      background 0.15s ease,
      transform 0.15s ease;
  }

  .sendButton:hover:not(:disabled) {
    background: #5140bf;
    transform: translateY(-1px);
  }

  .sendButton span {
    font-size: 15px;
  }

  .sendButton:disabled {
    opacity: 0.40;
    cursor: default;
  }

  .typing {
    display: flex;
    gap: 4px;
    padding: 5px 2px;
  }

  .typing span {
    width: 6px;
    height: 6px;
    background: #9b91c5;
    border-radius: 50%;
    animation: bounce 1s infinite;
  }

  .typing span:nth-child(2) {
    animation-delay: 0.15s;
  }

  .typing span:nth-child(3) {
    animation-delay: 0.3s;
  }

  @keyframes bounce {
    0%,
    60%,
    100% {
      transform: translateY(0);
    }

    30% {
      transform: translateY(-4px);
    }
  }

  /* RESPONSIVE */

  @media (max-width: 800px) {
    .hero {
      padding: 38px 35px;
    }

    .heroMimi {
      width: 140px;
    }

    .mimiOrb {
      width: 105px;
      height: 105px;
    }

    .mimiLetter {
      width: 62px;
      height: 62px;
    }
  }

  @media (max-width: 700px) {
    .header {
      padding: 0 4%;
    }

    .logoSubtitle {
      display: none;
    }

    .headerXp {
      display: none;
    }

    .homeScreen {
      width: 92%;
      padding-top: 30px;
    }

    .hero {
      flex-direction: column;
      text-align: center;
      padding: 38px 25px;
      gap: 25px;
    }

    .heroContent {
      max-width: 100%;
    }

    .heroEyebrow {
      justify-content: center;
    }

    .hero h1 {
      font-size: 44px;
    }

    .hero p {
      font-size: 14px;
    }

    .heroProgress {
      margin: 0 auto;
    }

    .missionGrid {
      grid-template-columns: 1fr;
    }

    .conversationHeader {
      flex-wrap: wrap;
    }

    .conversationTitle {
      order: 3;
      width: 100%;
    }

    .message {
      max-width: 88%;
    }

    .vocabularyList {
      grid-template-columns: 1fr;
    }

    .messages {
      height: 380px;
    }
  }

  @media (max-width: 500px) {
    .header {
      height: 68px;
    }

    .headerLevel {
      font-size: 9px;
      padding: 8px 9px;
    }

    .logoTitle {
      font-size: 15px;
    }

    .flagMark {
      width: 27px;
      height: 27px;
    }

    .missionsHeader h2 {
      font-size: 22px;
    }

    .missionCount {
      display: none;
    }

    .missionCard {
      min-height: 180px;
    }

    .introScreen {
      width: 92%;
    }

    .introCard {
      padding: 30px 20px;
      border-radius: 25px;
    }

    .introCard h1 {
      font-size: 28px;
    }

    .conversationCard {
      padding: 17px;
      border-radius: 24px;
    }

    .messages {
      height: 350px;
      padding-right: 4px;
    }

    .onlineStatus {
      display: none;
    }

    .inputArea {
      flex-direction: column;
    }

    .inputArea input {
      width: 100%;
      min-height: 44px;
    }

    .sendButton {
      min-height: 44px;
    }

    .homeTip {
      max-width: 100%;
    }
  }
`;
