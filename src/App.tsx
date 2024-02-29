import { useState, useEffect, KeyboardEvent } from 'react'
import classNames from 'classnames'
import './App.css'

const gravity = -0.5
const thrust = 5
const maxLandingSpeed = -8
const initialState = {
  altitude: 100,
  speed: 5
}

function App() {
  const [rocket, setRocket] = useState(initialState)
  const [crash, setCrash] = useState(false)

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
    }, 50)

    return () => clearInterval(interval)
  }, [rocket.speed])

  const resetGame = () => {
    setCrash(false)
    setRocket(initialState)
  }

  const fireThruster = () => {
    if (crash) return

    setRocket(({ altitude, speed: currSpeed }) => ({
      altitude,
      speed: currSpeed + thrust
    }))
  }

  const keyPressed = (e: KeyboardEvent<HTMLDivElement>) => e.key === ' ' && fireThruster()

  return (
    <div className='app' onMouseDown={fireThruster} onTouchStart={fireThruster} onKeyDown={keyPressed} tabIndex={0}>
      <header className='header'>
        <div className='title'>Rocket Game</div>
        <div className='description'>
          Land the rocket using the thruster (clicks, touches, or spacebar).
        </div>
      </header>

      <div
        id='rocket'
        className={classNames({ crash })}
        style={{ bottom: `${rocket.altitude}px` }}
      >
        <div className='fire'></div>
        <div id='restart' onClick={resetGame}>
          RESTART
        </div>
      </div>
    </div>
  )
}

export default App
