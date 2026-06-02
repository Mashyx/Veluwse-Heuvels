import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { storylines } from '../data/storylines';
import StoomkuilGame from '../components/games/StoomkuilGame';
import Quiz from '../components/Quiz';
import './Storyline.css';
import DierenGame from '../components/games/DierenGame'; 
import KledingGame from '../components/games/KledingGame';
import RitueelGame from '../components/games/RitueelGame';

function Storyline() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const data = storylines[id];
  
  const [step, setStep] = useState(1);

  if (!data) {
    return (
      <div className="container text-center py-5">
        <h2>Oeps! Deze verhaallijn is nog in de maak.</h2>
        <Link to="/plaat" className="btn btn-primary mt-3">Terug naar de kaart</Link>
      </div>
    );
  }

  // Navigatie functies
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Functie die bepaalt welk spel getoond moet worden bij stap 3
    const renderGame = () => {
    switch (id) {
        case 'storyline1':
        return <DierenGame />;
        case 'storyline2':
        return <KledingGame />;
        case 'storyline3':
        return <StoomkuilGame />;
        case 'storyline4':
        return <RitueelGame />;
        default:
        return <div className="text-center p-5">Het spel volgt binnenkort!</div>;
    }
    };

  return (
    <div className="storyline-page">
      <button className="storyline-btn-left" onClick={prevStep} style={{ visibility: step === 1 ? 'hidden' : 'visible' }}>
        <i className="bi bi-chevron-left"></i>
      </button>
      <button className="storyline-btn-right" onClick={nextStep} style={{ visibility: step === 4 ? 'hidden' : 'visible' }}>
        <i className="bi bi-chevron-right"></i>
      </button>

      <div className="storyline-header d-flex flex-column align-items-center mb-4">
        {/* De Titel Pill */}
        <div className="storyline-title-pill shadow-sm">
            <h1 className="h4 mb-0">{data.title}</h1>
        </div>
        
        <div className="step-indicator d-flex justify-content-center gap-3 mt-3">
            {[1, 2, 3, 4].map((s) => (
            <div 
                key={s} 
                className={`dot ${step === s ? 'active' : ''}`} 
                onClick={() => setStep(s)}
            ></div>
            ))}
        </div>
        </div>

      <main className="flex-grow-1 d-flex justify-content-center w-100">
        <div className="storyline-card shadow-lg">
          
          {step === 1 && (
            <div className="row animate-fade-in">
              <div className="col-lg-8"><p className="lead">{data.text}</p></div>
              <div className="col-lg-4 d-flex flex-column gap-2">
                {data.images?.map((img, i) => <img key={i} src={img} className="img-fluid rounded border shadow-sm" alt="" />)}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in text-center">
              <div className="ratio ratio-16x9 shadow rounded overflow-hidden mx-auto" style={{ maxWidth: '800px' }}>
                <iframe src={data.videoUrl} title="Video" allowFullScreen></iframe>
              </div>
            </div>
          )}

          {step === 3 && <div className="animate-fade-in">{renderGame()}</div>}

          {step === 4 && (
            <div className="animate-fade-in">
              {data.quiz ? (
                <Quiz questions={data.quiz} onComplete={() => navigate('/plaat/grafheuvels')} />
              ) : (
                <p>Quiz data niet gevonden...</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Storyline;