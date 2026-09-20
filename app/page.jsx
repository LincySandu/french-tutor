'use client';

import React, { useState, useRef, useEffect } from 'react';

const FrenchTutor = () => {
const [currentScenario, setCurrentScenario] = useState(null);
const [dialogue, setDialogue] = useState([]);
const [userInput, setUserInput] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [completed, setCompleted] = useState(new Set());
const [error, setError] = useState('');
const dialogueEndRef = useRef(null);

const scenarios = [
{
id: 'cafe',
name: '☕ At the Café',
description: 'Order something to eat or drink',
context:
"You're at a French café. The server says hello and asks what you'd like to order.",
firstPrompt: "Bonjour! Qu'est-ce que je peux faire pour toi?",
},
{
id: 'classroom',
name: '✏️ In Class',
description: 'Introduce yourself to a classmate',
context:
'A new student sits next to you. You want to get to know them.',
firstPrompt: "Bonjour! Comment t'appelles-tu?",
},
{
id: 'park',
name: '🌳 At the Park',
description: 'Ask someone about their hobbies',
context:
'You meet a French kid at the park. You want to know what games they like.',
firstPrompt:
'Salut! Tu joues souvent au parc? Quels sont tes jeux préférés?',
},
{
id: 'family',
name: '👨‍👩‍👧‍👦 About Your Family',
description: 'Describe your family members',
context:
'Your pen pal asks about your family. Tell them about someone.',
firstPrompt:
'Tu as une famille? Raconte-moi un peu! Tes parents, tes frères et sœurs?',
},
{
id: 'animals',
name: '🐶 About Animals',
description: 'Talk about animals you like',
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
setCurrentScenario(idx);
setDialogue([
{
speaker: 'scenario',
text: scenarios[idx].firstPrompt,
},
]);
setUserInput('');
setError('');
};

const sendMessage = async () => {
if (!userInput.trim()) {
setError('Please type something first!');
return;
}

```
const userMessage = userInput.trim();

setDialogue((prev) => [
  ...prev,
  {
    speaker: 'user',
    text: userMessage,
  },
]);

setUserInput('');
setError('');
setIsLoading(true);

try {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const fallbackResponses = [
    'Très bien! Peux-tu me dire pourquoi?',
    'Super! Et toi, qu’est-ce que tu préfères?',
    'Bravo! Peux-tu faire une autre phrase?',
    'Très bien! Continue comme ça!',
  ];

  const response =
    fallbackResponses[
      Math.floor(Math.random() * fallbackResponses.length)
    ];

  setDialogue((prev) => [
    ...prev,
    {
      speaker: 'scenario',
      text: response,
    },
  ]);

  setCompleted((prev) => {
    const updated = new Set(prev);
    updated.add(scenarios[currentScenario].id);
    return updated;
  });
} catch (err) {
  setError('Something went wrong. Please try again.');
} finally {
  setIsLoading(false);
}
```

};

const resetScenario = () => {
if (currentScenario === null) return;

```
setDialogue([
  {
    speaker: 'scenario',
    text: scenarios[currentScenario].firstPrompt,
  },
]);

setUserInput('');
setError('');
```

};

return (
<main
style={{
minHeight: '100vh',
background: '#f5f7fb',
padding: '40px 20px',
fontFamily: 'Arial, sans-serif',
}}
>
<div
style={{
maxWidth: '900px',
margin: '0 auto',
}}
>
<header
style={{
textAlign: 'center',
marginBottom: '35px',
}}
>
<h1
style={{
fontSize: '42px',
marginBottom: '10px',
color: '#1f2937',
}}
>
🇫🇷 French Tutor </h1>

```
      <p
        style={{
          fontSize: '18px',
          color: '#6b7280',
        }}
      >
        Practice French through fun conversations!
      </p>
    </header>

    {currentScenario === null ? (
      <section>
        <h2
          style={{
            textAlign: 'center',
            color: '#1f2937',
            marginBottom: '25px',
          }}
        >
          Choose a scenario
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '18px',
          }}
        >
          {scenarios.map((scenario, index) => (
            <button
              key={scenario.id}
              onClick={() => startScenario(index)}
              style={{
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                background: 'white',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  marginBottom: '10px',
                  color: '#111827',
                }}
              >
                {scenario.name}
              </div>

              <div
                style={{
                  color: '#6b7280',
                  lineHeight: '1.5',
                }}
              >
                {scenario.description}
              </div>

              {completed.has(scenario.id) && (
                <div
                  style={{
                    marginTop: '12px',
                    color: '#16a34a',
                    fontWeight: '600',
                  }}
                >
                  ✓ Completed
                </div>
              )}
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
            gap: '10px',
          }}
        >
          <button
            onClick={() => setCurrentScenario(null)}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#2563eb',
              fontWeight: '600',
            }}
          >
            ← Back to scenarios
          </button>

          <button
            onClick={resetScenario}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            Restart
          </button>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: '18px',
            padding: '25px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.07)',
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: '#111827',
            }}
          >
            {scenarios[currentScenario].name}
          </h2>

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
                  display: 'flex',
                  justifyContent:
                    message.speaker === 'user'
                      ? 'flex-end'
                      : 'flex-start',
                  marginBottom: '14px',
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '13px 16px',
                    borderRadius: '14px',
                    background:
                      message.speaker === 'user'
                        ? '#2563eb'
                        : '#f3f4f6',
                    color:
                      message.speaker === 'user'
                        ? 'white'
                        : '#111827',
                    lineHeight: '1.5',
                  }}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div
                style={{
                  color: '#6b7280',
                  padding: '10px',
                }}
              >
                Thinking...
              </div>
            )}

            <div ref={dialogueEndRef} />
          </div>

          {error && (
            <div
              style={{
                color: '#dc2626',
                marginBottom: '10px',
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: '15px',
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
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '16px',
              }}
            />

            <button
              onClick={sendMessage}
              disabled={isLoading}
              style={{
                padding: '14px 22px',
                borderRadius: '10px',
                border: 'none',
                background: '#2563eb',
                color: 'white',
                cursor: isLoading ? 'default' : 'pointer',
                fontWeight: '700',
              }}
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </section>
    )}
  </div>
</main>
```

);
};

export default FrenchTutor;
