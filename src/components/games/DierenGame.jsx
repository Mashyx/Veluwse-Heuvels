import { useState } from 'react';
import './DierenGame.css';

const animals = [
  { id: 'wolf', name: "Wolf", sound: "/sounds/wolf.mp3", icon: "🐺" },
  { id: 'schaap', name: "Schaap", sound: "/sounds/sheep.mp3", icon: "🐑" },
  { id: 'koe', name: "Koe", sound: "/sounds/cow.mp3", icon: "🐄" },
  { id: 'egel', name: "Egel", sound: "/sounds/egel.mp3", icon: "🦔" },
  { id: 'slang', name: "Slang", sound: "/sounds/slang.mp3", icon: "🐍" },
  { id: 'vos', name: "Vos", sound: "/sounds/vos.mp3", icon: "🦊" },
  { id: 'eekhoorn', name: "Eekhoorn", sound: "/sounds/eekhoorn.mp3", icon: "🐿️" }
];

function DierenGame() {
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [result, setResult] = useState("Klik op de knop om een dierengeluid te horen!");
  const [guessed, setGuessed] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAudio, setActiveAudio] = useState(null);

  const playSound = () => {
    if (activeAudio) {
      activeAudio.pause();
    }

    const remaining = animals.filter(a => !guessed.includes(a.id));
    
    if (remaining.length === 0) {
      setResult("🎉 Super! Je hebt alle dieren uit de Veluwe geraden!");
      return;
    }

    setIsPlaying(true);
    const random = remaining[Math.floor(Math.random() * remaining.length)];
    setCurrentAnimal(random);
    setResult("Luister goed... welk dier hoor je hier?");

    const audioPath = `${window.location.origin}${random.sound}`;
    const audio = new Audio(audioPath);
    
    setActiveAudio(audio);
    
    audio.play().catch(err => {
      console.error("Geluidsbestand kon niet afspelen:", err);
      setResult("❌ Oeps! Geluid kon niet laden. Check of de mp3 in public/sounds/ staat.");
      setIsPlaying(false);
    });

    audio.onended = () => {
      setIsPlaying(false);
      setActiveAudio(null); 
    };
  };

  const checkGuess = (id) => {
    if (!currentAnimal) {
      setResult("⚠️ Klik eerst op de grote knop om een nieuw geluid te starten!");
      return;
    }

    if (id === currentAnimal.id) {
      if (activeAudio) {
        activeAudio.pause();
        setActiveAudio(null); 
      }
      setIsPlaying(false); 

      const updatedGuessed = [...guessed, id];
      setGuessed(updatedGuessed);
      setCurrentAnimal(null);

      if (updatedGuessed.length === animals.length) {
        setResult("🎉 Geweldig gedaan! Je hebt alle dieren geraden!");
      } else {
        setResult(`✅ Goed zo! Dat was inderdaad de ${currentAnimal.name}. Op naar de volgende!`);
      }
    } else {
      setResult("❌ Helaas, dat dier maakt dit geluid niet. Probeer het nog eens!");
    }
  };

  const restartGame = () => {
    if (activeAudio) {
      activeAudio.pause();
    }
    setCurrentAnimal(null);
    setGuessed([]);
    setActiveAudio(null);
    setResult("Klik op de knop om een dierengeluid te horen!");
    setIsPlaying(false);
  };

  return (
    <div className="animal-game">
      <h2>🐾 Veluwse Dieren Game</h2>
      
      {guessed.length === animals.length ? (
        <div className="victory-box mt-3">
          <p className="fs-5 fw-bold text-success">{result}</p>
          <button className="btn" onClick={restartGame}>Opnieuw Spelen</button>
        </div>
      ) : (
        <>
          <button 
            className={`animal-play-btn ${isPlaying ? 'playing' : ''}`} 
            onClick={playSound}
            disabled={isPlaying}
          >
            {isPlaying ? "🎵 Aan het afspelen..." : "🔊 Speel dierengeluid af"}
          </button>
          
          <div className="animal-grid mt-4">
            {animals.map(a => {
              const isAlreadyGuessed = guessed.includes(a.id);
              return (
                <button 
                  key={a.id} 
                  className={`animal-card ${isAlreadyGuessed ? 'guessed' : ''}`}
                  onClick={() => checkGuess(a.id)}
                  disabled={isAlreadyGuessed}
                >
                  <span className="animal-icon">{a.icon}</span>
                  <span className="animal-name">{a.name}</span>
                </button>
              );
            })}
          </div>
          
          <p className="animal-status-msg mt-4">{result}</p>
          <p className="fw-bold">Voortgang: {guessed.length} / {animals.length} dieren</p>
        </>
      )}
    </div>
  );
}

export default DierenGame;