import { useState } from 'react';
import './StoomkuilGame.css';

const STEPS = [
  { item: "spade", zone: "pit" },
  { item: "stones", zone: "fire" },
  { item: "stones", zone: "pit" },
  { item: "bucket", zone: "pit" }
];

function StoomkuilGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState({ text: "Sleep de juiste objecten in de juiste volgorde.", type: "muted" });
  const [pitImg, setPitImg] = useState("/images/storyline3/dirt.png");
  const [stoneImg, setStoneImg] = useState("/images/storyline3/steen.png");
  const [itemsVisible, setItemsVisible] = useState({ spade: true, stones: true, bucket: true });
  const [showSteam, setShowSteam] = useState(false);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("itemId", id);
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData("itemId");
    const targetStep = STEPS[currentStep];

    if (draggedItemId === targetStep.item && zoneId === targetStep.zone) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setStatus({ text: "Goed gedaan!", type: "success" });

      // Logica per stap
      if (draggedItemId === "spade") {
        setPitImg("/images/storyline3/kuil.png");
        setItemsVisible(prev => ({ ...prev, spade: false }));
      }

      if (draggedItemId === "stones" && nextStep === 2) {
        setStoneImg("/images/storyline3/hete_steen.png");
        setStatus({ text: "De stenen worden heet! Verplaats ze nu naar de kuil.", type: "success" });
      }

      if (draggedItemId === "stones" && nextStep === 3) {
        setItemsVisible(prev => ({ ...prev, stones: false }));
        setStatus({ text: "De hete stenen liggen in de kuil. Tijd voor water!", type: "success" });
      }

      if (nextStep === STEPS.length) {
        setStatus({ text: "🎉 Gefeliciteerd! De stoomkuil is voltooid!", type: "success" });
        setShowSteam(true);
        setItemsVisible(prev => ({ ...prev, bucket: false }));
      }
    } else {
      setStatus({ text: "❌ Fout! Dat is niet de volgende logische stap.", type: "danger" });
    }
  };

  return (
    <div className="stoomkuil-game">
      <div className="inventory-bar d-flex justify-content-center gap-4 p-3 mb-4">
        {itemsVisible.spade && (
          <div className="item" draggable onDragStart={(e) => handleDragStart(e, "spade")}>
            <img src="/images/storyline3/schep.png" alt="Schep" className="game-icon" />
          </div>
        )}
        {itemsVisible.stones && (
          <div className="item" draggable onDragStart={(e) => handleDragStart(e, "stones")}>
            <img src={stoneImg} alt="Stenen" className="game-icon" />
          </div>
        )}
        {itemsVisible.bucket && (
          <div className="item" draggable onDragStart={(e) => handleDragStart(e, "bucket")}>
            <img src="/images/storyline3/emmer.png" alt="Emmer" className="game-icon" />
          </div>
        )}
      </div>
        <div className="game-scene d-flex justify-content-center gap-5">
        {/* Voeg id="pit" toe */}
        <div id="pit" className="zone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, "pit")}>
            <img src={pitImg} alt="Kuil zone" className="zone-img" />
            {showSteam && (
            <div id="steam-effect">
                <img src="/images/storyline3/steam.png" className="steam-animation" alt="Stoom" />
            </div>
            )}
        </div>

        {/* Voeg id="fire" toe */}
        <div id="fire" className="zone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, "fire")}>
            <img src="/images/storyline3/campfire.png" alt="Vuur zone" className="zone-img" />
        </div>
        </div>

      <p className={`status-msg mt-3 fs-5 fw-bold text-center text-${status.type}`}>
        {status.text}
      </p>
    </div>
  );
}

export default StoomkuilGame;