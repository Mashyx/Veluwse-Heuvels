import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Quiz({ questions, onComplete, returnPath = '/plaat/grafheuvels' }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const navigate = useNavigate();

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const correct = index === questions[currentQuestion].correct;
    setIsCorrect(correct);

    if (correct) setScore(score + 1);

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate(returnPath);
    }
  };

  if (showResults) {
    return (
      <div className="quiz-results text-center p-4">
        <h3>Resultaat</h3>
        <p className="fs-5 my-3">
          Je hebt <strong>{score}</strong> van de <strong>{questions.length}</strong> vragen goed!
        </p>
        <button className="btn-finish-story" onClick={handleComplete}>
          Volgende →
        </button>
      </div>
    );
  }

  const qData = questions[currentQuestion];

  return (
    <div className="quiz-box d-flex flex-column align-items-center">
      <p className="text-muted">Vraag {currentQuestion + 1} van {questions.length}</p>
      <h4 className="mb-4 text-center">{qData.q}</h4>
      
      <div className="answer-options d-flex flex-column gap-2 w-75">
        {qData.o.map((option, index) => {
          let btnClass = "btn py-3";
          if (selectedAnswer === index) {
            btnClass += isCorrect ? " btn-success" : " btn-danger";
          } else {
            btnClass += " btn-primary";
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
          {isCorrect ? "Goed gedaan!" : "Helaas, dat is niet juist."}
        </p>
      )}
    </div>
  );
}

export default Quiz;