import React, { useState, useEffect } from 'react';
import './GrafheuvelGame.css';

const localGameData = {
  lagen: [
    { id: "bovenlaag", name: "1. Bovenlaag: Humus & Heide (Moderne Tijd)", desc: "De bovenste laag met planten en jonge grond." },
    { id: "plaggen", name: "2. Plaggenlaag: De Uitbreiding (IJzertijd)", desc: "Later door mensen bovenop de heuvel gestapeld." },
    { id: "zandkern", name: "3. De Zandkern: Het Hoofdgraf (Bronstijd)", desc: "De kern van de originele, eerste grafheuvel." },
    { id: "ondergrond", name: "4. De Oergrond: De Oude Bodem (Steentijd)", desc: "De diepste vaste zandgrond, van vóór de grafheuvel." }
  ],
  items: [
    { id: "munt", name: "Een modern muntje uit de grond", icon: "🪙", targetLaag: "bovenlaag", hint: "Dit voorwerp is nog niet zo heel oud en ligt dichtbij het oppervlak." },
    { id: "urn", name: "Een aardewerken IJzertijd urn", icon: "⚱️", targetLaag: "plaggen", hint: "De ijzertijd kwam ná de bronstijd, toen de heuvel werd vergroot." },
    { id: "armband", name: "Een glimmende bronzen armband", icon: "📿", targetLaag: "zandkern", hint: "Dit voorwerp hoort bij de cultuur die de allereerste heuvel bouwde." },
    { id: "pijlspunt", name: "Een vuurstenen pijlspunt van jagers", icon: "🏹", targetLaag: "ondergrond", hint: "Dit is het alleroudste voorwerp. Het lag er al voordat de heuvel bestond!" }
  ]
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function GrafheuvelGame() {
  const [shuffledItems, setShuffledItems] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gevondenItems, setGevondenItems] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    setShuffledItems(shuffleArray(localGameData.items));
  }, []);

  if (shuffledItems.length === 0) {
    return <div className="text-center p-5">Spel laden...</div>;
  }

  const huidigItem = shuffledItems[currentQuestionIndex];

  const handleLaagClick = (laagId) => {
    if (gameFinished) return;

    if (laagId === huidigItem.targetLaag) {
      setFeedback(`✅ Goed gegraven! De ${huidigItem.name} hoort inderdaad in deze laag.`);
      setGevondenItems([...gevondenItems, { laagId: laagId, icon: huidigItem.icon, name: huidigItem.name }]);
      setScore(prev => prev + 1);
      
      if (currentQuestionIndex + 1 < shuffledItems.length) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setGameFinished(true);
        setFeedback("🎉 Geweldig! Je hebt alle archeologische lagen correct onderzocht!");
      }
    } else {
      setFeedback(`❌ Oei, op deze diepte ligt dit niet. Hint: ${huidigItem.hint}`);
    }
  };

  const restartGame = () => {
    setShuffledItems(shuffleArray(localGameData.items));
    setCurrentQuestionIndex(0);
    setGevondenItems([]);
    setFeedback("");
    setScore(0);
    setGameFinished(false);
  };

  return (
    <div className="grafheuvel-game">
      <h2>De Archeologische Lagenpuzzel</h2>
      <p className="intro-text">Hoe dieper je graaft, hoe verder je teruggaat in de tijd. Klik op de juiste grondlaag om het voorwerp te vinden!</p>

      <div className="game-layout">
        
        <div className="heuvel-doorsnede">
          {localGameData.lagen.map((laag) => {
            const itemsInDezeLaag = gevondenItems.filter(item => item.laagId === laag.id);
            
            return (
              <div 
                key={laag.id} 
                className={`grondlaag ${laag.id}`}
                onClick={() => handleLaagClick(laag.id)}
              >
                <div className="laag-info">
                  <h4>{laag.name}</h4>
                  <small>{laag.desc}</small>
                </div>
                
                <div className="gevonden-items-container">
                  {itemsInDezeLaag.map((item, idx) => (
                    <span key={idx} className="found-item-pop" title={item.name}>
                      {item.icon}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="opdracht-box">
          {!gameFinished ? (
            <div className="active-quest">
              <h3>Zoek de juiste laag voor:</h3>
              <div className="item-to-find">
                <span className="big-icon">{huidigItem.icon}</span>
                <h4>{huidigItem.name}</h4>
              </div>
              <p className="hint-banner"><strong>Tip:</strong> Denk aan de volgorde van de geschiedenis!</p>
            </div>
          ) : (
            <div className="victory-box">
              <h3>🏆 Meester-Archeoloog!</h3>
              <p>Je snapt nu precies hoe de geschiedenis in de bodem van de Veluwe begraven ligt.</p>
              <button className="restart-btn" onClick={restartGame}>Opnieuw Spelen</button>
            </div>
          )}
          
          {feedback && (
            <p className={`feedback-text ${feedback.includes('❌') ? 'error' : 'success'}`}>
              {feedback}
            </p>
          )}

          <div className="score-counter">
            Voorwerpen gevonden: <strong>{score}</strong> / {shuffledItems.length}
          </div>
        </div>

      </div>
    </div>
  );
}

export default GrafheuvelGame;