import React, { useState } from 'react';
import './DoodGame.css';

const ritueelStappen = [
  {
    stap: 1,
    fase: "De Voorbereiding: Grafgiften",
    vraag: "De belangrijkste stamoudste is overleden. Voordat de crematie begint, moet je 3 respectvolle grafgiften kiezen die hij meeneemt op zijn reis naar het hiernamaals. Welke horen er echt bij een machtige leider uit de Bronstijd?",
    type: "selectie",
    opties: [
      { id: "zwaard", name: "Een bronzen zwaard", icon: "⚔️", correct: true, feedback: "Juist! Een bronzen zwaard toont zijn status als machtige beschermer van de stam." },
      { id: "beker", name: "Een versierde klokbeker", icon: "🏆", correct: true, feedback: "Goed zo! Hierin kreeg hij mede (honingbier) mee tegen de dorst tijdens zijn reis." },
      { id: "vlees", name: "Een stuk gebraden vlees", icon: "🥩", correct: true, feedback: "Klopt! Eten gaf de ziel extra kracht voor de lange tocht naar de voorouders." },
      { id: "telefoon", name: "Een glimmende smartphone", icon: "📱", correct: false, feedback: "Oei! Mobiele telefoons bestonden natuurlijk nog lang niet in de Bronstijd." },
      { id: "munt", name: "Een plastic map met euro's", icon: "💶", correct: false, feedback: "Nee, plastic en euro's kenden de eerste boeren op de Veluwe nog niet." }
    ],
    targetCount: 3,
    hint: "Kies voorwerpen die te maken hebben met status, eten/drinken en reizen in de oudheid!"
  },
  {
    stap: 2,
    fase: "Het Ritueel: De Stoomkuilen",
    vraag: "De brandstapel brandt. Om de grens tussen de wereld van de levenden en de doden te openen, moet je een speciaal ritueel uitvoeren bij de vier stoomkuilen die in een rechte lijn naast de heuvel liggen. Wat doe je?",
    type: "dilemma",
    opties: [
      { id: "optieA", text: "Je gooit koud water over de gloeiend hete stenen in de kuilen zodat er gigantische stoomwolken en mist ontstaan.", correct: true, feedback: "✅ Helemaal goed! Archeologen denken dat deze mysterieuze mist en stoom symbool stonden voor de overgang naar de geestenwereld." },
      { id: "optieB", text: "Je gebruikt de kuilen om een groot feestmaal te koken met wild zwijn voor het hele dorp.", correct: false, feedback: "❌ Niet juist. Hoewel er wel gegeten werd, hadden deze specifieke kuilen direct naast het graf een heilige, rituele betekenis." },
      { id: "optieC", text: "Je gooit de kuilen snel dicht met zand zodat het vuur dooft.", correct: false, feedback: "❌ Oei, nee. De stenen moesten juist ademen en stoom afblazen om het ritueel te laten slagen!" }
    ]
  },
  {
    stap: 3,
    fase: "De Afsluiting: Het Huis voor de Eeuwigheid",
    vraag: "De crematieresten en de houtskool zijn verzameld in de grafkuil. Nu moet de grafheuvel definitief worden gesloten zodat de stamoudste voor altijd herinnerd zal worden en zijn rust vindt. Wat is de laatste handeling?",
    type: "dilemma",
    opties: [
      { id: "optie1", text: "Je bouwt een houten constructie over het graf en stapelt er honderden heideplaggen overheen tot een grote, ronde heuvel.", correct: true, feedback: "✅ Prachtig gedaan! Door deze plaggenstapel ontstonden de karakteristieke grafheuvels die we vandaag de dag nog steeds op de Veluwe zien liggen." },
      { id: "optie2", text: "Je laat het graf open zodat iedereen elke dag even naar binnen kan kijken.", correct: false, feedback: "❌ Nee, de dode moest juist beschermd worden tegen roofdieren en de natuur. Het graf werd heel zorgvuldig afgedekt." },
      { id: "optie3", text: "Je markeert de plek alleen met een klein houten kruisje in het gras.", correct: false, feedback: "❌ Onjuist. Voor zo'n belangrijk persoon bouwde het hele dorp mee aan een monumentale heuvel die kilometers ver te zien was." }
    ]
  }
];

function DoodGame() {
  const [huidigeStapIndex, setHuidigeStapIndex] = useState(0);
  const [geselecteerdeGiften, setGeselecteerdeGiften] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [isStapCompleet, setIsStapCompleet] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const huidigeStap = ritueelStappen[huidigeStapIndex];

  const handleGiftClick = (optie) => {
    if (isStapCompleet) return;

    if (geselecteerdeGiften.some(item => item.id === optie.id)) {
      setGeselecteerdeGiften(geselecteerdeGiften.filter(item => item.id !== optie.id));
      setFeedback("");
      return;
    }

    if (optie.correct) {
      const nieuweSelectie = [...geselecteerdeGiften, optie];
      setGeselecteerdeGiften(nieuweSelectie);
      setFeedback(optie.feedback);

      if (nieuweSelectie.length === huidigeStap.targetCount) {
        setIsStapCompleet(true);
        setFeedback("🎉 Uitstekend! Je hebt de perfecte uitrusting samengesteld voor zijn reis.");
      }
    } else {
      setFeedback(`❌ ${optie.feedback}`);
    }
  };

  const handleDilemmaClick = (optie) => {
    if (isStapCompleet) return;

    setFeedback(optie.feedback);
    if (optie.correct) {
      setIsStapCompleet(true);
    }
  };

  const handleNextStap = () => {
    setFeedback("");
    setIsStapCompleet(false);
    setGeselecteerdeGiften([]);

    if (huidigeStapIndex + 1 < ritueelStappen.length) {
      setHuidigeStapIndex(huidigeStapIndex + 1);
    } else {
      setGameFinished(true);
    }
  };

  const restartGame = () => {
    setHuidigeStapIndex(0);
    setGeselecteerdeGiften([]);
    setFeedback("");
    setIsStapCompleet(false);
    setGameFinished(false);
  };

  return (
    <div className="dood-game">
      <h2>Het Grote Grafritueel</h2>
      <p className="intro-text">Leid de stam veilig door de drie belangrijkste fasen van het ritueel om de stamoudste te eren.</p>

      <div className="game-layout">
        
        <div className="ritueel-status-box shadow">
          <div className="stappen-toren">
            {ritueelStappen.map((s, idx) => (
              <div 
                key={s.stap} 
                className={`stap-balk ${idx === huidigeStapIndex ? 'actief' : ''} ${idx < huidigeStapIndex ? 'voltooid' : ''}`}
              >
                <span className="stap-nummer">{idx < huidigeStapIndex ? "✓" : s.stap}</span>
                <span className="stap-naam">{s.fase}</span>
              </div>
            ))}
          </div>

          <div className="visuele-fase-plaat">
            {!gameFinished ? (
              <div className="fase-illustratie">
                {huidigeStapIndex === 0 && (
                  <div className="kist-container animate-fade-in">
                    <span className="krijger-avatar">👑🪓</span>
                    <p className="status-label">Grafkuil van de stamoudste</p>
                    <div className="gekozen-giften-manden">
                      {geselecteerdeGiften.map(g => (
                        <span key={g.id} className="gift-badge" title={g.name}>{g.icon}</span>
                      ))}
                      {geselecteerdeGiften.length === 0 && <small className="text-muted">De kuil is nog leeg...</small>}
                    </div>
                  </div>
                )}
                {huidigeStapIndex === 1 && (
                  <div className="stoom-illustratie animate-fade-in">
                    <div className="kuilen-grid">
                      <span className="kuil-icon">🪨💨</span>
                      <span className="kuil-icon">🪨💨</span>
                      <span className="kuil-icon">🪨💨</span>
                      <span className="kuil-icon">🪨💨</span>
                    </div>
                    <p className="status-label mt-2">De 4 rituele stoomkuilen</p>
                  </div>
                )}
                {huidigeStapIndex === 2 && (
                  <div className="heuvel-bouw-illustratie animate-fade-in">
                    <span className="heuvel-icon">🪵⛰️🌾</span>
                    <p className="status-label">Opbouw van de plaggenheuvel</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="einde-illustratie text-center animate-fade-in">
                <span className="🏆 display-1 d-block mb-2">✨</span>
                <h4>Ritueel Voltooid</h4>
              </div>
            )}
          </div>
        </div>

        <div className="interactie-box shadow">
          {!gameFinished ? (
            <div className="actieve-fase d-flex flex-column h-100">
              <span className="badge bg-warning text-dark align-self-start mb-2">Fase {huidigeStap.stap} van 3</span>
              <h3>{huidigeStap.fase}</h3>
              <p className="vraag-tekst">{huidigeStap.vraag}</p>

              {/* RENDER OPTIES OP BASIS VAN TYPE */}
              {huidigeStap.type === "selectie" ? (
                <div className="giften-grid-keuze">
                  {huidigeStap.opties.map(optie => {
                    const isSelected = geselecteerdeGiften.some(item => item.id === optie.id);
                    return (
                      <button 
                        key={optie.id}
                        className={`gift-select-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleGiftClick(optie)}
                        disabled={isStapCompleet && !isSelected}
                      >
                        <span className="gift-emoji">{optie.icon}</span>
                        <small>{optie.name}</small>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="dilemma-lijst-keuze">
                  {huidigeStap.opties.map(optie => (
                    <button 
                      key={optie.id}
                      className="dilemma-btn"
                      onClick={() => handleDilemmaClick(optie)}
                      disabled={isStapCompleet}
                    >
                      {optie.text}
                    </button>
                  ))}
                </div>
              )}

              {feedback && (
                <p className={`feedback-banner ${feedback.includes('❌') || feedback.includes('Oei') ? 'fout' : 'goed'}`}>
                  {feedback}
                </p>
              )}

              {isStapCompleet && (
                <button className="volgende-fase-btn mt-4 animate-fade-in" onClick={handleNextStap}>
                  Volgende Fase <i className="bi bi-arrow-right"></i>
                </button>
              )}
            </div>
          ) : (
            <div className="victory-scherm text-center d-flex flex-column justify-content-center h-100">
              <h3>⭐ Stamoudste Geëerd!</h3>
              <p>Je hebt het ritueel met groot succes volbracht. De ziel is veilig bij de voorouders en de grafheuvel zal eeuwenlang herinneren aan zijn grote daden.</p>
              <button className="reset-ritueel-btn" onClick={restartGame}>Ritueel Opnieuw Leiden</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default DoodGame;