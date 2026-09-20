'use client';

import { useEffect, useState } from 'react';

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

export default function FrenchTutor() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showIntro, setShowIntro] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [xp, setXp] = useState(0);
  const [completed, setCompleted] = useState([]);

  function getFrenchVoice() {
    if (
      typeof window === 'undefined' ||
      !window.speechSynthesis
    ) {
      return null;
    }

    const voices = window.speechSynthesis.getVoices();

    return (
      voices.find((voice) =>
        voice.lang.toLowerCase().startsWith('fr')
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

      window.speechSynthesis.speak(utterance);
    };

    const frenchVoice = getFrenchVoice();

    if (frenchVoice) {
      speak();
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      speak();
    };

    setTimeout(() => {
      if (!window.speechSynthesis.speaking) {
        speak();
      }
    }, 1000);
  }

  function selectScenario(scenario) {
    setSelectedScenario(scenario);
    setShowIntro(true);
    setMessages([]);
    setInput('');
  }

  function beginMission() {
    if (!selectedScenario) return;

    setShowIntro(false);

    const scenarioText = getScenarioText(
      selectedScenario.id
    );

    setMessages([
      {
        speaker: 'tutor',
        text: scenarioText,
        speechText: scenarioText,
      },
    ]);

    setTimeout(() => {
      speakFrench(scenarioText);
    }, 300);
  }

  async function sendMessage() {
    if (
      !input.trim() ||
      loading ||
      !selectedScenario
    ) {
      return;
    }

    const userMessage = {
      speaker: 'you',
      text: input.trim(),
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: selectedScenario.name,
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Something went wrong.'
        );
      }

      const tutorMessage = {
        speaker: 'tutor',
        text: data.reply,
        speechText:
          data.speechText || data.reply,
      };

      setMessages((current) => [
        ...current,
        tutorMessage,
      ]);

      speakFrench(
        data.speechText || data.reply
      );

      setXp((current) =>
        Math.min(current + 10, 9999)
      );
    } catch (error) {
      console.error(error);

      const errorMessage = {
        speaker: 'tutor',
        text:
          'Oops! Something went wrong. Let’s try again!',
        speechText:
          'Oups ! Quelque chose ne va pas. Essayons encore !',
      };

      setMessages((current) => [
        ...current,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  }

  function finishMission() {
    if (!selectedScenario) return;

    if (!completed.includes(selectedScenario.id)) {
      setCompleted((current) => [
        ...current,
        selectedScenario.id,
      ]);
    }

    setSelectedScenario(null);
    setShowIntro(false);
    setMessages([]);
    setInput('');
  }

  function restartMission() {
    if (!selectedScenario) return;

    setShowIntro(true);
    setMessages([]);
    setInput('');
  }

  const level = Math.floor(xp / 100) + 1;
  const progress = xp % 100;

  return (
    <main className="adventurePage">
      <div className="adventureContainer">

        <header className="adventureHeader">
          <div className="flagIcon">🇫🇷</div>

          <h1>FRENCH ADVENTURE</h1>

          <p>Learn French. Have fun. ⭐</p>

          <div className="xpPanel">
            <div className="xpTop">
              <span>⭐ {xp} XP</span>
              <span>🏆 Level {level}</span>
            </div>

            <div className="progressTrack">
              <div
                className="progressFill"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </header>

        <section className="mimiWelcome">
          <div className="mimiCharacter">🐱</div>

          <div className="mimiSpeech">
            <div className="mimiName">
              Mimi says:
            </div>

            <h2>
              Bonjour! 👋
            </h2>

            <p>
              Ready for your next French adventure?
            </p>
          </div>
        </section>

        {!selectedScenario && (
          <section className="missionsSection">
            <div className="sectionHeading">
              <div>
                <span className="smallHeading">
                  YOUR ADVENTURE
                </span>

                <h2>🗺️ Choose a Mission</h2>
              </div>

              <div className="missionCounter">
                {completed.length}/{scenarios.length}
                {' '}complete ⭐
              </div>
            </div>

            <div className="missionGrid">
              {scenarios.map((scenario, index) => {
                const isCompleted =
                  completed.includes(scenario.id);

                return (
                  <button
                    key={scenario.id}
                    className="missionCard"
                    onClick={() =>
                      selectScenario(scenario)
                    }
                    style={{
                      '--mission-color':
                        scenario.color,
                    }}
                  >
                    <div className="missionIcons">
                      <span>
                        {scenario.icon}
                      </span>

                      <span>
                        {scenario.mascot}
                      </span>
                    </div>

                    <div className="missionNumber">
                      MISSION {index + 1}
                    </div>

                    <h3>{scenario.name}</h3>

                    <p>
                      {scenario.description}
                    </p>

                    <div className="missionBottom">
                      {isCompleted ? (
                        <span className="completedText">
                          ✓ Completed
                        </span>
                      ) : (
                        <span>
                          🌟 Beginner
                        </span>
                      )}

                      <span>Play →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {selectedScenario && showIntro && (
          <section className="missionIntro">

            <button
              className="backButton"
              onClick={() =>
                setSelectedScenario(null)
              }
            >
              ← Back to missions
            </button>

            <div
              className="introCard"
              style={{
                '--mission-color':
                  selectedScenario.color,
              }}
            >
              <div className="introIcon">
                {selectedScenario.icon}
              </div>

              <div className="introMascot">
                {selectedScenario.mascot}
              </div>

              <div className="missionNumber">
                READY FOR MISSION
              </div>

              <h2>
                {selectedScenario.name}
              </h2>

              <p>
                {selectedScenario.description}
              </p>

              <div className="mimiIntro">
                <div className="mimiSmall">
                  🐱
                </div>

                <div>
                  <strong>
                    Mimi is ready!
                  </strong>

                  <p>
                    Talk to Mimi in French.
                    Don’t worry about making
                    mistakes!
                  </p>
                </div>
              </div>

              <button
                className="startButton"
                onClick={beginMission}
              >
                🚀 Start Mission
              </button>
            </div>
          </section>
        )}

        {selectedScenario && !showIntro && (
          <section className="conversationSection">

            <div className="conversationHeader">
              <button
                className="backButton"
                onClick={() =>
                  setSelectedScenario(null)
                }
              >
                ← Missions
              </button>

              <div className="conversationTitle">
                <span>
                  {selectedScenario.icon}
                </span>

                <div>
                  <div className="missionNumber">
                    MISSION
                  </div>

                  <h2>
                    {selectedScenario.name}
                  </h2>
                </div>
              </div>

              <button
                className="restartButton"
                onClick={restartMission}
              >
                🔄 Restart
              </button>
            </div>

            <div className="conversationCard">

              <div className="conversationMessages">
                {messages.map(
                  (message, index) => (
                    <div
                      key={index}
                      className={`messageRow ${
                        message.speaker === 'you'
                          ? 'youRow'
                          : 'tutorRow'
                      }`}
                    >
                      {message.speaker ===
                        'tutor' && (
                        <div className="messageAvatar">
                          🐱
                        </div>
                      )}

                      <div className="messageContent">
                        <div
                          className={`messageBubble ${
                            message.speaker ===
                            'you'
                              ? 'youBubble'
                              : 'tutorBubble'
                          }`}
                        >
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
                    <div className="messageAvatar">
                      🐱
                    </div>

                    <div className="messageBubble tutorBubble typingBubble">
                      Mimi is thinking... 💭
                    </div>
                  </div>
                )}
              </div>

              <div className="inputArea">
                <input
                  value={input}
                  onChange={(event) =>
                    setInput(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter' &&
                      !loading
                    ) {
                      sendMessage();
                    }
                  }}
                  placeholder="Write your answer in French..."
                  disabled={loading}
                />

                <button
                  className="sendButton"
                  onClick={sendMessage}
                  disabled={
                    loading || !input.trim()
                  }
                >
                  {loading
                    ? '...'
                    : 'Send 🚀'}
                </button>
              </div>

              <button
                className="finishButton"
                onClick={finishMission}
              >
                🏁 Finish Mission
              </button>
            </div>
          </section>
        )}

        <footer className="adventureFooter">
          <div>🐱</div>

          <p>
            Keep going, explorer!
            <br />
            Complete missions to earn XP and unlock
            new adventures.
          </p>

          <div>⭐ ⭐ ⭐</div>
        </footer>
      </div>
    </main>
  );
}
