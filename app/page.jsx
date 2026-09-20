'use client';

import { useEffect, useRef, useState } from 'react';

const scenarios = [
  {
    id: 'school',
    number: '01',
    name: 'At School',
    description: 'Talk about school, friends and your favourite subjects.',
    color: '#7DD9EA',
    category: 'EVERYDAY LIFE',
    icon: 'book',
  },
  {
    id: 'sports',
    number: '02',
    name: 'Sports',
    description: 'Talk about sports, teams and what you like to play.',
    color: '#FFB86B',
    category: 'FUN & GAMES',
    icon: 'ball',
  },
  {
    id: 'animals',
    number: '03',
    name: 'Animals',
    description: 'Discover animals and describe your favourites.',
    color: '#A9D98B',
    category: 'NATURE',
    icon: 'paw',
  },
  {
    id: 'hobbies',
    number: '04',
    name: 'My Hobbies',
    description: 'Talk about games, music, drawing and your free time.',
    color: '#C5A7F7',
    category: 'FREE TIME',
    icon: 'star',
  },
  {
    id: 'family',
    number: '05',
    name: 'My Family',
    description: 'Introduce your family and talk about the people you love.',
    color: '#F4A6C8',
    category: 'PEOPLE',
    icon: 'family',
  },
  {
    id: 'birthday',
    number: '06',
    name: 'Birthday Party',
    description: 'Talk about birthdays, presents, cake and celebrations.',
    color: '#FFD86B',
    category: 'CELEBRATIONS',
    icon: 'cake',
  },
  {
    id: 'park',
    number: '07',
    name: 'At the Park',
    description: 'Explore the park and talk about what you can see.',
    color: '#8ED5AE',
    category: 'OUTSIDE',
    icon: 'tree',
  },
  {
    id: 'shopping',
    number: '08',
    name: 'Shopping',
    description: 'Learn useful French for shops, clothes and prices.',
    color: '#9DBAF4',
    category: 'EVERYDAY LIFE',
    icon: 'bag',
  },
];

function getScenarioText(id) {
  const texts = {
    school:
      "Imagine we are at school in France. I will help you talk about your school day, your friends and the subjects you like.",
    sports:
      "Imagine we are talking about sports after school. I will ask you about the sports you enjoy and your favourite teams.",
    animals:
      "Imagine we are visiting an animal park. I will help you talk about different animals and describe the ones you like.",
    hobbies:
      "Let's talk about what you enjoy doing in your free time. We can talk about games, music, drawing and other hobbies.",
    family:
      "Let's talk about your family. I will help you introduce people in your family and say a few things about them.",
    birthday:
      "Imagine we are at a birthday party. We can talk about birthdays, presents, cake and what you like to do at parties.",
    park:
      "Imagine we are spending the afternoon in a French park. Let's talk about what we can see and what we like doing outside.",
    shopping:
      "Imagine we are in a French shop. I will help you practise useful words for clothes, colours, prices and buying things.",
  };

  return texts[id] || texts.school;
}

function getInitialMeaning(id) {
  const meanings = {
    school: 'We are going to practise talking about school and your favourite subjects.',
    sports: 'We are going to practise talking about sports and activities you enjoy.',
    animals: 'We are going to practise describing animals and talking about your favourites.',
    hobbies: 'We are going to practise talking about things you enjoy doing.',
    family: 'We are going to practise talking about your family.',
    birthday: 'We are going to practise French for a birthday party.',
    park: 'We are going to practise talking about things you see and do in a park.',
    shopping: 'We are going to practise useful French for shopping.',
  };

  return meanings[id] || meanings.school;
}

function getFrenchVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();

  return (
    voices.find((voice) => voice.lang?.toLowerCase().startsWith('fr')) ||
    voices.find((voice) => voice.lang?.toLowerCase().includes('fr')) ||
    null
  );
}

function speakFrench(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  window.speechSynthesis.cancel();

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getFrenchVoice();

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || 'fr-FR';
    } else {
      utterance.lang = 'fr-FR';
    }

    utterance.rate = 0.88;
    utterance.pitch = 1.05;

    window.speechSynthesis.speak(utterance);
  };

  const voices = window.speechSynthesis.getVoices();

  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      speak();
    };
  } else {
    speak();
  }
}

function Mimi({ small = false }) {
  return (
    <div className={`mimi ${small ? 'mimiSmall' : ''}`}>
      <div className="mimiEar mimiEarLeft" />
      <div className="mimiEar mimiEarRight" />

      <div className="mimiHead">
        <div className="mimiEye mimiEyeLeft" />
        <div className="mimiEye mimiEyeRight" />
        <div className="mimiNose" />
        <div className="mimiSmile" />
      </div>

      <div className="mimiBody">
        <div className="mimiScarf" />
      </div>
    </div>
  );
}

function MissionIcon({ type }) {
  return (
    <div className={`missionIcon missionIcon-${type}`}>
      {type === 'book' && (
        <>
          <div className="bookShape bookLeft" />
          <div className="bookShape bookRight" />
          <div className="bookLine" />
        </>
      )}

      {type === 'ball' && (
        <>
          <div className="ballShape" />
          <div className="ballLine ballLineOne" />
          <div className="ballLine ballLineTwo" />
        </>
      )}

      {type === 'paw' && (
        <>
          <div className="pawPad" />
          <div className="pawDot pawDotOne" />
          <div className="pawDot pawDotTwo" />
          <div className="pawDot pawDotThree" />
          <div className="pawDot pawDotFour" />
        </>
      )}

      {type === 'star' && <div className="starShape">★</div>}

      {type === 'family' && (
        <>
          <div className="person personOne" />
          <div className="person personTwo" />
          <div className="person personThree" />
        </>
      )}

      {type === 'cake' && (
        <>
          <div className="cakeCandle" />
          <div className="cakeTop" />
          <div className="cakeBottom" />
        </>
      )}

      {type === 'tree' && (
        <>
          <div className="treeTop" />
          <div className="treeTrunk" />
        </>
      )}

      {type === 'bag' && (
        <>
          <div className="bagHandle" />
          <div className="bagBody" />
        </>
      )}
    </div>
  );
}

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showIntro, setShowIntro] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [xp, setXp] = useState(0);
  const [answerOptions, setAnswerOptions] = useState([]);
  const [vocabulary, setVocabulary] = useState([]);
  const [showMeaning, setShowMeaning] = useState(false);

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
    setShowMeaning(false);
    setInput('');
  }

  async function beginMission() {
    setShowIntro(false);

    const scenarioText = getScenarioText(selectedScenario.id);

    setMessages([
      {
        role: 'mimi',
        text: scenarioText,
        speechText: scenarioText,
        meaning: getInitialMeaning(selectedScenario.id),
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: selectedScenario.id,
          messages: [],
          start: true,
        }),
      });

      const data = await response.json();

      if (data.reply) {
        setMessages([
          {
            role: 'mimi',
            text: data.reply,
            speechText: data.speechText || data.reply,
            meaning: data.meaning || '',
          },
        ]);

        setAnswerOptions(data.options || []);
        setVocabulary(data.vocabulary || []);

        setTimeout(() => {
          speakFrench(data.speechText || data.reply);
        }, 150);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function chooseAnswer(answer) {
    setInput(answer);
  }

  async function sendMessage(customMessage = null) {
    const messageToSend =
      typeof customMessage === 'string' ? customMessage.trim() : input.trim();

    if (!messageToSend || loading || !selectedScenario) {
      return;
    }

    const userMessage = {
      role: 'user',
      text: messageToSend,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setAnswerOptions([]);
    setLoading(true);
    setXp((current) => current + 5);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: selectedScenario.id,
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        throw new Error(data?.error?.message || 'Tutor request failed');
      }

      const mimiMessage = {
        role: 'mimi',
        text: data.reply || 'Très bien !',
        speechText: data.speechText || data.reply || 'Très bien !',
        meaning: data.meaning || '',
      };

      setMessages((current) => [...current, mimiMessage]);
      setAnswerOptions(data.options || []);
      setVocabulary(data.vocabulary || []);

      setTimeout(() => {
        speakFrench(data.speechText || data.reply || 'Très bien !');
      }, 100);
    } catch (error) {
      console.error(error);

      setMessages((current) => [
        ...current,
        {
          role: 'mimi',
          text: "Désolée ! Let's try that again.",
          speechText: "Désolée ! Let's try that again.",
          meaning: 'Something went wrong while connecting to Mimi.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function goHome() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setSelectedScenario(null);
    setShowIntro(false);
    setMessages([]);
    setAnswerOptions([]);
    setVocabulary([]);
    setShowMeaning(false);
    setInput('');
  }

  const progress = Math.min((xp / 100) * 100, 100);
  const level = Math.floor(xp / 100) + 1;

  return (
    <main className="page">
      <style jsx global>{styles}</style>

      <header className="topbar">
        <button className="brand" onClick={goHome}>
          <div className="brandMark">
            <span className="brandBlue" />
            <span className="brandWhite" />
            <span className="brandRed" />
          </div>

          <div className="brandText">
            <strong>Bonjour!</strong>
            <span>French with Mimi</span>
          </div>
        </button>

        <div className="xpArea">
          <div className="levelLabel">
            <span>LEVEL {level}</span>
            <strong>{xp} XP</strong>
          </div>

          <div className="xpBar">
            <div
              className="xpFill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {!selectedScenario && (
        <section className="home">
          <div className="decor decorOne" />
          <div className="decor decorTwo" />
          <div className="decor decorThree" />

          <div className="hero">
            <div className="heroText">
              <div className="helloPill">
                <span className="helloDot" />
                BONJOUR!
              </div>

              <h1>
                Your French
                <br />
                <span>adventure</span> starts here.
              </h1>

              <p>
                Learn French by talking, playing and completing fun little
                missions with Mimi.
              </p>

              <div className="heroStats">
                <div>
                  <strong>{scenarios.length}</strong>
                  <span>missions</span>
                </div>

                <div className="statDivider" />

                <div>
                  <strong>5</strong>
                  <span>XP per answer</span>
                </div>
              </div>
            </div>

            <div className="heroCharacter">
              <div className="characterGlow" />
              <div className="characterCard">
                <Mimi />

                <div className="speechBubble">
                  <span>Salut!</span>
                  <small>Ready to play?</small>
                </div>
              </div>

              <div className="floatingShape shapeOne" />
              <div className="floatingShape shapeTwo" />
              <div className="floatingShape shapeThree" />
            </div>
          </div>

          <section className="missionsSection">
            <div className="sectionHeading">
              <div>
                <span className="sectionEyebrow">CHOOSE YOUR ADVENTURE</span>
                <h2>Pick a mission</h2>
              </div>

              <span className="missionCount">
                {scenarios.length} to explore
              </span>
            </div>

            <div className="missionGrid">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  className="missionCard"
                  onClick={() => selectScenario(scenario)}
                  style={{ '--accent': scenario.color }}
                >
                  <div className="missionTop">
                    <span className="missionNumber">{scenario.number}</span>
                    <span className="missionArrow">↗</span>
                  </div>

                  <MissionIcon type={scenario.icon} />

                  <div className="missionContent">
                    <span className="missionCategory">
                      {scenario.category}
                    </span>

                    <h3>{scenario.name}</h3>

                    <p>{scenario.description}</p>
                  </div>

                  <div className="playLabel">
                    <span>PLAY MISSION</span>
                    <span>→</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <div className="homeTip">
            <div className="tipIcon">★</div>

            <div>
              <strong>Little tip from Mimi</strong>
              <p>
                You don't need to know everything. Just try! Every answer
                helps you learn.
              </p>
            </div>
          </div>
        </section>
      )}

      {selectedScenario && showIntro && (
        <section className="introScreen">
          <div className="introBackgroundShape introShapeOne" />
          <div className="introBackgroundShape introShapeTwo" />

          <button className="backButton" onClick={goHome}>
            ← All missions
          </button>

          <div className="introCard">
            <div
              className="introMissionIcon"
              style={{ '--accent': selectedScenario.color }}
            >
              <MissionIcon type={selectedScenario.icon} />
            </div>

            <span className="introNumber">
              MISSION {selectedScenario.number}
            </span>

            <h1>{selectedScenario.name}</h1>

            <p>{selectedScenario.description}</p>

            <div className="introMimi">
              <Mimi small />

              <div className="introMessage">
                <strong>Hi! I'm Mimi.</strong>
                <span>Let's practise some French together.</span>
              </div>
            </div>

            <button className="startButton" onClick={beginMission}>
              <span>START MISSION</span>
              <span className="startArrow">→</span>
            </button>
          </div>
        </section>
      )}

      {selectedScenario && !showIntro && (
        <section className="conversation">
          <div className="conversationHeader">
            <button className="backButton" onClick={goHome}>
              ← Missions
            </button>

            <div className="conversationTitle">
              <div
                className="conversationMission"
                style={{ background: selectedScenario.color }}
              >
                {selectedScenario.number}
              </div>

              <div>
                <span>{selectedScenario.category}</span>
                <h1>{selectedScenario.name}</h1>
              </div>
            </div>

            <div className="readyStatus">
              <span />
              READY
            </div>
          </div>

          <div className="chatCard">
            <div className="chatHeader">
              <div className="chatMimi">
                <Mimi small />
              </div>

              <div>
                <strong>Mimi</strong>
                <span>Your French friend</span>
              </div>
            </div>

            <div className="messages">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`messageRow ${message.role}`}
                >
                  {message.role === 'mimi' && (
                    <div className="messageAvatar">
                      <Mimi small />
                    </div>
                  )}

                  <div className="messageContent">
                    <div className="messageBubble">
                      {message.text}
                    </div>

                    {message.role === 'mimi' && (
                      <div className="messageTools">
                        <button
                          className="listenButton"
                          onClick={() =>
                            speakFrench(message.speechText || message.text)
                          }
                        >
                          <span className="speakerIcon">◖</span>
                          Listen
                        </button>

                        {message.meaning && (
                          <button
                            className="meaningButton"
                            onClick={() => setShowMeaning(!showMeaning)}
                          >
                            {showMeaning ? 'Hide meaning' : 'Meaning'}
                          </button>
                        )}
                      </div>
                    )}

                    {message.role === 'mimi' &&
                      message.meaning &&
                      showMeaning && (
                        <div className="meaningBox">
                          {message.meaning}
                        </div>
                      )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="messageRow mimi">
                  <div className="messageAvatar">
                    <Mimi small />
                  </div>

                  <div className="messageContent">
                    <div className="messageBubble typingBubble">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {vocabulary.length > 0 && (
              <div className="vocabulary">
                <div className="vocabularyTitle">USEFUL WORDS</div>

                <div className="vocabularyList">
                  {vocabulary.map((word, index) => (
                    <div className="vocabItem" key={index}>
                      <strong>{word.french || word}</strong>

                      {word.english && <span>{word.english}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {answerOptions.length > 0 && !loading && (
              <div className="answerArea">
                <div className="answerTitle">
                  <span>Your turn!</span>
                  <small>Choose an answer or type your own.</small>
                </div>

                <div className="answerOptions">
                  {answerOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        chooseAnswer(
                          typeof option === 'string'
                            ? option
                            : option.french || option.text || ''
                        )
                      }
                    >
                      <span className="optionNumber">{index + 1}</span>

                      <span>
                        {typeof option === 'string'
                          ? option
                          : option.french || option.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="inputArea">
              <div className="inputWrapper">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      sendMessage();
                    }
                  }}
                  placeholder="Write your answer in French..."
                  disabled={loading}
                />

                <button
                  className="sendButton"
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                >
                  →
                </button>
              </div>

              <div className="inputHint">
                <span>Tip</span> It's okay to make mistakes!
              </div>
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

  html,
  body {
    margin: 0;
    padding: 0;
    background: #f8f8fc;
    color: #20233a;
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  body {
    min-height: 100vh;
  }

  button,
  input {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  .page {
    min-height: 100vh;
    overflow-x: hidden;
    background:
      radial-gradient(circle at 85% 8%, rgba(197, 167, 247, 0.16), transparent 25%),
      radial-gradient(circle at 5% 35%, rgba(125, 217, 234, 0.13), transparent 25%),
      #f8f8fc;
  }

  /* =========================
     HEADER
  ========================= */

  .topbar {
    height: 76px;
    padding: 0 5vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.92);
    border-bottom: 1px solid #ececf3;
    position: sticky;
    top: 0;
    z-index: 20;
    backdrop-filter: blur(14px);
  }

  .brand {
    border: 0;
    background: transparent;
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 0;
    color: #20233a;
  }

  .brandMark {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    transform: rotate(-3deg);
    box-shadow: 0 5px 15px rgba(40, 44, 80, 0.12);
  }

  .brandMark span {
    flex: 1;
  }

  .brandBlue {
    background: #3155a5;
  }

  .brandWhite {
    background: #fff;
  }

  .brandRed {
    background: #ef5062;
  }

  .brandText {
    display: flex;
    flex-direction: column;
    text-align: left;
    line-height: 1.05;
  }

  .brandText strong {
    font-size: 17px;
    letter-spacing: -0.4px;
  }

  .brandText span {
    color: #85879a;
    font-size: 11px;
    margin-top: 4px;
  }

  .xpArea {
    width: 180px;
  }

  .levelLabel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.8px;
    color: #85879a;
  }

  .levelLabel strong {
    color: #20233a;
    font-size: 10px;
  }

  .xpBar {
    height: 7px;
    border-radius: 10px;
    background: #e9e9f0;
    overflow: hidden;
  }

  .xpFill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #7b6de8, #a98cf3);
    transition: width 0.35s ease;
  }

  /* =========================
     HOME
  ========================= */

  .home {
    max-width: 1180px;
    margin: 0 auto;
    padding: 60px 28px 70px;
    position: relative;
  }

  .decor {
    position: absolute;
    pointer-events: none;
    border-radius: 50%;
    opacity: 0.5;
  }

  .decorOne {
    width: 14px;
    height: 14px;
    background: #ffb86b;
    right: 9%;
    top: 115px;
  }

  .decorTwo {
    width: 9px;
    height: 9px;
    background: #f4a6c8;
    left: 5%;
    top: 350px;
  }

  .decorThree {
    width: 18px;
    height: 18px;
    border: 4px solid #8ed5ae;
    right: 3%;
    top: 510px;
  }

  .hero {
    min-height: 390px;
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
    gap: 50px;
    margin-bottom: 70px;
  }

  .heroText {
    position: relative;
    z-index: 2;
  }

  .helloPill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1px solid #e9e8f0;
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1px;
    color: #7266cf;
    box-shadow: 0 7px 20px rgba(43, 44, 80, 0.05);
  }

  .helloDot {
    width: 7px;
    height: 7px;
    background: #ffad69;
    border-radius: 50%;
  }

  .hero h1 {
    margin: 19px 0 18px;
    font-size: clamp(44px, 5vw, 68px);
    line-height: 0.98;
    letter-spacing: -3px;
    font-weight: 850;
    color: #25263b;
  }

  .hero h1 span {
    color: #7668d6;
    position: relative;
  }

  .hero h1 span::after {
    content: "";
    position: absolute;
    height: 7px;
    left: 2px;
    right: 4px;
    bottom: -5px;
    background: #ffd86b;
    border-radius: 20px;
    transform: rotate(-2deg);
    z-index: -1;
  }

  .heroText > p {
    max-width: 500px;
    margin: 0;
    color: #707287;
    font-size: 17px;
    line-height: 1.65;
  }

  .heroStats {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 30px;
  }

  .heroStats div:not(.statDivider) {
    display: flex;
    flex-direction: column;
  }

  .heroStats strong {
    font-size: 20px;
    color: #292b40;
  }

  .heroStats span {
    color: #9698a8;
    font-size: 11px;
    margin-top: 2px;
  }

  .statDivider {
    width: 1px;
    height: 30px;
    background: #dedee8;
  }

  .heroCharacter {
    min-height: 360px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .characterGlow {
    position: absolute;
    width: 310px;
    height: 310px;
    border-radius: 50%;
    background: #ebe7ff;
    opacity: 0.75;
  }

  .characterCard {
    position: relative;
    width: 300px;
    height: 315px;
    background: #fff;
    border-radius: 40px;
    border: 1px solid #eeeef5;
    box-shadow: 0 25px 60px rgba(53, 53, 88, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .speechBubble {
    position: absolute;
    top: 42px;
    right: -45px;
    background: #fff;
    border: 1px solid #ececf3;
    border-radius: 17px;
    padding: 12px 17px;
    box-shadow: 0 12px 30px rgba(40, 40, 70, 0.1);
    display: flex;
    flex-direction: column;
    gap: 2px;
    transform: rotate(3deg);
  }

  .speechBubble::after {
    content: "";
    position: absolute;
    bottom: -7px;
    left: 23px;
    width: 14px;
    height: 14px;
    background: white;
    border-right: 1px solid #ececf3;
    border-bottom: 1px solid #ececf3;
    transform: rotate(45deg);
  }

  .speechBubble span {
    color: #7266cf;
    font-size: 17px;
    font-weight: 850;
  }

  .speechBubble small {
    color: #9293a3;
    font-size: 10px;
  }

  .floatingShape {
    position: absolute;
    border-radius: 50%;
  }

  .shapeOne {
    width: 17px;
    height: 17px;
    background: #ffb86b;
    top: 34px;
    left: 20%;
  }

  .shapeTwo {
    width: 12px;
    height: 12px;
    background: #7dd9ea;
    bottom: 42px;
    right: 15%;
  }

  .shapeThree {
    width: 25px;
    height: 25px;
    border: 5px solid #f4a6c8;
    bottom: 65px;
    left: 12%;
  }

  /* =========================
     MIMI
  ========================= */

  .mimi {
    width: 170px;
    height: 205px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .mimiEar {
    width: 45px;
    height: 65px;
    background: #a995e8;
    border-radius: 50%;
    position: absolute;
    top: 24px;
    z-index: 1;
  }

  .mimiEar::after {
    content: "";
    position: absolute;
    inset: 8px;
    border-radius: inherit;
    background: #d9d0fa;
  }

  .mimiEarLeft {
    left: 8px;
    transform: rotate(-20deg);
  }

  .mimiEarRight {
    right: 8px;
    transform: rotate(20deg);
  }

  .mimiHead {
    width: 125px;
    height: 115px;
    background: #b6a4ef;
    border-radius: 48% 48% 45% 45%;
    position: relative;
    z-index: 2;
    box-shadow: inset 0 -7px 0 rgba(80, 60, 150, 0.07);
  }

  .mimiEye {
    position: absolute;
    top: 45px;
    width: 11px;
    height: 15px;
    border-radius: 50%;
    background: #34334b;
  }

  .mimiEye::after {
    content: "";
    position: absolute;
    width: 3px;
    height: 4px;
    border-radius: 50%;
    background: #fff;
    top: 3px;
    left: 3px;
  }

  .mimiEyeLeft {
    left: 35px;
  }

  .mimiEyeRight {
    right: 35px;
  }

  .mimiNose {
    position: absolute;
    top: 65px;
    left: 58px;
    width: 9px;
    height: 7px;
    border-radius: 50%;
    background: #806dc9;
  }

  .mimiSmile {
    position: absolute;
    top: 76px;
    left: 50px;
    width: 25px;
    height: 13px;
    border-bottom: 3px solid #5e4c9e;
    border-radius: 0 0 20px 20px;
  }

  .mimiBody {
    width: 105px;
    height: 70px;
    position: absolute;
    bottom: 0;
    background: #7d70db;
    border-radius: 42px 42px 28px 28px;
    z-index: 1;
  }

  .mimiScarf {
    position: absolute;
    width: 92px;
    height: 19px;
    top: 9px;
    left: 6px;
    background: #ffd76a;
    border-radius: 20px;
    transform: rotate(-2deg);
  }

  .mimiScarf::after {
    content: "";
    position: absolute;
    width: 18px;
    height: 30px;
    right: 5px;
    top: 11px;
    background: #ffd76a;
    border-radius: 5px 5px 12px 12px;
    transform: rotate(-6deg);
  }

  .mimiSmall {
    transform: scale(0.56);
    transform-origin: center bottom;
    width: 100px;
    height: 120px;
  }

  /* =========================
     MISSIONS
  ========================= */

  .missionsSection {
    position: relative;
  }

  .sectionHeading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .sectionEyebrow {
    font-size: 10px;
    font-weight: 850;
    letter-spacing: 1.3px;
    color: #8a89a0;
  }

  .sectionHeading h2 {
    margin: 6px 0 0;
    font-size: 31px;
    letter-spacing: -1.2px;
  }

  .missionCount {
    color: #898a9d;
    font-size: 12px;
    background: #fff;
    border: 1px solid #ececf3;
    padding: 8px 12px;
    border-radius: 999px;
  }

  .missionGrid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 17px;
  }

  .missionCard {
    border: 1px solid #ececf3;
    background: #fff;
    border-radius: 25px;
    padding: 18px;
    text-align: left;
    position: relative;
    min-height: 285px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition:
      transform 0.22s ease,
      box-shadow 0.22s ease,
      border-color 0.22s ease;
  }

  .missionCard::before {
    content: "";
    position: absolute;
    width: 115px;
    height: 115px;
    background: var(--accent);
    opacity: 0.16;
    border-radius: 50%;
    top: 42px;
    right: -42px;
  }

  .missionCard:hover {
    transform: translateY(-6px) rotate(-0.4deg);
    border-color: var(--accent);
    box-shadow: 0 20px 40px rgba(50, 50, 80, 0.1);
  }

  .missionTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .missionNumber {
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 11px;
    background: var(--accent);
    color: #3c3c51;
    font-weight: 850;
    font-size: 10px;
  }

  .missionArrow {
    font-size: 20px;
    color: #aaaabd;
    transition: transform 0.2s ease;
  }

  .missionCard:hover .missionArrow {
    transform: translate(3px, -3px);
  }

  .missionIcon {
    width: 68px;
    height: 68px;
    border-radius: 22px;
    background: var(--accent);
    position: relative;
    margin: 18px 0 17px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .missionIcon-book,
  .missionIcon-ball,
  .missionIcon-paw,
  .missionIcon-star,
  .missionIcon-family,
  .missionIcon-cake,
  .missionIcon-tree,
  .missionIcon-bag {
    --accent: #dedbf8;
  }

  .bookShape {
    position: absolute;
    width: 22px;
    height: 32px;
    background: #fff;
    border-radius: 4px 8px 8px 4px;
    top: 19px;
  }

  .bookLeft {
    left: 14px;
    transform: rotate(-5deg);
  }

  .bookRight {
    right: 14px;
    transform: rotate(5deg);
  }

  .bookLine {
    width: 3px;
    height: 31px;
    background: #8a7bd8;
    border-radius: 3px;
    position: absolute;
  }

  .ballShape {
    width: 38px;
    height: 38px;
    background: #fff;
    border-radius: 50%;
    border: 4px solid #5d69a7;
  }

  .ballLine {
    position: absolute;
    width: 17px;
    height: 4px;
    background: #5d69a7;
    border-radius: 5px;
  }

  .ballLineOne {
    transform: rotate(45deg);
  }

  .ballLineTwo {
    transform: rotate(-45deg);
  }

  .pawPad {
    width: 27px;
    height: 24px;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    bottom: 15px;
  }

  .pawDot {
    width: 12px;
    height: 15px;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    top: 17px;
  }

  .pawDotOne {
    left: 16px;
    transform: rotate(-25deg);
  }

  .pawDotTwo {
    left: 28px;
    top: 11px;
  }

  .pawDotThree {
    right: 16px;
    transform: rotate(25deg);
  }

  .pawDotFour {
    right: 27px;
    top: 10px;
  }

  .starShape {
    color: #fff;
    font-size: 39px;
    line-height: 1;
    text-shadow: 0 3px 0 rgba(87, 73, 130, 0.18);
  }

  .person {
    position: absolute;
    background: #fff;
    border-radius: 50%;
  }

  .person::after {
    content: "";
    position: absolute;
    background: #fff;
    border-radius: 18px 18px 9px 9px;
    width: 27px;
    height: 26px;
    left: -7px;
    top: 20px;
  }

  .personOne {
    width: 17px;
    height: 17px;
    left: 11px;
    top: 17px;
  }

  .personTwo {
    width: 21px;
    height: 21px;
    left: 24px;
    top: 11px;
    z-index: 2;
  }

  .personThree {
    width: 17px;
    height: 17px;
    right: 11px;
    top: 17px;
  }

  .cakeCandle {
    width: 5px;
    height: 17px;
    background: #fff;
    position: absolute;
    top: 12px;
    border-radius: 3px;
  }

  .cakeCandle::before {
    content: "";
    width: 8px;
    height: 8px;
    background: #ff8d68;
    border-radius: 50% 50% 50% 0;
    position: absolute;
    left: -2px;
    top: -7px;
    transform: rotate(45deg);
  }

  .cakeTop {
    width: 40px;
    height: 17px;
    background: #fff;
    border-radius: 5px 5px 2px 2px;
    position: absolute;
    top: 29px;
  }

  .cakeBottom {
    width: 49px;
    height: 18px;
    background: #fff;
    border-radius: 3px 3px 8px 8px;
    position: absolute;
    top: 46px;
  }

  .treeTop {
    width: 42px;
    height: 42px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 12px;
    box-shadow:
      -15px 10px 0 -4px #fff,
      15px 10px 0 -4px #fff;
  }

  .treeTrunk {
    width: 10px;
    height: 25px;
    background: #fff;
    position: absolute;
    bottom: 10px;
    border-radius: 5px;
  }

  .bagBody {
    width: 38px;
    height: 36px;
    background: #fff;
    border-radius: 4px 4px 9px 9px;
    position: absolute;
    bottom: 12px;
  }

  .bagHandle {
    width: 25px;
    height: 17px;
    border: 4px solid #fff;
    border-bottom: 0;
    border-radius: 20px 20px 0 0;
    position: absolute;
    top: 12px;
  }

  .missionContent {
    position: relative;
    z-index: 2;
  }

  .missionCategory {
    color: #9293a4;
    font-size: 8px;
    font-weight: 850;
    letter-spacing: 1px;
  }

  .missionContent h3 {
    margin: 6px 0 6px;
    color: #27293e;
    font-size: 20px;
    letter-spacing: -0.5px;
  }

  .missionContent p {
    margin: 0;
    color: #858698;
    font-size: 11px;
    line-height: 1.55;
  }

  .playLabel {
    margin-top: auto;
    padding-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #7468cf;
    font-size: 9px;
    font-weight: 850;
    letter-spacing: 0.7px;
  }

  .homeTip {
    margin-top: 25px;
    background: #fff9e9;
    border: 1px solid #f2e5bb;
    border-radius: 22px;
    padding: 17px 20px;
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .tipIcon {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    background: #ffd86b;
    border-radius: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #866d2d;
  }

  .homeTip strong {
    color: #51472c;
    font-size: 13px;
  }

  .homeTip p {
    margin: 3px 0 0;
    color: #82775a;
    font-size: 11px;
  }

  /* =========================
     INTRO
  ========================= */

  .introScreen {
    min-height: calc(100vh - 76px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 45px 25px;
    position: relative;
    overflow: hidden;
  }

  .backButton {
    border: 0;
    background: transparent;
    color: #797b91;
    font-size: 12px;
    font-weight: 700;
    padding: 8px 0;
    transition: color 0.2s ease;
  }

  .backButton:hover {
    color: #7165cf;
  }

  .introScreen > .backButton {
    position: absolute;
    top: 30px;
    left: 5vw;
  }

  .introBackgroundShape {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  .introShapeOne {
    width: 330px;
    height: 330px;
    background: #ebe7ff;
    right: -100px;
    top: 10%;
  }

  .introShapeTwo {
    width: 190px;
    height: 190px;
    background: #e1f7fa;
    left: -70px;
    bottom: 8%;
  }

  .introCard {
    width: min(560px, 100%);
    background: #fff;
    border: 1px solid #ececf3;
    border-radius: 38px;
    box-shadow: 0 30px 80px rgba(50, 50, 90, 0.12);
    padding: 45px;
    text-align: center;
    position: relative;
    z-index: 2;
  }

  .introMissionIcon {
    display: inline-flex;
    --accent: #c5a7f7;
  }

  .introMissionIcon .missionIcon {
    margin: 0;
  }

  .introNumber {
    display: block;
    margin-top: 20px;
    color: #8c8ca0;
    font-size: 9px;
    font-weight: 850;
    letter-spacing: 1.3px;
  }

  .introCard h1 {
    margin: 8px 0 10px;
    font-size: 42px;
    letter-spacing: -1.7px;
    color: #25263b;
  }

  .introCard > p {
    margin: 0 auto;
    max-width: 430px;
    color: #858698;
    line-height: 1.65;
    font-size: 14px;
  }

  .introMimi {
    margin: 30px auto 27px;
    padding: 13px 18px;
    width: fit-content;
    background: #f8f7fd;
    border-radius: 22px;
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .introMessage {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-left: -4px;
  }

  .introMessage strong {
    font-size: 13px;
    color: #36364c;
  }

  .introMessage span {
    margin-top: 3px;
    font-size: 10px;
    color: #8d8ea0;
  }

  .startButton {
    width: 100%;
    border: 0;
    border-radius: 17px;
    padding: 17px 20px;
    background: #7569d5;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    font-weight: 850;
    font-size: 11px;
    letter-spacing: 0.7px;
    box-shadow: 0 12px 24px rgba(117, 105, 213, 0.22);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .startButton:hover {
    transform: translateY(-2px);
    box-shadow: 0 17px 30px rgba(117, 105, 213, 0.27);
  }

  .startArrow {
    font-size: 18px;
    line-height: 1;
  }

  /* =========================
     CONVERSATION
  ========================= */

  .conversation {
    max-width: 1000px;
    margin: 0 auto;
    padding: 25px 25px 50px;
  }

  .conversationHeader {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    margin-bottom: 18px;
  }

  .conversationHeader > .backButton {
    justify-self: start;
  }

  .conversationTitle {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .conversationMission {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3c3c51;
    font-size: 10px;
    font-weight: 850;
  }

  .conversationTitle span {
    display: block;
    color: #9192a4;
    font-size: 8px;
    font-weight: 850;
    letter-spacing: 1px;
  }

  .conversationTitle h1 {
    margin: 3px 0 0;
    font-size: 18px;
    letter-spacing: -0.5px;
  }

  .readyStatus {
    justify-self: end;
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 8px;
    font-weight: 850;
    letter-spacing: 0.8px;
    color: #8a8b9d;
  }

  .readyStatus span {
    width: 7px;
    height: 7px;
    background: #6fd09a;
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(111, 208, 154, 0.12);
  }

  .chatCard {
    background: #fff;
    border: 1px solid #ececf3;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(45, 45, 80, 0.08);
  }

  .chatHeader {
    height: 72px;
    padding: 0 24px;
    border-bottom: 1px solid #f0f0f5;
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .chatMimi {
    width: 48px;
    height: 58px;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
  }

  .chatHeader strong {
    display: block;
    font-size: 13px;
    color: #303147;
  }

  .chatHeader span {
    display: block;
    font-size: 9px;
    color: #999aaa;
    margin-top: 3px;
  }

  .messages {
    height: 420px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 22px 22px 10px;
    min-height: 0;
    scroll-behavior: smooth;
    overscroll-behavior: contain;
  }

  .messages::-webkit-scrollbar {
    width: 7px;
  }

  .messages::-webkit-scrollbar-track {
    background: transparent;
  }

  .messages::-webkit-scrollbar-thumb {
    background: #dddde8;
    border-radius: 20px;
  }

  .messageRow {
    display: flex;
    gap: 9px;
    margin-bottom: 17px;
  }

  .messageRow.user {
    justify-content: flex-end;
  }

  .messageAvatar {
    width: 34px;
    height: 39px;
    flex: 0 0 34px;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
  }

  .messageContent {
    max-width: min(72%, 560px);
  }

  .messageBubble {
    padding: 12px 15px;
    border-radius: 17px 17px 17px 5px;
    background: #f4f3fb;
    color: #3d3e52;
    font-size: 13px;
    line-height: 1.55;
  }

  .messageRow.user .messageBubble {
    background: #7569d5;
    color: #fff;
    border-radius: 17px 17px 5px 17px;
  }

  .messageTools {
    display: flex;
    gap: 7px;
    margin-top: 6px;
  }

  .listenButton,
  .meaningButton {
    border: 0;
    background: transparent;
    color: #8b8c9f;
    font-size: 9px;
    padding: 3px 5px;
  }

  .listenButton:hover,
  .meaningButton:hover {
    color: #7569d5;
  }

  .speakerIcon {
    display: inline-block;
    margin-right: 3px;
    font-size: 12px;
  }

  .meaningBox {
    margin-top: 7px;
    padding: 9px 11px;
    background: #fff9e9;
    border-radius: 10px;
    color: #756b50;
    font-size: 10px;
    line-height: 1.45;
  }

  .typingBubble {
    display: flex;
    gap: 4px;
    padding: 14px 17px;
  }

  .typingBubble span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #9b95c9;
    animation: typing 1s infinite ease-in-out;
  }

  .typingBubble span:nth-child(2) {
    animation-delay: 0.15s;
  }

  .typingBubble span:nth-child(3) {
    animation-delay: 0.3s;
  }

  @keyframes typing {
    0%,
    60%,
    100% {
      transform: translateY(0);
      opacity: 0.45;
    }

    30% {
      transform: translateY(-4px);
      opacity: 1;
    }
  }

  .vocabulary {
    border-top: 1px solid #f0f0f5;
    padding: 15px 22px;
    background: #fafafd;
  }

  .vocabularyTitle {
    font-size: 8px;
    font-weight: 850;
    letter-spacing: 1px;
    color: #9697a9;
    margin-bottom: 8px;
  }

  .vocabularyList {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }

  .vocabItem {
    background: #fff;
    border: 1px solid #ececf3;
    border-radius: 10px;
    padding: 6px 9px;
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .vocabItem strong {
    color: #7165cf;
    font-size: 10px;
  }

  .vocabItem span {
    color: #9798a8;
    font-size: 9px;
  }

  .answerArea {
    padding: 16px 22px 12px;
    border-top: 1px solid #f0f0f5;
  }

  .answerTitle {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 10px;
  }

  .answerTitle span {
    color: #303147;
    font-size: 12px;
    font-weight: 850;
  }

  .answerTitle small {
    color: #999aaa;
    font-size: 9px;
  }

  .answerOptions {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .answerOptions button {
    min-height: 44px;
    border: 1px solid #e7e6ef;
    background: #fff;
    border-radius: 13px;
    padding: 7px 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: left;
    color: #45465a;
    font-size: 10px;
    transition:
      transform 0.15s ease,
      border-color 0.15s ease,
      background 0.15s ease;
  }

  .answerOptions button:hover {
    transform: translateY(-2px);
    border-color: #c7c0ef;
    background: #faf9ff;
  }

  .optionNumber {
    width: 22px;
    height: 22px;
    flex: 0 0 22px;
    border-radius: 8px;
    background: #f0effa;
    color: #7569d5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 850;
    font-size: 9px;
  }

  .inputArea {
    padding: 13px 22px 20px;
  }

  .inputWrapper {
    height: 52px;
    border: 2px solid #e8e7f0;
    border-radius: 17px;
    display: flex;
    align-items: center;
    padding: 4px;
    transition: border-color 0.2s ease;
  }

  .inputWrapper:focus-within {
    border-color: #b9b0ed;
  }

  .inputWrapper input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    padding: 0 12px;
    color: #343549;
    font-size: 12px;
  }

  .inputWrapper input::placeholder {
    color: #aaaaba;
  }

  .sendButton {
    width: 43px;
    height: 43px;
    border: 0;
    border-radius: 13px;
    background: #7569d5;
    color: #fff;
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      transform 0.15s ease,
      opacity 0.15s ease;
  }

  .sendButton:hover:not(:disabled) {
    transform: translateX(2px);
  }

  .sendButton:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .inputHint {
    margin-top: 7px;
    color: #a0a1b0;
    font-size: 9px;
  }

  .inputHint span {
    color: #7569d5;
    font-weight: 850;
  }

  /* =========================
     RESPONSIVE
  ========================= */

  @media (max-width: 950px) {
    .missionGrid {
      grid-template-columns: repeat(2, 1fr);
    }

    .hero {
      grid-template-columns: 1fr;
      gap: 20px;
      text-align: center;
    }

    .heroText > p {
      margin-left: auto;
      margin-right: auto;
    }

    .heroStats {
      justify-content: center;
    }

    .heroCharacter {
      min-height: 320px;
    }

    .speechBubble {
      right: calc(50% - 190px);
    }
  }

  @media (max-width: 700px) {
    .topbar {
      height: 68px;
      padding: 0 18px;
    }

    .xpArea {
      width: 125px;
    }

    .brandText span {
      display: none;
    }

    .home {
      padding: 42px 18px 50px;
    }

    .hero {
      min-height: auto;
      margin-bottom: 50px;
    }

    .hero h1 {
      font-size: 47px;
      letter-spacing: -2px;
    }

    .heroText > p {
      font-size: 15px;
    }

    .heroCharacter {
      min-height: 285px;
    }

    .characterCard {
      width: 250px;
      height: 270px;
    }

    .characterGlow {
      width: 260px;
      height: 260px;
    }

    .sectionHeading {
      align-items: flex-start;
      gap: 10px;
    }

    .missionGrid {
      grid-template-columns: 1fr;
    }

    .missionCard {
      min-height: 250px;
    }

    .introCard {
      padding: 32px 23px;
      border-radius: 28px;
    }

    .introCard h1 {
      font-size: 34px;
    }

    .conversation {
      padding: 17px 12px 35px;
    }

    .conversationHeader {
      grid-template-columns: auto 1fr auto;
      gap: 10px;
    }

    .conversationTitle h1 {
      font-size: 15px;
    }

    .readyStatus {
      display: none;
    }

    .messages {
      height: 380px;
      padding: 18px 14px 8px;
    }

    .messageContent {
      max-width: 82%;
    }

    .answerOptions {
      grid-template-columns: 1fr;
    }

    .chatHeader {
      padding: 0 15px;
    }

    .answerArea,
    .inputArea,
    .vocabulary {
      padding-left: 15px;
      padding-right: 15px;
    }
  }

  @media (max-width: 460px) {
    .brandText strong {
      font-size: 15px;
    }

    .xpArea {
      width: 105px;
    }

    .hero h1 {
      font-size: 41px;
    }

    .heroStats {
      gap: 14px;
    }

    .speechBubble {
      right: 0;
      top: 25px;
    }

    .messages {
      height: 350px;
    }

    .conversationTitle span {
      display: none;
    }

    .conversationMission {
      width: 36px;
      height: 36px;
    }
  }
`;
