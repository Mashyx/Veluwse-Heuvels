import React, { useState } from 'react';
import './KledingGame.css' 

const slots = ['head', 'neck', 'top', 'jacket', 'arm', 'bottom', 'shoes', 'accessory'];

const itemsData = [
    // Man items
    { model: 'male', slot: 'neck', id: 'ketting', label: 'Ketting', icon: '📿' },
    { model: 'male', slot: 'arm', id: 'armband', label: 'Armband', icon: '💍' },
    { model: 'male', slot: 'top', id: 'shirt', label: 'Shirt', icon: '👕' },
    { model: 'male', slot: 'bottom', id: 'broek', label: 'Broek', icon: '👖' },
    { model: 'male', slot: 'jacket', id: 'jas', label: 'Mantel', icon: '🧥' },
    { model: 'male', slot: 'shoes', id: 'schoenen', label: 'Schoenen', icon: '👞' },
    { model: 'male', slot: 'bottom', id: 'lang-gewaad', label: 'Gewaad', icon: '👗' },
    { model: 'male', slot: 'accessory', id: 'riem', label: 'Riem', icon: '🎗️' },
    // Vrouw items (zelfde IDs voor de logica, maar gefilterd op model)
    { model: 'female', slot: 'neck', id: 'ketting', label: 'Ketting', icon: '📿' },
    { model: 'female', slot: 'arm', id: 'armband', label: 'Armband', icon: '💍' },
    { model: 'female', slot: 'top', id: 'shirt', label: 'Shirt', icon: '👕' },
    { model: 'female', slot: 'bottom', id: 'broek', label: 'Rok', icon: '👗' },
    { model: 'female', slot: 'jacket', id: 'jas', label: 'Mantel', icon: '🧥' },
    { model: 'female', slot: 'shoes', id: 'schoenen', label: 'Schoenen', icon: '👞' },
    { model: 'female', slot: 'bottom', id: 'lang-gewaad', label: 'Kleed', icon: '👗' },
    { model: 'female', slot: 'accessory', id: 'riem', label: 'Riem', icon: '🎗️' },
];

function KledingGame() {
    const [model, setModel] = useState('male');
    const [outfit, setOutfit] = useState({
        head: '', neck: '', top: '', jacket: '', arm: '', bottom: '', shoes: '', accessory: ''
    });

    const toggleItem = (slot, item) => {
        setOutfit(prev => {
            const next = { ...prev };
            if (next[slot] === item) {
                next[slot] = '';
            } else {
                next[slot] = item;
                // Exclusiviteitsregels uit je JS
                if (item === 'lang-gewaad') next.top = '';
                if (slot === 'top' && item === 'shirt' && next.bottom === 'lang-gewaad') {
                    next.bottom = '';
                }
            }
            return next;
        });
    };

    const reset = () => setOutfit({ head: '', neck: '', top: '', jacket: '', arm: '', bottom: '', shoes: '', accessory: '' });

    // Splits de items voor de linkerkant en rechterkant van de grid
    const currentItems = itemsData.filter(i => i.model === model);
    const leftItems = currentItems.slice(0, 4);
    const rightItems = currentItems.slice(4, 8);

    return (
        <div className="dressup-game">
            <div className="dressup-layout">
                {/* Linkerkant items */}
                <div className="dressup-side dressup-side-left">
                    {leftItems.map(item => (
                        <button 
                            key={item.id} 
                            className={`dressup-item ${outfit[item.slot] === item.id ? 'is-active' : ''}`}
                            onClick={() => toggleItem(item.slot, item.id)}
                        >
                            <div className="dressup-item-image d-flex align-items-center justify-content-center bg-white">
                                <span style={{fontSize: '2rem'}}>{item.icon}</span>
                            </div>
                            <span className="dressup-item-label">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Midden: Karakter */}
                <div className="dressup-center">
                    <div className="dressup-stage">
                        <div className="dressup-character">
                            {/* Basis laag */}
                            <div className="character-layer layer-base" 
                                 style={{backgroundImage: `url(/images/storyline2/dressup/models/${model}-base.png)`}}></div>
                            
                            {/* Kleding lagen */}
                            {slots.map(slot => outfit[slot] && (
                                <div key={slot} 
                                     className={`character-layer layer-${slot}`} 
                                     style={{backgroundImage: `url(/images/storyline2/dressup/items/${model}/${outfit[slot]}.png)`}}></div>
                            ))}
                        </div>
                    </div>

                    <div className="dressup-model-switch mt-3">
                        <button className={`model-btn ${model === 'male' ? 'is-active' : ''}`} onClick={() => setModel('male')}>Man</button>
                        <button className={`model-btn ${model === 'female' ? 'is-active' : ''}`} onClick={() => setModel('female')}>Vrouw</button>
                    </div>

                    <button id="dressup-reset" className="btn mt-3" onClick={reset}>Reset outfit</button>
                </div>

                {/* Rechterkant items */}
                <div className="dressup-side dressup-side-right">
                    {rightItems.map(item => (
                        <button 
                            key={item.id} 
                            className={`dressup-item ${outfit[item.slot] === item.id ? 'is-active' : ''}`}
                            onClick={() => toggleItem(item.slot, item.id)}
                        >
                            <div className="dressup-item-image d-flex align-items-center justify-content-center bg-white">
                                <span style={{fontSize: '2rem'}}>{item.icon}</span>
                            </div>
                            <span className="dressup-item-label">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default KledingGame;