import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Plaat.css';

function Plaat() {
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [showZoomButtons, setShowZoomButtons] = useState(true);
  const [expandedPOI, setExpandedPOI] = useState(null);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);

  // We gebruiken refs om de staat van het slepen bij te houden zonder re-renders
  const state = useRef({
    isDragging: false,
    hasMoved: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    lastTouchDistance: 0
  });

  const hotspots = [
    { id: 1, top: '47%', left: '41%', title: 'Stoomkuilen', info: 'Tijdens het ritueel tonen de vier stoomkuilen verschillende scènes: een actieve kuil met stoom die richting de grafheuvel waait; een moeder en haar zoontje bij het blussen van stenen; een jongen die een hete steen brengt om te helpen; en een meisje dat in stilte afscheid neemt met een barnstenen aandenken. Verder beheert een man het vuur bij een haard waar stenen en aardewerk worden verhit, terwijl een buurvrouw met een pot water wacht om te helpen blussen..', link: '/storyline3' },
    { id: 2, top: '15%', left: '52%', title: 'Dieren', info: ' Om te voorkomen dat de open heide tot een jong loofbos groeit liep er regelmatig vee rond. In dit geval heb ik ervoor gekozen om schapen in de verte af te beelden. Deze hebben weer een link met de herder (tweeling) op de middengrond, die even de tijd nam om bij het ritueel te zijn. Op het pad van heuvel 2 naar heuvel 1 lopen twee mensen. De vrouw heeft water meegenomen en de man naast haar heeft brandhout meegenomen voor het vuur. Tenslotte is de plek waar de plaggen net zijn afgestoken te zien achter de “wachter”, zodat er ook hier continuïteit in verhaallijn zit.', link: '/storyline1' },
    { id: 3, top: '32%', left: '78%', title: 'Het grafritueel', info: 'Tijdens een begrafenisritueel legt de weduwe verkoold hout in het graf, terwijl een belangrijke vrouw een toespraak houdt. Rondom de grafheuvel staan familie en kennissen: sommigen rouwen en troosten elkaar, anderen kijken nieuwsgierig toe of brengen giften. Ontdek wwaarom ze dit doen en wat er precies gebeurt.', link: '/storyline4' },
    { id: 4, top: '45%', left: '10%', title: 'Kleding', info: 'Hoe liep iemand er in de bronstijd eigenlijk bij? Ontdek gewaden, riemen en sieraden uit een lang vergane tijd en stel zelf een outfit samen als een echte stijlexpert uit de prehistorie!', link: '/storyline2' }
  ];

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container) return;

    const constrain = () => {
      const rect = container.getBoundingClientRect();
      const minX = Math.min(0, wrapper.clientWidth - rect.width);
      const minY = Math.min(0, wrapper.clientHeight - rect.height);
      state.current.offsetX = Math.max(minX, Math.min(0, state.current.offsetX));
      state.current.offsetY = Math.max(minY, Math.min(0, state.current.offsetY));
    };

    const update = () => {
      container.style.transform = `translate3d(${state.current.offsetX}px, ${state.current.offsetY}px, 0) scale(${state.current.scale})`;
      const icons = container.querySelectorAll('.vergrootglas');
      icons.forEach(v => {
        // Hide POIs when zoomed in (zoom level > 1.5)
        const opacity = state.current.scale > 1.5 ? 0 : 1;
        v.style.opacity = opacity;
        v.style.transform = `translate(-50%, -50%) scale(${1 / state.current.scale})`;
        v.style.transition = 'opacity 0.3s ease';
      });
    };

    const onWheel = (e) => {
      // Zorg dat wheel event altijd werkt, ook als popup open is
      if (!e.target.closest('.popup') && !e.target.closest('#popup-content')) {
        e.preventDefault();
      }
      
      const delta = -e.deltaY * 0.002;
      const prevScale = state.current.scale;
      state.current.scale = Math.max(1, Math.min(4, state.current.scale + delta));
      
      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      
      state.current.offsetX -= (cursorX) * (state.current.scale - prevScale) / state.current.scale;
      state.current.offsetY -= (cursorY) * (state.current.scale - prevScale) / state.current.scale;
      
      constrain();
      update();
    };

    const onMouseDown = (e) => {
      // Alleen slepen als we niet op de popup, knoppen of iconen klikken
      if (e.target.closest('.popup') || e.target.closest('.back-to-home') || e.target.closest('.vergrootglas') || e.target.closest('.zoom-controls') || e.target.closest('.poi-navigator')) return;

      state.current.isDragging = true;
      state.current.hasMoved = false;
      state.current.startX = e.clientX - state.current.offsetX;
      state.current.startY = e.clientY - state.current.offsetY;
      wrapper.style.cursor = 'grabbing';
    };

    const onMouseMove = (e) => {
      if (!state.current.isDragging) return;
      
      const x = e.clientX - state.current.startX;
      const y = e.clientY - state.current.startY;

      // Check of er echt bewogen wordt
      if (Math.abs(x - state.current.offsetX) > 5 || Math.abs(y - state.current.offsetY) > 5) {
        state.current.hasMoved = true;
      }

      state.current.offsetX = x;
      state.current.offsetY = y;
      constrain();
      update();
    };

    const onMouseUp = () => {
      state.current.isDragging = false;
      wrapper.style.cursor = 'grab';
    };

    // Touch zoom (pinch gesture)
    const getTouchDistance = (touches) => {
      if (touches.length < 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        state.current.lastTouchDistance = getTouchDistance(e.touches);
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length !== 2) return;
      
      const currentDistance = getTouchDistance(e.touches);
      const delta = (currentDistance - state.current.lastTouchDistance) * 0.005;
      const prevScale = state.current.scale;
      state.current.scale = Math.max(1, Math.min(4, state.current.scale + delta));
      
      // Bereken het middelpunt van de twee fingers
      const rect = container.getBoundingClientRect();
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
      
      state.current.offsetX -= centerX * (state.current.scale - prevScale) / state.current.scale;
      state.current.offsetY -= centerY * (state.current.scale - prevScale) / state.current.scale;
      
      constrain();
      update();
      state.current.lastTouchDistance = currentDistance;
    };

    // Zoom buttons functionality
    const handleZoomIn = () => {
      const prevScale = state.current.scale;
      state.current.scale = Math.max(1, Math.min(4, state.current.scale + 0.2));
      
      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      state.current.offsetX -= centerX * (state.current.scale - prevScale) / state.current.scale;
      state.current.offsetY -= centerY * (state.current.scale - prevScale) / state.current.scale;
      
      constrain();
      update();
    };

    const handleZoomOut = () => {
      const prevScale = state.current.scale;
      state.current.scale = Math.max(1, Math.min(4, state.current.scale - 0.2));
      
      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      state.current.offsetX -= centerX * (state.current.scale - prevScale) / state.current.scale;
      state.current.offsetY -= centerY * (state.current.scale - prevScale) / state.current.scale;
      
      constrain();
      update();
    };

    wrapper.addEventListener('wheel', onWheel, { passive: false });
    wrapper.addEventListener('mousedown', onMouseDown);
    wrapper.addEventListener('touchstart', onTouchStart, { passive: false });
    wrapper.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Maak zoom functies accessible
    wrapper.handleZoomIn = handleZoomIn;
    wrapper.handleZoomOut = handleZoomOut;

    return () => {
      wrapper.removeEventListener('wheel', onWheel);
      wrapper.removeEventListener('mousedown', onMouseDown);
      wrapper.removeEventListener('touchstart', onTouchStart);
      wrapper.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleHotspotClick = (e, spot) => {
    e.stopPropagation();
    // Alleen popup openen als we NIET gesleept hebben
    if (!state.current.hasMoved) {
      setSelectedHotspot(spot);
      setExpandedPOI(null);
    }
  };

  // Jump naar POI met auto-zoom en pan (sluit eerst open popup, daarna animatie)
  const jumpToPOI = (spot) => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    // Als er al een popup open is en het is een andere POI: sluit eerst
    const shouldCloseFirst = selectedHotspot && selectedHotspot.id !== spot.id;
    const closeDelay = shouldCloseFirst ? 350 : 0; // wait for popup close animation

    if (shouldCloseFirst) {
      setSelectedHotspot(null);
    }

    setTimeout(() => {
      // Bereken de positie van de POI op de afbeelding
      const imgRect = container.querySelector('#plaat-img').getBoundingClientRect();
      const poiX = (parseFloat(spot.left) / 100) * container.clientWidth;
      const poiY = (parseFloat(spot.top) / 100) * container.clientHeight;

      const targetScale = 2;
      const centerX = wrapper.clientWidth / 2;
      const centerY = wrapper.clientHeight / 2;

      // Doel positie
      const targetOffsetX = centerX - (poiX * targetScale);
      const targetOffsetY = centerY - (poiY * targetScale);

      // Start positie
      const startScale = state.current.scale;
      const startOffsetX = state.current.offsetX;
      const startOffsetY = state.current.offsetY;

      // Animatie parameters
      const duration = 800; // milliseconden
      const startTime = Date.now();

      // Constrain functie
      const constrain = () => {
        const rect = container.getBoundingClientRect();
        const minX = Math.min(0, wrapper.clientWidth - rect.width * state.current.scale);
        const minY = Math.min(0, wrapper.clientHeight - rect.height * state.current.scale);
        state.current.offsetX = Math.max(minX, Math.min(0, state.current.offsetX));
        state.current.offsetY = Math.max(minY, Math.min(0, state.current.offsetY));
      };

      // Update functie
      const update = () => {
        container.style.transform = `translate3d(${state.current.offsetX}px, ${state.current.offsetY}px, 0) scale(${state.current.scale})`;
        const icons = container.querySelectorAll('.vergrootglas');
        icons.forEach(v => {
          const opacity = state.current.scale > 1.5 ? 0 : 1;
          v.style.opacity = opacity;
          v.style.transform = `translate(-50%, -50%) scale(${1 / state.current.scale})`;
        });
      };

      // Easing functie (cubic-ease-out)
      const easeOutCubic = (t) => {
        return 1 - Math.pow(1 - t, 3);
      };

      // Animatie loop
      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);

        // Interpoleer scale
        state.current.scale = startScale + (targetScale - startScale) * eased;

        // Interpoleer offset
        state.current.offsetX = startOffsetX + (targetOffsetX - startOffsetX) * eased;
        state.current.offsetY = startOffsetY + (targetOffsetY - startOffsetY) * eased;

        constrain();
        update();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Animatie klaar - open popup
          setSelectedHotspot(spot);
          setExpandedPOI(null);
        }
      };

      animate();
    }, closeDelay);
  };

  return (
    <div id="plaat-wrapper" ref={wrapperRef}>
      <Link to="/" className="back-to-home">← Terug</Link>

      {/* Zoom buttons */}
      <div className="zoom-controls">
        <button 
          className="zoom-btn zoom-in-btn" 
          onClick={() => wrapperRef.current?.handleZoomIn?.()}
          title="Inzoomen"
          aria-label="Inzoomen"
        >
          +
        </button>
        <button 
          className="zoom-btn zoom-out-btn" 
          onClick={() => wrapperRef.current?.handleZoomOut?.()}
          title="Uitzoomen"
          aria-label="Uitzoomen"
        >
          −
        </button>
      </div>

      {/* POI Navigator */}
      <div className="poi-navigator">
        <button 
          className="poi-toggle-btn"
          onClick={() => setExpandedPOI(expandedPOI ? null : true)}
          title="Punten van interesse"
          aria-label="Punten van interesse"
        >
          <i className="bi bi-list"></i>
        </button>
        <div className={`poi-menu ${expandedPOI ? 'expanded' : ''}`}>
          {hotspots.map((spot) => (
            <button
              key={spot.id}
              className="poi-item"
              onClick={() => jumpToPOI(spot)}
              title={spot.title}
            >
              <span className="poi-number">{spot.id}</span>
              <span className="poi-title">{spot.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div 
        id="plaat-container" 
        ref={containerRef}
        onClick={() => { if(state.current.hasMoved) setSelectedHotspot(null); }}
      >
        <img id="plaat-img" src="/images/grafheuvels.jpg" alt="Plaat" draggable="false" />
        
        {hotspots.map((spot) => (
          <div 
            key={spot.id}
            className="vergrootglas" 
            style={{ top: spot.top, left: spot.left }}
            onMouseUp={(e) => handleHotspotClick(e, spot)}
          >
            <i className="bi bi-search"></i>
          </div>
        ))}
      </div>

      {/* Popup */}
      <div className={`popup ${selectedHotspot ? 'active' : ''}`}>
        <button id="popup-close" onClick={() => setSelectedHotspot(null)}>✖</button>
        <div id="popup-content">
          {selectedHotspot && (
            <>
              <strong>{selectedHotspot.title}</strong>
              <p>{selectedHotspot.info}</p>
              <button 
                id="popup-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(selectedHotspot.link);
                }}
              >
                Ga naar verhaal
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Plaat;