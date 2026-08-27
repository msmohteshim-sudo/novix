import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Scene {
  id: string;
  url: string;
  alt: string;
}

const SCENES: Scene[] = [
  {
    id: 'sugarcane-mill',
    url: '/images/sugarcane-mill.jpg',
    alt: 'Sugarcane processing mill and raw juice extraction plant'
  },
  {
    id: 'warehouse-logistics',
    url: '/images/warehouse-logistics.jpg',
    alt: 'Industrial warehouse, racking storage and forklift logistics'
  },
  {
    id: 'food-processing',
    url: '/images/food-processing.jpg',
    alt: 'Food processing, washing, and packaging production line'
  },
  {
    id: 'auto-assembly',
    url: '/images/auto-assembly.jpg',
    alt: 'Automotive vehicle assembly line with robotic welding'
  },
  {
    id: 'steel-mill',
    url: '/images/steel-mill.jpg',
    alt: 'Heavy steel manufacturing mill and hot rolling bar line'
  },
  {
    id: 'footwear-factory',
    url: '/images/footwear-factory.jpg',
    alt: 'Footwear and shoe manufacturing conveyor assembly line'
  },
  {
    id: 'poultry-farm',
    url: '/images/poultry-farm.jpg',
    alt: 'Modern commercial poultry farm layer area and egg collection'
  },
  {
    id: 'textile-spinning',
    url: '/images/textile-spinning.jpg',
    alt: 'Textile yarn bobbin spinning and weaving mill'
  }
];

/** Fisher-Yates shuffle — randomize order each session */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  intervalMs?: number;
  showControls?: boolean;
}

export const RotatingIndustryBackground: React.FC<Props> = ({ intervalMs = 5000, showControls = true }) => {
  const scenes = useMemo(() => shuffle(SCENES), []);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % scenes.length);
    }, intervalMs);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % scenes.length);
    resetTimer();
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + scenes.length) % scenes.length);
    resetTimer();
  };

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % scenes.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [intervalMs, scenes.length]);

  return (
    <div className="bg-slideshow">
      {scenes.map((scene, idx) => (
        <div
          key={scene.id}
          className={`bg-slide${idx === current ? ' bg-slide--active' : ''}`}
          style={{ backgroundImage: `url(${scene.url})` }}
          role="img"
          aria-label={scene.alt}
          aria-hidden={idx !== current}
        />
      ))}

      {showControls && (
        <>
          <button className="bg-slide-control bg-slide-control-prev" onClick={prevSlide} aria-label="Previous Background Image">
            <ChevronLeft size={22} />
          </button>
          <button className="bg-slide-control bg-slide-control-next" onClick={nextSlide} aria-label="Next Background Image">
            <ChevronRight size={22} />
          </button>
        </>
      )}
    </div>
  );
};
