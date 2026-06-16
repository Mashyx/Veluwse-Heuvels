import { useState } from 'react';
import './StoomkuilGame.css';

const STEPS = [
  { item: "spade", zone: "pit", label: "Graaf eerst een diepe kuil in de grond." },
  { item: "stones", zone: "fire", label: "Maak de koude stenen gloeiend heet in het vuur." },
  { item: "stones", zone: "pit", label: "Verplaats de gloeiend hete stenen naar de kuil." },
  { item: "bucket", zone: "pit", label: "Giet koud water over de stenen voor het stoomritueel!" }
];

function StoomkuilGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState({ text: "Sleep de schep naar de grond om te beginnen met graven.", type: "muted" });
  const [pitImg, setPitImg] = useState("/images/storyline3/dirt.png");
  const [stoneImg, setStoneImg] = useState("/images/storyline3/steen.png");
  const [itemsVisible, setItemsVisible] = useState({ spade: true, stones: true, bucket: true });
  const [showSteam, setShowSteam] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("itemId", id);
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    if (gameFinished) return;

    const draggedItemId = e.dataTransfer.getData("itemId");
    const targetStep = STEPS[currentStep];

    if (draggedItemId === targetStep.item && zoneId === targetStep.zone) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      // Logica per specifieke stap
      if (draggedItemId === "spade") {
        setPitImg("/images/storyline3/kuil.png");
        setItemsVisible(prev => ({ ...prev, spade: false }));
        setStatus({ text: "✅ Geweldig! De kuil is gegraven. Nu moeten we de stenen verhitten.", type: "success" });
      }

      if (draggedItemId === "stones" && nextStep === 2) {
        setStoneImg("/images/storyline3/hete_steen.png");
        setStatus({ text: "🔥 Sinderend heet! De stenen zijn boven de 540 graden. Breng ze snel naar de kuil!", type: "success" });
      }

      if (draggedItemId === "stones" && nextStep === 3) {
        setItemsVisible(prev => ({ ...prev, stones: false }));
        setStatus({ text: "✅ De hete stenen liggen in de kuil. Tijd voor de laatste stap: giet het water!", type: "success" });
      }

      if (nextStep === STEPS.length) {
        setStatus({ text: "🎉 Gefeliciteerd! De stoomkuil is voltooid! Er ontstaat een heilige mist.", type: "success" });
        setShowSteam(true);
        setGameFinished(true);
        setItemsVisible(prev => ({ ...prev, bucket: false }));
      }
    } else {
      setStatus({ text: "❌ Dat is niet de juiste handeling voor deze stap. Kijk goed naar de opdracht!", type: "danger" });
    }
  };

  const restartGame = () => {
    setCurrentStep(0);
    setStatus({ text: "Sleep de schep naar de grond om te beginnen met graven.", type: "muted" });
    setPitImg("/images/storyline3/dirt.png");
    setStoneImg("/images/storyline3/steen.png");
    setItemsVisible({ spade: true, stones: true, bucket: true });
    setShowSteam(false);
    setGameFinished(false);
  };

  return (
    <div className="stoomkuil-game">
      <h2>Het Bouwen van een Stoomkuil</h2>
      <p className="intro-text">Archeologen hebben ontdekt dat hete stenen en water werden gebruikt voor een bijzonder mistritueel. Help mee de stoomkuil op te bouwen!</p>

      <div className="game-layout">
        
        {/* Linkerkant: De Game Scene (Het Kamp) */}
        <div className="game-scene-wrapper shadow">
          <div className="scene-background-grid">
            
            {/* Het Vuur */}
            <div 
              id="fire" 
              className={`zone-container ${currentStep === 1 ? 'highlight-zone' : ''}`}
              onDragOver={(e) => e.preventDefault()} 
              onDrop={(e) => handleDrop(e, "fire")}
            >
              <img src="/images/storyline3/campfire.png" alt="Vuur zone" className="zone-element-img" />
              <span className="zone-label-tag">Het Vuur</span>
            </div>

            {/* De Grond / Kuil */}
            <div 
              id="pit" 
              className={`zone-container ${currentStep === 0 || currentStep === 2 || currentStep === 3 ? 'highlight-zone' : ''}`}
              onDragOver={(e) => e.preventDefault()} 
              onDrop={(e) => handleDrop(e, "pit")}
            >
              <img src={pitImg} alt="Kuil zone" className="zone-element-img" />
              <span className="zone-label-tag">De Grond</span>
              
              {showSteam && (
                <div id="steam-effect-overlay">
                  <img src="/images/storyline3/steam.png" className="steam-puff-animation" alt="Stoom" />
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Rechterkant: De Inventaris & Instructies (Gelijke hoogte!) */}
        <div className="interactie-box shadow">
          {!gameFinished ? (
            <div className="actieve-opdracht d-flex flex-column h-100">
              <span className="badge bg-bronstijd mb-2">Stap {Math.min(currentStep + 1, 4)} van 4</span>
              <h3>Huidige Opdracht</h3>
              <p className="stoom-opdracht-tekst">
                {STEPS[currentStep]?.label || "Het ritueel is in gang gezet!"}
              </p>

              {/* De Gereedschapskist / Inventaris */}
              <div className="inventaris-titel">Jouw Gereedschap (Sleep naar de juiste zone):</div>
              <div className="inventory-shelf">
                {itemsVisible.spade && (
                  <div className="draggable-tool-item" draggable onDragStart={(e) => handleDragStart(e, "spade")}>
                    <img src="/images/storyline3/schep.png" alt="Schep" className="tool-icon" />
                    <span className="tool-name-label">Schep</span>
                  </div>
                )}
                {itemsVisible.stones && (
                  <div className="draggable-tool-item" draggable onDragStart={(e) => handleDragStart(e, "stones")}>
                    <img src={stoneImg} alt="Stenen" className="tool-icon" />
                    <span className="tool-name-label">{currentStep >= 2 ? "Hete Stenen" : "Koude Stenen"}</span>
                  </div>
                )}
                {itemsVisible.bucket && (
                  <div className="draggable-tool-item" draggable onDragStart={(e) => handleDragStart(e, "bucket")}>
                    <img src="/images/storyline3/emmer.png" alt="Emmer" className="tool-icon" />
                    <span className="tool-name-label">Emmer Water</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="victory-box text-center d-flex flex-column justify-content-center h-100">
              <h3>💨 Heilige Mist Opgewekt!</h3>
              <p>Het ritueel is compleet. De stoom stijgt op langs de grafheuvels. Je hebt alle stappen in de historisch correcte volgorde uitgevoerd!</p>
              <button className="stoom-restart-btn" onClick={restartGame}>Opnieuw Bouwen</button>
            </div>
          )}

          {/* Feedback berichten strak onderaan */}
          {status.text && (
            <p className={`stoom-feedback-banner ${status.type}`}>
              {status.text}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default StoomkuilGame;