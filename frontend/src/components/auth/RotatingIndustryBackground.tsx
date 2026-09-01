import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Scene {
  id: string;
  url: string;
  alt: string;
}

const SCENES: Scene[] = [
  {
    id: 'textile-spinning-tco12',
    url: '/images/slide-1-spinning.jpg',
    alt: 'Trützschler Spinning TCO 12 - High tech yarn spinning line'
  },
  {
    id: 'weaving-department-loom16',
    url: '/images/slide-2-weaving.jpg',
    alt: 'Weaving Department - Automated loom machinery floor'
  },
  {
    id: 'dyeing-range-winch02',
    url: '/images/slide-3-dyeing.jpg',
    alt: 'Industrial Dyeing Range Winch-02 fabric processing plant'
  },
  {
    id: 'fabric-inspection-machine',
    url: '/images/slide-4-inspection.jpg',
    alt: 'Fabric Inspection Machine - Quality control department'
  },
  {
    id: 'finished-goods-warehouse',
    url: '/images/slide-5-warehouse.jpg',
    alt: 'Finished Goods Warehouse - Barcode scanning, packaging & logistics'
  },
  {
    id: 'circular-knitting-department',
    url: '/images/slide-6-knitting.jpg',
    alt: 'Circular Knitting Department - High output yarn knitting machinery floor'
  }
];

interface Props {
  intervalMs?: number;
  showControls?: boolean;
}

export const RotatingIndustryBackground: React.FC<Props> = ({ intervalMs = 5000, showControls = true }) => {
  const scenes = SCENES;
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
