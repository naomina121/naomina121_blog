import { FC } from 'react'

export const Spinner: FC = () => {
  return (
    <div className='loading'>
      <div className='spinner-box'>
        <div className='pulse-container'>
          <div className='pulse-bubble pulse-bubble-1'></div>
          <div className='pulse-bubble pulse-bubble-2'></div>
          <div className='pulse-bubble pulse-bubble-3'></div>
        </div>
      </div>
      <style jsx global>{`
        .loading {
          width: 100%;
          height: 100vh;
          background-color: #1d2630;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          align-items: center;
          z-index: 50;
          position: relative;
          overflow: hidden;
          position: fixed;
        }
        .spinner-box {
          width: 300px;
          height: 300px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: transparent;
        }

        @keyframes pulse {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0.25;
            transform: scale(0.75);
          }
        }

        .pulse-container {
          width: 120px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .pulse-bubble {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #3ff9dc;
        }

        .pulse-bubble-1 {
          animation: pulse 0.4s ease 0s infinite alternate;
        }
        .pulse-bubble-2 {
          animation: pulse 0.4s ease 0.2s infinite alternate;
        }
        .pulse-bubble-3 {
          animation: pulse 0.4s ease 0.4s infinite alternate;
        }
      `}</style>
    </div>
  )
}
