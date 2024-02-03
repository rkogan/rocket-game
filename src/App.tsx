import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const gravity = -0.5
  const thrust = 5
  const maxLandingSpeed = -8
  const initialState = {
    altitude: 100,
    speed: 5
  }

  const [rocket, setRocket] = useState(initialState)
  const [crash, setCrash] = useState(false)

  // Call update every 50ms (20 frames/sec).
  const DELAY_MS = 50

  const fireThruster = () => {
    if (crash) return

    setRocket(({ altitude, speed: currSpeed }) => ({
      altitude,
      speed: currSpeed + thrust
    }))
  }

  const resetGame = () => {
    setCrash(false)
    setRocket(initialState)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setRocket(({ altitude: currAltitude, speed: currSpeed }) => {
        let newAltitude = currAltitude + currSpeed
        let newSpeed = currSpeed + gravity

        if (newAltitude <= 0) {
          newAltitude = 0
          newSpeed = currSpeed * -0.5

          if (rocket.speed < maxLandingSpeed) {
            setCrash(true)
            newSpeed = 0
          }
        }

        return {
          altitude: newAltitude,
          speed: newSpeed
        }
      })
    }, DELAY_MS)

    return () => clearInterval(interval)
  }, [gravity, maxLandingSpeed, rocket.speed])

  return (
    <div className="app" onMouseDown={fireThruster} onTouchStart={fireThruster}>
    <header className="header">
        <div className="title">Rocket Game</div>
        <div className="description">Land the rocket using the thruster (clicks, touches, or spacebar).</div>
      </header>

      <div id="rocket" className={crash ? 'crash' : ''} style={{ bottom: `${rocket.altitude}px` }}>
        <div className="fire"></div>
        <div id="restart" onClick={resetGame}>RESTART</div>
      </div>
    </div>
  );
}

export default App;
