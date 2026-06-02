import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Quiz({ questions, quizId = 'default', onComplete, returnPath = '/plaat' }) {
  const storageKey = `quizHighscores_${quizId}`;

  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [duration, setDuration] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [saveScore, setSaveScore] = useState(true);
  const [highscores, setHighscores] = useState(() => {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  });

  const navigate = useNavigate();
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!started || showResults) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 250);

    return () => clearInterval(interval);
  }, [started, showResults]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${String(sec).padStart(2, '0')}`;
  };

  const startQuiz = () => {
    startTimeRef.current = Date.now();
    setElapsedSeconds(0);
    setStarted(true);
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const correct = index === questions[currentQuestion].correct;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    const nextQuestion = currentQuestion + 1;

    setTimeout(() => {
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        const finalSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(finalSeconds);
        setElapsedSeconds(finalSeconds);
        setShowResults(true);
      }
    }, 1500);
  };

  const saveHighscore = () => {
    const trimmedName = playerName.trim();
    if (!trimmedName) return null;

    const nextScores = [
      ...highscores,
      {
        name: trimmedName,
        score,
        duration,
        date: new Date().toISOString(),
      },
    ];

    nextScores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.duration - b.duration;
    });

    localStorage.setItem(storageKey, JSON.stringify(nextScores));
    setHighscores(nextScores);
    return nextScores;
  };

  const handleComplete = () => {
    if (saveScore && playerName.trim()) {
      saveHighscore();
    }

    if (onComplete) {
      onComplete();
    } else {
      navigate(returnPath);
    }
  };

  const handleSkipSave = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate(returnPath);
    }
  };

  const launchConfetti = () => {
    const colors = ['#ff4d4d', '#ffcc4d', '#4dff88', '#4db8ff', '#c14dff'];
    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 9999,
    });
    document.body.appendChild(container);

    for (let i = 0; i < 30; i += 1) {
      const piece = document.createElement('div');
      const size = 6 + Math.random() * 12;
      Object.assign(piece.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size * 1.6}px`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        left: `${Math.random() * 100}%`,
        top: '-20px',
        opacity: '0.95',
        borderRadius: '2px',
        transform: `rotate(${Math.random() * 360}deg)`,
        transition: 'transform 2.2s ease-out, top 2.2s ease-out, opacity 2.2s ease-out',
      });
      container.appendChild(piece);

      setTimeout(() => {
        piece.style.top = `${90 + Math.random() * 10}vh`;
        piece.style.transform = `rotate(${Math.random() * 720}deg)`;
        piece.style.opacity = '0';
      }, 20);
    }

    setTimeout(() => {
      container.remove();
    }, 2400);
  };

  if (!started) {
    return (
      <div className="quiz-intro text-center p-4">
        <h3>Laten we je kennis testen</h3>
        <p className="lead">
          Je hebt een live timer tijdens deze quiz. Probeer zo snel mogelijk de vragen goed te beantwoorden.
        </p>
        <p>
          Na afloop zie je je score, je tijd en kun je kiezen of je je resultaat opslaat.
        </p>
        <button className="btn btn-primary" onClick={startQuiz}>
          Start de quiz
        </button>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="quiz-results text-center p-4">
        <h3>Resultaat</h3>
        <p className="fs-5 my-3">
          Je hebt <strong>{score}</strong> van de <strong>{questions.length}</strong> vragen goed.
        </p>
        <p>
          Tijd: <strong>{formatTime(duration)}</strong>
        </p>

        <div className="mt-4">
          <div className="mb-3 text-start">
            <label className="form-label">Naam</label>
            <input
              type="text"
              className="form-control"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              disabled={!saveScore}
              placeholder="Typ je naam"
            />
          </div>

          <div className="form-check mb-3 text-start">
            <input
              id="saveScore"
              type="checkbox"
              className="form-check-input"
              checked={saveScore}
              onChange={(e) => setSaveScore(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="saveScore">
              Score opslaan in highscore
            </label>
          </div>

          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <button
              className="btn btn-primary"
              onClick={handleComplete}
              disabled={saveScore && !playerName.trim()}
            >
              {saveScore ? 'Opslaan en terug' : 'Terug naar schoolplaat'}
            </button>
            <button className="btn btn-secondary" onClick={handleSkipSave}>
              Niet opslaan
            </button>
            <button className="btn btn-success" type="button" onClick={launchConfetti}>
              Feest! Confetti
            </button>
          </div>
        </div>

        {highscores.length > 0 && (
          <div className="mt-5 text-start">
            <h4>Highscores</h4>
            <ol className="ps-3">
              {highscores.slice(0, 5).map((item, index) => (
                <li key={index}>
                  {item.name} - {item.score}/{questions.length} ({formatTime(item.duration)})
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  }

  const qData = questions[currentQuestion];

  return (
    <div className="quiz-box d-flex flex-column align-items-center">
      <div className="w-100 d-flex justify-content-between mb-3">
        <span>Vraag {currentQuestion + 1} van {questions.length}</span>
        <span>Tijd: {formatTime(elapsedSeconds)}</span>
      </div>

      <h4 className="mb-4 text-center">{qData.q}</h4>

      <div className="answer-options d-flex flex-column gap-2 w-75">
        {qData.o.map((option, index) => {
          let btnClass = 'btn py-3';
          if (selectedAnswer === index) {
            btnClass += isCorrect ? ' btn-success' : ' btn-danger';
          } else {
            btnClass += ' btn-primary';
          }

          return (
            <button
              key={index}
              className={btnClass}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selectedAnswer !== null && (
        <p className={`mt-3 fw-bold ${isCorrect ? 'text-success' : 'text-danger'}`}>
          {isCorrect ? 'Goed gedaan!' : 'Helaas, dat is niet juist.'}
        </p>
      )}
    </div>
  );
}

export default Quiz;