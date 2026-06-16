import { useState } from "react";
import "./LandschapGame.css";

const questions = [
  {
    question: "Welk past bij het landschap van de tijd van de eerste boeren?",
    correct: 0,
    images: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    ],
  }
];

export default function LandschapGame() {
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);

  const current = questions[index];

  const handleClick = (i) => {
    setSelected(i);

    const isCorrect = i === current.correct;

    if (isCorrect) {
      setMessage("✅ Goed!");
      setScore((s) => s + 1);
    } else {
      setMessage("❌ Fout!");
    }

    setTimeout(() => {
      setMessage("");
      setSelected(null);

      if (index < questions.length - 1) {
        setIndex(index + 1);
      } else {
        setMessage(`🎉 Klaar! Score: ${score + (isCorrect ? 1 : 0)}/${questions.length}`);
      }
    }, 1200);
  };

  return (
    <div className="game">
      <h1>🌍 Landschap Kies Game</h1>

      <h2>{current.question}</h2>

      <div className="grid">
        {current.images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="landschap"
            className={`image ${selected === i ? "selected" : ""}`}
            onClick={() => handleClick(i)}
          />
        ))}
      </div>

      <p className="message">{message}</p>
      <p>Score: {score}</p>
    </div>
  );
}