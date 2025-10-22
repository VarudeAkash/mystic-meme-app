import { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  // Load random questions on startup
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/quiz-questions`);
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback questions
        setQuestions([
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
          }
        ]);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswer = async (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered - get result
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/generate-result`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: newAnswers }),
        });

        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error('Error generating result:', error);
        setResult({
          title: "The Mysterious Wanderer",
          description: "You're an enigma wrapped in a riddle, sprinkled with confusion and a dash of 'what even is happening?'",
          imageUrl: null,
          shareText: "I got 'The Mysterious Wanderer'! What's your mystical personality? 🔮",
          stats: {
            vibeScore: 78,
            spiritualAnimal: "Confused Panda",
            powerLevel: 65
          }
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  const shareResult = async () => {
    if (!result) {
      alert('Please complete the quiz first!');
      return;
    }
  
    try {
      setIsLoading(true);
      
      // Generate the shareable image with DALL-E result and text
      const imageResponse = await fetch(`${API_URL}/api/generate-share-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: result.title,
          description: result.description,
          vibeScore: result.stats.vibeScore,
          spiritualAnimal: result.stats.spiritualAnimal,
          powerLevel: result.stats.powerLevel,
          dalleImageUrl: result.imageUrl // Use the DALL-E generated image
        }),
      });
  
      if (!imageResponse.ok) {
        throw new Error('Failed to generate share image');
      }
  
      // Convert response to blob and create download
      const imageBlob = await imageResponse.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = imageUrl;
      downloadLink.download = `vibecraft-${result.title.toLowerCase().replace(/\s+/g, '-')}.png`;
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
  
      // Show success message with Instagram instructions
      alert(`✅ SHAREABLE IMAGE DOWNLOADED! 🎨\n\n✨ "${result.title}" ✨\n\n📱 HOW TO SHARE ON INSTAGRAM:\n\n1. Open Instagram\n2. Create Story\n3. Select downloaded image from gallery\n4. Add LINK sticker:\n   - Tap sticker icon\n   - Choose "LINK"\n   - Paste: vibecraft-ai.netlify.app\n5. Share & tag friends! 🚀\n\nYour beautiful result image is ready to go viral!`);
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
  
    } catch (error) {
      console.error('Error generating share image:', error);
      
      // Fallback to text sharing
      const shareText = `🎭 "${result.title}" on VibeCraft AI! ✨\n\n${result.description}\n\n⭐ ${result.stats.vibeScore}/100 Vibe\n🐾 ${result.stats.spiritualAnimal}\n\n👇 vibecraft-ai.netlify.app`;
      
      try {
        await navigator.clipboard.writeText(shareText);
        alert(`✅ Copied text version! 📋\n\n"${result.title}"\n${result.description}\n\nShare this text on Instagram with a LINK sticker!`);
      } catch (err) {
        alert(`📱 Share "${result.title}" on Instagram!\n\n${result.description}\n\nDon't forget to add LINK sticker with: vibecraft-ai.netlify.app`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    window.location.reload(); // Get new random questions
  };

  if (isLoadingQuestions) {
    return (
      <div className="app">
        <div className="magical-orb"></div>
        <div className="container">
          <div className="loading-section">
            <div className="crystal-ball">
              <div className="crystal-inner"></div>
            </div>
            <h2>Preparing Your Mystical Journey...</h2>
            <p>Gathering cosmic questions from the universe ✨</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="app">
        <div className="magical-orb"></div>
        <div className="container">
          <div className="loading-section">
            <div className="crystal-ball">
              <div className="crystal-inner"></div>
            </div>
            <h2>Creating Your Personality...</h2>
            <p>Consulting the meme gods and generating your AI art! 🎨</p>
            <div className="loading-steps">
              <div className="step">🔮 Analyzing your vibes...</div>
              <div className="step">🎭 Crafting your persona...</div>
              <div className="step">🤖 Generating AI art...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="app">
        <div className="magical-orb"></div>
        <div className="magical-orb-2"></div>
        <div className="container">
          <div className="result-section">
            <h1 className="title">Mystic Meme</h1>
            <p className="subtitle">Your Viral Personality Revealed!</p>
            
            <div className="result-card">
              <div className="result-badge">{result.title}</div>
              
              <div className="result-image-container">
                {result.imageUrl ? (
                  <img 
                    src={result.imageUrl} 
                    alt={result.title}
                    className="result-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`image-placeholder ${result.imageUrl ? 'hidden' : ''}`}>
                  <div className="placeholder-content">
                    <span>✨</span>
                    <p>AI Art Generation</p>
                    <small>Premium Feature Coming Soon!</small>
                  </div>
                </div>
              </div>

              <p className="result-description">{result.description}</p>
              
              <div className="result-stats">
                <div className="stat">
                  <span className="stat-label">Vibe Score</span>
                  <span className="stat-value">{result.stats.vibeScore}/100</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Spiritual Animal</span>
                  <span className="stat-value">{result.stats.spiritualAnimal}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Meme Power</span>
                  <span className="stat-value">{result.stats.powerLevel}/100</span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
            <button 
              onClick={shareResult} 
              className="share-button"
            >
              Share to Instagram Story 📱
            </button>

              <button onClick={restartQuiz} className="secondary-button">
                Discover New Personality 🔄
              </button>
            </div>

            <div className="share-instructions">
              <h4>📱 How to Share on Instagram Stories:</h4>
              <ol>
                <li>Tap "Share My Result" to download your image</li>
                <li>Open Instagram and go to Stories</li>
                <li>Select the downloaded image from your gallery</li>
                <li>Add stickers, text, or tag friends!</li>
                <li>Don't forget to include our link so friends can play too! 🎯</li>
              </ol>
              <p><strong>Pro Tip:</strong> Use the "Add Yours" sticker to start a chain! 🔗</p>
            </div>

            <div className="social-proof">
              <p>🎉 <strong>Join 12,847 people</strong> who discovered their viral personality today!</p>
              <small>Share yours and see what your friends get! 👯</small>
            </div>

            <div className="premium-teaser">
              <h3>✨ Want AI Art with Your Results?</h3>
              <p>Upgrade to Premium for custom AI-generated images with every personality!</p>
              <button className="premium-button" onClick={() => alert('Premium coming soon! 🚀')}>
                Get Premium - $2.99/month 💎
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  if (!question) {
    return (
      <div className="app">
        <div className="container">
          <div className="error-section">
            <h2>Something went wrong! 😅</h2>
            <p>Failed to load questions. Please refresh the page.</p>
            <button onClick={() => window.location.reload()} className="share-button">
              Refresh Page 🔄
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="magical-orb"></div>
      <div className="magical-orb-2"></div>
      <div className="magical-particle"></div>
      <div className="magical-particle"></div>
      <div className="magical-particle"></div>
      <div className="magical-particle"></div>
      <div className="magical-particle"></div>
      <div className="magical-particle"></div>

      <div className="container">
        <header className="header">
          <h1 className="title">Mystic Meme</h1>
          <p className="subtitle">Discover Your Viral Personality</p>
          <p className="instruction">Answer 5 random questions to reveal your true meme potential!</p>
        </header>

        <div className="quiz-section">
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="progress-text">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          
          <div className="question-card">
            <h2 className="question-text">{question.question}</h2>
            <div className="options-grid">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="option-button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-footer">
            <p>💡 <em>Choose whatever feels right! There are no wrong answers, only meme potential.</em></p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;