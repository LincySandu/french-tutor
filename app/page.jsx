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
      selectLanguage: 'Language',
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
      selectLanguage: 'Langue',
    },
    scenarios: {
      school: {
        name: 'À l’école',
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
          'Imagine que nous parlons de sport après l’école. Je vais te poser des questions sur les sports que tu aimes et tes équipes préférées.',
        meaning:
          'Nous allons pratiquer le français pour parler du sport et des activités que tu aimes.',
      },
      animals: {
        name: 'Les animaux',
        description:
          'Découvre les animaux et décris tes préférés.',
        category: 'NATURE',
        intro:
          'Imagine que nous visitons un parc animalier. Je vais t’aider à parler de différents animaux et à décrire ceux que tu aimes.',
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
          'Parlons de ta famille. Je vais t’aider à présenter les personnes de ta famille et à dire quelques choses sur elles.',
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
          'Imagine que nous passons l’après-midi dans un parc français. Parlons de ce que nous pouvons voir et de ce que nous aimons faire dehors.',
        meaning:
          'Nous allons pratiquer le français pour parler de ce que tu vois et fais dans un parc.',
      },
      shopping: {
        name: 'Les achats',
        description:
          'Apprends le français utile pour les magasins, les vêtements et les prix.',
        category: 'VIE QUOTIDIENNE',
        intro:
          'Imagine que nous sommes dans un magasin français. Je vais t’aider à pratiquer des mots utiles pour les vêtements, les couleurs, les prix et les achats.',
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
      selectLanguage: 'Sprache',
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
      selectLanguage: 'Limbă',
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
      selectLanguage: 'Idioma',
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

function getScenarioText(id, baseLanguage) {
  return (
    languages[baseLanguage]?.scenarios?.[id]?.intro ||
    languages.en.scenarios[id].intro
  );
}

function getInitialMeaning(id, baseLanguage) {
  return (
    languages[baseLanguage]?.scenarios?.[id]?.meaning ||
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
  const [baseLanguage, setBaseLanguage] = useState('en');
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

  const ui =
    languages[baseLanguage]?.ui ||
    languages.en.ui;

  useEffect(() => {
    const savedLanguage =
      window.localStorage.getItem(
        'mimiBaseLanguage'
      );

    if (
      savedLanguage &&
      languages[savedLanguage]
    ) {
      setBaseLanguage(savedLanguage);
    }
  }, []);

  function changeLanguage(language) {
    setBaseLanguage(language);

    window.localStorage.setItem(
      'mimiBaseLanguage',
      language
    );
  }

  useEffect(() => {
    if (!selectedScenario || showIntro) return;

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
    setShowMeaning(false);
    setInput('');
  }

  async function beginMission() {
    setShowIntro(false);

    const scenarioText = getScenarioText(
      selectedScenario.id,
      baseLanguage
    );

    setMessages([
      {
        role: 'mimi',
        text: scenarioText,
        speechText: scenarioText,
        meaning: getInitialMeaning(
          selectedScenario.id,
          baseLanguage
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
            baseLanguage,
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
              data.speechText ||
              data.reply,
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

        setTimeout(() => {
          speakFrench(
            data.speechText ||
              data.reply
          );
        }, 150);
      }
    } catch (error) {
      console.error(error);

      setMessages((current) => [
        ...current,
        {
          role: 'mimi',
          text:
            baseLanguage === 'fr'
              ? 'Désolée ! Réessayons.'
              : baseLanguage === 'de'
                ? 'Entschuldigung! Versuchen wir es noch einmal.'
                : baseLanguage === 'ro'
                  ? 'Scuze! Hai să încercăm din nou.'
                  : baseLanguage === 'es'
                    ? '¡Lo siento! Intentémoslo de nuevo.'
                    : "Désolée ! Let's try that again.",
          speechText: '',
          meaning:
            baseLanguage === 'fr'
              ? 'Un problème est survenu pendant la connexion à Mimi.'
              : baseLanguage === 'de'
                ? 'Beim Verbinden mit Mimi ist ein Problem aufgetreten.'
                : baseLanguage === 'ro'
                  ? 'A apărut o problemă la conectarea cu Mimi.'
                  : baseLanguage === 'es'
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
            baseLanguage,
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
          data.speechText ||
          data.reply ||
          'Très bien !',
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

      setTimeout(() => {
        speakFrench(
          data.speechText ||
            data.reply ||
            'Très bien !'
        );
      }, 100);
    } catch (error) {
      console.error(error);

      setMessages((current) => [
        ...current,
        {
          role: 'mimi',
          text:
            baseLanguage === 'fr'
              ? 'Désolée ! Réessayons.'
              : baseLanguage === 'de'
                ? 'Entschuldigung! Versuchen wir es noch einmal.'
                : baseLanguage === 'ro'
                  ? 'Scuze! Hai să încercăm din nou.'
                  : baseLanguage === 'es'
                    ? '¡Lo siento! Intentémoslo de nuevo.'
                    : "Désolée ! Let's try that again.",
          speechText: '',
          meaning:
            baseLanguage === 'fr'
              ? 'Un problème est survenu pendant la connexion à Mimi.'
              : baseLanguage === 'de'
                ? 'Beim Verbinden mit Mimi ist ein Problem aufgetreten.'
                : baseLanguage === 'ro'
                  ? 'A apărut o problemă la conectarea cu Mimi.'
                  : baseLanguage === 'es'
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
    setShowMeaning(false);
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
              value={baseLanguage}
              onChange={(event) =>
                changeLanguage(
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

            <div className="heroCharacter">
              <div className="characterGlow" />

              <div className="characterCard">
                <Mimi />

                <div className="speechBubble">
                  <span>Salut!</span>
                  <small>
                    {ui.readyToPlay}
                  </small>
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
                <span className="sectionEyebrow">
                  {ui.chooseAdventure}
                </span>

                <h2>
                  {ui.pickMission}
                </h2>
              </div>

              <span className="missionCount">
                {scenarios.length}{' '}
                {ui.toExplore}
              </span>
            </div>

            <div className="missionGrid">
              {scenarios.map(
                (scenario) => {
                  const translatedScenario =
                    languages[
                      baseLanguage
                    ]?.scenarios?.[
                      scenario.id
                    ] ||
                    languages.en
                      .scenarios[
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
                      style={{
                        '--accent':
                          scenario.color,
                      }}
                    >
                      <div className="missionTop">
                        <span className="missionNumber">
                          {scenario.number}
                        </span>

                        <span className="missionArrow">
                          ↗
                        </span>
                      </div>

                      <MissionIcon
                        type={
                          scenario.icon
                        }
                      />

                      <div className="missionContent">
                        <span className="missionCategory">
                          {
                            translatedScenario.category
                          }
                        </span>

                        <h3>
                          {
                            translatedScenario.name
                          }
                        </h3>

                        <p>
                          {
                            translatedScenario.description
                          }
                        </p>
                      </div>

                      <div className="playLabel">
                        <span>
                          {
                            ui.playMission
                          }
                        </span>

                        <span>→</span>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </section>

          <div className="homeTip">
            <div className="tipIcon">
              ★
            </div>

            <div>
              <strong>
                {ui.littleTip}
              </strong>

              <p>{ui.tipText}</p>
            </div>
          </div>
        </section>
      )}

      {selectedScenario &&
        showIntro && (
          <section className="introScreen">
            <div className="introBackgroundShape introShapeOne" />
            <div className="introBackgroundShape introShapeTwo" />

            <button
              className="backButton"
              onClick={goHome}
            >
              {ui.allMissions}
            </button>

            <div className="introCard">
              <div
                className="introMissionIcon"
                style={{
                  '--accent':
                    selectedScenario.color,
                }}
              >
                <MissionIcon
                  type={
                    selectedScenario.icon
                  }
                />
              </div>

              <span className="introNumber">
                {ui.mission}{' '}
                {
                  selectedScenario.number
                }
              </span>

              <h1>
                {
                  languages[
                    baseLanguage
                  ]?.scenarios?.[
                    selectedScenario.id
                  ]?.name
                }
              </h1>

              <p>
                {
                  languages[
                    baseLanguage
                  ]?.scenarios?.[
                    selectedScenario.id
                  ]?.description
                }
              </p>

              <div className="introMimi">
                <Mimi small />

                <div className="introMessage">
                  <strong>
                    {ui.hiMimi}
                  </strong>

                  <span>
                    {ui.practise}
                  </span>
                </div>
              </div>

              <button
                className="startButton"
                onClick={
                  beginMission
                }
              >
                <span>
                  {ui.startMission}
                </span>

                <span className="startArrow">
                  →
                </span>
              </button>
            </div>
          </section>
        )}

      {selectedScenario &&
        !showIntro && (
          <section className="conversation">
            <div className="conversationHeader">
              <button
                className="backButton"
                onClick={goHome}
              >
                {ui.missionsBack}
              </button>

              <div className="conversationTitle">
                <div
                  className="conversationMission"
                  style={{
                    background:
                      selectedScenario.color,
                  }}
                >
                  {
                    selectedScenario.number
                  }
                </div>

                <div>
                  <span>
                    {
                      languages[
                        baseLanguage
                      ]?.scenarios?.[
                        selectedScenario.id
                      ]?.category
                    }
                  </span>

                  <h1>
                    {
                      languages[
                        baseLanguage
                      ]?.scenarios?.[
                        selectedScenario.id
                      ]?.name
                    }
                  </h1>
                </div>
              </div>

              <div className="readyStatus">
                <span />
                {ui.ready}
              </div>
            </div>

            <div className="chatCard">
              <div className="chatHeader">
                <div className="chatMimi">
                  <Mimi small />
                </div>

                <div>
                  <strong>Mimi</strong>
                  <span>
                    {ui.frenchFriend}
                  </span>
                </div>
              </div>

              <div className="messages">
                {messages.map(
                  (
                    message,
                    index
                  ) => (
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
                                    message.speechText ||
                                      message.text
                                  )
                                }
                              >
                                <span className="speakerIcon">
                                  ◖
                                </span>

                                {ui.listen}
                              </button>
                            )}

                            {message.meaning && (
                              <button
                                className="meaningButton"
                                onClick={() =>
                                  setShowMeaning(
                                    !showMeaning
                                  )
                                }
                              >
                                {showMeaning
                                  ? ui.hideMeaning
                                  : ui.meaning}
                              </button>
                            )}
                          </div>
                        )}

                        {message.role ===
                          'mimi' &&
                          message.meaning &&
                          showMeaning && (
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
                      <div className="messageBubble typingBubble">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                )}

                <div
                  ref={
                    messagesEndRef
                  }
                />
              </div>

              {vocabulary.length > 0 && (
                <div className="vocabularyArea">
                  <div className="vocabularyTitle">
                    {ui.usefulWords}
                  </div>

                  <div className="vocabularyList">
                    {vocabulary.map(
                      (
                        word,
                        index
                      ) => {
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
                        {ui.chooseOrType}
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

              <div className="conversationTip">
                <span>
                  {ui.tip}
                </span>
                {ui.mistakes}
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
    min-height: 100%;
  }

  body {
    background: #ffffff;
    color: #25263a;
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  button,
  input,
  select {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  .page {
    min-height: 100vh;
    background:
      radial-gradient(
        circle at 80% 8%,
        rgba(228, 224, 255, 0.55),
        transparent 24%
      ),
      linear-gradient(
        180deg,
        #ffffff 0%,
        #faf9ff 100%
      );
    overflow-x: hidden;
  }

  .topbar {
    height: 76px;
    padding: 0 42px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eeeef4;
    background: rgba(255, 255, 255, 0.94);
    position: relative;
    z-index: 10;
  }

  .brand {
    border: 0;
    background: transparent;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 11px;
    text-align: left;
  }

  .brandMark {
    width: 31px;
    height: 31px;
    border-radius: 10px;
    background: #7569d5;
    position: relative;
    overflow: hidden;
    transform: rotate(-6deg);
  }

  .brandBlue,
  .brandWhite,
  .brandRed {
    position: absolute;
    height: 7px;
    width: 22px;
    border-radius: 8px;
    left: 5px;
  }

  .brandBlue {
    top: 5px;
    background: #7dcce0;
  }

  .brandWhite {
    top: 12px;
    background: #ffffff;
  }

  .brandRed {
    top: 19px;
    background: #ef879e;
  }

  .brandText {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .brandText strong {
    color: #34354a;
    font-size: 15px;
    font-weight: 850;
    line-height: 1;
  }

  .brandText span {
    color: #9b9baa;
    font-size: 9px;
    line-height: 1;
  }

  .headerRight {
    display: flex;
    align-items: center;
    gap: 25px;
  }

  .languageSelector {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .languageSelector > span {
    color: #999aaa;
    font-size: 9px;
    font-weight: 700;
  }

  .languageSelector select {
    border: 1px solid #e8e7ef;
    border-radius: 9px;
    padding: 6px 25px 6px 9px;
    background: #fff;
    color: #444559;
    font-size: 10px;
    outline: none;
  }

  .xpArea {
    width: 145px;
  }

  .levelLabel {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    color: #9a9baa;
    font-size: 8px;
    font-weight: 750;
  }

  .levelLabel strong {
    color: #7569d5;
    font-size: 9px;
  }

  .xpBar {
    width: 100%;
    height: 5px;
    border-radius: 99px;
    background: #ecebf4;
    overflow: hidden;
  }

  .xpFill {
    height: 100%;
    border-radius: inherit;
    background: #7569d5;
    transition: width 0.3s ease;
  }

  .home {
    position: relative;
    max-width: 1120px;
    margin: 0 auto;
    padding: 62px 35px 60px;
  }

  .decor {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  .decorOne {
    width: 110px;
    height: 110px;
    background: #eef9fb;
    left: -80px;
    top: 210px;
  }

  .decorTwo {
    width: 70px;
    height: 70px;
    background: #f8edf3;
    right: -20px;
    top: 420px;
  }

  .decorThree {
    width: 35px;
    height: 35px;
    border: 6px solid #eeeafc;
    right: 80px;
    top: 80px;
  }

  .hero {
    min-height: 390px;
    display: grid;
    grid-template-columns: 1fr 0.9fr;
    align-items: center;
    gap: 50px;
  }

  .heroText {
    position: relative;
    z-index: 2;
  }

  .helloPill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 10px;
    border-radius: 99px;
    background: #f3f1fd;
    color: #7569d5;
    font-size: 8px;
    font-weight: 850;
    letter-spacing: 0.08em;
  }

  .helloDot {
    width: 6px;
    height: 6px;
    background: #7569d5;
    border-radius: 50%;
  }

  .hero h1 {
    margin: 17px 0 14px;
    color: #303147;
    font-size: clamp(39px, 5vw, 62px);
    line-height: 0.98;
    letter-spacing: -0.045em;
    font-weight: 900;
  }

  .hero h1 span {
    color: #7569d5;
  }

  .heroText > p {
    max-width: 470px;
    color: #858697;
    font-size: 14px;
    line-height: 1.65;
    margin: 0;
  }

  .heroStats {
    display: flex;
    align-items: center;
    gap: 22px;
    margin-top: 27px;
  }

  .heroStats > div:not(.statDivider) {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .heroStats strong {
    color: #35364b;
    font-size: 22px;
    line-height: 1;
  }

  .heroStats span {
    color: #9b9baa;
    font-size: 8px;
    font-weight: 700;
  }

  .statDivider {
    width: 1px;
    height: 30px;
    background: #e7e6ef;
  }

  .heroCharacter {
    min-height: 350px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .characterGlow {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: #f2f0fd;
  }

  .characterCard {
    position: relative;
    z-index: 2;
    width: 270px;
    height: 290px;
    border-radius: 35px;
    background: #ffffff;
    box-shadow:
      0 20px 55px rgba(82, 77, 130, 0.12),
      0 4px 15px rgba(82, 77, 130, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .speechBubble {
    position: absolute;
    right: -65px;
    top: 32px;
    min-width: 115px;
    padding: 10px 13px;
    border-radius: 13px 13px 13px 3px;
    background: #7569d5;
    color: #fff;
    box-shadow: 0 8px 20px rgba(117, 105, 213, 0.2);
  }

  .speechBubble span,
  .speechBubble small {
    display: block;
  }

  .speechBubble span {
    font-size: 11px;
    font-weight: 800;
  }

  .speechBubble small {
    margin-top: 2px;
    font-size: 8px;
    opacity: 0.8;
  }

  .floatingShape {
    position: absolute;
    z-index: 1;
  }

  .shapeOne {
    width: 22px;
    height: 22px;
    border-radius: 7px;
    background: #ffd86b;
    top: 42px;
    left: 20px;
    transform: rotate(15deg);
  }

  .shapeTwo {
    width: 28px;
    height: 28px;
    border: 7px solid #f4a6c8;
    border-radius: 50%;
    right: 5px;
    bottom: 48px;
  }

  .shapeThree {
    width: 16px;
    height: 16px;
    background: #8ed5ae;
    border-radius: 4px;
    left: 55px;
    bottom: 28px;
    transform: rotate(25deg);
  }

  .mimi {
    width: 130px;
    height: 190px;
    position: relative;
  }

  .mimiSmall {
    transform: scale(0.45);
    transform-origin: bottom center;
    width: 130px;
    height: 190px;
  }

  .mimiEar {
    position: absolute;
    top: 23px;
    width: 39px;
    height: 53px;
    border-radius: 50% 50% 42% 42%;
    background: #7569d5;
    z-index: 1;
  }

  .mimiEarLeft {
    left: 9px;
    transform: rotate(-19deg);
  }

  .mimiEarRight {
    right: 9px;
    transform: rotate(19deg);
  }

  .mimiHead {
    position: absolute;
    z-index: 2;
    top: 23px;
    left: 18px;
    width: 94px;
    height: 96px;
    border-radius: 48% 48% 45% 45%;
    background: #c8a07c;
    box-shadow: inset 0 -4px 0 rgba(0,0,0,0.03);
  }

  .mimiEye {
    position: absolute;
    top: 38px;
    width: 9px;
    height: 12px;
    border-radius: 50%;
    background: #303147;
  }

  .mimiEyeLeft {
    left: 26px;
  }

  .mimiEyeRight {
    right: 26px;
  }

  .mimiNose {
    position: absolute;
    top: 53px;
    left: 43px;
    width: 8px;
    height: 7px;
    border-radius: 50%;
    background: #8d6652;
  }

  .mimiSmile {
    position: absolute;
    left: 36px;
    top: 63px;
    width: 23px;
    height: 11px;
    border-bottom: 3px solid #5b4140;
    border-radius: 0 0 50% 50%;
  }

  .mimiBody {
    position: absolute;
    left: 23px;
    top: 108px;
    width: 84px;
    height: 74px;
    border-radius: 38px 38px 18px 18px;
    background: #7569d5;
  }

  .mimiScarf {
    position: absolute;
    top: 2px;
    left: 7px;
    right: 7px;
    height: 15px;
    border-radius: 99px;
    background: #f4a6c8;
  }

  .missionsSection {
    margin-top: 35px;
  }

  .sectionHeading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 19px;
  }

  .sectionEyebrow {
    display: block;
    color: #aaaaba;
    font-size: 8px;
    font-weight: 850;
    letter-spacing: 0.1em;
    margin-bottom: 4px;
  }

  .sectionHeading h2 {
    margin: 0;
    color: #35364b;
    font-size: 24px;
    letter-spacing: -0.025em;
  }

  .missionCount {
    color: #a0a0ae;
    font-size: 9px;
    font-weight: 700;
  }

  .missionGrid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 13px;
  }

  .missionCard {
    min-height: 235px;
    padding: 15px;
    border: 1px solid #ecebf2;
    border-radius: 20px;
    background: #fff;
    text-align: left;
    position: relative;
    overflow: hidden;
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      border-color 0.18s ease;
  }

  .missionCard:hover {
    transform: translateY(-4px);
    border-color: var(--accent);
    box-shadow: 0 12px 30px rgba(70, 67, 105, 0.09);
  }

  .missionTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .missionNumber {
    color: #b0afbc;
    font-size: 8px;
    font-weight: 850;
  }

  .missionArrow {
    color: #a9a8b7;
    font-size: 15px;
  }

  .missionIcon {
    width: 62px;
    height: 62px;
    margin: 18px 0 15px;
    border-radius: 19px;
    background: color-mix(in srgb, var(--accent, #7569d5) 22%, white);
    position: relative;
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
    --accent: #7569d5;
  }

  .bookShape {
    position: absolute;
    width: 18px;
    height: 25px;
    background: #7569d5;
    border-radius: 3px;
    bottom: 18px;
  }

  .bookLeft {
    left: 14px;
    transform: skewY(7deg);
  }

  .bookRight {
    right: 14px;
    transform: skewY(-7deg);
  }

  .bookLine {
    position: absolute;
    width: 3px;
    height: 28px;
    background: #fff;
    opacity: 0.8;
  }

  .ballShape {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #7569d5;
  }

  .ballLine {
    position: absolute;
    background: #fff;
    height: 2px;
    width: 23px;
  }

  .ballLineOne {
    transform: rotate(45deg);
  }

  .ballLineTwo {
    transform: rotate(-45deg);
  }

  .pawPad {
    width: 24px;
    height: 22px;
    border-radius: 50% 50% 45% 45%;
    background: #7569d5;
    position: absolute;
    bottom: 16px;
  }

  .pawDot {
    width: 10px;
    height: 12px;
    border-radius: 50%;
    background: #7569d5;
    position: absolute;
  }

  .pawDotOne {
    left: 13px;
    top: 17px;
    transform: rotate(-25deg);
  }

  .pawDotTwo {
    left: 24px;
    top: 11px;
    transform: rotate(-8deg);
  }

  .pawDotThree {
    right: 13px;
    top: 17px;
    transform: rotate(25deg);
  }

  .pawDotFour {
    right: 23px;
    top: 12px;
    transform: rotate(8deg);
  }

  .starShape {
    color: #7569d5;
    font-size: 34px;
    line-height: 1;
  }

  .person {
    position: absolute;
    bottom: 16px;
    background: #7569d5;
    border-radius: 50% 50% 18% 18%;
  }

  .personOne {
    width: 17px;
    height: 29px;
    left: 12px;
  }

  .personTwo {
    width: 21px;
    height: 36px;
    left: 21px;
  }

  .personThree {
    width: 17px;
    height: 29px;
    right: 12px;
  }

  .cakeBottom {
    position: absolute;
    bottom: 15px;
    width: 36px;
    height: 20px;
    border-radius: 5px;
    background: #7569d5;
  }

  .cakeTop {
    position: absolute;
    bottom: 34px;
    width: 29px;
    height: 8px;
    border-radius: 5px;
    background: #f4a6c8;
  }

  .cakeCandle {
    position: absolute;
    bottom: 42px;
    width: 4px;
    height: 10px;
    background: #7569d5;
  }

  .treeTop {
    position: absolute;
    top: 12px;
    width: 37px;
    height: 37px;
    border-radius: 50%;
    background: #7569d5;
  }

  .treeTrunk {
    position: absolute;
    bottom: 14px;
    width: 9px;
    height: 25px;
    background: #7569d5;
    border-radius: 3px;
  }

  .bagHandle {
    position: absolute;
    top: 13px;
    width: 22px;
    height: 17px;
    border: 4px solid #7569d5;
    border-bottom: 0;
    border-radius: 12px 12px 0 0;
  }

  .bagBody {
    width: 35px;
    height: 29px;
    background: #7569d5;
    border-radius: 4px 4px 8px 8px;
    position: absolute;
    bottom: 14px;
  }

  .missionContent {
    min-height: 67px;
  }

  .missionCategory {
    color: #aaa9b7;
    font-size: 7px;
    font-weight: 850;
    letter-spacing: 0.08em;
  }

  .missionContent h3 {
    margin: 4px 0 4px;
    color: #37384c;
    font-size: 15px;
  }

  .missionContent p {
    margin: 0;
    color: #9292a1;
    font-size: 9px;
    line-height: 1.45;
  }

  .playLabel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    padding-top: 10px;
    border-top: 1px solid #f0eff4;
    color: #7569d5;
    font-size: 8px;
    font-weight: 850;
  }

  .homeTip {
    max-width: 600px;
    margin: 27px auto 0;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 17px;
    border: 1px solid #eeeef4;
    border-radius: 15px;
    background: #fff;
  }

  .tipIcon {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    background: #fff4d2;
    color: #d49b19;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
  }

  .homeTip strong {
    display: block;
    color: #55566a;
    font-size: 9px;
  }

  .homeTip p {
    margin: 2px 0 0;
    color: #9999a8;
    font-size: 8px;
  }

  .introScreen {
    min-height: calc(100vh - 76px);
    position: relative;
    padding: 40px 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background:
      radial-gradient(
        circle at 20% 30%,
        rgba(220, 244, 248, 0.8),
        transparent 24%
      ),
      #fbfaff;
  }

  .introBackgroundShape {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  .introShapeOne {
    width: 180px;
    height: 180px;
    left: -60px;
    bottom: 40px;
    background: #eef9fb;
  }

  .introShapeTwo {
    width: 100px;
    height: 100px;
    right: 5%;
    top: 100px;
    background: #f8edf3;
  }

  .backButton {
    align-self: flex-start;
    border: 0;
    background: transparent;
    color: #8d8d9d;
    padding: 5px 0;
    font-size: 10px;
    font-weight: 750;
    position: relative;
    z-index: 2;
  }

  .backButton:hover {
    color: #7569d5;
  }

  .introCard {
    width: min(100%, 550px);
    margin: auto;
    padding: 38px 45px 42px;
    border-radius: 28px;
    background: #fff;
    box-shadow:
      0 22px 60px rgba(80, 75, 120, 0.1),
      0 4px 14px rgba(80, 75, 120, 0.04);
    text-align: center;
    position: relative;
    z-index: 2;
  }

  .introMissionIcon {
    width: 74px;
    height: 74px;
    margin: 0 auto 15px;
    border-radius: 22px;
    background: color-mix(
      in srgb,
      var(--accent) 20%,
      white
    );
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .introMissionIcon .missionIcon {
    margin: 0;
  }

  .introNumber {
    color: #aaa9b7;
    font-size: 8px;
    font-weight: 850;
    letter-spacing: 0.1em;
  }

  .introCard h1 {
    margin: 7px 0 8px;
    color: #35364b;
    font-size: 30px;
    letter-spacing: -0.035em;
  }

  .introCard > p {
    margin: 0 auto;
    max-width: 400px;
    color: #8e8e9e;
    font-size: 11px;
    line-height: 1.6;
  }

  .introMimi {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    margin: 25px 0 26px;
  }

  .introMessage {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    padding: 11px 15px;
    background: #f5f3fc;
    border-radius: 13px 13px 13px 3px;
  }

  .introMessage strong {
    color: #4b4b5e;
    font-size: 10px;
  }

  .introMessage span {
    color: #9999a7;
    font-size: 8px;
    margin-top: 2px;
  }

  .startButton {
    width: 100%;
    border: 0;
    border-radius: 13px;
    padding: 13px 17px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #7569d5;
    color: #fff;
    font-size: 10px;
    font-weight: 850;
    box-shadow: 0 9px 20px rgba(117, 105, 213, 0.22);
    transition: transform 0.15s ease;
  }

  .startButton:hover {
    transform: translateY(-2px);
  }

  .startArrow {
    font-size: 16px;
  }

  .conversation {
    max-width: 980px;
    margin: 0 auto;
    padding: 28px 30px 45px;
  }

  .conversationHeader {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    margin-bottom: 22px;
  }

  .conversationHeader .backButton {
    justify-self: start;
  }

  .conversationTitle {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .conversationMission {
    width: 39px;
    height: 39px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 9px;
    font-weight: 900;
  }

  .conversationTitle span {
    display: block;
    color: #aaa9b8;
    font-size: 7px;
    font-weight: 850;
    letter-spacing: 0.08em;
  }

  .conversationTitle h1 {
    margin: 2px 0 0;
    color: #38394d;
    font-size: 19px;
    line-height: 1;
  }

  .readyStatus {
    justify-self: end;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #8f909f;
    font-size: 8px;
    font-weight: 800;
  }

  .readyStatus span {
    width: 6px;
    height: 6px;
    background: #8ed5ae;
    border-radius: 50%;
  }

  .chatCard {
    overflow: hidden;
    border: 1px solid #ecebf2;
    border-radius: 23px;
    background: #fff;
    box-shadow: 0 10px 35px rgba(72, 69, 105, 0.06);
  }

  .chatHeader {
    height: 64px;
    padding: 0 22px;
    display: flex;
    align-items: center;
    gap: 7px;
    border-bottom: 1px solid #f0eff4;
    background: #fff;
  }

  .chatMimi {
    width: 32px;
    height: 42px;
    overflow: hidden;
    position: relative;
  }

  .chatMimi .mimi {
    position: absolute;
    left: -49px;
    top: -63px;
    transform: scale(0.35);
  }

  .chatHeader strong,
  .chatHeader span {
    display: block;
  }

  .chatHeader strong {
    color: #444559;
    font-size: 10px;
  }

  .chatHeader span {
    color: #a0a0ae;
    font-size: 8px;
  }

  .messages {
    height: 430px;
    padding: 22px;
    overflow-y: auto;
    background: #fff;
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
    width: 34px;
    height: 39px;
    flex: 0 0 34px;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
  }

  .messageAvatar .mimi {
    transform: scale(0.27);
    transform-origin: bottom left;
  }

  .messageContent {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    flex: 1;
  }

  .messageBubble {
    width: 500px;
    max-width: 100%;
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
    margin-left: auto;
  }

  .messageRow.user .messageBubble {
    background: #7569d5;
    color: #fff;
    border-radius: 17px 17px 5px 17px;
  }

  .messageTools {
    display: flex;
    gap: 6px;
    margin-top: 7px;
  }

  .listenButton,
  .meaningButton {
    border: 1px solid #e9e8f0;
    background: #fff;
    border-radius: 8px;
    padding: 4px 7px;
    color: #898999;
    font-size: 8px;
  }

  .listenButton:hover,
  .meaningButton:hover {
    color: #7569d5;
    border-color: #d7d2f0;
  }

  .speakerIcon {
    display: inline-block;
    margin-right: 3px;
    color: #7569d5;
  }

  .meaningBox {
    max-width: 500px;
    margin-top: 7px;
    padding: 9px 11px;
    border-radius: 10px;
    background: #faf9fd;
    color: #858595;
    font-size: 9px;
    line-height: 1.5;
  }

  .typingBubble {
    width: 62px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .typingBubble span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #aaa6cf;
    animation: typing 1.2s infinite ease-in-out;
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
      transform: translateY(-3px);
      opacity: 1;
    }
  }

  .vocabularyArea {
    padding: 14px 22px 13px;
    border-top: 1px solid #f0eff4;
    background: #fcfbfe;
  }

  .vocabularyTitle {
    color: #9d9dab;
    font-size: 7px;
    font-weight: 850;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
  }

  .vocabularyList {
    display: flex;
    gap: 7px;
    flex-wrap: wrap;
  }

  .vocabItem {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 9px;
    border-radius: 8px;
    background: #fff;
    border: 1px solid #ecebf2;
  }

  .vocabItem strong {
    color: #55566a;
    font-size: 9px;
  }

  .vocabItem span {
    color: #9b9baa;
    font-size: 8px;
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
    display: flex;
    gap: 8px;
    padding: 14px 22px;
    border-top: 1px solid #f0eff4;
    background: #fff;
  }

  .inputArea input {
    min-width: 0;
    flex: 1;
    height: 42px;
    border: 1px solid #e7e6ef;
    border-radius: 12px;
    padding: 0 13px;
    color: #4b4c5e;
    font-size: 10px;
    outline: none;
  }

  .inputArea input:focus {
    border-color: #c9c3ee;
    box-shadow: 0 0 0 3px rgba(117, 105, 213, 0.06);
  }

  .inputArea input::placeholder {
    color: #b0afbb;
  }

  .sendButton {
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    border: 0;
    border-radius: 12px;
    background: #7569d5;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
  }

  .sendButton:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .conversationTip {
    padding: 0 22px 14px;
    color: #a1a1af;
    font-size: 8px;
  }

  .conversationTip span {
    color: #7569d5;
    font-weight: 850;
    margin-right: 4px;
  }

  @media (max-width: 900px) {
    .missionGrid {
      grid-template-columns: repeat(2, 1fr);
    }

    .hero {
      gap: 20px;
    }

    .speechBubble {
      right: -15px;
    }
  }

  @media (max-width: 700px) {
    .topbar {
      height: auto;
      min-height: 70px;
      padding: 12px 17px;
      gap: 12px;
    }

    .headerRight {
      gap: 8px;
    }

    .languageSelector > span {
      display: none;
    }

    .xpArea {
      width: 85px;
    }

    .brandText span {
      display: none;
    }

    .home {
      padding: 35px 17px 40px;
    }

    .hero {
      min-height: auto;
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .hero h1 {
      font-size: 43px;
    }

    .heroCharacter {
      min-height: 290px;
    }

    .characterCard {
      width: 220px;
      height: 230px;
    }

    .characterCard .mimi {
      transform: scale(0.8);
    }

    .speechBubble {
      right: -30px;
      top: 25px;
    }

    .missionGrid {
      grid-template-columns: 1fr;
    }

    .missionCard {
      min-height: 205px;
    }

    .conversation {
      padding: 20px 12px 30px;
    }

    .conversationHeader {
      grid-template-columns: auto 1fr auto;
      gap: 10px;
    }

    .conversationHeader .backButton {
      font-size: 8px;
    }

    .conversationTitle h1 {
      font-size: 15px;
    }

    .readyStatus {
      font-size: 7px;
    }

    .chatCard {
      border-radius: 18px;
    }

    .messages {
      height: 430px;
      padding: 16px 13px;
    }

    .messageContent {
      max-width: 82%;
    }

    .messageBubble {
      width: auto;
      font-size: 12px;
    }

    .answerOptions {
      grid-template-columns: 1fr;
    }

    .answerArea {
      padding-left: 13px;
      padding-right: 13px;
    }

    .inputArea {
      padding-left: 13px;
      padding-right: 13px;
    }

    .conversationTip {
      padding-left: 13px;
      padding-right: 13px;
    }

    .introScreen {
      padding: 25px 15px;
    }

    .introCard {
      padding: 30px 22px 32px;
    }
  }

  @media (max-width: 430px) {
    .brandText strong {
      font-size: 13px;
    }

    .headerRight {
      gap: 5px;
    }

    .languageSelector select {
      max-width: 88px;
    }

    .hero h1 {
      font-size: 38px;
    }

    .heroText > p {
      font-size: 12px;
    }

    .conversationTitle span {
      font-size: 6px;
    }

    .conversationTitle h1 {
      font-size: 13px;
    }

    .conversationMission {
      width: 34px;
      height: 34px;
    }

    .readyStatus {
      display: none;
    }

    .messageRow {
      gap: 6px;
    }

    .messageAvatar {
      width: 29px;
      flex-basis: 29px;
    }

    .messageContent {
      max-width: 88%;
    }

    .answerTitle {
      flex-direction: column;
      gap: 2px;
    }

    .vocabularyList {
      display: grid;
      grid-template-columns: 1fr;
    }
  }
`;
