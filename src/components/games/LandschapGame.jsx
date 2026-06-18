import { useState } from "react";
import "./LandschapGame.css";

const baseCards = [
  { id: 1, name: "Veluwe", image: "/images/storyline8/veluwen.jpeg" },
  { id: 2, name: "Ardennen", image: "/images/storyline8/ardennnen.jpg" },
  { id: 3, name: "Sahara", image: "/images/storyline8/shahara.jpeg" },
];

export default function LandschapGame() {
  const maxRounds = 3;
  const [cards] = useState(baseCards);
  const [flipped, setFlipped] = useState(false);
  const [message, setMessage] = useState("Klik op Start om te zien waar de Veluwe naartoe schuift!");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [canClick, setCanClick] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [positions, setPositions] = useState([0, 1, 2]);

  const startRound = (targetRound = round) => {
    if (targetRound > maxRounds) {
      setGameOver(true);
      return;
    }

    setRunning(true);
    setGameStarted(true);
    setMessage("Kijk goed... De kaarten gaan nu omdraaien!");
    setCanClick(false);
    setFlipped(false);

    setTimeout(() => {
      setFlipped(true);
      setMessage("Husselen maar... Blijf de Veluwe volgen!");

      let count = 0;
      const interval = setInterval(() => {
        setPositions((prev) => [...prev].sort(() => Math.random() - 0.5));
        count++;

        if (count >= 10) {
          clearInterval(interval);
          setCanClick(true);
          setRunning(false);
          setMessage("De kaarten liggen stil. Waar is de Veluwe?");
        }
      }, 400); 
    }, 1200);
  };

  const handleClick = (cardIndex) => {
    if (!canClick || gameOver || running) return;

    setCanClick(false);
    setFlipped(false); 

    const clickedCard = cards[cardIndex];
    const isCorrect = clickedCard.name === "Veluwe";

    if (isCorrect) {
      setMessage("✅ Goed geraden! Dat is de Veluwe!");
      setScore((s) => s + 1);
    } else {
      setMessage(`❌ Helaas! Dit zijn de ${clickedCard.name}.`);
    }

    setTimeout(() => {
      const nextRound = round + 1;
      if (nextRound > maxRounds) {
        setGameOver(true);
      } else {
        setRound(nextRound);
        setPositions([0, 1, 2]); 
        startRound(nextRound);
      }
    }, 2500);
  };

  const restartGame = () => {
    setFlipped(false);
    setMessage("Klik op Start om te zien waar de Veluwe naartoe schuift!");
    setScore(0);
    setRound(1);
    setCanClick(false);
    setGameOver(false);
    setGameStarted(false);
    setRunning(false);
    setPositions([0, 1, 2]);
  };

  const getTransformStyle = (cardId) => {
    const currentPos = positions[cardId - 1]; 
    const originalPos = cardId - 1;         
    
    const diff = currentPos - originalPos;
    const translateX = diff * 184;

    return {
      transform: `translateX(${translateX}px)`,
      zIndex: currentPos === 1 ? 2 : 1 
    };
  };

  return (
    <div className="game">
      <h2>🌍 Landschap Game</h2>

      {gameOver ? (
        <div className="victory-box text-center p-3">
          <h3>🎉 Game Over!</h3>
          <p className="fs-5">Jouw totale score is: <strong>{score} / {maxRounds}</strong></p>
          <button className="btn" onClick={restartGame}>Opnieuw Spelen</button>
        </div>
      ) : (
        <>
          <h3>Ronde: {round} / {maxRounds}</h3>

          {!gameStarted && (
            <button onClick={() => startRound(1)} disabled={running}>
              Start Game
            </button>
          )}

          <div className="grid">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`card ${flipped ? "flipped" : ""} ${running ? "shuffling" : ""}`}
                onClick={() => handleClick(card.id - 1)}
                style={{ 
                  pointerEvents: canClick ? "auto" : "none",
                  ...getTransformStyle(card.id) // Pas de live berekende schuif-transitie toe
                }}
              >
                {flipped ? (
                  <div className="back">?</div>
                ) : (
                  <img src={card.image} alt={card.name} />
                )}
              </div>
            ))}
          </div>

          <p className="status-msg mt-2 fw-bold text-center">{message}</p>
          <p className="fw-bold">Score: {score}</p>
        </>
      )}
    </div>
  );
}