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
          "We are going to practise talking about school and your favourite subjects.",
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
  if (typeof window === 'undefined' || !window.speechSynthesis) {
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

  const ui = languages[baseLanguage]?.ui || languages.en.ui;

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(
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
          baseLanguage,
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
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: selectedScenario.id,
          messages: updatedMessages,
          baseLanguage,
        }),
      });

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
        text: data.reply || 'Très bien !',
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

      setAnswerOptions(data.options || []);
      setVocabulary(data.vocabulary || []);

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

        <div className="headerRight">
          <div className="languageSelector">
            <span>{ui.selectLanguage}</span>

            <select
              value={baseLanguage}
              onChange={(event) =>
                changeLanguage(event.target.value)
              }
              aria-label={ui.selectLanguage}
            >
              {Object.entries(languages).map(
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
                <span>{ui.heroTitle2}</span>{' '}
                {ui.heroTitle3}
              </h1>

              <p>{ui.heroText}</p>

              <div className="heroStats">
                <div>
                  <strong>{scenarios.length}</strong>
                  <span>{ui.missions}</span>
                </div>

                <div className="statDivider" />

                <div>
                  <strong>5</strong>
                  <span>{ui.xpPerAnswer}</span>
                </div>
              </div>
            </div>

            <div className="heroCharacter">
              <div className="characterGlow" />

              <div className="characterCard">
                <Mimi />

                <div className="speechBubble">
                  <span>Salut!</span>
                  <small>{ui.readyToPlay}</small>
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

                <h2>{ui.pickMission}</h2>
              </div>

              <span className="missionCount">
                {scenarios.length} {ui.toExplore}
              </span>
            </div>

            <div className="missionGrid">
              {scenarios.map((scenario) => {
                const translatedScenario =
                  languages[baseLanguage]
                    ?.scenarios?.[scenario.id] ||
                  languages.en.scenarios[
                    scenario.id
                  ];

                return (
                  <button
                    key={scenario.id}
                    className="missionCard"
                    onClick={() =>
                      selectScenario(scenario)
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
                      type={scenario.icon}
                    />

                    <div className="missionContent">
                      <span className="missionCategory">
                        {
                          translatedScenario.category
                        }
                      </span>

                      <h3>
                        {translatedScenario.name}
                      </h3>

                      <p>
                        {
                          translatedScenario.description
                        }
                      </p>
                    </div>

                    <div className="playLabel">
                      <span>
                        {ui.playMission}
                      </span>

                      <span>→</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="homeTip">
            <div className="tipIcon">★</div>

            <div>
              <strong>
                {ui.littleTip}
              </strong>

              <p>{ui.tipText}</p>
            </div>
          </div>
        </section>
      )}

      {selectedScenario && showIntro && (
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
                type={selectedScenario.icon}
              />
            </div>

            <span className="introNumber">
              {ui.mission}{' '}
              {selectedScenario.number}
            </span>

            <h1>
              {
                languages[baseLanguage]
                  ?.scenarios?.[
                    selectedScenario.id
                  ]?.name
              }
            </h1>

            <p>
              {
                languages[baseLanguage]
                  ?.scenarios?.[
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
              onClick={beginMission}
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

      {selectedScenario && !showIntro && (
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
                {selectedScenario.number}
              </div>

              <div>
                <span>
                  {
                    languages[baseLanguage]
                      ?.scenarios?.[
                        selectedScenario.id
                      ]?.category
                  }
                </span>

                <h1>
                  {
                    languages[baseLanguage]
                      ?.scenarios?.[
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
                            {message.meaning}
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

              <div ref={messagesEndRef} />
            </div>

            {vocabulary.length > 0 && (
              <div className="vocabulary">
                <div className="vocabularyTitle">
                  {ui.usefulWords}
                </div>

                <div className="vocabularyList">
                  {vocabulary.map(
                    (word, index) => (
                      <div
                        className="vocabItem"
                        key={index}
                      >
                        <strong>
                          {word.french ||
                            word}
                        </strong>

                        {(word.translation ||
                          word.english) && (
                          <span>
                            {word.translation ||
                              word.english}
                          </span>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {answerOptions.length > 0 &&
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
                      (option, index) => {
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
                                  {translation}
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
              <div className="inputWrapper">
                <input
                  value={input}
                  onChange={(event) =>
                    setInput(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter'
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
                >
                  →
                </button>
              </div>

              <div className="inputHint">
                <span>{ui.tip}</span>{' '}
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
  input,
  select {
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

  .headerRight {
    display: flex;
    align-items: center;
    gap: 22px;
  }

  .languageSelector {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .languageSelector > span {
    color: #999aaa;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.4px;
  }

  .languageSelector select {
    appearance: none;
    border: 1px solid #e7e6ef;
    background: #fff;
    color: #393a4e;
    border-radius: 10px;
    padding: 7px 27px 7px 10px;
    font-size: 10px;
    font-weight: 750;
    cursor: pointer;
    outline: none;
  }

  .languageSelector select:focus {
    border-color: #b9b0ed;
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
  width: min(82%, 720px);
  max-width: 720px;
  min-width: 0;
}

.messageBubble {
  width: 100%;
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

    .headerRight {
      gap: 8px;
    }

    .languageSelector > span {
      display: none;
    }

    .languageSelector select {
      padding: 7px 8px;
      max-width: 95px;
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
