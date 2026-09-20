'use client';

import { useEffect, useRef, useState } from 'react';

const scenarios = [
  {
    id: 'school',
    icon: '🎒',
    name: 'At School',
    description:
      'Talk about school, friends and your favourite subjects!',
    color: '#7BDFF2',
    mascot: '📚',
  },
  {
    id: 'sports',
    icon: '⚽',
    name: 'Sports & Games',
    description:
      'Talk about football, swimming and your favourite games!',
    color: '#B8E986',
    mascot: '🏆',
  },
  {
    id: 'animals',
    icon: '🐶',
    name: 'Animals',
    description:
      'Discover animals and talk about your favourites!',
    color: '#C7B8FF',
    mascot: '🐾',
  },
  {
    id: 'hobbies',
    icon: '🎮',
    name: 'Games & Hobbies',
    description:
      'Talk about games, music, drawing and things you love!',
    color: '#FFB6C8',
    mascot: '🎨',
  },
  {
    id: 'family',
    icon: '👨‍👩‍👦',
    name: 'My Family',
    description:
      'Tell Mimi about your family!',
    color: '#FFD166',
    mascot: '❤️',
  },
  {
    id: 'birthday',
    icon: '🎂',
    name: 'My Birthday',
    description:
      'Talk about your birthday, presents and cake!',
    color: '#FF9FAD',
    mascot: '🎁',
  },
  {
    id: 'park',
    icon: '🌳',
    name: 'At the Park',
    description:
      'Play outside and talk about what you like to do!',
    color: '#9DE2B2',
    mascot: '🛝',
  },
  {
    id: 'shopping',
    icon: '🛍️',
    name: 'Shopping',
    description:
      'Choose toys, clothes and your favourite colours!',
    color: '#A9D6FF',
    mascot: '🧸',
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
          <div className="logoIcon">
            🇫🇷
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

        <div className="headerStats">
          <div className="xpBox">
            ⭐ {xp} XP
          </div>

          <div className="levelBox">
            LEVEL {currentLevel}
          </div>
        </div>
      </header>

      {!selectedScenario && (
        <section className="homeScreen">
          <div className="hero">
            <div className="heroMascot">
              🐭
            </div>

            <div>
              <h1>
                Bonjour, explorer!
              </h1>

              <p>
                Choose a mission and
                practise French with Mimi!
              </p>
            </div>
          </div>

          <div className="missionsTitle">
            <span>🗺️</span>
            Choose your mission
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
                  <div className="missionIcon">
                    {scenario.icon}
                  </div>

                  <div className="missionInfo">
                    <h2>
                      {scenario.name}
                    </h2>

                    <p>
                      {
                        scenario.description
                      }
                    </p>
                  </div>

                  <div className="missionMascot">
                    {scenario.mascot}
                  </div>

                  <div className="arrow">
                    →
                  </div>
                </button>
              )
            )}
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
              ← Back to missions
            </button>

            <div
              className="introCard"
              style={{
                '--card-color':
                  selectedScenario.color,
              }}
            >
              <div className="introIcon">
                {selectedScenario.icon}
              </div>

              <div className="introMascot">
                {selectedScenario.mascot}
              </div>

              <h1>
                {selectedScenario.name}
              </h1>

              <p>
                {selectedScenario.description}
              </p>

              <div className="mimiBubble">
                <div className="mimiFace">
                  🐭
                </div>

                <div>
                  <strong>
                    Mimi says:
                  </strong>

                  <p>
                    Let’s practise French
                    together! 🇫🇷
                  </p>
                </div>
              </div>

              <button
                className="startButton"
                onClick={beginMission}
              >
                Start Mission 🚀
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
                ← Missions
              </button>

              <div className="conversationTitle">
                <span>
                  {selectedScenario.icon}
                </span>

                <div>
                  <strong>
                    {selectedScenario.name}
                  </strong>

                  <small>
                    French Mission
                  </small>
                </div>
              </div>

              <div className="missionXp">
                ⭐ +10 XP
              </div>
            </div>

            <div className="conversationCard">
              <div className="mimiHeader">
                <div className="mimiAvatar">
                  🐭
                </div>

                <div>
                  <strong>
                    Mimi
                  </strong>

                  <span>
                    French tutor
                  </span>
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
                          🐭
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
                            🔊 Listen
                          </button>
                        )}
                      </div>
                    </div>
                  )
                )}

                {loading && (
                  <div className="messageRow tutorRow">
                    <div className="smallAvatar">
                      🐭
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
                      💡 What does this mean?

                      <span>
                        {showMeaning
                          ? '▲'
                          : '▼'}
                      </span>
                    </button>

                    {showMeaning && (
                      <div className="meaningBox">
                        <div className="meaningLabel">
                          In English:
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
                          📚 Words I've Learned
                        </div>

                        <div className="vocabularySubtitle">
                          New French words from Mimi
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
                    <div className="suggestedTitle">
                      💬 Choose an answer:
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
                            <div className="optionFrench">
                              {option.french}
                            </div>

                            <div className="optionEnglish">
                              {option.english}
                            </div>
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
                  Send 🚀
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
      linear-gradient(
        135deg,
        #f8f7ff 0%,
        #eef9ff 50%,
        #fff8f1 100%
      );
    color: #302d4b;
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
    padding-bottom: 50px;
  }

  .header {
    height: 76px;
    padding: 0 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255,255,255,0.88);
    border-bottom: 1px solid #eeeaf8;
    position: sticky;
    top: 0;
    z-index: 20;
    backdrop-filter: blur(12px);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .logoIcon {
    font-size: 32px;
  }

  .logoTitle {
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 2px;
    line-height: 1;
  }

  .logoSubtitle {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 3px;
    color: #8b83a8;
    margin-top: 4px;
  }

  .headerStats {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .xpBox,
  .levelBox {
    border-radius: 14px;
    padding: 9px 13px;
    font-size: 13px;
    font-weight: 800;
  }

  .xpBox {
    background: #fff2b8;
  }

  .levelBox {
    background: #e9e4ff;
    color: #6655aa;
  }

  .homeScreen {
    width: min(1100px, 90%);
    margin: 0 auto;
    padding: 48px 0;
  }

  .hero {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    margin-bottom: 42px;
    text-align: left;
  }

  .heroMascot {
    width: 100px;
    height: 100px;
    border-radius: 32px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 56px;
    box-shadow:
      0 12px 35px rgba(65, 55, 100, 0.10);
  }

  .hero h1 {
    margin: 0 0 8px;
    font-size: clamp(30px, 5vw, 46px);
    line-height: 1.1;
  }

  .hero p {
    margin: 0;
    color: #77748a;
    font-size: 17px;
  }

  .missionsTitle {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 19px;
    font-weight: 900;
    margin-bottom: 18px;
  }

  .missionGrid {
    display: grid;
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .missionCard {
    position: relative;
    min-height: 145px;
    border: none;
    border-radius: 28px;
    padding: 24px 60px 24px 24px;
    background:
      linear-gradient(
        135deg,
        var(--card-color),
        white
      );
    text-align: left;
    overflow: hidden;
    box-shadow:
      0 10px 30px rgba(65, 55, 100, 0.08);
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease;
  }

  .missionCard:hover {
    transform: translateY(-4px);
    box-shadow:
      0 16px 35px rgba(65, 55, 100, 0.13);
  }

  .missionIcon {
    font-size: 35px;
    margin-bottom: 8px;
  }

  .missionInfo h2 {
    margin: 0 0 6px;
    font-size: 20px;
  }

  .missionInfo p {
    margin: 0;
    color: #666378;
    font-size: 14px;
    line-height: 1.45;
  }

  .missionMascot {
    position: absolute;
    right: 18px;
    bottom: 15px;
    font-size: 45px;
    opacity: 0.75;
  }

  .arrow {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 22px;
    font-weight: 900;
  }

  .introScreen {
    width: min(700px, 90%);
    margin: 0 auto;
    padding: 35px 0;
  }

  .backButton {
    border: none;
    background: transparent;
    color: #706a8b;
    font-weight: 800;
    font-size: 14px;
    padding: 8px 0;
  }

  .introCard {
    margin-top: 20px;
    background:
      linear-gradient(
        145deg,
        var(--card-color),
        white 75%
      );
    border-radius: 35px;
    padding: 45px 35px;
    text-align: center;
    box-shadow:
      0 15px 45px rgba(65, 55, 100, 0.10);
  }

  .introIcon {
    font-size: 58px;
  }

  .introMascot {
    font-size: 65px;
    margin-top: -5px;
  }

  .introCard h1 {
    font-size: 32px;
    margin: 8px 0;
  }

  .introCard > p {
    color: #686477;
    margin: 0 auto 25px;
    max-width: 500px;
    line-height: 1.5;
  }

  .mimiBubble {
    display: flex;
    align-items: center;
    gap: 15px;
    text-align: left;
    background: rgba(255,255,255,0.82);
    border-radius: 22px;
    padding: 17px;
    max-width: 480px;
    margin: 0 auto 25px;
  }

  .mimiFace {
    font-size: 38px;
  }

  .mimiBubble strong {
    font-size: 14px;
  }

  .mimiBubble p {
    margin: 4px 0 0;
    color: #666378;
  }

  .startButton {
    border: none;
    border-radius: 17px;
    background: #5d4bd8;
    color: white;
    padding: 15px 28px;
    font-size: 16px;
    font-weight: 900;
    box-shadow:
      0 8px 18px rgba(93, 75, 216, 0.25);
  }

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
    margin-bottom: 18px;
  }

  .conversationTitle {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
  }

  .conversationTitle > span {
    font-size: 30px;
  }

  .conversationTitle div {
    display: flex;
    flex-direction: column;
  }

  .conversationTitle small {
    font-size: 11px;
    color: #8a859d;
    margin-top: 3px;
  }

  .missionXp {
    background: #fff2b8;
    padding: 9px 12px;
    border-radius: 13px;
    font-size: 12px;
    font-weight: 800;
  }

  .conversationCard {
    background: rgba(255,255,255,0.9);
    border-radius: 30px;
    padding: 25px;
    box-shadow:
      0 15px 45px rgba(65, 55, 100, 0.09);
  }

  .mimiHeader {
    display: flex;
    align-items: center;
    gap: 11px;
    padding-bottom: 18px;
    border-bottom: 1px solid #eeeaf5;
  }

  .mimiAvatar {
    width: 46px;
    height: 46px;
    border-radius: 15px;
    background: #f1ecff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 27px;
  }

  .mimiHeader div:last-child {
    display: flex;
    flex-direction: column;
  }

  .mimiHeader span {
    color: #8a859d;
    font-size: 11px;
    margin-top: 3px;
  }

  /*
    FIXED CHAT WINDOW
    Only this area scrolls when the
    conversation gets longer.
  */

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
    width: 32px;
    height: 32px;
    border-radius: 11px;
    background: #f1ecff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 19px;
  }

  .message {
    max-width: 78%;
    border-radius: 18px;
    padding: 13px 15px;
  }

  .tutorMessage {
    background: #f3f0ff;
    border-top-left-radius: 5px;
  }

  .userMessage {
    background: #e6f7fb;
    border-top-right-radius: 5px;
  }

  .messageText {
    white-space: pre-wrap;
    line-height: 1.5;
    font-size: 15px;
  }

  .listenButton {
    border: none;
    background: white;
    color: #6758a5;
    border-radius: 10px;
    padding: 7px 10px;
    margin-top: 9px;
    font-size: 11px;
    font-weight: 800;
  }

  .meaningArea {
    margin: 0 0 13px;
  }

  .meaningButton {
    width: 100%;
    border: 1px solid #e6e0fb;
    background: #faf9ff;
    color: #6758a5;
    border-radius: 15px;
    padding: 11px 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    font-weight: 800;
    text-align: left;
  }

  .meaningButton span {
    font-size: 10px;
    margin-left: 8px;
  }

  .meaningBox {
    margin-top: 8px;
    padding: 13px 15px;
    background: #fffdf3;
    border: 1px solid #f1e8bd;
    border-radius: 15px;
  }

  .meaningLabel {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #9a8b54;
    margin-bottom: 5px;
  }

  .meaningText {
    font-size: 14px;
    line-height: 1.45;
    color: #5f5a4a;
  }

  .vocabularyBox {
    margin: 8px 0 13px;
    padding: 16px;
    background: #f8fbff;
    border: 1px solid #dfeef7;
    border-radius: 22px;
  }

  .vocabularyHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  .vocabularyTitle {
    font-size: 14px;
    font-weight: 900;
    color: #4f5970;
  }

  .vocabularySubtitle {
    margin-top: 3px;
    font-size: 11px;
    color: #8a859d;
  }

  .vocabularyCount {
    min-width: 30px;
    height: 30px;
    padding: 0 8px;
    border-radius: 10px;
    background: #e8f5ff;
    color: #54718c;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 900;
  }

  .vocabularyList {
    display: grid;
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
    gap: 9px;
  }

  .vocabularyItem {
    background: white;
    border: 1px solid #e5edf3;
    border-radius: 14px;
    padding: 11px 12px;
  }

  .vocabularyFrench {
    font-size: 14px;
    font-weight: 900;
    color: #3f4760;
    line-height: 1.35;
  }

  .vocabularyEnglish {
    margin-top: 4px;
    font-size: 11px;
    color: #8a859d;
    line-height: 1.35;
  }

  .suggestedAnswers {
    background: rgba(248, 246, 255, 0.9);
    border: 1px solid #eeeafd;
    border-radius: 22px;
    padding: 16px;
    margin: 8px 0 13px;
  }

  .suggestedTitle {
    font-size: 13px;
    font-weight: 900;
    color: #77748a;
    margin-bottom: 10px;
  }

  .answerOptions {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .answerOption {
    border: 2px solid #e7e1ff;
    background: white;
    color: #302d4b;
    border-radius: 16px;
    padding: 12px 15px;
    font-size: 15px;
    font-weight: 750;
    text-align: left;
    box-shadow:
      0 4px 12px rgba(60, 50, 80, 0.05);
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease,
      border-color 0.15s ease;
  }

  .answerOption:hover {
    transform: translateY(-2px);
    border-color: #9b83f5;
    box-shadow:
      0 7px 16px rgba(60, 50, 80, 0.10);
  }

  .answerOption:active {
    transform: translateY(0);
  }

  .optionFrench {
    font-size: 15px;
    font-weight: 850;
    line-height: 1.4;
  }

  .optionEnglish {
    margin-top: 3px;
    font-size: 12px;
    font-weight: 500;
    color: #8a859d;
    line-height: 1.35;
  }

  .inputArea {
    display: flex;
    gap: 9px;
    padding-top: 7px;
  }

  .inputArea input {
    flex: 1;
    min-width: 0;
    border: 2px solid #ebe7f5;
    border-radius: 15px;
    padding: 13px 14px;
    outline: none;
    font-size: 14px;
    background: white;
  }

  .inputArea input:focus {
    border-color: #a99be8;
  }

  .sendButton {
    border: none;
    border-radius: 15px;
    background: #5d4bd8;
    color: white;
    padding: 0 18px;
    font-weight: 900;
  }

  .sendButton:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .typing {
    display: flex;
    gap: 4px;
    padding: 5px 2px;
  }

  .typing span {
    width: 7px;
    height: 7px;
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

  @media (max-width: 700px) {
    .header {
      padding: 0 4%;
    }

    .logoSubtitle {
      display: none;
    }

    .hero {
      flex-direction: column;
      text-align: center;
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
    .homeScreen {
      width: 92%;
      padding-top: 30px;
    }

    .header {
      height: 68px;
    }

    .xpBox,
    .levelBox {
      font-size: 11px;
      padding: 8px 9px;
    }

    .heroMascot {
      width: 82px;
      height: 82px;
      font-size: 45px;
    }

    .hero h1 {
      font-size: 30px;
    }

    .hero p {
      font-size: 15px;
    }

    .conversationCard {
      padding: 17px;
      border-radius: 24px;
    }

    .messages {
      height: 350px;
      padding-right: 4px;
    }

    .inputArea {
      flex-direction: column;
    }

    .inputArea input {
      width: 100%;
    }

    .sendButton {
      min-height: 44px;
    }
  }
`;
