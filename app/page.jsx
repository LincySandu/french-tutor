'use client';

import { useState } from 'react';

const scenarios = [
  {
    id: 'cafe',
    icon: '☕',
    name: 'At the Café',
    description: 'Order a yummy snack in French!',
    color: '#FFD166',
    mascot: '🥐',
  },
  {
    id: 'school',
    icon: '🎒',
    name: 'At School',
    description: 'Meet your French classmates!',
    color: '#7BDFF2',
    mascot: '📚',
  },
  {
    id: 'park',
    icon: '🌳',
    name: 'At the Park',
    description: 'Play and have fun outside!',
    color: '#B8E986',
    mascot: '⚽',
  },
  {
    id: 'family',
    icon: '👨‍👩‍👧',
    name: 'My Family',
    description: 'Talk about your family!',
    color: '#FF9FAD',
    mascot: '❤️',
  },
  {
    id: 'animals',
    icon: '🐶',
    name: 'Animals',
    description: 'Discover your favourite animals!',
    color: '#C7B8FF',
    mascot: '🐾',
  },
];

export default function FrenchTutor() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(new Set());
  const [xp, setXp] = useState(0);
  const [showIntro, setShowIntro] = useState(false);

  const level = Math.floor(xp / 100) + 1;
  const levelXp = xp % 100;

  function startScenario(scenario) {
    setSelectedScenario(scenario);
    setMessages([]);
    setInput('');
    setShowIntro(true);
  }

  function beginMission() {
    setShowIntro(false);

    const scenarioText = getScenarioText(selectedScenario.id);

    setMessages([
      {
        speaker: 'tutor',
        text: scenarioText,
      },
    ]);

    setTimeout(() => {
      speakFrench(scenarioText);
    }, 200);
  }

  function getScenarioText(id) {
    const greetings = {
      cafe: 'Bonjour ! Bienvenue au café ! Qu’est-ce que tu veux boire ?',
      school: 'Bonjour ! Je suis ton nouvel ami. Comment tu t’appelles ?',
      park: 'Salut ! Tu veux jouer au parc ?',
      family: 'Bonjour ! Parle-moi de ta famille. Tu as des frères ou des sœurs ?',
      animals: 'Salut ! J’adore les animaux. Quel est ton animal préféré ?',
    };

    return greetings[id] || 'Bonjour ! Commençons à parler français !';
  }

  async function sendMessage() {
    if (!input.trim() || loading || !selectedScenario) return;

    const userMessage = {
      speaker: 'you',
      text: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];

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
        throw new Error(data.error || 'Something went wrong.');
      }

      const tutorMessage = {
        speaker: 'tutor',
        text: data.reply,
      };

      setMessages((current) => [...current, tutorMessage]);

      speakFrench(data.reply);

      setXp((current) => Math.min(current + 10, 9999));
    } catch (error) {
      console.error(error);

      const errorMessage = {
        speaker: 'tutor',
        text: 'Oops! Something went wrong. Let’s try again!',
      };

      setMessages((current) => [...current, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  function speakFrench(text) {
    if (typeof window === 'undefined') return;
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.88;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();

    const frenchVoice = voices.find((voice) =>
      voice.lang.toLowerCase().startsWith('fr')
    );

    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  function restartMission() {
    if (!selectedScenario) return;

    setMessages([]);
    setInput('');
    setShowIntro(true);
  }

  function finishMission() {
    if (selectedScenario) {
      setCompleted((current) => {
        const updated = new Set(current);
        updated.add(selectedScenario.id);
        return updated;
      });

      setXp((current) => current + 25);
    }

    setSelectedScenario(null);
    setMessages([]);
    setInput('');
    setShowIntro(false);
  }

  if (selectedScenario) {
    return (
      <main className="app">
        <style>{styles}</style>

        <div className="topBar">
          <button
            className="backButton"
            onClick={() => {
              setSelectedScenario(null);
              setMessages([]);
              setShowIntro(false);
            }}
          >
            ← Missions
          </button>

          <div className="topStats">
            <div className="stat">
              ⭐ <strong>{xp}</strong> XP
            </div>

            <div className="levelStat">
              🏆 Level {level}
            </div>
          </div>
        </div>

        {showIntro ? (
          <section className="missionIntro">
            <div
              className="bigMissionIcon"
              style={{ background: selectedScenario.color }}
            >
              {selectedScenario.icon}
            </div>

            <div className="mascotBig">
              🐱
            </div>

            <div className="introBubble">
              <div className="bubbleName">Mimi 🐱</div>
              <h1>Ready for a mission?</h1>
              <p>{selectedScenario.description}</p>
            </div>

            <div className="missionPreview">
              <div>
                <span>🎯</span>
                <strong>Your mission</strong>
                <small>Have a simple conversation in French</small>
              </div>

              <div>
                <span>⭐</span>
                <strong>Earn XP</strong>
                <small>Get 10 XP for each answer</small>
              </div>

              <div>
                <span>🏆</span>
                <strong>Have fun!</strong>
                <small>There are no wrong answers here</small>
              </div>
            </div>

            <button className="startButton" onClick={beginMission}>
              🚀 Start Mission
            </button>

            <button className="smallBack" onClick={() => setSelectedScenario(null)}>
              Maybe later
            </button>
          </section>
        ) : (
          <section className="conversationPage">
            <div className="missionHeader">
              <div
                className="missionIconSmall"
                style={{ background: selectedScenario.color }}
              >
                {selectedScenario.icon}
              </div>

              <div>
                <div className="missionLabel">CURRENT MISSION</div>
                <h1>{selectedScenario.name}</h1>
              </div>

              <div className="missionXp">
                ⭐ +10 XP
              </div>
            </div>

            <div className="conversation">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`messageRow ${
                    message.speaker === 'you' ? 'youRow' : 'tutorRow'
                  }`}
                >
                  {message.speaker === 'tutor' && (
                    <div className="avatar tutorAvatar">🐱</div>
                  )}

                  <div
                    className={`messageBubble ${
                      message.speaker === 'you'
                        ? 'userBubble'
                        : 'tutorBubble'
                    }`}
                  >
                    {message.speaker === 'tutor' && (
                      <div className="bubbleLabel">Mimi</div>
                    )}

                    {message.text}

                    {message.speaker === 'tutor' && (
                      <button
                        className="listenButton"
                        onClick={() => speakFrench(message.text)}
                      >
                        🔊 Listen
                      </button>
                    )}
                  </div>

                  {message.speaker === 'you' && (
                    <div className="avatar userAvatar">😎</div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="messageRow tutorRow">
                  <div className="avatar tutorAvatar">🐱</div>

                  <div className="messageBubble tutorBubble typing">
                    <div className="bubbleLabel">Mimi</div>
                    <span>•</span>
                    <span>•</span>
                    <span>•</span>
                  </div>
                </div>
              )}
            </div>

            <div className="inputArea">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    sendMessage();
                  }
                }}
                placeholder="Type your answer in French..."
                disabled={loading}
              />

              <button
                className="sendButton"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
              >
                Send 🚀
              </button>
            </div>

            <div className="conversationActions">
              <button onClick={restartMission}>
                🔄 Restart
              </button>

              <button onClick={finishMission}>
                🏁 Finish Mission
              </button>
            </div>
          </section>
        )}
      </main>
    );
  }

  return (
    <main className="app">
      <style>{styles}</style>

      <div className="home">
        <header className="hero">
          <div className="brand">
            <div className="flag">🇫🇷</div>
            <div>
              <div className="brandName">FRENCH ADVENTURE</div>
              <div className="brandTagline">
                Learn French. Have fun. ⭐
              </div>
            </div>
          </div>

          <div className="profileStats">
            <div className="xpBox">
              ⭐ <strong>{xp}</strong>
              <span>XP</span>
            </div>

            <div className="levelBox">
              🏆
              <div>
                <strong>Level {level}</strong>
                <div className="levelProgress">
                  <div style={{ width: `${levelXp}%` }} />
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="welcome">
          <div className="welcomeMascot">
            <div className="mascotCircle">
              🐱
            </div>

            <div className="floatingEmoji one">⭐</div>
            <div className="floatingEmoji two">🇫🇷</div>
            <div className="floatingEmoji three">🥐</div>
          </div>

          <div className="welcomeText">
            <div className="speechBubble">
              <span className="bubbleTiny">Mimi says:</span>
              <h1>Bonjour! 👋</h1>
              <p>Ready for your next French adventure?</p>
            </div>
          </div>
        </section>

        <section className="missionsSection">
          <div className="sectionTitle">
            <div>
              <span className="eyebrow">YOUR ADVENTURE</span>
              <h2>🗺️ Choose a Mission</h2>
            </div>

            <div className="missionCount">
              {completed.size}/{scenarios.length} complete ⭐
            </div>
          </div>

          <div className="missionGrid">
            {scenarios.map((scenario, index) => {
              const isComplete = completed.has(scenario.id);

              return (
                <button
                  key={scenario.id}
                  className={`scenarioCard ${
                    isComplete ? 'completedCard' : ''
                  }`}
                  onClick={() => startScenario(scenario)}
                >
                  <div
                    className="cardTop"
                    style={{ background: scenario.color }}
                  >
                    <div className="scenarioIcon">
                      {scenario.icon}
                    </div>

                    <div className="cardMascot">
                      {scenario.mascot}
                    </div>

                    {isComplete && (
                      <div className="completedBadge">✓</div>
                    )}
                  </div>

                  <div className="cardContent">
                    <div className="missionNumber">
                      MISSION {index + 1}
                    </div>

                    <h3>{scenario.name}</h3>

                    <p>{scenario.description}</p>

                    <div className="cardFooter">
                      <span>🌟 Beginner</span>

                      <span className="playArrow">
                        {isComplete ? '✓ Done' : 'Play →'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="bottomAdventure">
          <div className="progressCharacter">🐱</div>

          <div className="progressText">
            <strong>Keep going, explorer!</strong>
            <span>
              Complete missions to earn XP and unlock new adventures.
            </span>
          </div>

          <div className="stars">
            ⭐ ⭐ ⭐
          </div>
        </section>
      </div>
    </main>
  );
}

const styles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #fffaf2;
  }

  button,
  input {
    font-family: inherit;
  }

  button {
    cursor: pointer;
  }

  .app {
    min-height: 100vh;
    background:
      radial-gradient(circle at 10% 10%, rgba(255, 209, 102, 0.35), transparent 25%),
      radial-gradient(circle at 90% 15%, rgba(123, 223, 242, 0.35), transparent 25%),
      radial-gradient(circle at 50% 100%, rgba(199, 184, 255, 0.25), transparent 30%),
      #fffaf2;
    color: #25243a;
  }

  .home {
    width: min(1100px, 92%);
    margin: 0 auto;
    padding: 28px 0 50px;
  }

  .hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .flag {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    font-size: 29px;
    box-shadow: 0 6px 20px rgba(60, 50, 80, 0.1);
  }

  .brandName {
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 1.5px;
  }

  .brandTagline {
    font-size: 13px;
    color: #77748a;
    margin-top: 3px;
  }

  .profileStats {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .xpBox,
  .levelBox {
    background: white;
    border-radius: 18px;
    padding: 10px 15px;
    box-shadow: 0 5px 18px rgba(60, 50, 80, 0.08);
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .xpBox {
    color: #d28b00;
  }

  .xpBox span {
    color: #9995a7;
    font-size: 11px;
    font-weight: 700;
  }

  .levelBox {
    color: #7d65d8;
  }

  .levelBox strong {
    display: block;
    font-size: 12px;
  }

  .levelProgress {
    width: 70px;
    height: 5px;
    background: #eeeaf8;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 4px;
  }

  .levelProgress div {
    height: 100%;
    background: #9b83f5;
    border-radius: 10px;
    transition: width 0.4s ease;
  }

  .welcome {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 45px;
    padding: 55px 20px 45px;
  }

  .welcomeMascot {
    position: relative;
  }

  .mascotCircle {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: linear-gradient(145deg, #ffe28a, #ffc95c);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 83px;
    box-shadow:
      0 12px 0 #e9b94f,
      0 20px 35px rgba(80, 60, 30, 0.12);
    transform: rotate(-3deg);
  }

  .floatingEmoji {
    position: absolute;
    font-size: 27px;
    animation: float 2.8s ease-in-out infinite;
  }

  .floatingEmoji.one {
    top: -18px;
    right: -15px;
  }

  .floatingEmoji.two {
    bottom: 15px;
    left: -30px;
    animation-delay: .5s;
  }

  .floatingEmoji.three {
    top: 45px;
    right: -45px;
    animation-delay: 1s;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-8px);
    }
  }

  .speechBubble {
    background: white;
    border-radius: 25px;
    padding: 24px 30px;
    box-shadow: 0 12px 35px rgba(60, 50, 80, 0.1);
    position: relative;
    min-width: 330px;
  }

  .speechBubble::before {
    content: "";
    position: absolute;
    left: -14px;
    top: 45px;
    width: 28px;
    height: 28px;
    background: white;
    transform: rotate(45deg);
  }

  .bubbleTiny {
    color: #8a84a0;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .speechBubble h1 {
    margin: 5px 0;
    font-size: 36px;
    color: #302d4b;
  }

  .speechBubble p {
    margin: 0;
    color: #77748a;
    font-size: 16px;
  }

  .missionsSection {
    margin-top: 10px;
  }

  .sectionTitle {
    display: flex;
    align-items: end;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .eyebrow {
    font-size: 11px;
    font-weight: 900;
    color: #9a94a9;
    letter-spacing: 1.5px;
  }

  .sectionTitle h2 {
    margin: 4px 0 0;
    font-size: 27px;
  }

  .missionCount {
    background: #fff;
    border-radius: 14px;
    padding: 9px 13px;
    color: #77748a;
    font-size: 13px;
    font-weight: 700;
  }

  .missionGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }

  .scenarioCard {
    border: 0;
    padding: 0;
    overflow: hidden;
    border-radius: 24px;
    background: white;
    text-align: left;
    box-shadow: 0 8px 25px rgba(60, 50, 80, 0.09);
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease;
  }

  .scenarioCard:hover {
    transform: translateY(-6px) rotate(-0.5deg);
    box-shadow: 0 15px 32px rgba(60, 50, 80, 0.15);
  }

  .scenarioCard:active {
    transform: translateY(-2px);
  }

  .cardTop {
    height: 145px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .scenarioIcon {
    font-size: 70px;
    filter: drop-shadow(0 5px 2px rgba(0,0,0,.08));
    z-index: 2;
  }

  .cardMascot {
    position: absolute;
    right: 17px;
    bottom: 12px;
    font-size: 31px;
    transform: rotate(8deg);
  }

  .completedBadge {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #61c879;
    color: white;
    font-size: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    box-shadow: 0 3px 8px rgba(0,0,0,.15);
  }

  .cardContent {
    padding: 18px 19px 19px;
  }

  .missionNumber {
    font-size: 9px;
    color: #aaa5b4;
    font-weight: 900;
    letter-spacing: 1.2px;
  }

  .cardContent h3 {
    margin: 5px 0 4px;
    font-size: 20px;
  }

  .cardContent p {
    margin: 0;
    color: #77748a;
    font-size: 13px;
    line-height: 1.4;
    min-height: 37px;
  }

  .cardFooter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    font-size: 11px;
    font-weight: 800;
  }

  .cardFooter > span:first-child {
    color: #8b8797;
  }

  .playArrow {
    color: #6f5ac9;
  }

  .completedCard .cardContent h3 {
    color: #61a96f;
  }

  .bottomAdventure {
    margin-top: 28px;
    background: linear-gradient(100deg, #fff, #fff8df);
    border-radius: 23px;
    padding: 17px 22px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 7px 22px rgba(60, 50, 80, 0.06);
  }

  .progressCharacter {
    font-size: 39px;
  }

  .progressText {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
  }

  .progressText strong {
    font-size: 14px;
  }

  .progressText span {
    font-size: 12px;
    color: #888496;
  }

  .stars {
    font-size: 18px;
    white-space: nowrap;
  }

  /* Mission intro */

  .missionIntro {
    width: min(680px, 92%);
    margin: 45px auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .bigMissionIcon {
    width: 125px;
    height: 125px;
    border-radius: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 68px;
    box-shadow: 0 10px 0 rgba(0,0,0,.08);
    margin-bottom: -25px;
    z-index: 2;
  }

  .mascotBig {
    font-size: 54px;
    position: relative;
    align-self: flex-end;
    margin-right: 80px;
    margin-bottom: -22px;
    z-index: 3;
  }

  .introBubble {
    background: white;
    border-radius: 28px;
    padding: 30px 35px;
    width: 100%;
    box-shadow: 0 12px 35px rgba(60, 50, 80, 0.1);
  }

  .bubbleName {
    color: #8b7bd4;
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .introBubble h1 {
    margin: 6px 0;
    font-size: 34px;
  }

  .introBubble p {
    margin: 0;
    color: #77748a;
    font-size: 17px;
  }

  .missionPreview {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 20px 0;
  }

  .missionPreview > div {
    background: rgba(255,255,255,.8);
    border-radius: 18px;
    padding: 15px 10px;
  }

  .missionPreview span {
    display: block;
    font-size: 26px;
    margin-bottom: 7px;
  }

  .missionPreview strong {
    display: block;
    font-size: 12px;
  }

  .missionPreview small {
    display: block;
    color: #9290a0;
    font-size: 10px;
    margin-top: 4px;
  }

  .startButton {
    border: 0;
    border-radius: 18px;
    background: #705bd0;
    color: white;
    font-size: 17px;
    font-weight: 900;
    padding: 15px 35px;
    box-shadow: 0 6px 0 #5141a2;
    transition: all .15s ease;
  }

  .startButton:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 0 #5141a2;
  }

  .startButton:active {
    transform: translateY(4px);
    box-shadow: 0 2px 0 #5141a2;
  }

  .smallBack {
    border: 0;
    background: transparent;
    color: #8d8998;
    margin-top: 17px;
    font-size: 12px;
  }

  /* Conversation */

  .conversationPage {
    width: min(820px, 92%);
    margin: 30px auto;
  }

  .topBar {
    width: min(1100px, 92%);
    margin: 0 auto;
    padding-top: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .backButton {
    border: 0;
    background: white;
    border-radius: 14px;
    padding: 10px 15px;
    color: #625e72;
    font-weight: 700;
    box-shadow: 0 5px 15px rgba(60, 50, 80, .07);
  }

  .topStats {
    display: flex;
    gap: 8px;
  }

  .stat,
  .levelStat {
    background: white;
    padding: 9px 13px;
    border-radius: 14px;
    font-size: 12px;
    box-shadow: 0 5px 15px rgba(60, 50, 80, .07);
  }

  .levelStat {
    color: #765fd1;
  }

  .missionHeader {
    background: white;
    border-radius: 23px;
    padding: 15px 18px;
    display: flex;
    align-items: center;
    gap: 13px;
    box-shadow: 0 7px 22px rgba(60, 50, 80, .07);
  }

  .missionIconSmall {
    width: 55px;
    height: 55px;
    border-radius: 17px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
  }

  .missionLabel {
    color: #aaa5b4;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 1px;
  }

  .missionHeader h1 {
    margin: 3px 0 0;
    font-size: 21px;
  }

  .missionXp {
    margin-left: auto;
    background: #fff5d2;
    color: #bd8500;
    border-radius: 12px;
    padding: 8px 10px;
    font-size: 11px;
    font-weight: 900;
  }

  .conversation {
    padding: 28px 5px;
    min-height: 420px;
  }

  .messageRow {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    margin-bottom: 18px;
  }

  .youRow {
    justify-content: flex-end;
  }

  .avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }

  .tutorAvatar {
    background: #ffe08a;
  }

  .userAvatar {
    background: #c9baff;
  }

  .messageBubble {
    max-width: 72%;
    padding: 14px 17px;
    border-radius: 20px;
    font-size: 15px;
    line-height: 1.5;
  }

  .tutorBubble {
    background: white;
    border-bottom-left-radius: 5px;
    box-shadow: 0 6px 18px rgba(60, 50, 80, .08);
  }

  .userBubble {
    background: #705bd0;
    color: white;
    border-bottom-right-radius: 5px;
  }

  .bubbleLabel {
    color: #7867c6;
    font-size: 10px;
    font-weight: 900;
    margin-bottom: 3px;
  }

  .listenButton {
    display: block;
    border: 0;
    background: #f2efff;
    color: #6c58c1;
    border-radius: 10px;
    padding: 6px 9px;
    margin-top: 10px;
    font-size: 10px;
    font-weight: 800;
  }

  .typing {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .typing span {
    animation: typing 1s infinite;
    font-weight: 900;
  }

  .typing span:nth-child(2) {
    animation-delay: .15s;
  }

  .typing span:nth-child(3) {
    animation-delay: .3s;
  }

  @keyframes typing {
    0%, 60%, 100% {
      opacity: .3;
      transform: translateY(0);
    }

    30% {
      opacity: 1;
      transform: translateY(-3px);
    }
  }

  .inputArea {
    display: flex;
    gap: 9px;
    background: white;
    padding: 9px;
    border-radius: 18px;
    box-shadow: 0 7px 22px rgba(60, 50, 80, .09);
  }

  .inputArea input {
    flex: 1;
    border: 0;
    outline: 0;
    padding: 10px 12px;
    font-size: 14px;
    min-width: 0;
  }

  .inputArea input::placeholder {
    color: #aaa7b2;
  }

  .sendButton {
    border: 0;
    border-radius: 13px;
    background: #705bd0;
    color: white;
    padding: 10px 17px;
    font-weight: 800;
  }

  .sendButton:disabled {
    opacity: .45;
    cursor: default;
  }

  .conversationActions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 16px;
  }

  .conversationActions button {
    border: 0;
    background: transparent;
    color: #858191;
    font-size: 11px;
    font-weight: 700;
  }

  @media (max-width: 800px) {
    .missionGrid {
      grid-template-columns: repeat(2, 1fr);
    }

    .welcome {
      gap: 25px;
    }

    .mascotCircle {
      width: 120px;
      height: 120px;
      font-size: 65px;
    }
  }

  @media (max-width: 600px) {
    .home {
      width: 94%;
    }

    .hero {
      align-items: flex-start;
    }

    .profileStats {
      flex-direction: column;
      align-items: stretch;
    }

    .xpBox,
    .levelBox {
      padding: 7px 10px;
    }

    .welcome {
      padding: 35px 0;
      flex-direction: column;
    }

    .speechBubble {
      min-width: 0;
      width: 100%;
      text-align: center;
    }

    .speechBubble::before {
      left: 50%;
      top: -9px;
      transform: rotate(45deg);
    }

    .speechBubble h1 {
      font-size: 30px;
    }

    .missionGrid {
      grid-template-columns: 1fr;
    }

    .missionPreview {
      grid-template-columns: 1fr;
    }

    .missionHeader {
      padding: 12px;
    }

    .missionXp {
      display: none;
    }

    .messageBubble {
      max-width: 78%;
    }

    .topStats {
      display: none;
    }

    .bottomAdventure {
      padding: 14px;
    }

    .stars {
      display: none;
    }
  }
`;
