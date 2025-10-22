const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Larger question pool (20 questions)
const QUESTION_POOL = [
  {
    id: 1,
    question: "Your ideal weekend involves...",
    options: [
      "Binging shows with snacks 🍿",
      "Exploring hidden local spots 🗺️",
      "Organizing your entire life 📊",
      "Dramatic photo shoots for the gram 📸"
    ]
  },
  {
    id: 2,
    question: "Choose a mystical companion:",
    options: [
      "A sarcastic robot cat 🤖",
      "A dragon that's bad at flying 🐉",
      "A ghost who gives terrible advice 👻",
      "A talking plant with attitude 🌿"
    ]
  },
  {
    id: 3,
    question: "Your superpower would be:",
    options: [
      "Turning anxiety into productivity ⚡",
      "Finding parking spots instantly 🅿️",
      "Speaking every language (including dolphin) 🐬",
      "Making perfect avocado toast every time 🥑"
    ]
  },
  {
    id: 4,
    question: "Your brain is mostly filled with:",
    options: [
      "Random song lyrics 🎵",
      "Anxiety about things that will never happen 😰",
      "Plans for 10 different business ideas 💡",
      "Memes from 2016 🤣"
    ]
  },
  {
    id: 5,
    question: "Choose a road trip snack:",
    options: [
      "Gas station sushi 🍣",
      "Questionable beef jerky 🥩",
      "Overpriced airport water 💧",
      "Mysterious chips from 2005 🥔"
    ]
  },
  {
    id: 6,
    question: "Your spirit animal is:",
    options: [
      "A sloth that drinks coffee ☕",
      "A raccoon in a tuxedo 🦝",
      "A dramatic squirrel 🐿️",
      "A confused panda 🐼"
    ]
  },
  {
    id: 7,
    question: "Your love language is:",
    options: [
      "Sending memes at 3 AM 💕",
      "Remembering their coffee order ☕",
      "Emergency chocolate supplies 🍫",
      "Awkward but sincere compliments 😳"
    ]
  },
  {
    id: 8,
    question: "Choose a magical item:",
    options: [
      "A cloak of invisibility (but it only works when no one's looking) 🫥",
      "A time machine that only goes forward 5 minutes ⏰",
      "A crystal ball that shows you what you already know 🔮",
      "A wand that occasionally works ✨"
    ]
  },
  {
    id: 9,
    question: "Your productivity style:",
    options: [
      "Panic at the last minute 😱",
      "Color-coded spreadsheets 📊",
      "15 tabs open, all memes 🖥️",
      "Nap-based decision making 🛏️"
    ]
  },
  {
    id: 10,
    question: "Choose a fantasy world to live in:",
    options: [
      "Hogwarts but you're a muggle 🏰",
      "Middle-earth but you have to walk everywhere 🚶",
      "Wakanda but your tech keeps glitching 📱",
      "Narnia but it's always winter ❄️"
    ]
  },
  {
    id: 11,
    question: "Your signature dance move:",
    options: [
      "The awkward shuffle 🕺",
      "Grandma at a wedding 💃",
      "TikTok trend from 2 years ago 📱",
      "Interpretive dance about taxes 💸"
    ]
  },
  {
    id: 12,
    question: "Your kitchen contains:",
    options: [
      "17 identical mugs ☕",
      "A single fork 🍴",
      "Expired sauce packets 🌶️",
      "Bread that might be artisanal or might be moldy 🍞"
    ]
  },
  {
    id: 13,
    question: "Choose a super villain origin story:",
    options: [
      "Someone took the last coffee ☕",
      "Your WiFi went down during a meeting 📡",
      "They forgot your birthday 🎂",
      "You sat on your glasses 👓"
    ]
  },
  {
    id: 14,
    question: "Your ideal pet:",
    options: [
      "A cat that judges your life choices 😼",
      "A dog with more Instagram followers than you 📸",
      "A fish that's seen things 🐠",
      "A plant you occasionally remember to water 🌱"
    ]
  },
  {
    id: 15,
    question: "Your hidden talent:",
    options: [
      "Remembering every TV show theme song 📺",
      "Parallel parking on the first try 🚗",
      "Finding the end of the tape roll 🎬",
      "Accurate weather prediction by knee pain 🌧️"
    ]
  },
  {
    id: 16,
    question: "Choose a time period to visit:",
    options: [
      "The 90s for the fashion and existential dread 👖",
      "The future but you forgot to charge your phone 🔋",
      "Ancient Rome but you only speak emoji 🏛️",
      "The 80s for the hair and the confusion 💇"
    ]
  },
  {
    id: 17,
    question: "Your brain contains:",
    options: [
      "90% memes, 10% anxiety 🤪",
      "A detailed map of every coffee shop ☕",
      "The entire script of Shrek 🧅",
      "Plans for 17 different careers 💼"
    ]
  },
  {
    id: 18,
    question: "Choose a road trip companion:",
    options: [
      "GPS that's passive aggressive 🗺️",
      "A playlist of only one band 🎵",
      "Snacks that may or may not be expired 🍪",
      "A car that only plays classical music 🎻"
    ]
  },
  {
    id: 19,
    question: "Your ideal superpower:",
    options: [
      "Teleportation but only to places you've already been ✈️",
      "Invisibility but you can't turn it off 🫥",
      "Flight but only 3 feet off the ground 🕊️",
      "Mind reading but only for pets 🐶"
    ]
  },
  {
    id: 20,
    question: "Choose a fantasy job:",
    options: [
      "Professional nap tester 🛏️",
      "Cat video quality assurance 🐱",
      "Meme historian 📜",
      "Snack food sommelier 🍷"
    ]
  }
];

// Get 5 random questions
app.get('/api/quiz-questions', (req, res) => {
  const shuffled = [...QUESTION_POOL].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, 5);
  res.json(selectedQuestions);
});

// Generate personality result with AI image
app.post('/api/generate-result', async (req, res) => {
  const { answers } = req.body;

  try {
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Step 1: Generate personality description
    const personalityCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a hilarious, viral content creator. Generate funny personality archetypes based on quiz answers. 
          Return ONLY a JSON object with this exact structure:
          {
            "title": "Catchy 4-6 word title",
            "description": "2-3 funny sentences describing the personality",
            "imagePrompt": "Detailed visual description for AI image generation of this personality as a cartoon character",
            "shareText": "Funny sharing text with emojis"
          }
          
          Make it humorous, relatable, and highly shareable. Base it on these answers.`
        },
        {
          role: 'user',
          content: `Quiz answers: ${answers.join(' | ')}`
        }
      ],
      temperature: 0.9,
      max_tokens: 500
    });

    const content = personalityCompletion.choices[0].message.content;
    let result;
    
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      result = {
        title: "The Mysterious Meme Lord",
        description: "You're 90% mystery, 10% questionable life choices, and 100% memeable. Your aura confuses GPS and inspires spontaneous dance breaks.",
        imagePrompt: "a mysterious cartoon character surrounded by floating memes and question marks, digital art, vibrant colors",
        shareText: "I'm a Mysterious Meme Lord! What's your viral personality? 🔮"
      };
    }

    // Step 2: Generate AI image
    try {
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Cartoon character illustration, ${result.imagePrompt}. Colorful, fun, viral meme style, digital art, clean background`,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });

      result.imageUrl = imageResponse.data[0].url;
    } catch (imageError) {
      console.log('Image generation failed, using placeholder');
      result.imageUrl = null;
    }

    // Add some fun stats
    result.stats = {
      vibeScore: Math.floor(Math.random() * 30) + 70,
      spiritualAnimal: ["Confused Panda", "Dramatic Squirrel", "Anxious Sloth", "Meme-loving Raccoon"][Math.floor(Math.random() * 4)],
      powerLevel: Math.floor(Math.random() * 50) + 50
    };

    res.json(result);
  } catch (error) {
    console.error('Error generating result:', error);
    // Fallback result
    res.json({
      title: "The Glitch in the Matrix",
      description: "You're the human equivalent of a 404 error - mysterious, confusing, but somehow still delightful. Reality buffers around you.",
      imageUrl: null,
      shareText: "I'm a Glitch in the Matrix! Find your vibe 🔮",
      stats: {
        vibeScore: 85,
        spiritualAnimal: "Digital Ghost",
        powerLevel: 73
      }
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Mystic Meme server is running!', questionCount: QUESTION_POOL.length });
});

app.listen(port, () => {
  console.log(`Mystic Meme server running on port ${port}`);
});