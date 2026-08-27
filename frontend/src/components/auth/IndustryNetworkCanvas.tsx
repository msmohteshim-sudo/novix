import React, { useEffect, useRef } from 'react';

interface IndustryNetworkCanvasProps {
  activeIndustry?: string;
}

export const IndustryNetworkCanvas: React.FC<IndustryNetworkCanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes setup
    const particleCount = 45;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      pulse: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.3,
        pulse: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep dark blue / indigo purple gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0a0d24');
      bgGrad.addColorStop(0.4, '#0f1738');
      bgGrad.addColorStop(0.7, '#16194f');
      bgGrad.addColorStop(1, '#1e1045');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle glowing mesh grid / waves
      ctx.save();
      for (let waveIndex = 0; waveIndex < 3; waveIndex++) {
        ctx.beginPath();
        const waveOffset = waveIndex * 70;
        const waveAlpha = 0.15 - waveIndex * 0.03;
        
        ctx.strokeStyle = waveIndex % 2 === 0 ? `rgba(99, 102, 241, ${waveAlpha})` : `rgba(168, 85, 247, ${waveAlpha})`;
        ctx.lineWidth = 1.5;

        for (let x = 0; x <= width; x += 15) {
          const y =
            height * 0.55 +
            Math.sin((x * 0.005) + time + waveIndex) * 35 +
            Math.cos((x * 0.008) - time * 0.5) * 20 +
            waveOffset;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      // Draw perspective glowing light beam in center
      const centerGlow = ctx.createRadialGradient(
        width * 0.35, height * 0.48, 10,
        width * 0.35, height * 0.48, width * 0.45
      );
      centerGlow.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
      centerGlow.addColorStop(0.5, 'rgba(139, 92, 246, 0.12)');
      centerGlow.addColorStop(1, 'rgba(10, 13, 36, 0)');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, width, height);

      // Draw connecting lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(165, 180, 252, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.03;

        // Wrap around bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentRadius = p.radius + Math.sin(p.pulse) * 0.8;
        const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(199, 210, 254, ${Math.max(0.1, currentAlpha)})`;
        ctx.shadowColor = '#818cf8';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};
