'use client';

import { useEffect, useRef, useState } from 'react';

const languages = {
  en: {
    label: 'English',
    native: 'English',
    ui: {
      level: 'LEVEL',
      xp: 'XP',
      missions: 'missions',
      xpPerAnswer: 'XP per answer',
      chooseAdventure: 'CHOOSE YOUR ADVENTURE',
      pickMission: 'Pick a mission',
      toExplore: 'to explore',
      playMission: 'PLAY MISSION',
      littleTip: 'Little tip from Mimi',
      tipText:
        "You don't need to know everything. Just try! Every answer helps you learn.",
      allMissions: '← All missions',
      mission: 'MISSION',
      hiMimi: "Hi! I'm Mimi.",
      practise: "Let's practise some French together.",
      startMission: 'START MISSION',
      missionsBack: '← Missions',
      ready: 'READY',
      frenchFriend: 'Your French friend',
      listen: 'Listen',
      meaning: 'Meaning',
      hideMeaning: 'Hide meaning',
      usefulWords: 'USEFUL WORDS',
      yourTurn: 'Your turn!',
      chooseOrType: 'Choose an answer or type your own.',
      placeholder: 'Write your answer in French...',
      tip: 'Tip',
      mistakes: "It's okay to make mistakes!",
      hello: 'BONJOUR!',
      heroTitle1: 'Your French',
      heroTitle2: 'adventure',
      heroTitle3: 'starts here.',
      heroText:
        'Learn French by talking, playing and completing fun little missions with Mimi.',
      readyToPlay: 'Ready to play?',
      selectLanguage: 'Explanations in',
    },
    scenarios: {
      school: {
        name: 'At School',
        description:
          'Talk about school, friends and your favourite subjects.',
        category: 'EVERYDAY LIFE',
        intro:
          'Imagine we are at school in France. I will help you talk about your school day, your friends and the subjects you like.',
        meaning:
          'We are going to practise talking about school and your favourite subjects.',
      },
      sports: {
        name: 'Sports',
        description:
          'Talk about sports, teams and what you like to play.',
        category: 'FUN & GAMES',
        intro:
          'Imagine we are talking about sports after school. I will ask you about the sports you enjoy and your favourite teams.',
        meaning:
          'We are going to practise talking about sports and activities you enjoy.',
      },
      animals: {
        name: 'Animals',
        description:
          'Discover animals and describe your favourites.',
        category: 'NATURE',
        intro:
          'Imagine we are visiting an animal park. I will help you talk about different animals and describe the ones you like.',
        meaning:
          'We are going to practise describing animals and talking about your favourites.',
      },
      hobbies: {
        name: 'My Hobbies',
        description:
          'Talk about games, music, drawing and your free time.',
        category: 'FREE TIME',
        intro:
          "Let's talk about what you enjoy doing in your free time. We can talk about games, music, drawing and other hobbies.",
        meaning:
          'We are going to practise talking about things you enjoy doing.',
      },
      family: {
        name: 'My Family',
        description:
          'Introduce your family and talk about the people you love.',
        category: 'PEOPLE',
        intro:
          "Let's talk about your family. I will help you introduce people in your family and say a few things about them.",
        meaning:
          'We are going to practise talking about your family.',
      },
      birthday: {
        name: 'Birthday Party',
        description:
          'Talk about birthdays, presents, cake and celebrations.',
        category: 'CELEBRATIONS',
        intro:
          'Imagine we are at a birthday party. We can talk about birthdays, presents, cake and what you like to do at parties.',
        meaning:
          'We are going to practise French for a birthday party.',
      },
      park: {
        name: 'At the Park',
        description:
          'Explore the park and talk about what you can see.',
        category: 'OUTSIDE',
        intro:
          "Imagine we are spending the afternoon in a French park. Let's talk about what we can see and what we like doing outside.",
        meaning:
          'We are going to practise talking about things you see and do in a park.',
      },
      shopping: {
        name: 'Shopping',
        description:
          'Learn useful French for shops, clothes and prices.',
        category: 'EVERYDAY LIFE',
        intro:
          'Imagine we are in a French shop. I will help you practise useful words for clothes, colours, prices and buying things.',
        meaning:
          'We are going to practise useful French for shopping.',
      },
    },
  },

  fr: {
    label: 'Français',
    native: 'Français',
    ui: {
      level: 'NIVEAU',
      xp: 'XP',
      missions: 'missions',
      xpPerAnswer: 'XP par réponse',
      chooseAdventure: 'CHOISIS TON AVENTURE',
      pickMission: 'Choisis une mission',
      toExplore: 'à découvrir',
      playMission: 'JOUER LA MISSION',
      littleTip: 'Le petit conseil de Mimi',
      tipText:
        "Tu n'as pas besoin de tout savoir. Essaie simplement ! Chaque réponse t'aide à apprendre.",
      allMissions: '← Toutes les missions',
      mission: 'MISSION',
      hiMimi: 'Salut ! Je suis Mimi.',
      practise: 'Pratiquons le français ensemble.',
      startMission: 'COMMENCER LA MISSION',
      missionsBack: '← Missions',
      ready: 'PRÊT',
      frenchFriend: 'Ton amie française',
      listen: 'Écouter',
      meaning: 'Sens',
      hideMeaning: 'Cacher le sens',
      usefulWords: 'MOTS UTILES',
      yourTurn: 'À ton tour !',
      chooseOrType: 'Choisis une réponse ou écris la tienne.',
      placeholder: 'Écris ta réponse en français...',
      tip: 'Conseil',
      mistakes: "Ce n'est pas grave de faire des erreurs !",
      hello: 'BONJOUR !',
      heroTitle1: 'Ton aventure',
      heroTitle2: 'française',
      heroTitle3: 'commence ici.',
      heroText:
        'Apprends le français en parlant, en jouant et en faisant de petites missions avec Mimi.',
      readyToPlay: 'Prêt à jouer ?',
      selectLanguage: 'Explications en',
    },
    scenarios: {
      school: {
        name: "À l'école",
        description:
          "Parle de l'école, de tes amis et de tes matières préférées.",
        category: 'VIE QUOTIDIENNE',
        intro:
          "Imagine que nous sommes à l'école en France. Je vais t'aider à parler de ta journée, de tes amis et des matières que tu aimes.",
        meaning:
          "Nous allons pratiquer le français pour parler de l'école et de tes matières préférées.",
      },
      sports: {
        name: 'Le sport',
        description:
          'Parle de sport, des équipes et de ce que tu aimes pratiquer.',
        category: 'JEUX & PLAISIR',
        intro:
          "Imagine que nous parlons de sport après l'école. Je vais te poser des questions sur les sports que tu aimes et tes équipes préférées.",
        meaning:
          'Nous allons pratiquer le français pour parler du sport et des activités que tu aimes.',
      },
      animals: {
        name: 'Les animaux',
        description:
          'Découvre les animaux et décris tes préférés.',
        category: 'NATURE',
        intro:
          "Imagine que nous visitons un parc animalier. Je vais t'aider à parler de différents animaux et à décrire ceux que tu aimes.",
        meaning:
          'Nous allons pratiquer le français pour décrire les animaux et parler de tes préférés.',
      },
      hobbies: {
        name: 'Mes loisirs',
        description:
          'Parle des jeux, de la musique, du dessin et de ton temps libre.',
        category: 'TEMPS LIBRE',
        intro:
          'Parlons de ce que tu aimes faire pendant ton temps libre. Nous pouvons parler de jeux, de musique, de dessin et de loisirs.',
        meaning:
          'Nous allons pratiquer le français pour parler de ce que tu aimes faire.',
      },
      family: {
        name: 'Ma famille',
        description:
          'Présente ta famille et parle des personnes que tu aimes.',
        category: 'PERSONNES',
        intro:
          "Parlons de ta famille. Je vais t'aider à présenter les personnes de ta famille et à dire quelques choses sur elles.",
        meaning:
          'Nous allons pratiquer le français pour parler de ta famille.',
      },
      birthday: {
        name: "Fête d'anniversaire",
        description:
          "Parle des anniversaires, des cadeaux, du gâteau et des fêtes.",
        category: 'FÊTES',
        intro:
          "Imagine que nous sommes à une fête d'anniversaire. Nous pouvons parler des anniversaires, des cadeaux, du gâteau et de ce que tu aimes faire pendant les fêtes.",
        meaning:
          "Nous allons pratiquer le français pour parler d'une fête d'anniversaire.",
      },
      park: {
        name: 'Au parc',
        description:
          'Explore le parc et parle de ce que tu peux voir.',
        category: 'DEHORS',
        intro:
          "Imagine que nous passons l'après-midi dans un parc français. Parlons de ce que nous pouvons voir et de ce que nous aimons faire dehors.",
        meaning:
          'Nous allons pratiquer le français pour parler de ce que tu vois et fais dans un parc.',
      },
      shopping: {
        name: 'Les achats',
        description:
          'Apprends le français utile pour les magasins, les vêtements et les prix.',
        category: 'VIE QUOTIDIENNE',
        intro:
          "Imagine que nous sommes dans un magasin français. Je vais t'aider à pratiquer des mots utiles pour les vêtements, les couleurs, les prix et les achats.",
        meaning:
          'Nous allons pratiquer le français utile pour faire des achats.',
      },
    },
  },

  de: {
    label: 'Deutsch',
    native: 'Deutsch',
    ui: {
      level: 'LEVEL',
      xp: 'XP',
      missions: 'Missionen',
      xpPerAnswer: 'XP pro Antwort',
      chooseAdventure: 'WÄHLE DEIN ABENTEUER',
      pickMission: 'Wähle eine Mission',
      toExplore: 'zu entdecken',
      playMission: 'MISSION STARTEN',
      littleTip: 'Mimis kleiner Tipp',
      tipText:
        'Du musst nicht alles wissen. Versuch es einfach! Jede Antwort hilft dir beim Lernen.',
      allMissions: '← Alle Missionen',
      mission: 'MISSION',
      hiMimi: 'Hallo! Ich bin Mimi.',
      practise: 'Lass uns zusammen Französisch üben.',
      startMission: 'MISSION STARTEN',
      missionsBack: '← Missionen',
      ready: 'BEREIT',
      frenchFriend: 'Deine französische Freundin',
      listen: 'Anhören',
      meaning: 'Bedeutung',
      hideMeaning: 'Bedeutung ausblenden',
      usefulWords: 'NÜTZLICHE WÖRTER',
      yourTurn: 'Du bist dran!',
      chooseOrType: 'Wähle eine Antwort oder schreibe deine eigene.',
      placeholder: 'Schreibe deine Antwort auf Französisch...',
      tip: 'Tipp',
      mistakes: 'Es ist okay, Fehler zu machen!',
      hello: 'BONJOUR!',
      heroTitle1: 'Dein Französisch-',
      heroTitle2: 'Abenteuer',
      heroTitle3: 'beginnt hier.',
      heroText:
        'Lerne Französisch mit Mimi durch Sprechen, Spielen und kleine Missionen.',
      readyToPlay: 'Bereit zum Spielen?',
      selectLanguage: 'Erklärungen in',
    },
    scenarios: {
      school: {
        name: 'In der Schule',
        description:
          'Sprich über die Schule, Freunde und deine Lieblingsfächer.',
        category: 'ALLTAG',
        intro:
          'Stell dir vor, wir sind in einer Schule in Frankreich. Ich helfe dir, über deinen Schultag, deine Freunde und deine Lieblingsfächer zu sprechen.',
        meaning:
          'Wir üben Französisch, um über die Schule und deine Lieblingsfächer zu sprechen.',
      },
      sports: {
        name: 'Sport',
        description:
          'Sprich über Sport, Teams und was du gerne spielst.',
        category: 'SPIEL & SPASS',
        intro:
          'Stell dir vor, wir sprechen nach der Schule über Sport. Ich frage dich nach deinen Lieblingssportarten und Teams.',
        meaning:
          'Wir üben Französisch, um über Sport und Aktivitäten zu sprechen, die du magst.',
      },
      animals: {
        name: 'Tiere',
        description:
          'Entdecke Tiere und beschreibe deine Lieblingstiere.',
        category: 'NATUR',
        intro:
          'Stell dir vor, wir besuchen einen Tierpark. Ich helfe dir, über verschiedene Tiere zu sprechen und deine Lieblingstiere zu beschreiben.',
        meaning:
          'Wir üben Französisch, um Tiere zu beschreiben und über deine Lieblingstiere zu sprechen.',
      },
      hobbies: {
        name: 'Meine Hobbys',
        description:
          'Sprich über Spiele, Musik, Zeichnen und deine Freizeit.',
        category: 'FREIZEIT',
        intro:
          'Lass uns darüber sprechen, was du in deiner Freizeit gerne machst. Wir können über Spiele, Musik, Zeichnen und andere Hobbys sprechen.',
        meaning:
          'Wir üben Französisch, um über Dinge zu sprechen, die du gerne machst.',
      },
      family: {
        name: 'Meine Familie',
        description:
          'Stelle deine Familie vor und sprich über die Menschen, die du liebst.',
        category: 'MENSCHEN',
        intro:
          'Lass uns über deine Familie sprechen. Ich helfe dir, deine Familie vorzustellen und etwas über sie zu erzählen.',
        meaning:
          'Wir üben Französisch, um über deine Familie zu sprechen.',
      },
      birthday: {
        name: 'Geburtstagsparty',
        description:
          'Sprich über Geburtstage, Geschenke, Kuchen und Feiern.',
        category: 'FEIERN',
        intro:
          'Stell dir vor, wir sind auf einer Geburtstagsparty. Wir können über Geburtstage, Geschenke, Kuchen und Partys sprechen.',
        meaning:
          'Wir üben Französisch für eine Geburtstagsparty.',
      },
      park: {
        name: 'Im Park',
        description:
          'Erkunde den Park und sprich darüber, was du sehen kannst.',
        category: 'DRAUSSEN',
        intro:
          'Stell dir vor, wir verbringen den Nachmittag in einem französischen Park. Lass uns darüber sprechen, was wir sehen und gerne draußen machen.',
        meaning:
          'Wir üben Französisch, um über Dinge zu sprechen, die du im Park siehst und machst.',
      },
      shopping: {
        name: 'Einkaufen',
        description:
          'Lerne nützliches Französisch für Geschäfte, Kleidung und Preise.',
        category: 'ALLTAG',
        intro:
          'Stell dir vor, wir sind in einem französischen Geschäft. Ich helfe dir mit Wörtern für Kleidung, Farben, Preise und Einkaufen.',
        meaning:
          'Wir üben nützliches Französisch zum Einkaufen.',
      },
    },
  },

  ro: {
    label: 'Română',
    native: 'Română',
    ui: {
      level: 'NIVEL',
      xp: 'XP',
      missions: 'misiuni',
      xpPerAnswer: 'XP pentru fiecare răspuns',
      chooseAdventure: 'ALEGE AVENTURA',
      pickMission: 'Alege o misiune',
      toExplore: 'de descoperit',
      playMission: 'JOACĂ MISIUNEA',
      littleTip: 'Micul sfat al lui Mimi',
      tipText:
        'Nu trebuie să știi totul. Doar încearcă! Fiecare răspuns te ajută să înveți.',
      allMissions: '← Toate misiunile',
      mission: 'MISIUNEA',
      hiMimi: 'Salut! Eu sunt Mimi.',
      practise: 'Hai să exersăm franceza împreună.',
      startMission: 'ÎNCEPE MISIUNEA',
      missionsBack: '← Misiuni',
      ready: 'GATA',
      frenchFriend: 'Prietenul tău francez',
      listen: 'Ascultă',
      meaning: 'Sens',
      hideMeaning: 'Ascunde sensul',
      usefulWords: 'CUVINTE UTILE',
      yourTurn: 'E rândul tău!',
      chooseOrType: 'Alege un răspuns sau scrie unul propriu.',
      placeholder: 'Scrie răspunsul tău în franceză...',
      tip: 'Sfat',
      mistakes: 'Este în regulă să faci greșeli!',
      hello: 'BONJOUR!',
      heroTitle1: 'Aventura ta',
      heroTitle2: 'în franceză',
      heroTitle3: 'începe aici.',
      heroText:
        'Învață franceza vorbind, jucându-te și completând mici misiuni cu Mimi.',
      readyToPlay: 'Gata de joacă?',
      selectLanguage: 'Explicații în',
    },
    scenarios: {
      school: {
        name: 'La școală',
        description:
          'Vorbește despre școală, prieteni și materiile tale preferate.',
        category: 'VIAȚA DE ZI CU ZI',
        intro:
          'Imaginează-ți că suntem la o școală din Franța. Te voi ajuta să vorbești despre ziua ta la școală, prieteni și materiile care îți plac.',
        meaning:
          'Vom exersa franceza pentru a vorbi despre școală și materiile tale preferate.',
      },
      sports: {
        name: 'Sport',
        description:
          'Vorbește despre sporturi, echipe și ce îți place să practici.',
        category: 'JOCURI & DISTRACȚIE',
        intro:
          'Imaginează-ți că vorbim despre sport după școală. Te voi întreba despre sporturile și echipele tale preferate.',
        meaning:
          'Vom exersa franceza pentru a vorbi despre sport și activitățile care îți plac.',
      },
      animals: {
        name: 'Animale',
        description:
          'Descoperă animale și descrie-le pe cele preferate.',
        category: 'NATURĂ',
        intro:
          'Imaginează-ți că vizităm un parc cu animale. Te voi ajuta să vorbești despre animale și să le descrii pe cele care îți plac.',
        meaning:
          'Vom exersa franceza pentru a descrie animale și a vorbi despre preferatele tale.',
      },
      hobbies: {
        name: 'Hobby-urile mele',
        description:
          'Vorbește despre jocuri, muzică, desen și timpul liber.',
        category: 'TIMP LIBER',
        intro:
          'Hai să vorbim despre ce îți place să faci în timpul liber. Putem vorbi despre jocuri, muzică, desen și alte hobby-uri.',
        meaning:
          'Vom exersa franceza pentru a vorbi despre lucrurile care îți place să le faci.',
      },
      family: {
        name: 'Familia mea',
        description:
          'Prezintă-ți familia și vorbește despre oamenii pe care îi iubești.',
        category: 'OAMENI',
        intro:
          'Hai să vorbim despre familia ta. Te voi ajuta să prezinți membrii familiei și să spui câteva lucruri despre ei.',
        meaning:
          'Vom exersa franceza pentru a vorbi despre familia ta.',
      },
      birthday: {
        name: 'Petrecere de ziua de naștere',
        description:
          'Vorbește despre zile de naștere, cadouri, tort și sărbători.',
        category: 'SĂRBĂTORI',
        intro:
          'Imaginează-ți că suntem la o petrecere de ziua de naștere. Putem vorbi despre cadouri, tort și ce îți place să faci la petreceri.',
        meaning:
          'Vom exersa franceza pentru o petrecere de ziua de naștere.',
      },
      park: {
        name: 'În parc',
        description:
          'Explorează parcul și vorbește despre ceea ce poți vedea.',
        category: 'AFARĂ',
        intro:
          'Imaginează-ți că petrecem după-amiaza într-un parc francez. Hai să vorbim despre ce vedem și ce ne place să facem afară.',
        meaning:
          'Vom exersa franceza pentru a vorbi despre lucrurile pe care le vezi și le faci în parc.',
      },
      shopping: {
        name: 'La cumpărături',
        description:
          'Învață franceza utilă pentru magazine, haine și prețuri.',
        category: 'VIAȚA DE ZI CU ZI',
        intro:
          'Imaginează-ți că suntem într-un magazin francez. Te voi ajuta să exersezi cuvinte utile pentru haine, culori, prețuri și cumpărături.',
        meaning:
          'Vom exersa franceza utilă pentru cumpărături.',
      },
    },
  },

  es: {
    label: 'Español',
    native: 'Español',
    ui: {
      level: 'NIVEL',
      xp: 'XP',
      missions: 'misiones',
      xpPerAnswer: 'XP por respuesta',
      chooseAdventure: 'ELIGE TU AVENTURA',
      pickMission: 'Elige una misión',
      toExplore: 'por descubrir',
      playMission: 'JUGAR MISIÓN',
      littleTip: 'El pequeño consejo de Mimi',
      tipText:
        'No necesitas saberlo todo. ¡Solo inténtalo! Cada respuesta te ayuda a aprender.',
      allMissions: '← Todas las misiones',
      mission: 'MISIÓN',
      hiMimi: '¡Hola! Soy Mimi.',
      practise: 'Vamos a practicar francés juntos.',
      startMission: 'EMPEZAR MISIÓN',
      missionsBack: '← Misiones',
      ready: 'LISTO',
      frenchFriend: 'Tu amiga francesa',
      listen: 'Escuchar',
      meaning: 'Significado',
      hideMeaning: 'Ocultar significado',
      usefulWords: 'PALABRAS ÚTILES',
      yourTurn: '¡Tu turno!',
      chooseOrType: 'Elige una respuesta o escribe la tuya.',
      placeholder: 'Escribe tu respuesta en francés...',
      tip: 'Consejo',
      mistakes: '¡No pasa nada si cometes errores!',
      hello: 'BONJOUR!',
      heroTitle1: 'Tu aventura',
      heroTitle2: 'en francés',
      heroTitle3: 'empieza aquí.',
      heroText:
        'Aprende francés hablando, jugando y completando pequeñas misiones con Mimi.',
      readyToPlay: '¿Listo para jugar?',
      selectLanguage: 'Explicaciones en',
    },
    scenarios: {
      school: {
        name: 'En la escuela',
        description:
          'Habla sobre la escuela, tus amigos y tus asignaturas favoritas.',
        category: 'VIDA COTIDIANA',
        intro:
          'Imagina que estamos en una escuela de Francia. Te ayudaré a hablar sobre tu día, tus amigos y las asignaturas que te gustan.',
        meaning:
          'Vamos a practicar francés para hablar de la escuela y tus asignaturas favoritas.',
      },
      sports: {
        name: 'Deportes',
        description:
          'Habla sobre deportes, equipos y lo que te gusta practicar.',
        category: 'JUEGOS Y DIVERSIÓN',
        intro:
          'Imagina que hablamos de deportes después de la escuela. Te preguntaré por tus deportes y equipos favoritos.',
        meaning:
          'Vamos a practicar francés para hablar de deportes y actividades que te gustan.',
      },
      animals: {
        name: 'Animales',
        description:
          'Descubre animales y describe tus favoritos.',
        category: 'NATURALEZA',
        intro:
          'Imagina que visitamos un parque de animales. Te ayudaré a hablar de diferentes animales y a describir los que te gustan.',
        meaning:
          'Vamos a practicar francés para describir animales y hablar de tus favoritos.',
      },
      hobbies: {
        name: 'Mis aficiones',
        description:
          'Habla sobre juegos, música, dibujo y tu tiempo libre.',
        category: 'TIEMPO LIBRE',
        intro:
          'Hablemos de lo que te gusta hacer en tu tiempo libre. Podemos hablar de juegos, música, dibujo y otras aficiones.',
        meaning:
          'Vamos a practicar francés para hablar de las cosas que te gusta hacer.',
      },
      family: {
        name: 'Mi familia',
        description:
          'Presenta a tu familia y habla de las personas que quieres.',
        category: 'PERSONAS',
        intro:
          'Hablemos de tu familia. Te ayudaré a presentar a las personas de tu familia y decir algunas cosas sobre ellas.',
        meaning:
          'Vamos a practicar francés para hablar de tu familia.',
      },
      birthday: {
        name: 'Fiesta de cumpleaños',
        description:
          'Habla sobre cumpleaños, regalos, tarta y celebraciones.',
        category: 'CELEBRACIONES',
        intro:
          'Imagina que estamos en una fiesta de cumpleaños. Podemos hablar de cumpleaños, regalos, tarta y lo que te gusta hacer en las fiestas.',
        meaning:
          'Vamos a practicar francés para una fiesta de cumpleaños.',
      },
      park: {
        name: 'En el parque',
        description:
          'Explora el parque y habla de lo que puedes ver.',
        category: 'AL AIRE LIBRE',
        intro:
          'Imagina que pasamos la tarde en un parque francés. Hablemos de lo que podemos ver y de lo que nos gusta hacer fuera.',
        meaning:
          'Vamos a practicar francés para hablar de las cosas que ves y haces en un parque.',
      },
      shopping: {
        name: 'De compras',
        description:
          'Aprende francés útil para tiendas, ropa y precios.',
        category: 'VIDA COTIDIANA',
        intro:
          'Imagina que estamos en una tienda francesa. Te ayudaré a practicar palabras útiles para ropa, colores, precios y compras.',
        meaning:
          'Vamos a practicar francés útil para ir de compras.',
      },
    },
  },
};

const scenarios = [
  {
    id: 'school',
    number: '01',
    color: '#7DD9EA',
    icon: 'book',
  },
  {
    id: 'sports',
    number: '02',
    color: '#FFB86B',
    icon: 'ball',
  },
  {
    id: 'animals',
    number: '03',
    color: '#A9D98B',
    icon: 'paw',
  },
  {
    id: 'hobbies',
    number: '04',
    color: '#C5A7F7',
    icon: 'star',
  },
  {
    id: 'family',
    number: '05',
    color: '#F4A6C8',
    icon: 'family',
  },
  {
    id: 'birthday',
    number: '06',
    color: '#FFD86B',
    icon: 'cake',
  },
  {
    id: 'park',
    number: '07',
    color: '#8ED5AE',
    icon: 'tree',
  },
  {
    id: 'shopping',
    number: '08',
    color: '#9DBAF4',
    icon: 'bag',
  },
];

function getScenarioText(id, interfaceLanguage) {
  return (
    languages[interfaceLanguage]?.scenarios?.[id]?.intro ||
    languages.en.scenarios[id].intro
  );
}

function getInitialMeaning(id, interfaceLanguage) {
  return (
    languages[interfaceLanguage]?.scenarios?.[id]?.meaning ||
    languages.en.scenarios[id].meaning
  );
}

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
      voice.lang?.toLowerCase().startsWith('fr')
    ) ||
    voices.find((voice) =>
      voice.lang?.toLowerCase().includes('fr')
    ) ||
    null
  );
}

function speakFrench(text) {
  if (
    typeof window === 'undefined' ||
    !window.speechSynthesis ||
    !text
  ) {
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

      {type === 'star' && (
        <div className="starShape">★</div>
      )}

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
  const [interfaceLanguage, setInterfaceLanguage] =
    useState('en');

  const [secondaryLanguage, setSecondaryLanguage] =
    useState('en');

  const [selectedScenario, setSelectedScenario] =
    useState(null);

  const [showIntro, setShowIntro] =
    useState(false);

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState('');

  const [loading, setLoading] = useState(false);

  const [xp, setXp] = useState(0);

  const [answerOptions, setAnswerOptions] =
    useState([]);

  const [vocabulary, setVocabulary] =
    useState([]);

  const [meaningMessageIndex, setMeaningMessageIndex] =
    useState(null);

  const messagesEndRef = useRef(null);

  const ui =
    languages[interfaceLanguage]?.ui ||
    languages.en.ui;

  useEffect(() => {
    const savedInterfaceLanguage =
      window.localStorage.getItem(
        'mimiInterfaceLanguage'
      );

    const savedSecondaryLanguage =
      window.localStorage.getItem(
        'mimiSecondaryLanguage'
      );

    const savedLanguage =
      savedSecondaryLanguage &&
      languages[savedSecondaryLanguage]
        ? savedSecondaryLanguage
        : savedInterfaceLanguage &&
            languages[savedInterfaceLanguage]
          ? savedInterfaceLanguage
          : 'en';

    setInterfaceLanguage(savedLanguage);
    setSecondaryLanguage(savedLanguage);
  }, []);

  function changeInterfaceLanguage(language) {
    setInterfaceLanguage(language);

    window.localStorage.setItem(
      'mimiInterfaceLanguage',
      language
    );
  }

  function changeSecondaryLanguage(language) {
    // The visible selector controls the complete support/interface language.
    // French remains the language being learned and spoken by Mimi.
    setSecondaryLanguage(language);
    setInterfaceLanguage(language);

    window.localStorage.setItem(
      'mimiSecondaryLanguage',
      language
    );
    window.localStorage.setItem(
      'mimiInterfaceLanguage',
      language
    );
  }

  useEffect(() => {
    if (!selectedScenario || showIntro) {
      return;
    }

    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [
    messages,
    loading,
    selectedScenario,
    showIntro,
  ]);

  function selectScenario(scenario) {
    setSelectedScenario(scenario);
    setShowIntro(true);
    setMessages([]);
    setAnswerOptions([]);
    setVocabulary([]);
    setMeaningMessageIndex(null);
    setInput('');
  }

  async function beginMission() {
    if (!selectedScenario) return;

    setShowIntro(false);

    const scenarioText = getScenarioText(
      selectedScenario.id,
      interfaceLanguage
    );

    setMessages([
      {
        role: 'mimi',
        text: scenarioText,
        speechText: '',
        meaning: getInitialMeaning(
          selectedScenario.id,
          interfaceLanguage
        ),
      },
    ]);

    setAnswerOptions([]);
    setVocabulary([]);
    setLoading(true);

    try {
      const response = await fetch(
        '/api/tutor',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            scenario:
              selectedScenario.id,
            messages: [],
            start: true,
            interfaceLanguage,
            secondaryLanguage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);

        throw new Error(
          data?.error?.message ||
            data?.error ||
            'Tutor request failed'
        );
      }

      if (data.reply) {
        setMessages([
          {
            role: 'mimi',
            text: data.reply,
            speechText:
              data.speechText || '',
            meaning: data.meaning || '',
          },
        ]);

        setAnswerOptions(
          Array.isArray(data.options)
            ? data.options
            : []
        );

        setVocabulary(
          Array.isArray(data.vocabulary)
            ? data.vocabulary
            : []
        );

        if (data.speechText) {
          setTimeout(() => {
            speakFrench(data.speechText);
          }, 150);
        }
      }
    } catch (error) {
      console.error(error);

      setMessages((current) => [
        ...current,
        {
          role: 'mimi',
          text:
            interfaceLanguage === 'fr'
              ? 'Désolée ! Réessayons.'
              : interfaceLanguage === 'de'
                ? 'Entschuldigung! Versuchen wir es noch einmal.'
                : interfaceLanguage === 'ro'
                  ? 'Scuze! Hai să încercăm din nou.'
                  : interfaceLanguage === 'es'
                    ? '¡Lo siento! Intentémoslo de nuevo.'
                    : "Désolée ! Let's try that again.",
          speechText: '',
          meaning:
            interfaceLanguage === 'fr'
              ? 'Un problème est survenu pendant la connexion à Mimi.'
              : interfaceLanguage === 'de'
                ? 'Beim Verbinden mit Mimi ist ein Problem aufgetreten.'
                : interfaceLanguage === 'ro'
                  ? 'A apărut o problemă la conectarea cu Mimi.'
                  : interfaceLanguage === 'es'
                    ? 'Ha ocurrido un problema al conectar con Mimi.'
                    : 'Something went wrong while connecting to Mimi.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function chooseAnswer(answer) {
    setInput(answer);
  }

  async function sendMessage(
    customMessage = null
  ) {
    const messageToSend =
      typeof customMessage === 'string'
        ? customMessage.trim()
        : input.trim();

    if (
      !messageToSend ||
      loading ||
      !selectedScenario
    ) {
      return;
    }

    const userMessage = {
      role: 'user',
      text: messageToSend,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);
    setInput('');
    setAnswerOptions([]);
    setLoading(true);
    setXp((current) => current + 5);

    try {
      const response = await fetch(
        '/api/tutor',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            scenario:
              selectedScenario.id,
            messages: updatedMessages,
            interfaceLanguage,
            secondaryLanguage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);

        throw new Error(
          data?.error?.message ||
            data?.error ||
            'Tutor request failed'
        );
      }

      const mimiMessage = {
        role: 'mimi',
        text:
          data.reply ||
          'Très bien !',
        speechText:
          data.speechText || '',
        meaning: data.meaning || '',
      };

      setMessages((current) => [
        ...current,
        mimiMessage,
      ]);

      setAnswerOptions(
        Array.isArray(data.options)
          ? data.options
          : []
      );

      setVocabulary(
        Array.isArray(data.vocabulary)
          ? data.vocabulary
          : []
      );

      if (data.speechText) {
        setTimeout(() => {
          speakFrench(data.speechText);
        }, 100);
      }
    } catch (error) {
      console.error(error);

      setMessages((current) => [
        ...current,
        {
          role: 'mimi',
          text:
            interfaceLanguage === 'fr'
              ? 'Désolée ! Réessayons.'
              : interfaceLanguage === 'de'
                ? 'Entschuldigung! Versuchen wir es noch einmal.'
                : interfaceLanguage === 'ro'
                  ? 'Scuze! Hai să încercăm din nou.'
                  : interfaceLanguage === 'es'
                    ? '¡Lo siento! Intentémoslo de nuevo.'
                    : "Désolée ! Let's try that again.",
          speechText: '',
          meaning:
            interfaceLanguage === 'fr'
              ? 'Un problème est survenu pendant la connexion à Mimi.'
              : interfaceLanguage === 'de'
                ? 'Beim Verbinden mit Mimi ist ein Problem aufgetreten.'
                : interfaceLanguage === 'ro'
                  ? 'A apărut o problemă la conectarea cu Mimi.'
                  : interfaceLanguage === 'es'
                    ? 'Ha ocurrido un problema al conectar con Mimi.'
                    : 'Something went wrong while connecting to Mimi.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function goHome() {
    if (
      typeof window !== 'undefined' &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }

    setSelectedScenario(null);
    setShowIntro(false);
    setMessages([]);
    setAnswerOptions([]);
    setVocabulary([]);
    setMeaningMessageIndex(null);
    setInput('');
  }

  const progress = Math.min(
    (xp / 100) * 100,
    100
  );

  const level =
    Math.floor(xp / 100) + 1;

  return (
    <main className="page">
      <style jsx global>
        {styles}
      </style>

      <header className="topbar">
        <button
          className="brand"
          onClick={goHome}
        >
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

        <div className="headerRight">
          <div className="languageSelector">
            <span>
              {ui.selectLanguage}
            </span>

            <select
              value={secondaryLanguage}
              onChange={(event) =>
                changeSecondaryLanguage(
                  event.target.value
                )
              }
              aria-label={
                ui.selectLanguage
              }
            >
              {Object.entries(
                languages
              ).map(
                ([code, language]) => (
                  <option
                    key={code}
                    value={code}
                  >
                    {language.native}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="xpArea">
            <div className="levelLabel">
              <span>
                {ui.level} {level}
              </span>

              <strong>
                {xp} {ui.xp}
              </strong>
            </div>

            <div className="xpBar">
              <div
                className="xpFill"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
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
                {ui.hello}
              </div>

              <h1>
                {ui.heroTitle1}
                <br />
                <span>
                  {ui.heroTitle2}
                </span>{' '}
                {ui.heroTitle3}
              </h1>

              <p>{ui.heroText}</p>

              <div className="heroStats">
                <div>
                  <strong>
                    {scenarios.length}
                  </strong>
                  <span>
                    {ui.missions}
                  </span>
                </div>

                <div className="statDivider" />

                <div>
                  <strong>5</strong>
                  <span>
                    {ui.xpPerAnswer}
                  </span>
                </div>
              </div>
            </div>

            <div className="heroMimi">
              <div className="heroBlob" />
              <Mimi />
            </div>
          </div>

          <div className="missionsHeader">
            <div>
              <span className="sectionEyebrow">
                {ui.chooseAdventure}
              </span>

              <h2>
                {ui.pickMission}{' '}
                <span>
                  {ui.toExplore}
                </span>
              </h2>
            </div>

            <div className="tip">
              <strong>
                {ui.littleTip}
              </strong>
              <span>{ui.tipText}</span>
            </div>
          </div>

          <div className="missionGrid">
            {scenarios.map(
              (scenario) => {
                const scenarioInfo =
                  languages[
                    interfaceLanguage
                  ]?.scenarios?.[
                    scenario.id
                  ] ||
                  languages.en.scenarios[
                    scenario.id
                  ];

                return (
                  <button
                    key={scenario.id}
                    className="missionCard"
                    onClick={() =>
                      selectScenario(
                        scenario
                      )
                    }
                  >
                    <div
                      className="missionNumber"
                      style={{
                        background:
                          scenario.color,
                      }}
                    >
                      {scenario.number}
                    </div>

                    <MissionIcon
                      type={
                        scenario.icon
                      }
                    />

                    <div className="missionInfo">
                      <span>
                        {
                          scenarioInfo.category
                        }
                      </span>

                      <h3>
                        {
                          scenarioInfo.name
                        }
                      </h3>

                      <p>
                        {
                          scenarioInfo.description
                        }
                      </p>
                    </div>

                    <div className="missionArrow">
                      →
                    </div>
                  </button>
                );
              }
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
              {ui.allMissions}
            </button>

            <div className="introCard">
              <div className="introTop">
                <div>
                  <span className="sectionEyebrow">
                    {ui.mission}{' '}
                    {selectedScenario.number}
                  </span>

                  <h1>
                    {
                      languages[
                        interfaceLanguage
                      ]?.scenarios?.[
                        selectedScenario.id
                      ]?.name
                    }
                  </h1>
                </div>

                <MissionIcon
                  type={
                    selectedScenario.icon
                  }
                />
              </div>

              <div className="introMimi">
                <Mimi small />

                <div>
                  <strong>
                    {ui.hiMimi}
                  </strong>

                  <p>
                    {ui.practise}
                  </p>
                </div>
              </div>

              <p className="introDescription">
                {
                  languages[
                    interfaceLanguage
                  ]?.scenarios?.[
                    selectedScenario.id
                  ]?.description
                }
              </p>

              <button
                className="startButton"
                onClick={beginMission}
              >
                {ui.startMission}
                <span>→</span>
              </button>
            </div>
          </section>
        )}

      {selectedScenario &&
        !showIntro && (
          <section className="conversationScreen">
            <div className="conversationTop">
              <button
                className="backButton"
                onClick={goHome}
              >
                {ui.missionsBack}
              </button>

              <div className="conversationTitle">
                <div>
                  <span>
                    {ui.mission}{' '}
                    {
                      selectedScenario.number
                    }
                  </span>

                  <h1>
                    {
                      languages[
                        interfaceLanguage
                      ]?.scenarios?.[
                        selectedScenario.id
                      ]?.name
                    }
                  </h1>
                </div>

                <div className="readyBadge">
                  <span />
                  {ui.ready}
                </div>
              </div>
            </div>

            <div className="chatCard">
              <div className="chatHeader">
                <div className="chatMimi">
                  <Mimi small />

                  <div>
                    <strong>
                      Mimi
                    </strong>

                    <span>
                      {ui.frenchFriend}
                    </span>
                  </div>
                </div>
              </div>

              <div className="messages">
                {messages.map(
                  (message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`messageRow ${message.role}`}
                    >
                      {message.role ===
                        'mimi' && (
                        <div className="messageAvatar">
                          <Mimi small />
                        </div>
                      )}

                      <div className="messageContent">
                        <div className="messageBubble">
                          {message.text}
                        </div>

                        {message.role ===
                          'mimi' && (
                          <div className="messageTools">
                            {message.speechText && (
                              <button
                                className="listenButton"
                                onClick={() =>
                                  speakFrench(
                                    message.speechText
                                  )
                                }
                                title="Listen to the French pronunciation"
                              >
                                <span className="speakerIcon">
                                  🔊
                                </span>

                                {
                                  ui.listen
                                }
                              </button>
                            )}

                            {message.meaning && (
                              <button
                                className="meaningButton"
                                onClick={() =>
                                  setMeaningMessageIndex(
                                    meaningMessageIndex === index
                                      ? null
                                      : index
                                  )
                                }
                              >
                                {meaningMessageIndex === index
                                  ? ui.hideMeaning
                                  : ui.meaning}
                              </button>
                            )}
                          </div>
                        )}

                        {message.role ===
                          'mimi' &&
                          message.meaning &&
                          meaningMessageIndex === index && (
                            <div className="meaningBox">
                              {
                                message.meaning
                              }
                            </div>
                          )}
                      </div>
                    </div>
                  )
                )}

                {loading && (
                  <div className="messageRow mimi">
                    <div className="messageAvatar">
                      <Mimi small />
                    </div>

                    <div className="messageContent">
                      <div className="typingBubble">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                )}

                <div
                  ref={messagesEndRef}
                />
              </div>

              {vocabulary.length > 0 &&
                !loading && (
                  <div className="vocabulary">
                    <div className="vocabularyTitle">
                      {ui.usefulWords}
                    </div>

                    <div className="vocabularyList">
                      {vocabulary.map(
                        (word, index) => {
                          const french =
                            typeof word ===
                            'string'
                              ? word
                              : word?.french ||
                                '';

                          const translation =
                            typeof word ===
                            'string'
                              ? ''
                              : word?.translation ||
                                word?.english ||
                                '';

                          return (
                            <div
                              className="vocabItem"
                              key={index}
                            >
                              <strong>
                                {french}
                              </strong>

                              {translation && (
                                <span>
                                  {
                                    translation
                                  }
                                </span>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

              {answerOptions.length >
                0 &&
                !loading && (
                  <div className="answerArea">
                    <div className="answerTitle">
                      <span>
                        {ui.yourTurn}
                      </span>

                      <small>
                        {
                          ui.chooseOrType
                        }
                      </small>
                    </div>

                    <div className="answerOptions">
                      {answerOptions.map(
                        (
                          option,
                          index
                        ) => {
                          const french =
                            typeof option ===
                            'string'
                              ? option
                              : option.french ||
                                option.text ||
                                '';

                          const translation =
                            typeof option ===
                            'string'
                              ? ''
                              : option.translation ||
                                option.english ||
                                '';

                          return (
                            <button
                              key={index}
                              onClick={() =>
                                chooseAnswer(
                                  french
                                )
                              }
                            >
                              <span className="optionNumber">
                                {index + 1}
                              </span>

                              <span className="optionText">
                                <strong>
                                  {french}
                                </strong>

                                {translation && (
                                  <small>
                                    {
                                      translation
                                    }
                                  </small>
                                )}
                              </span>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

              <div className="inputArea">
                <div className="inputWrap">
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
                    placeholder={
                      ui.placeholder
                    }
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
                    aria-label="Send"
                  >
                    →
                  </button>
                </div>

                <div className="inputTip">
                  <strong>
                    {ui.tip}
                  </strong>{' '}
                  {ui.mistakes}
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

.page {
  min-height: 100vh;
  background: #ffffff;
  color: #303147;
}

.topbar {
  height: 76px;
  padding: 0 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0eff5;
  background: rgba(255,255,255,0.96);
}

.brand {
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 11px;
  cursor: pointer;
  padding: 0;
}

.brandMark {
  width: 34px;
  height: 34px;
  border-radius: 11px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #263c91;
  position: relative;
}

.brandBlue {
  position: absolute;
  left: 0;
  top: 0;
  width: 34%;
  height: 100%;
  background: #263c91;
}

.brandWhite {
  position: absolute;
  left: 34%;
  top: 0;
  width: 33%;
  height: 100%;
  background: #ffffff;
}

.brandRed {
  position: absolute;
  right: 0;
  top: 0;
  width: 33%;
  height: 100%;
  background: #ef5965;
}

.brandText {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.05;
}

.brandText strong {
  font-size: 15px;
  color: #303147;
  font-weight: 850;
}

.brandText span {
  margin-top: 4px;
  font-size: 8px;
  color: #9b9cab;
  letter-spacing: 0.04em;
}

.headerRight {
  display: flex;
  align-items: center;
  gap: 28px;
}

.languageSelector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.languageSelector span {
  font-size: 9px;
  color: #999aaa;
  white-space: nowrap;
}

.languageSelector select {
  border: 1px solid #e5e4ed;
  border-radius: 9px;
  background: #fff;
  padding: 7px 25px 7px 9px;
  color: #45465a;
  font-size: 10px;
  outline: none;
}

.xpArea {
  width: 140px;
}

.levelLabel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}

.levelLabel span {
  color: #999aaa;
  font-size: 8px;
  font-weight: 750;
}

.levelLabel strong {
  color: #7569d5;
  font-size: 9px;
  font-weight: 850;
}

.xpBar {
  width: 100%;
  height: 5px;
  border-radius: 99px;
  background: #eeeef5;
  overflow: hidden;
}

.xpFill {
  height: 100%;
  border-radius: 99px;
  background: #7569d5;
  transition: width 0.3s ease;
}

.home {
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
  padding: 50px 0 70px;
  position: relative;
}

.decor {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.decorOne {
  width: 12px;
  height: 12px;
  background: #ffd86b;
  top: 84px;
  right: 110px;
}

.decorTwo {
  width: 8px;
  height: 8px;
  background: #a9d98b;
  top: 175px;
  right: 44px;
}

.decorThree {
  width: 18px;
  height: 18px;
  border: 4px solid #c5a7f7;
  top: 210px;
  left: 15px;
}

.hero {
  min-height: 310px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 50px 0;
  background: #faf9ff;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
}

.heroText {
  max-width: 560px;
  position: relative;
  z-index: 2;
}

.helloPill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 11px;
  background: #ffffff;
  border-radius: 999px;
  color: #7569d5;
  font-size: 8px;
  font-weight: 850;
  letter-spacing: 0.06em;
  box-shadow: 0 5px 18px rgba(60,54,110,0.05);
}

.helloDot {
  width: 6px;
  height: 6px;
  background: #7dd9ea;
  border-radius: 50%;
}

.hero h1 {
  margin: 16px 0 13px;
  color: #303147;
  font-size: clamp(34px, 4.1vw, 53px);
  line-height: 0.99;
  letter-spacing: -0.055em;
  font-weight: 900;
}

.hero h1 span {
  color: #7569d5;
}

.heroText > p {
  max-width: 455px;
  color: #88899a;
  font-size: 12px;
  line-height: 1.65;
}

.heroStats {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 24px;
}

.heroStats > div:not(.statDivider) {
  display: flex;
  flex-direction: column;
}

.heroStats strong {
  color: #303147;
  font-size: 18px;
  line-height: 1;
}

.heroStats span {
  color: #a1a1af;
  font-size: 8px;
  margin-top: 5px;
}

.statDivider {
  width: 1px;
  height: 27px;
  background: #dedde8;
}

.heroMimi {
  width: 330px;
  height: 290px;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.heroBlob {
  width: 245px;
  height: 245px;
  position: absolute;
  right: 15px;
  bottom: -55px;
  border-radius: 48% 52% 44% 56%;
  background: #e7e3fb;
}

.mimi {
  width: 150px;
  height: 210px;
  position: relative;
  z-index: 2;
}

.mimiEar {
  width: 36px;
  height: 48px;
  position: absolute;
  top: 22px;
  background: #f1b4a6;
  border-radius: 50%;
}

.mimiEarLeft {
  left: 5px;
  transform: rotate(-24deg);
}

.mimiEarRight {
  right: 5px;
  transform: rotate(24deg);
}

.mimiHead {
  width: 125px;
  height: 130px;
  position: absolute;
  top: 25px;
  left: 12px;
  border-radius: 48% 48% 45% 45%;
  background: #f6c6b7;
  box-shadow: inset 0 -5px 0 rgba(185,100,85,0.08);
}

.mimiEye {
  width: 9px;
  height: 12px;
  position: absolute;
  top: 50px;
  border-radius: 50%;
  background: #3d3e52;
}

.mimiEyeLeft {
  left: 34px;
}

.mimiEyeRight {
  right: 34px;
}

.mimiNose {
  width: 8px;
  height: 7px;
  position: absolute;
  top: 69px;
  left: 58px;
  border-radius: 50%;
  background: #df988a;
}

.mimiSmile {
  width: 27px;
  height: 13px;
  position: absolute;
  left: 49px;
  top: 79px;
  border-bottom: 3px solid #3d3e52;
  border-radius: 0 0 50% 50%;
}

.mimiBody {
  width: 112px;
  height: 78px;
  position: absolute;
  bottom: 0;
  left: 19px;
  background: #7569d5;
  border-radius: 42px 42px 15px 15px;
}

.mimiScarf {
  width: 84px;
  height: 15px;
  position: absolute;
  top: 8px;
  left: 14px;
  border-radius: 99px;
  background: #ffd86b;
}

.mimiSmall {
  transform: scale(0.45);
  transform-origin: bottom center;
  width: 150px;
  height: 210px;
  flex: 0 0 150px;
}

.missionsHeader {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 48px 5px 20px;
}

.sectionEyebrow {
  display: block;
  color: #aaaab8;
  font-size: 8px;
  letter-spacing: 0.12em;
  font-weight: 850;
  margin-bottom: 5px;
}

.missionsHeader h2 {
  font-size: 23px;
  color: #303147;
  line-height: 1.15;
  letter-spacing: -0.035em;
}

.missionsHeader h2 span {
  color: #a4a4b1;
  font-weight: 450;
}

.tip {
  width: 310px;
  padding: 12px 15px;
  background: #fffaf0;
  border: 1px solid #f7ebcf;
  border-radius: 13px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tip strong {
  color: #b18a35;
  font-size: 9px;
}

.tip span {
  color: #99918a;
  font-size: 8px;
  line-height: 1.45;
}

.missionGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.missionCard {
  position: relative;
  min-height: 170px;
  padding: 20px 17px 17px;
  border: 1px solid #eeedf4;
  border-radius: 19px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.missionCard:hover {
  transform: translateY(-4px);
  border-color: #ddd9ef;
  box-shadow: 0 12px 28px rgba(65,61,100,0.08);
}

.missionNumber {
  position: absolute;
  top: 12px;
  right: 12px;
  min-width: 26px;
  height: 19px;
  padding: 0 6px;
  border-radius: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555666;
  font-size: 7px;
  font-weight: 850;
}

.missionIcon {
  width: 46px;
  height: 46px;
  margin-bottom: 18px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.missionInfo > span {
  color: #aaaab7;
  font-size: 7px;
  font-weight: 850;
  letter-spacing: 0.09em;
}

.missionInfo h3 {
  margin-top: 5px;
  color: #343548;
  font-size: 14px;
  font-weight: 850;
}

.missionInfo p {
  margin-top: 5px;
  color: #999aaa;
  font-size: 8px;
  line-height: 1.45;
}

.missionArrow {
  position: absolute;
  right: 15px;
  bottom: 14px;
  color: #c1bfd0;
  font-size: 15px;
  transition: transform 0.15s ease;
}

.missionCard:hover .missionArrow {
  transform: translateX(3px);
}

.bookShape {
  position: absolute;
  width: 21px;
  height: 29px;
  top: 8px;
  background: #7dd9ea;
  border-radius: 3px 5px 5px 3px;
}

.bookLeft {
  left: 2px;
  transform: skewY(5deg);
}

.bookRight {
  right: 2px;
  transform: skewY(-5deg);
  background: #5fc1d4;
}

.bookLine {
  position: absolute;
  width: 2px;
  height: 29px;
  top: 8px;
  left: 22px;
  background: #ffffff;
}

.ballShape {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ffb86b;
  position: absolute;
}

.ballLine {
  position: absolute;
  width: 27px;
  height: 2px;
  background: rgba(255,255,255,0.8);
}

.ballLineOne {
  transform: rotate(45deg);
}

.ballLineTwo {
  transform: rotate(-45deg);
}

.pawPad {
  width: 28px;
  height: 25px;
  background: #a9d98b;
  border-radius: 50% 50% 45% 45%;
  position: absolute;
  bottom: 2px;
}

.pawDot {
  width: 12px;
  height: 14px;
  background: #a9d98b;
  border-radius: 50%;
  position: absolute;
}

.pawDotOne {
  top: 3px;
  left: 5px;
}

.pawDotTwo {
  top: 0;
  left: 17px;
}

.pawDotThree {
  top: 11px;
  left: 0;
}

.pawDotFour {
  top: 10px;
  right: 0;
}

.starShape {
  color: #c5a7f7;
  font-size: 43px;
  line-height: 1;
}

.person {
  position: absolute;
  border-radius: 50%;
  background: #f4a6c8;
}

.personOne {
  width: 17px;
  height: 17px;
  top: 2px;
  left: 4px;
}

.personTwo {
  width: 20px;
  height: 20px;
  top: 0;
  left: 14px;
  background: #d890b0;
}

.personThree {
  width: 17px;
  height: 17px;
  top: 4px;
  right: 1px;
}

.cakeCandle {
  width: 5px;
  height: 13px;
  background: #ffd86b;
  position: absolute;
  top: 0;
  left: 20px;
}

.cakeTop {
  width: 39px;
  height: 15px;
  background: #f4a6c8;
  position: absolute;
  top: 13px;
  left: 4px;
  border-radius: 5px;
}

.cakeBottom {
  width: 46px;
  height: 17px;
  background: #d98bab;
  position: absolute;
  top: 27px;
  left: 1px;
  border-radius: 4px 4px 8px 8px;
}

.treeTop {
  width: 43px;
  height: 42px;
  background: #8ed5ae;
  border-radius: 50%;
  position: absolute;
  top: 0;
}

.treeTrunk {
  width: 9px;
  height: 20px;
  background: #b88967;
  position: absolute;
  bottom: 0;
  left: 19px;
  border-radius: 3px;
}

.bagHandle {
  width: 24px;
  height: 17px;
  border: 4px solid #9dbaf4;
  border-bottom: 0;
  border-radius: 12px 12px 0 0;
  position: absolute;
  top: 0;
}

.bagBody {
  width: 42px;
  height: 37px;
  background: #9dbaf4;
  position: absolute;
  top: 13px;
  border-radius: 4px 4px 8px 8px;
}

.introScreen {
  width: min(820px, calc(100% - 48px));
  margin: 0 auto;
  padding: 34px 0 70px;
}

.backButton {
  border: 0;
  background: transparent;
  color: #8f8fa0;
  font-size: 10px;
  font-weight: 750;
  cursor: pointer;
  padding: 7px 0;
}

.introCard {
  margin-top: 22px;
  padding: 34px;
  border: 1px solid #eeedf4;
  border-radius: 26px;
  background: #fff;
  box-shadow: 0 16px 40px rgba(63,58,100,0.06);
}

.introTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.introTop h1 {
  color: #303147;
  font-size: 31px;
  letter-spacing: -0.04em;
}

.introMimi {
  margin-top: 28px;
  padding: 13px 17px;
  min-height: 72px;
  border-radius: 15px;
  background: #faf9ff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.introMimi strong {
  color: #45465a;
  font-size: 11px;
}

.introMimi p {
  margin-top: 3px;
  color: #999aaa;
  font-size: 9px;
}

.introDescription {
  margin: 25px 0;
  color: #77788a;
  font-size: 12px;
  line-height: 1.7;
}

.startButton {
  border: 0;
  border-radius: 13px;
  background: #7569d5;
  color: white;
  padding: 12px 18px;
  font-size: 10px;
  font-weight: 850;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.15s ease;
}

.startButton:hover {
  transform: translateY(-2px);
}

.conversationScreen {
  width: min(900px, calc(100% - 48px));
  margin: 0 auto;
  padding: 25px 0 50px;
}

.conversationTop {
  margin-bottom: 15px;
}

.conversationTitle {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.conversationTitle > div:first-child > span {
  color: #aaaab7;
  font-size: 8px;
  font-weight: 850;
  letter-spacing: 0.1em;
}

.conversationTitle h1 {
  margin-top: 3px;
  color: #303147;
  font-size: 25px;
  letter-spacing: -0.04em;
}

.readyBadge {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #7b7c8c;
  font-size: 8px;
  font-weight: 750;
}

.readyBadge span {
  width: 6px;
  height: 6px;
  background: #8ed5ae;
  border-radius: 50%;
}

.chatCard {
  overflow: hidden;
  border: 1px solid #eeedf4;
  border-radius: 21px;
  background: #fff;
  box-shadow: 0 12px 35px rgba(63,58,100,0.05);
}

.chatHeader {
  padding: 12px 22px;
  border-bottom: 1px solid #f0f0f5;
}

.chatMimi {
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 54px;
  overflow: visible;
}

.chatMimi strong {
  display: block;
  color: #45465a;
  font-size: 11px;
}

.chatMimi span {
  display: block;
  color: #aaaab7;
  font-size: 8px;
  margin-top: 2px;
}

.messages {
  min-height: 280px;
  max-height: 440px;
  overflow-y: auto;
  padding: 22px;
}

.messageRow {
  display: flex;
  gap: 9px;
  margin-bottom: 17px;
  width: 100%;
  min-width: 0;
}

.messageRow.user {
  justify-content: flex-end;
}

.messageAvatar {
  width: 48px;
  height: 58px;
  flex: 0 0 48px;
  overflow: visible;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.messageContent {
  width: auto;
  max-width: min(70%, 560px);
  min-width: 0;
  flex: 0 1 auto;
}

.messageBubble {
  width: auto;
  max-width: 560px;
  padding: 12px 15px;
  border-radius: 17px 17px 17px 5px;
  background: #f4f3fb;
  color: #3d3e52;
  font-size: 13px;
  line-height: 1.55;
  overflow-wrap: break-word;
  word-break: normal;
}

.messageRow.user .messageContent {
  margin-left: 0;
  max-width: min(70%, 560px);
}

.messageRow.user .messageBubble {
  background: #7569d5;
  color: #fff;
  border-radius: 17px 17px 5px 17px;
}

.messageTools {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 6px;
}

.listenButton,
.meaningButton {
  border: 0;
  background: transparent;
  color: #999aaa;
  padding: 3px 4px;
  cursor: pointer;
  font-size: 8px;
}

.listenButton:hover,
.meaningButton:hover {
  color: #7569d5;
}

.speakerIcon {
  margin-right: 3px;
}

.meaningBox {
  margin-top: 8px;
  width: 500px;
  max-width: 100%;
  padding: 9px 12px;
  border-left: 3px solid #c5a7f7;
  border-radius: 7px;
  background: #faf9ff;
  color: #7b7b8d;
  font-size: 9px;
  line-height: 1.5;
}

.typingBubble {
  width: fit-content;
  padding: 13px 16px;
  border-radius: 17px 17px 17px 5px;
  background: #f4f3fb;
  display: flex;
  gap: 4px;
}

.typingBubble span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #aaa7c3;
  animation: typing 1s infinite ease-in-out;
}

.typingBubble span:nth-child(2) {
  animation-delay: 0.15s;
}

.typingBubble span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.45;
  }

  30% {
    transform: translateY(-3px);
    opacity: 1;
  }
}

.vocabulary {
  padding: 13px 22px 14px;
  border-top: 1px solid #f0f0f5;
}

.vocabularyTitle {
  margin-bottom: 8px;
  color: #aaaab7;
  font-size: 8px;
  font-weight: 850;
  letter-spacing: 0.1em;
}

.vocabularyList {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.vocabItem {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 7px 10px;
  border-radius: 9px;
  background: #faf9ff;
}

.vocabItem strong {
  color: #55566a;
  font-size: 9px;
}

.vocabItem span {
  color: #a0a0ae;
  font-size: 7px;
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
  min-height: 55px;
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
  cursor: pointer;
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

.optionText {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.optionText strong {
  color: #45465a;
  font-size: 10px;
  font-weight: 750;
}

.optionText small {
  color: #999aaa;
  font-size: 8px;
  line-height: 1.25;
}

.inputArea {
  padding: 13px 22px 17px;
  border-top: 1px solid #f0f0f5;
}

.inputWrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.inputWrap input {
  flex: 1;
  min-width: 0;
  height: 39px;
  padding: 0 13px;
  border: 1px solid #e6e5ee;
  border-radius: 11px;
  outline: none;
  color: #45465a;
  font-size: 10px;
}

.inputWrap input:focus {
  border-color: #c8c1ed;
}

.sendButton {
  width: 39px;
  height: 39px;
  border: 0;
  border-radius: 11px;
  background: #7569d5;
  color: #fff;
  font-size: 17px;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.sendButton:hover:not(:disabled) {
  transform: translateY(-2px);
}

.sendButton:disabled {
  opacity: 0.4;
  cursor: default;
}

.inputTip {
  margin-top: 7px;
  color: #aaaab7;
  font-size: 8px;
}

.inputTip strong {
  color: #7569d5;
}

@media (max-width: 900px) {
  .missionGrid {
    grid-template-columns: repeat(2, 1fr);
  }

  .hero {
    padding-left: 32px;
    padding-right: 20px;
  }

  .heroMimi {
    width: 260px;
  }
}

@media (max-width: 700px) {
  .topbar {
    height: auto;
    min-height: 70px;
    padding: 12px 18px;
    gap: 12px;
  }

  .headerRight {
    gap: 10px;
  }

  .languageSelector {
    flex-direction: column;
    align-items: flex-end;
    gap: 3px;
  }

  .languageSelector span {
    font-size: 7px;
  }

  .languageSelector select {
    font-size: 9px;
    padding: 6px 20px 6px 7px;
  }

  .xpArea {
    width: 80px;
  }

  .brandText span {
    display: none;
  }

  .home {
    width: calc(100% - 28px);
    padding-top: 25px;
  }

  .hero {
    min-height: auto;
    padding: 30px 25px 20px;
    display: block;
  }

  .heroMimi {
    width: 100%;
    height: 180px;
    margin-top: 10px;
  }

  .heroBlob {
    right: 50%;
    transform: translateX(50%);
  }

  .missionsHeader {
    display: block;
    margin-top: 35px;
  }

  .tip {
    width: 100%;
    margin-top: 14px;
  }

  .missionGrid {
    grid-template-columns: 1fr;
  }

  .introScreen,
  .conversationScreen {
    width: calc(100% - 28px);
  }

  .introCard {
    padding: 23px;
  }

  .conversationTitle {
    align-items: flex-end;
  }

  .readyBadge {
    display: none;
  }

  .messages {
    padding: 15px;
    min-height: 260px;
  }

  .messageContent {
    max-width: 82%;
  }

  .messageRow.user .messageContent {
    max-width: 82%;
  }

  .messageBubble {
    width: auto;
  }

  .meaningBox {
    width: auto;
  }

  .answerOptions {
    grid-template-columns: 1fr;
  }

  .answerArea,
  .vocabulary,
  .inputArea,
  .chatHeader {
    padding-left: 15px;
    padding-right: 15px;
  }
}  }
`;

  ...existing CSS...

  /* NEW CHILD-FRIENDLY CHAT DESIGN */

  .conversationScreen {
    width: min(1100px, calc(100% - 48px));
  }

  .chatCard {
    border-radius: 24px;
  }

  /* ...rest of the new CSS... */

`;
