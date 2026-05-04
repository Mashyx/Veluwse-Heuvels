import React, { useState } from 'react';
import './RitueelGame.css';

const juisteVolgorde = [
    { id: 'vuur', label: 'Vuur' },
    { id: 'offer', label: 'Offer' },
    { id: 'stenen', label: 'Stenen' }
];

function RitueelGame() {
    const [huidigeStap, setHuidigeStap] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [geplaatsteItems, setGeplaatsteItems] = useState([]);
    const [spelBegonnen, setSpelBegonnen] = useState(false);

    const handleItemClick = (item) => {
        if (item.id === juisteVolgorde[huidigeStap].id) {
            setGeplaatsteItems([...geplaatsteItems, item.id]);
            setHuidigeStap(prev => prev + 1);
            setFeedback(`Goed! Je hebt het ${item.label} geplaatst.`);
            
            if (huidigeStap + 1 === juisteVolgorde.length) {
                setFeedback("✨ Ritueel compleet! ✨");
            }
        } else {
            setFeedback(`❌ Dat is niet de juiste volgorde.`);
        }
    };

    const resetSpel = () => {
        setHuidigeStap(0);
        setFeedback("");
        setGeplaatsteItems([]);
    };

    if (!spelBegonnen) {
        return (
            <div className="game-intro">
                <h2>Het Grafritueel</h2>
                <p>Klik op de voorwerpen om ze in de juiste volgorde naar de grafheuvel te brengen.</p>
                <button className="start-btn" onClick={() => setSpelBegonnen(true)}>Start het ritueel</button>
            </div>
        );
    }

    return (
        <div className="ritueel-game">
            <div className="game-header">
                <h3>{huidigeStap < juisteVolgorde.length ? `Stap ${huidigeStap + 1}: Wat gebeurt er nu?` : "Ritueel voltooid!"}</h3>
            </div>

            <div className="ritual-zone">
                <div className="dropzone-area">
                    <div className="grafheuvel-base">
                        {geplaatsteItems.map((itemId, index) => (
                            <img 
                                key={itemId} 
                                src={`/images/storyline4/${itemId}.png`} 
                                className={`placed-item step-${index}`} 
                                alt="" 
                            />
                        ))}
                        {geplaatsteItems.length === 0 && <span className="placeholder-text">De lege grafheuvel...</span>}
                    </div>
                </div>

                <div className="items-inventory">
                    {juisteVolgorde.map((item) => {
                        const isGeplaatst = geplaatsteItems.includes(item.id);
                        return (
                            <button 
                                key={item.id}
                                className={`inventory-btn ${isGeplaatst ? 'disabled' : ''}`}
                                onClick={() => !isGeplaatst && handleItemClick(item)}
                            >
                                <img src={`/images/storyline4/${item.id}.png`} alt={item.label} className="item-img" />
                                {/* Class toegevoegd voor betere styling */}
                                <span className="item-label-text">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="game-footer">
                <p className={`feedback-banner ${feedback.includes('❌') ? 'error' : 'success'}`}>
                    {feedback}
                </p>
                {/* Duidelijke reset-knop toegevoegd */}
                <button className="reset-btn-large" onClick={resetSpel}>
                    <i className="bi bi-arrow-counterclockwise"></i> Ritueel opnieuw beginnen
                </button>
            </div>
        </div>
    );
}

export default RitueelGame;