import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { platenData } from '../data/platenData';
import './Plaat.css';

export default function Plaat() {
  const { id } = useParams();
  const currentPlaat = platenData[id];
  const navigate = useNavigate();

  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [scale, setScale] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const [poiOpen, setPoiOpen] = useState(false);

  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const zoomTimeoutRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  const state = useRef({
    isDragging: false,
    hasMoved: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1
  });

  const pinchRef = useRef({ isPinching: false, startDistance: 0, startScale: 1, startOffsetX: 0, startOffsetY: 0 });

  const clamp = (v) => Math.max(1, Math.min(4, v));

  const startZooming = () => {
    if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
    setIsZooming(true);
    zoomTimeoutRef.current = window.setTimeout(() => setIsZooming(false), 250);
  };

  const setContainerTransition = (enabled) => {
    const container = containerRef.current;
    if (!container) return;
    container.style.transition = enabled ? 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    if (enabled) {
      transitionTimeoutRef.current = window.setTimeout(() => {
        if (container) container.style.transition = 'none';
        transitionTimeoutRef.current = null;
      }, 460);
    }
  };

  const constrain = () => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container) return;

    if (state.current.scale <= 1) {
      state.current.scale = 1;
      const baseWidth = container.offsetWidth;
      const baseHeight = container.offsetHeight;
      state.current.offsetX = Math.max(Math.min(0, (wrapper.clientWidth - baseWidth) / 2), wrapper.clientWidth - baseWidth);
      state.current.offsetY = Math.max(Math.min(0, (wrapper.clientHeight - baseHeight) / 2), wrapper.clientHeight - baseHeight);
      return;
    }

    const rect = container.getBoundingClientRect();
    const minX = Math.min(0, wrapper.clientWidth - rect.width);
    const minY = Math.min(0, wrapper.clientHeight - rect.height);
    state.current.offsetX = Math.max(minX, Math.min(0, state.current.offsetX));
    state.current.offsetY = Math.max(minY, Math.min(0, state.current.offsetY));
  };

  const applyTransform = () => {
    const container = containerRef.current;
    if (!container) return;
    container.style.transform = `translate3d(${state.current.offsetX}px, ${state.current.offsetY}px, 0) scale(${state.current.scale})`;
    const icons = container.querySelectorAll('.vergrootglas');
    icons.forEach(v => v.style.transform = `translate(-50%, -50%) scale(${1 / state.current.scale})`);
  };

  const doZoom = (delta, origin = null) => {
    const container = containerRef.current;
    if (!container) return;
    setContainerTransition(true);
    startZooming();
    const prev = state.current.scale;
    state.current.scale = clamp(state.current.scale + delta);
    const rect = container.getBoundingClientRect();
    const ox = origin?.x ?? rect.width / 2;
    const oy = origin?.y ?? rect.height / 2;
    state.current.offsetX -= ox * (state.current.scale - prev) / state.current.scale;
    state.current.offsetY -= oy * (state.current.scale - prev) / state.current.scale;
    constrain();
    applyTransform();
    setScale(state.current.scale);
  };

  const getTouchDistance = (t) => Math.hypot(t[1].clientX - t[0].clientX, t[1].clientY - t[0].clientY);
  const getTouchMidpoint = (t) => ({ x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container) return;

    const update = () => applyTransform();

    const onWheel = (e) => {
      e.preventDefault();
      startZooming();
      const delta = -e.deltaY * 0.002;
      const prev = state.current.scale;
      state.current.scale = clamp(state.current.scale + delta);
      const rect = container.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      state.current.offsetX -= cx * (state.current.scale - prev) / state.current.scale;
      state.current.offsetY -= cy * (state.current.scale - prev) / state.current.scale;
      constrain();
      update();
      setScale(state.current.scale);
    };

    const onMouseDown = (e) => {
      if (e.target.closest('.popup') || e.target.closest('.back-to-home') || e.target.closest('.vergrootglas')) return;
      state.current.isDragging = true;
      state.current.hasMoved = false;
      state.current.startX = e.clientX - state.current.offsetX;
      state.current.startY = e.clientY - state.current.offsetY;
      wrapper.style.cursor = 'grabbing';
      setContainerTransition(false);
    };

    const onMouseMove = (e) => {
      if (!state.current.isDragging) return;
      const x = e.clientX - state.current.startX;
      const y = e.clientY - state.current.startY;
      if (Math.abs(x - state.current.offsetX) > 5 || Math.abs(y - state.current.offsetY) > 5) state.current.hasMoved = true;
      state.current.offsetX = x;
      state.current.offsetY = y;
      constrain();
      update();
    };

    const onMouseUp = () => {
      state.current.isDragging = false;
      wrapper.style.cursor = 'grab';
      setTimeout(() => { state.current.hasMoved = false; }, 50);
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        startZooming();
        const midpoint = getTouchMidpoint(e.touches);
        pinchRef.current = {
          isPinching: true,
          startDistance: getTouchDistance(e.touches),
          startScale: state.current.scale,
          startOffsetX: state.current.offsetX,
          startOffsetY: state.current.offsetY
        };
        setContainerTransition(false);
        e.preventDefault();
        return;
      }

      if (e.touches.length === 1) {
        if (e.target.closest('.popup') || e.target.closest('.back-to-home') || e.target.closest('.vergrootglas')) return;
        state.current.isDragging = true;
        state.current.hasMoved = false;
        state.current.startX = e.touches[0].clientX - state.current.offsetX;
        state.current.startY = e.touches[0].clientY - state.current.offsetY;
        wrapper.style.cursor = 'grabbing';
        e.preventDefault();
      }
    };

    const onTouchMove = (e) => {
      if (pinchRef.current.isPinching && e.touches.length === 2) {
        const midpoint = getTouchMidpoint(e.touches);
        const currentDistance = getTouchDistance(e.touches);
        const newScale = clamp(pinchRef.current.startScale * (currentDistance / pinchRef.current.startDistance));
        const prev = state.current.scale;
        state.current.scale = newScale;
        state.current.offsetX = pinchRef.current.startOffsetX - midpoint.x * (state.current.scale - prev) / state.current.scale;
        state.current.offsetY = pinchRef.current.startOffsetY - midpoint.y * (state.current.scale - prev) / state.current.scale;
        constrain();
        update();
        setScale(state.current.scale);
        e.preventDefault();
        return;
      }

      if (!state.current.isDragging || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const x = touch.clientX - state.current.startX;
      const y = touch.clientY - state.current.startY;
      if (Math.abs(x - state.current.offsetX) > 5 || Math.abs(y - state.current.offsetY) > 5) state.current.hasMoved = true;
      state.current.offsetX = x;
      state.current.offsetY = y;
      constrain();
      update();
      e.preventDefault();
    };

    const onTouchEnd = () => {
      if (pinchRef.current.isPinching) pinchRef.current.isPinching = false;
      if (state.current.isDragging) {
        state.current.isDragging = false;
        wrapper.style.cursor = 'grab';
        setTimeout(() => { state.current.hasMoved = false; }, 50);
      }
    };

    wrapper.addEventListener('wheel', onWheel, { passive: false });
    wrapper.addEventListener('mousedown', onMouseDown);
    wrapper.addEventListener('touchstart', onTouchStart, { passive: false });
    wrapper.addEventListener('touchmove', onTouchMove, { passive: false });
    wrapper.addEventListener('touchend', onTouchEnd);
    wrapper.addEventListener('touchcancel', onTouchEnd);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      wrapper.removeEventListener('wheel', onWheel);
      wrapper.removeEventListener('mousedown', onMouseDown);
      wrapper.removeEventListener('touchstart', onTouchStart);
      wrapper.removeEventListener('touchmove', onTouchMove);
      wrapper.removeEventListener('touchend', onTouchEnd);
      wrapper.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [id]);

  useEffect(() => {
    return () => {
      if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
      if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  const updatePopupPosition = () => {
    if (!selectedHotspot || !containerRef.current || !wrapperRef.current) return;

    const container = containerRef.current;
    
    const baseWidth = container.offsetWidth / state.current.scale;
    const baseHeight = container.offsetHeight / state.current.scale;
    
    const hx = parseCoord(selectedHotspot.left, baseWidth);
    const hy = parseCoord(selectedHotspot.top, baseHeight);
    
    const screenX = state.current.offsetX + hx * state.current.scale;
    const screenY = state.current.offsetY + hy * state.current.scale;
    
    const popup = document.querySelector(`[data-spot-id="${selectedHotspot.id}"].popup`);
    if (!popup) return;

    let left = screenX - 200; 
    let top = screenY - 250; 

    if (left < 10) left = 10;
    if (left + 400 > window.innerWidth - 10) left = window.innerWidth - 410;
    if (top < 10) top = 10;

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  };

  useEffect(() => {
    if (!selectedHotspot) return;

    updatePopupPosition();

    let rafId;
    const animate = () => {
      updatePopupPosition();
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [selectedHotspot]);

  const handleHotspotClick = (e, spot) => { e.stopPropagation(); if (!state.current.hasMoved) setSelectedHotspot(spot); };

  const parseCoord = (val, size) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val.trim().endsWith('%')) {
      const n = parseFloat(val);
      if (isNaN(n)) return 0;
      return (n / 100) * size;
    }
    if (typeof val === 'string' && val.trim().endsWith('px')) return parseFloat(val);
    const maybe = parseFloat(val);
    return isNaN(maybe) ? 0 : maybe;
  };

  const navigateToSpot = (spot) => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container) return;
    setContainerTransition(true);
    const rect = container.getBoundingClientRect();
    const baseWidth = rect.width / state.current.scale;
    const baseHeight = rect.height / state.current.scale;
    const wrapperW = wrapper.clientWidth;
    const wrapperH = wrapper.clientHeight;
    const hx = parseCoord(spot.left, baseWidth);
    const hy = parseCoord(spot.top, baseHeight);

    const targetScale = clamp(Math.max(state.current.scale, 1.8));
    state.current.scale = targetScale;

    state.current.offsetX = wrapperW / 2 - hx * state.current.scale;
    state.current.offsetY = wrapperH / 2 - hy * state.current.scale;

    constrain();
    applyTransform();
    setScale(state.current.scale);
    setSelectedHotspot(spot);
    setPoiOpen(true);
  };

  if (!currentPlaat) {
    return (
      <div className="text-center py-5">
        <h2>Oeps! Deze schoolplaat bestaat niet.</h2>
        <Link to="/dashboard" className="btn btn-primary mt-3">Terug naar het overzicht</Link>
      </div>
    );
  }

  return (
    <div id="plaat-wrapper" ref={wrapperRef}>
      <Link to="/dashboard" className="back-to-home">← Overzicht</Link>

      <div className={`poi-panel ${poiOpen ? 'open' : 'closed'}`}>
        <button className="poi-toggle" onClick={() => setPoiOpen((value) => !value)} aria-label="Open POI menu">
          <span className="poi-icon">?</span>
        </button>

        <aside className={`poi-sidebar ${poiOpen ? 'open' : 'closed'}`}>
          <h4>POI's</h4>
          {/* ✅ STAP 1: Nummering in de zijbalk toevoegen via de index */}
          {currentPlaat.hotspots.map((s, index) => (
            <div key={s.id} className={`poi-item ${selectedHotspot && selectedHotspot.id === s.id ? 'active' : ''}`} onClick={() => navigateToSpot(s)}>
              <div className="dot">{index + 1}</div>
              <div className="poi-title">{s.title}</div>
            </div>
          ))}
        </aside>
      </div>

      <div className="zoom-controls">
        <button className="zoom-button" onClick={() => doZoom(-0.25)}>-</button>
        <span className="zoom-level">{Math.round(scale * 100)}%</span>
        <button className="zoom-button" onClick={() => doZoom(0.25)}>+</button>
      </div>

      <div id="plaat-container" ref={containerRef} onClick={() => { if (state.current.hasMoved) setSelectedHotspot(null); }}>
        <img id="plaat-img" src={currentPlaat.image} alt={currentPlaat.title} draggable="false" />

        {/* ✅ STAP 2: Vergrootglas-icoon vervangen door het nummer op de schoolplaat */}
        {currentPlaat.hotspots.map((spot, index) => (
          <div key={spot.id} className="vergrootglas" data-spot-id={spot.id} style={{ top: spot.top, left: spot.left, visibility: isZooming ? 'hidden' : 'visible' }} onClick={(e) => handleHotspotClick(e, spot)}>
            {index + 1}
          </div>
        ))}
      </div>

      {currentPlaat.hotspots.map((spot) => (
        <div 
          key={spot.id}
          className={`popup ${selectedHotspot && selectedHotspot.id === spot.id ? 'active' : ''}`}
          data-spot-id={spot.id}
          data-spot-top={spot.top}
          data-spot-left={spot.left}
        >
          <button className="popup-close" onClick={() => setSelectedHotspot(null)}>✖</button>
          <div className="popup-content">
            <strong>{spot.title}</strong>
            <p>{spot.info}</p>
            <button className="popup-button" onClick={(e) => { e.stopPropagation(); navigate(spot.link); }}>
              Ga naar verhaal
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}