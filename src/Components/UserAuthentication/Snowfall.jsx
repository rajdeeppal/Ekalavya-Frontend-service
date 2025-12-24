import React, { useEffect } from 'react';

const isLowEndDevice =
  navigator.hardwareConcurrency &&
  navigator.hardwareConcurrency <= 4;

const Snowfall = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .snow {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
      }

      .flake {
        position: absolute;
        top: -10px;
        color: white;
        opacity: 0.8;
        animation-name: fall;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }

      @keyframes fall {
        to {
          transform: translateY(110vh);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

const SNOW_COUNT = isLowEndDevice ? 15 : 30;
const flakes = Array.from({ length: SNOW_COUNT });

  return (
    <div className="snow">
      {flakes.map((_, i) => {
        const size = Math.random() * 10 + 10;
        const duration = Math.random() * 10 + 12;

        return (
          <div
            key={i}
            className="flake"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${size}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          >
            ❄️
          </div>
        );
      })}
    </div>
  );
};

export default Snowfall;
