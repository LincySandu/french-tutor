'use client';

import React, { useState, useRef, useEffect } from 'react';

const FrenchTutor = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
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
      context: 'You\'re at a French café. The server says hello and asks what you\'d like to order.',
      firstPrompt: 'Bonjour! Qu\'est-ce que je peux faire pour toi?',
    },
    {
      id: 'classroom',
      name: '✏️ In Class',
      description: 'Introduce yourself to a classmate',
      context: 'A new student sits next to you. You want to get to know them.',
      firstPrompt: 'Bonjour! Comment t\'appelles-tu?',
    },
    {
      id: 'park',
      name: '🌳 At the Park',
      description: 'Ask someone about their hobbies',
      context: 'You meet a French kid at the park. You want to know what games they like.',
      firstPrompt: 'Salut! Tu joues souvent au parc? Quels sont tes jeux préférés?',
    },
    {
      id: 'family',
      name: '👨‍👩‍👧‍👦 About Your Family',
      description: 'Describe your family members',
      context: 'Your pen pal asks about your family. Tell them about someone.',
      firstPrompt: 'Tu as une famille? Raconte-moi un peu! Tes parents, tes frères et sœurs?',
    },
    {
      id: 'animals',
      name: '🐶 About Animals',
      description: 'Talk about animals you like',
      context: 'Your friend asks what animals you like and why.',
      firstPrompt: 'J\'adore les animaux! Quel est ton animal préféré? Pourquoi?',
    },
  ];

  const scrollToBottom = () => {
    dialogueEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [dialogue]);

  const startScenario = async (idx) => {
    setCurrentScenario(idx);
    setDialogue([
      { speaker: 'scenario', text: scenarios[idx].firstPrompt }
    ]);
    setUserInput('');
    setError('');
  };

  const sendMessage = async () => {
    if (!userInput.trim()) {
      setError('Please type something first!');
      return;
    }

    const userMessage = userInput.trim();
    setDialogue(prev => [...prev, { speaker: 'user', text: userMessage }]);
    setUserInput('');
    setError('');
    setIsLoading(true);

    try {
      const systemPrompt = `You are a patient, encouraging French tutor for a 9-year-old beginner learning French. 
      
The child knows basic verbs and simple sentences. Current scenario: ${scenarios[currentScenario].context}

Your role:
1. Evaluate their French response (grammar, vocabulary, correctness)
2. Give warm, specific feedback (what they did well, gentle correction if needed)
3. Continue the conversation naturally in French
4. Use simple vocabulary appropriate for a beginner
5. Ask follow-up questions to build confidence
6. Celebrate effort and progress

Format your response as:
[FEEDBACK] Your feedback here (1-2 sentences)
[RESPONSE] Your French response here (keep it short and simple for them to understand)
[HINT] A helpful tip if they made a mistake (optional)

Keep the conversation flowing naturally. Be enthusiastic but honest.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 500,
          system: systemPrompt,
          messages: dialogue.filter(m => m.speaker !== 'scenario').map(m => ({
            role: m.speaker === 'user' ? 'user' : 'assistant',
            content: m.text
          })).concat([
            { role: 'user', content: userMessage }
          ])
        })
      });

      const data = await response.json();
      const fullResponse = data.content[0].text;

      const feedbackMatch = fullResponse.match(/\[FEEDBACK\](.*?)\n/s);
      const responseMatch = fullResponse.match(/\[RESPONSE\](.*?)\n/s);
      const hintMatch = fullResponse.match(/\[HINT\](.*?)(\n|$)/s);

      const feedback = feedbackMatch ? feedbackMatch[1].trim() : '';
      const tutorResponse = responseMatch ? responseMatch[1].trim() : fullResponse;
      const hint = hintMatch ? hintMatch[1].trim() : '';

      if (feedback) {
        setDialogue(prev => [...prev, 
          { speaker: 'feedback', text: feedback },
          { speaker: 'tutor', text: tutorResponse }
        ]);
      } else {
        setDialogue(prev => [...prev, { speaker: 'tutor', text: tutorResponse }]);
      }

      if (hint) {
        setDialogue(prev => [...prev, { speaker: 'hint', text: `💡 ${hint}` }]);
      }
    } catch (err) {
      setError('Oops! Something went wrong. Try again?');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const markComplete = () => {
    const newCompleted = new Set(completed);
    newCompleted.add(scenarios[currentScenario].id);
    setCompleted(newCompleted);
  };

  const resetScenario = () => {
    setDialogue([]);
    setCurrentScenario(null);
    setUserInput('');
    setError('');
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a1a1a', padding: '0 16px' }}>
      {currentScenario === null ? (
        <div style={{ padding: '2rem 0' }}>
          <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e0e0e0' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 500, margin: '0 0 0.5rem 0' }}>French Dialogue Practice</h1>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Build confidence speaking French with real conversations</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '2rem' }}>
            {scenarios.map((scen, idx) => (
              <button
                key={scen.id}
                onClick={() => startScenario(idx)}
                style={{
                  padding: '1rem 1.25rem',
                  textAlign: 'left',
                  background: completed.has(scen.id) ? '#f0f9ff' : '#ffffff',
                  border: completed.has(scen.id) ? '2px solid
