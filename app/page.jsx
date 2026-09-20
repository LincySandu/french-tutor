'use client';

import React, { useState, useRef, useEffect } from 'react';

const FrenchTutor = () => {
  const [currentScenario, setCurrentScenario] = useState(null);
  const [dialogue, setDialogue] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [completed, setCompleted] = useState(new Set());
  const [error, setError] = useState('');
  const dialogueEndRef = useRef(null);

  const scenarios = [
    {
      id: 'cafe',
      emoji: '☕',
      name: 'At the Café',
      description: 'Order something to eat or drink',
      level: 'Beginner',
      context:
        "You're at a French café. The server says hello and asks what you'd like to order.",
      firstPrompt: "Bonjour! Qu'est-ce que je peux faire pour toi?",
    },
    {
      id: 'classroom',
      emoji: '✏️',
      name: 'In Class',
      description: 'Introduce yourself to a classmate',
      level: 'Beginner',
      context:
        'A new student sits next to you. You want to get to know them.',
      firstPrompt: "Bonjour! Comment t'appelles-tu?",
    },
    {
      id: 'park',
      emoji: '🌳',
      name: 'At the Park',
      description: 'Talk about your favourite games',
      level: 'Beginner',
      context:
        'You meet a French kid at the park. You want to know what games they like.',
      firstPrompt:
        'Salut! Tu joues souvent au parc? Quels sont tes jeux préférés?',
    },
    {
      id: 'family',
      emoji: '👨‍👩‍👧‍👦',
      name: 'My Family',
      description: 'Talk about your family',
      level: 'Beginner',
      context:
        'Your pen pal asks about your family. Tell them about someone.',
      firstPrompt:
        'Tu as une famille? Raconte-moi un peu! Tes parents, tes frères et sœurs?',
    },
    {
      id: 'animals',
      emoji: '🐶',
      name: 'Animals',
      description: 'Talk about animals you like',
      level: 'Beginner',
      context:
        'Your friend asks what animals you like and why.',
      firstPrompt:
        "J'adore les animaux! Quel est ton animal préféré? Pourquoi?",
    },
  ];

  const scrollToBottom = () => {
    dialogueEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [dialogue]);

  const startScenario = (idx) => {
    window.speechSynthesis?.cancel();

    setCurrentScenario(idx);
    setDialogue([
      {
        speaker: 'scenario',
        text: scenarios[idx].firstPrompt,
      },
    ]);
    setUserInput('');
    setError('');
    setIsSpeaking(false);
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      setError('Your browser does not support text-to-speech.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = 'fr-FR';
    utterance.rate = 0.85;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();

    const frenchVoice = voices.find(
      (voice) =>
        voice.lang &&
        voice.lang.toLowerCase().startsWith('fr')
    );

    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setError('');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsSpeaking(false);
      setError('The French voice could not be played.');
    };

    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) {
      setError('Please type something first!');
      return;
    }

    const userMessage = userInput.trim();

    const updatedDialogue = [
      ...dialogue,
      {
        speaker: 'user',
        text: userMessage,
      },
    ];

    setDialogue(updatedDialogue);
    setUserInput('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: scenarios[currentScenario].context,
          messages: updatedDialogue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setDialogue((prev) => [
        ...prev,
        {
          speaker: 'scenario',
          text: data.reply,
        },
      ]);

      setCompleted((prev) => {
        const updated = new Set(prev);
        updated.add(scenarios[currentScenario].id);
        return updated;
      });
    } catch (err) {
      console.error(err);
      setError(
        err.message || 'Sorry, something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetScenario = () => {
    if (currentScenario === null) return;

    window.speechSynthesis?.cancel();

    setDialogue([
      {
        speaker: 'scenario',
        text: scenarios[currentScenario].firstPrompt,
      },
    ]);

    setUserInput('');
    setError('');
    setIsSpeaking(false);
  };

  const current = currentScenario !== null
    ? scenarios[currentScenario]
    : null;

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #ecfeff 100%)',
        padding: '30px 20px 60px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <header
          style={{
            textAlign: 'center',
            marginBottom: '35px',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              background: 'white',
              padding: '8px 16px',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: '700',
              color: '#4f46e5',
              marginBottom: '15px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            🇫🇷 French Adventure
          </div>

          <h1
            style={{
              fontSize: '46px',
              margin: '0 0 10px',
              color: '#111827',
            }}
          >
            Learn French by Talking!
          </h1>

          <p
            style={{
              fontSize: '18px',
              color: '#64748b',
              margin: 0,
            }}
          >
            Choose a mission and start speaking French.
          </p>
        </header>

        {currentScenario === null ? (
          <section>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: '#111827',
                    fontSize: '28px',
                  }}
                >
                  🎯 Choose your mission
                </h2>

                <p
                  style={{
                    margin: '6px 0 0',
                    color: '#64748b',
                  }}
                >
                  Pick a situation and practise your French.
                </p>
              </div>

              <div
                style={{
                  background: 'white',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  color: '#f59e0b',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}
              >
                ⭐ {completed.size} / {scenarios.length}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '20px',
              }}
            >
              {scenarios.map((scenario, index) => (
                <button
                  key={scenario.id}
                  onClick={() => startScenario(index)}
                  style={{
                    padding: '24px',
                    borderRadius: '20px',
                    border: '2px solid transparent',
                    background: 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.07)',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '42px',
                        marginBottom: '15px',
                      }}
                    >
                      {scenario.emoji}
                    </div>

                    {completed.has(scenario.id) && (
                      <div
                        style={{
                          background: '#dcfce7',
                          color: '#15803d',
                          padding: '5px 9px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: '700',
                        }}
                      >
                        ✓ Done
                      </div>
                    )}
                  </div>

                  <h3
                    style={{
                      fontSize: '23px',
                      margin: '0 0 8px',
                      color: '#111827',
                    }}
                  >
                    {scenario.name}
                  </h3>

                  <p
                    style={{
                      color: '#64748b',
                      lineHeight: '1.5',
                      margin: '0 0 18px',
                    }}
                  >
                    {scenario.description}
                  </p>

                  <div
                    style={{
                      display: 'inline-block',
                      background: '#eef2ff',
                      color: '#4f46e5',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                    }}
                  >
                    ⭐ {scenario.level}
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setIsSpeaking(false);
                  setCurrentScenario(null);
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#4f46e5',
                  fontWeight: '700',
                  fontSize: '15px',
                }}
              >
                ← All missions
              </button>

              <button
                onClick={resetScenario}
                style={{
                  padding: '9px 15px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                🔄 Restart
              </button>
            </div>

            <div
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '30px',
                boxShadow: '0 10px 35px rgba(0,0,0,0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '25px',
                }}
              >
                <div
                  style={{
                    fontSize: '48px',
                    background: '#eef2ff',
                    width: '75px',
                    height: '75px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {current.emoji}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#4f46e5',
                      fontWeight: '700',
                      marginBottom: '4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Mission
                  </div>

                  <h2
                    style={{
                      margin: 0,
                      color: '#111827',
                      fontSize: '28px',
                    }}
                  >
                    {current.name}
                  </h2>
                </div>
              </div>

              <div
                style={{
                  minHeight: '350px',
                  maxHeight: '500px',
                  overflowY: 'auto',
                  padding: '10px 0',
                }}
              >
                {dialogue.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '18px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          message.speaker === 'user'
                            ? 'flex-end'
                            : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '75%',
                          padding: '15px 18px',
                          borderRadius:
                            message.speaker === 'user'
                              ? '18px 18px 4px 18px'
                              : '18px 18px 18px 4px',
                          background:
                            message.speaker === 'user'
                              ? '#4f46e5'
                              : '#f1f5f9',
                          color:
                            message.speaker === 'user'
                              ? 'white'
                              : '#111827',
                          lineHeight: '1.6',
                          fontSize: '16px',
                        }}
                      >
                        {message.text}
                      </div>
                    </div>

                    {message.speaker === 'scenario' && (
                      <button
                        onClick={() => speakText(message.text)}
                        disabled={isSpeaking}
                        style={{
                          marginTop: '8px',
                          padding: '8px 13px',
                          borderRadius: '9px',
                          border: '1px solid #d1d5db',
                          background: 'white',
                          cursor: isSpeaking
                            ? 'default'
                            : 'pointer',
                          color: '#374151',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {isSpeaking
                          ? '🔊 Playing...'
                          : '🔊 Listen'}
                      </button>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div
                    style={{
                      color: '#64748b',
                      padding: '10px',
                      fontStyle: 'italic',
                    }}
                  >
                    🤔 Thinking...
                  </div>
                )}

                <div ref={dialogueEndRef} />
              </div>

              {error && (
                <div
                  style={{
                    color: '#dc2626',
                    marginBottom: '12px',
                    padding: '10px',
                    background: '#fef2f2',
                    borderRadius: '8px',
                    wordBreak: 'break-word',
                  }}
                >
                  {error}
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginTop: '20px',
                }}
              >
                <input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      sendMessage();
                    }
                  }}
                  placeholder="Write your answer in French..."
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '15px',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    fontSize: '16px',
                    outline: 'none',
                  }}
                />

                <button
                  onClick={sendMessage}
                  disabled={isLoading}
                  style={{
                    padding: '15px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#4f46e5',
                    color: 'white',
                    cursor: isLoading
                      ? 'default'
                      : 'pointer',
                    fontWeight: '700',
                    fontSize: '16px',
                  }}
                >
                  {isLoading ? '...' : 'Send →'}
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default FrenchTutor;
