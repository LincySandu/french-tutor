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
      description: 'Talk about animals you
