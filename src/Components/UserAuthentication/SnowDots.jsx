import React, { useEffect, useRef } from "react";

const isNightTime = () => {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
};

const SnowDots = () => {
  const canvasRef = useRef(null);
  const particles = [];
  const TOTAL_DOTS = 120;

  const random = (min, max) => Math.random() * (max - min) + min;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < TOTAL_DOTS; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: random(1, 4),
        speedY: random(0.2, 1.2),
        speedX: random(-0.5, 0.5),
        opacity: random(0.4, 1),
        blueTone: Math.floor(Math.random() * 60) + 180 // 180–240
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        ctx.fillStyle = isNightTime()
          ? `rgba(255,255,255,${p.opacity})`
          : `rgba(100, ${p.blueTone}, 255, ${p.opacity})`;

        ctx.fill();

        p.y += p.speedY;
        p.x += p.speedX * 0.3;

        if (p.y > canvas.height) p.y = -5;
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
      });

      requestAnimationFrame(animate);
    };

    animate();

    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none"
      }}
    />
  );
};

export default SnowDots;
