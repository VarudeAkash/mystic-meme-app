const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

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

      // Placeholder since image generation is disabled
      // result.imageUrl = null;
      
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
// Generate Instagram Story Image with DALL-E result
// Generate Instagram Story Image with DALL-E result - IMPROVED SPACING
app.post('/api/generate-share-image', async (req, res) => {
  const { title, description, vibeScore, spiritualAnimal, powerLevel, dalleImageUrl } = req.body;

  try {
    const { createCanvas, loadImage } = require('canvas');

    // === ADD THIS FONT FIX RIGHT HERE ===
    try {
      // Try to register common Linux system fonts (Railway uses Linux)
      registerFont('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf', { family: 'Arial', weight: 'bold' });
      registerFont('/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf', { family: 'Arial' });
      console.log('Arial fonts registered via Liberation Sans');
    } catch (fontError) {
      try {
        // Alternative common font paths
        registerFont('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', { family: 'Arial', weight: 'bold' });
        registerFont('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', { family: 'Arial' });
        console.log('Arial fonts registered via DejaVu Sans');
      } catch (secondFontError) {
        console.log('System fonts not available, using canvas defaults');
        // Your existing code will work with fallback fonts
      }
    }
    // === END OF FONT FIX ===
    
    // Instagram Story dimensions
    const width = 1080;
    const height = 1920;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Preload fonts first
    try {
      ctx.font = '10px "Arial", "Helvetica", "sans-serif"';
      ctx.fillText('', 0, 0);
    } catch (fontError) {
      console.log('Font preloading completed');
    }

    // 1. Create beautiful gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0c0c2e');
    gradient.addColorStop(0.5, '#1a1a4b');
    gradient.addColorStop(1, '#2d1b69');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Add cosmic stars effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Load and draw DALL-E generated image (with proper spacing)
    let imageLoaded = false;
    let currentY = 120; // Track current Y position for proper spacing
    
    try {
      if (dalleImageUrl) {
        const image = await loadImage(dalleImageUrl);
        imageLoaded = true;
        
        // Calculate dimensions with better spacing
        const imageSize = 460; // Slightly smaller for better spacing
        const x = (width - imageSize) / 2;
        
        // Draw image with rounded corners
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, currentY, imageSize, imageSize, 40);
        ctx.clip();
        ctx.drawImage(image, x, currentY, imageSize, imageSize);
        ctx.restore();

        // Add border around image
        ctx.strokeStyle = 'rgba(138, 110, 255, 0.8)';
        ctx.lineWidth = 8;
        ctx.roundRect(x, currentY, imageSize, imageSize, 40);
        ctx.stroke();

        // Update current Y position after image - ADDED MORE SPACE HERE
        currentY += imageSize + 80; // Increased from 60 to 80 for more space after image
      } else {
        currentY = 200; // Start lower if no image
      }
    } catch (imageError) {
      console.log('Could not load DALL-E image:', imageError);
      imageLoaded = false;
      currentY = 200; // Start lower if no image
    }

    // 4. Add personality title (with EVEN MORE space from image)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px "Arial", "Helvetica", "sans-serif"';
    ctx.textAlign = 'center';
    
    // Wrap title if too long
    const titleLines = wrapText(ctx, title, width - 120, 64);
    const titleLineHeight = 75;
    
    // ADD EXTRA SPACE BEFORE TITLE
    currentY += 20; // Additional 20px padding before title starts
    
    titleLines.forEach((line, index) => {
      ctx.fillText(line, width / 2, currentY + (index * titleLineHeight));
    });
    
    // Update Y position after title
    currentY += (titleLines.length * titleLineHeight) + 40;

    // 5. Add description (with better boundaries and spacing)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '30px "Arial", "Helvetica", "sans-serif"';
    ctx.textAlign = 'center';
    
    const descriptionLines = wrapText(ctx, description, width - 120, 30);
    const maxDescLines = 3;
    const linesToShow = descriptionLines.slice(0, maxDescLines);
    const descLineHeight = 42;
    
    linesToShow.forEach((line, index) => {
      ctx.fillText(line, width / 2, currentY + (index * descLineHeight));
    });
    
    // Update Y position after description
    currentY += (linesToShow.length * descLineHeight) + 60;

    // 6. Add stats section (with proper spacing and boundaries)
    const statsBgHeight = 200;
    const statsBgPadding = 40;
    
    // Ensure we have enough space
    if (currentY + statsBgHeight > height - 300) {
      currentY = height - 300 - statsBgHeight;
    }
    
    // Stats background
    ctx.fillStyle = 'rgba(138, 110, 255, 0.15)';
    roundRect(ctx, statsBgPadding, currentY, width - (statsBgPadding * 2), statsBgHeight, 35);
    ctx.fill();

    // Stats labels
    ctx.fillStyle = '#8a6eff';
    ctx.font = 'bold 26px "Arial", "Helvetica", "sans-serif"';
    const labelY = currentY + 60;
    
    ctx.fillText('Vibe Score', width * 0.25, labelY);
    ctx.fillText('Spirit Animal', width * 0.5, labelY);
    ctx.fillText('Power Level', width * 0.75, labelY);

    // Stats values
    ctx.fillStyle = '#ffffff';
    const valueY = currentY + 120;
    
    // Vibe Score
    ctx.font = 'bold 32px "Arial", "Helvetica", "sans-serif"';
    ctx.fillText(`${vibeScore}/100`, width * 0.25, valueY);
    
    // Spirit Animal - handle wrapping with smaller font if needed
    ctx.font = 'bold 28px "Arial", "Helvetica", "sans-serif"';
    const animalMaxWidth = 200;
    const animalLines = wrapText(ctx, spiritualAnimal, animalMaxWidth, 28);
    
    animalLines.forEach((line, index) => {
      ctx.fillText(line, width * 0.5, valueY + (index * 35));
    });
    
    // Power Level
    ctx.font = 'bold 32px "Arial", "Helvetica", "sans-serif"';
    ctx.fillText(`${powerLevel}/100`, width * 0.75, valueY);

    // Update Y position after stats
    currentY += statsBgHeight + 70;

    // 7. Add app branding and URL (with boundary check)
    const brandingY = Math.min(currentY, height - 200);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '28px "Arial", "Helvetica", "sans-serif"';
    ctx.fillText('Discover your vibe at:', width / 2, brandingY);
    
    ctx.fillStyle = '#ff6ec7';
    ctx.font = 'bold 32px "Arial", "Helvetica", "sans-serif"';
    ctx.fillText('vibecraft-ai.netlify.app', width / 2, brandingY + 50);

    // 8. Add call-to-action (with boundary check)
    const ctaY = Math.min(brandingY + 110, height - 120);
    
    ctx.fillStyle = 'rgba(255, 110, 199, 0.4)';
    roundRect(ctx, width / 2 - 140, ctaY, 280, 70, 35);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Arial", "Helvetica", "sans-serif"';
    ctx.fillText('Tap to Play!', width / 2, ctaY + 45);

    // 9. Add subtle footer/branding at the very bottom
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '22px "Arial", "Helvetica", "sans-serif"';
    ctx.fillText('VibeCraft AI • Personality Quiz', width / 2, height - 40);

    // Convert to buffer and send
    const buffer = canvas.toBuffer('image/png');
    
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="vibecraft-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png"`
    });
    
    res.send(buffer);

  } catch (error) {
    console.error('Error generating share image:', error);
    res.status(500).json({ error: 'Failed to generate share image' });
  }
});

// Keep the same wrapText function
function wrapText(ctx, text, maxWidth, fontSize) {
  if (!text) return [''];
  
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

// Keep the same roundRect function
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}
// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Mystic Meme server is running!', questionCount: QUESTION_POOL.length });
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Mystic Meme server running on port ${port}`);
});