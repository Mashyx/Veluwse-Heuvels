import { useState } from 'react';

const animals = [
  { id: 'wolf', name: "Wolf", sound: "/sounds/wolf.mp3", icon: "🐺" },
  { id: 'schaap', name: "Schaap", sound: "/sounds/sheep.mp3", icon: "🐑" },
  { id: 'koe', name: "Koe", sound: "/sounds/cow.mp3", icon: "🐄" }
];

function DierenGame() {
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [result, setResult] = useState("");
  const [guessed, setGuessed] = useState([]);

  const playSound = () => {
    const remaining = animals.filter(a => !guessed.includes(a.id));
    if (remaining.length === 0) {
      setResult("🎉 Je hebt alle dieren geraden!");
      return;
    }
    const random = remaining[Math.floor(Math.random() * remaining.length)];
    setCurrentAnimal(random);
    new Audio(random.sound).play();
    setResult("Luister goed... welk dier is dit?");
  };

  const checkGuess = (id) => {
    if (!currentAnimal) return;
    if (id === currentAnimal.id) {
      setResult(`✅ Goed! Het was de ${currentAnimal.name}.`);
      setGuessed([...guessed, id]);
      setCurrentAnimal(null);
    } else {
      setResult("❌ Fout! Probeer het nog eens.");
    }
  };

  return (
    <div className="text-center p-4">
      <h3>Raad het dier!</h3>
      <button className="btn btn-lg btn-primary my-3" onClick={playSound}>
        🔊 Speel geluid
      </button>
      
      <div className="d-flex justify-content-center gap-3 mt-3">
        {animals.map(a => (
          <button 
            key={a.id} 
            className={`btn btn-outline-dark p-3 ${guessed.includes(a.id) ? 'bg-success text-white' : ''}`}
            onClick={() => checkGuess(a.id)}
            disabled={guessed.includes(a.id)}
          >
            <span style={{ fontSize: '2rem' }}>{a.icon}</span><br/>{a.name}
          </button>
        ))}
      </div>
      <p className="mt-4 fs-5 fw-bold">{result}</p>
    </div>
  );
}

export default DierenGame;