import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./LandschapGame.css";

const baseCards = [
  { id: 1, name: "Veluwe", image: "/images/storyline8/veluwen.jpeg" },
  { id: 2, name: "Ardennen", image: "/images/storyline8/ardennnen.jpg" },
  { id: 3, name: "Sahara", image: "/images/storyline8/shahara.jpeg" },
];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function LandschapGame() {
  const maxRounds = 3;

  const [cards, setCards] = useState(shuffle(baseCards));
  const [flipped, setFlipped] = useState(false);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [canClick, setCanClick] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);

  const startRound = () => {
    if (round >= maxRounds) {
      setGameOver(true);
      return;
    }

    setRunning(true);
    setMessage("");
    setCanClick(false);
    setFlipped(false);

    setTimeout(() => {
      setFlipped(true);

      let count = 0;

      const interval = setInterval(() => {
        setCards(shuffle(baseCards));
        count++;

        if (count >= 10) {
          clearInterval(interval);
          setCanClick(true);
          setRunning(false);
        }
      }, 120);
    }, 700);
  };

  const handleClick = (card) => {
    if (!canClick || gameOver) return;

    const isCorrect = card.name === "Veluwe";

    setCanClick(false);
    setFlipped(false);

    if (isCorrect) {
      setMessage("✅ Goed!");
      setScore((s) => s + 1);
    } else {
      setMessage("❌ Fout!");
    }

    setTimeout(() => {
      const nextRound = round + 1;
      setRound(nextRound);

      if (nextRound >= maxRounds) {
        setGameOver(true);
      } else {
        startRound();
      }
    }, 1200);
  };

  return (
    <div className="game">
      <h1>🌍 Landschap Game</h1>

      <h2>
        Ronde: {round + 1} / {maxRounds}
      </h2>

      {gameOver ? (
        <h2>🎉 Game Over! Score: {score}/{maxRounds}</h2>
      ) : (
        <button onClick={startRound} disabled={running}>
          Start
        </button>
      )}

      <div className="grid">
        <AnimatePresence>
          {cards.map((card) => (
            <motion.div
              key={card.id}
              layout
              transition={{ duration: 0.4 }}
              className={`card ${flipped ? "flipped" : ""}`}
              onClick={() => handleClick(card)}
            >
              {flipped ? (
                <div className="back">?</div>
              ) : (
                <img src={card.image} alt={card.name} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="message">{message}</p>
      <p>Score: {score}</p>
    </div>
  );
}