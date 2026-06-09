import { useState } from 'react';
import './zwaardgame.css';

export default function ZwaardGame({ onComplete }) {
  const [phase, setPhase] = useState('forge');
  const [heat, setHeat] = useState(20);
  const [hammerHits, setHammerHits] = useState(0);
  const [sparks, setSparks] = useState(0);
  const [forgePower, setForgePower] = useState(0);
  const [feedback, setFeedback] = useState('');

  const [sword, setSword] = useState({
    blade: 'klassiek',
    grip: 'leer',
    color: 'staal',
    ornament: 'geen',
    aura: 'normaal'
  });

  const forgeDone = heat >= 100 && hammerHits >= 5 && sparks >= 3;

  const swordClasses = `sword-preview sword-${sword.blade} color-${sword.color} grip-${sword.grip} aura-${sword.aura} ornament-${sword.ornament}`;

  const handleHeat = () => {
    setHeat((value) => Math.min(100, value + 20));
    setForgePower((value) => Math.min(100, value + 12));
    setSparks((value) => Math.min(10, value + 1));
    setFeedback('Het staal wordt gloeiend heet!');
  };

  const handleHammer = () => {
    if (heat < 60) {
      setFeedback('Eerst moet het staal warmer worden!');
      return;
    }

    setHammerHits((value) => Math.min(5, value + 1));
    setForgePower((value) => Math.min(100, value + 18));
    setSparks((value) => Math.min(10, value + 2));
    setFeedback('KLOP! Goed geslagen!');
  };

  const handleQuench = () => {
    if (heat < 80 || hammerHits < 3) {
      setFeedback('Nog niet klaar om te koelen!');
      return;
    }

    setHeat((value) => Math.max(70, value - 25));
    setForgePower((value) => Math.min(100, value + 10));
    setFeedback('Sssst! Het zwaard wordt sterker.');
  };

  const finishGame = () => {
    if (onComplete) onComplete(sword);
    setPhase('done');
  };

  return (
    <div className="zwaardgame">
      <h3>Het zwaard van de man</h3>
      <p className="intro-text">
        Sla, verhit en maak je eigen zwaard. Eerst smeden, daarna customizen.
      </p>

      {phase === 'forge' && (
        <div className="game-step forge-layout">
          <div className="forge-left">
            <div className={`forge-hall heat-${Math.floor(heat / 20)}`}>
              <div className="anvil-scene">
                <div className="forge-fire" />
                <div className="anvil" />

                <div className={`${swordClasses} forge-sword`}>
                  <div className="blade" />
                  <div className="guard" />
                  <div className="grip" />
                  <div className="pommel" />
                </div>

                <div className="spark-layer">
                  {Array.from({ length: sparks }).map((_, i) => (
                    <span key={i} className="spark" />
                  ))}
                </div>
              </div>
            </div>

            <div className="forge-stats">
              <div>
                <span>Warmte</span>
                <div className="bar">
                  <div className="fill heat" style={{ width: `${heat}%` }} />
                </div>
              </div>

              <div>
                <span>Kracht</span>
                <div className="bar">
                  <div className="fill power" style={{ width: `${forgePower}%` }} />
                </div>
              </div>

              <div className="small-stats">
                <p>Hamerslagen: {hammerHits}/5</p>
                <p>Vonken: {sparks}/3</p>
              </div>
            </div>
          </div>

          <div className="forge-right">
            <h4>Smeed het zwaard</h4>
            <p>Kies de juiste acties om het zwaard te maken.</p>

            <div className="game-actions">
              <button type="button" onClick={handleHeat}>🔥 Verhit</button>
              <button type="button" onClick={handleHammer}>🔨 Hameren</button>
              <button type="button" onClick={handleQuench}>💧 Koelen</button>
            </div>

            <div className="forge-steps">
              <div className={heat >= 60 ? 'done' : ''}>1. Staal verhitten</div>
              <div className={hammerHits >= 5 ? 'done' : ''}>2. Goed hameren</div>
              <div className={forgeDone ? 'done' : ''}>3. Afschrikken en vormen</div>
            </div>

            {feedback && <p className="feedback">{feedback}</p>}

            {forgeDone && (
              <button
                type="button"
                className="next-phase"
                onClick={() => setPhase('customize')}
              >
                Naar customizen
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'customize' && (
        <div className="game-step customize-layout">
          <div className="customize-left">
            <h4>Customiseer je zwaard</h4>

            <label>
              Kling
              <select
                value={sword.blade}
                onChange={(e) => setSword({ ...sword, blade: e.target.value })}
              >
                <option value="klassiek">Klassiek</option>
                <option value="breed">Breed</option>
                <option value="licht">Licht</option>
              </select>
            </label>

            <label>
              Greep
              <select
                value={sword.grip}
                onChange={(e) => setSword({ ...sword, grip: e.target.value })}
              >
                <option value="leer">Leer</option>
                <option value="hout">Hout</option>
                <option value="metaal">Metaal</option>
              </select>
            </label>

            <label>
              Kleur
              <select
                value={sword.color}
                onChange={(e) => setSword({ ...sword, color: e.target.value })}
              >
                <option value="staal">Staal</option>
                <option value="zwart">Zwart</option>
                <option value="goud">Goud</option>
              </select>
            </label>

            <label>
              Versiering
              <select
                value={sword.ornament}
                onChange={(e) => setSword({ ...sword, ornament: e.target.value })}
              >
                <option value="geen">Geen</option>
                <option value="runen">Runen</option>
                <option value="edelsteen">Edelsteen</option>
                <option value="goudrand">Goudrand</option>
              </select>
            </label>

            <label>
              Sfeerstijl
              <select
                value={sword.aura}
                onChange={(e) => setSword({ ...sword, aura: e.target.value })}
              >
                <option value="normaal">Normaal</option>
                <option value="episch">Episch</option>
                <option value="koninklijk">Koninklijk</option>
              </select>
            </label>

            <button type="button" onClick={finishGame}>Zwaard opslaan</button>
          </div>

          <div className="customize-right">
            <h4>Live preview</h4>
            <div className="sword-stage">
              <div className={`${swordClasses} preview-animated`}>
                <div className="blade" />
                <div className="guard" />
                <div className="grip" />
                <div className="pommel" />
              </div>
            </div>

            <div className="sword-summary">
              <span>Kling: {sword.blade}</span>
              <span>Greep: {sword.grip}</span>
              <span>Kleur: {sword.color}</span>
              <span>Versiering: {sword.ornament}</span>
              <span>Stijl: {sword.aura}</span>
            </div>

            <p className="preview-note">Het zwaard verandert meteen mee.</p>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="game-step text-center">
          <h4>Klaar!</h4>
          <p>Je zwaard is gemaakt en aangepast.</p>
          <button type="button" onClick={() => setPhase('forge')}>
            Opnieuw spelen
          </button>
        </div>
      )}
    </div>
  );
}