import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="card border-0 shadow-sm" id="welcome-card">
      <div className="card-body p-5 text-center">
        <h1 className="card-title display-4 mb-4">Welkom!</h1>
        <p className="card-text fs-5 mb-4">
            Ga op ontdekkingstocht in een digitale schoolplaat over de eerste boeren! <br></br>
            Kijk goed naar de afbeelding. Hoe leefden mensen vroeger? Wat gebeurde er als iemand stierf? <br></br>
            Klik op de verschillende plekken en ontdek het verhaal achter deze bijzondere plek.
        </p>

        <Link to="/plaat" className="btn btn-primary w-100 mb-3 py-3 fw-bold" id="startBtn">
          START
        </Link>

        <small className="text-muted d-block fw-bold">Klik op START om door te gaan</small>
      </div>
    </div>
  )
}

export default Home;