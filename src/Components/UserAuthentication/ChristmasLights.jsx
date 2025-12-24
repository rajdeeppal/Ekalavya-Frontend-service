import React from 'react';

const COLORS = ['#ff5252', '#ffd740', '#69f0ae', '#40c4ff'];

const BULB_WIDTH = 10;
const BULB_HEIGHT = 14;
const SPACING = 22;

const Bulb = ({ color, delay }) => (
  <div style={{ position: 'relative', animation: 'blink 1.8s infinite', animationDelay: delay }}>
    {/* Bulb cap */}
    <div
      style={{
        width: 6,
        height: 4,
        background: '#333',
        borderRadius: '2px',
        margin: '0 auto',
      }}
    />

    {/* Bulb */}
    <div
      style={{
        width: BULB_WIDTH,
        height: BULB_HEIGHT,
        background: color,
        borderRadius: '50% 50% 60% 60%',
        boxShadow: `
          0 0 6px ${color},
          0 6px 12px ${color}
        `,
        marginTop: -1,
      }}
    />
  </div>
);

const renderLine = (count, vertical = false) =>
  Array.from({ length: count }).map((_, i) => (
    <Bulb
      key={i}
      color={COLORS[i % COLORS.length]}
      delay={`${Math.random() * 1.5}s`}
    />
  ));

const ChristmasLights = () => {
  const hCount = Math.ceil(window.innerWidth / SPACING);
  const vCount = Math.ceil(window.innerHeight / SPACING);

  return (
    <>
      {/* WIRE */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        {/* Top wire */}
        <div style={{ position: 'fixed', top: 8, left: 0, right: 0, height: 2, background: '#222' }} />
        {/* Bottom wire */}
        <div style={{ position: 'fixed', bottom: 8, left: 0, right: 0, height: 2, background: '#222' }} />
        {/* Left wire */}
        <div style={{ position: 'fixed', left: 8, top: 0, bottom: 0, width: 2, background: '#222' }} />
        {/* Right wire */}
        <div style={{ position: 'fixed', right: 8, top: 0, bottom: 0, width: 2, background: '#222' }} />

        {/* TOP */}
        <div style={{ position: 'fixed', top: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: SPACING }}>
          {renderLine(hCount)}
        </div>

        {/* BOTTOM */}
        <div style={{ position: 'fixed', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: SPACING }}>
          {renderLine(hCount)}
        </div>

        {/* LEFT */}
        <div style={{ position: 'fixed', left: 10, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', gap: SPACING }}>
          {renderLine(vCount)}
        </div>

        {/* RIGHT */}
        <div style={{ position: 'fixed', right: 10, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', gap: SPACING }}>
          {renderLine(vCount)}
        </div>
      </div>

      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}
      </style>
    </>
  );
};

export default ChristmasLights;
