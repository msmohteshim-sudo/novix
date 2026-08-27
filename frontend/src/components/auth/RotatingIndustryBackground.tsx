import React, { useState, useEffect, useRef, useMemo } from 'react';

interface Scene {
  id: string;
  url: string;
  alt: string;
}

/**
 * 15 India-first industry scenes.
 * Priority order as specified:
 *  1. Textile / Fabric spinning & weaving
 *  2. Textile garment factory floor
 *  3. Poultry / Chicken farming sheds
 *  4. Indian agriculture — wheat/crop fields
 *  5. Indian agriculture — tractor & harvest
 *  6. Food processing & packaging plant
 *  7. Indian manufacturing factory floor
 *  8. Industrial automation & CNC machinery
 *  9. Indian warehousing & inventory
 * 10. Indian logistics & truck transport
 * 11. Pharmaceutical / medicine manufacturing
 * 12. Electronics & electrical component assembly
 * 13. Construction & engineering site
 * 14. Metal fabrication & welding
 * 15. Packaging & distribution operations
 */
const SCENES: Scene[] = [
  {
    // Spinning bobbins / yarn production — textile mill
    id: 'textile-spinning',
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&auto=format&fit=crop&q=80',
    alt: 'Textile spinning machines and yarn production in a mill'
  },
  {
    // Fabric rolls / garment factory
    id: 'textile-garment',
    url: 'https://images.unsplash.com/photo-1517677129300-07b130802f46?w=1920&auto=format&fit=crop&q=80',
    alt: 'Garment and fabric manufacturing factory floor'
  },
  {
    // Commercial poultry / chicken farm shed
    id: 'poultry-farm',
    url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1920&auto=format&fit=crop&q=80',
    alt: 'Commercial poultry and chicken farming operations'
  },
  {
    // Indian wheat / crop agriculture — golden fields
    id: 'agriculture-crops',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&auto=format&fit=crop&q=80',
    alt: 'Indian agricultural crop fields and farming landscape'
  },
  {
    // Tractor working in field — farm machinery
    id: 'agriculture-tractor',
    url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&auto=format&fit=crop&q=80',
    alt: 'Agricultural tractor and crop harvesting operations'
  },
  {
    // Food processing & bakery/grain packaging lines
    id: 'food-processing',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&auto=format&fit=crop&q=80',
    alt: 'Food and beverage industrial processing and packaging plant'
  },
  {
    // Factory floor — heavy manufacturing machinery
    id: 'manufacturing-floor',
    url: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1920&auto=format&fit=crop&q=80',
    alt: 'Industrial manufacturing floor with heavy machinery'
  },
  {
    // Industrial automation / robotic arm production
    id: 'industrial-automation',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&auto=format&fit=crop&q=80',
    alt: 'Industrial automation and robotic machinery production line'
  },
  {
    // Warehouse — high-racking inventory storage
    id: 'warehouse-storage',
    url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&auto=format&fit=crop&q=80',
    alt: 'Large warehouse with inventory storage and racking systems'
  },
  {
    // Logistics — truck fleet at distribution depot
    id: 'logistics-trucks',
    url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&auto=format&fit=crop&q=80',
    alt: 'Truck logistics fleet at distribution and transport depot'
  },
  {
    // Pharmaceutical — clean-room medicine manufacturing
    id: 'pharmaceutical',
    url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1920&auto=format&fit=crop&q=80',
    alt: 'Pharmaceutical and medicine manufacturing clean environment'
  },
  {
    // Electronics — PCB circuit board assembly
    id: 'electronics-pcb',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&auto=format&fit=crop&q=80',
    alt: 'Electronics and circuit board manufacturing assembly'
  },
  {
    // Construction — infrastructure and building site
    id: 'construction-site',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&auto=format&fit=crop&q=80',
    alt: 'Large construction and infrastructure project site'
  },
  {
    // Metal fabrication — welding sparks in workshop
    id: 'metal-welding',
    url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&auto=format&fit=crop&q=80',
    alt: 'Metal fabrication and welding workshop operations'
  },
  {
    // Packaging & distribution — warehouse dispatch
    id: 'packaging-distribution',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&auto=format&fit=crop&q=80',
    alt: 'Packaging and order fulfillment distribution center'
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
}

export const RotatingIndustryBackground: React.FC<Props> = ({ intervalMs = 5000 }) => {
  const scenes = useMemo(() => shuffle(SCENES), []);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Silently preload the next 2 slides in the background
  useEffect(() => {
    [(current + 1) % scenes.length, (current + 2) % scenes.length].forEach((idx) => {
      const img = new window.Image();
      img.src = scenes[idx].url;
    });
  }, [current, scenes]);

  // Auto-advance
  useEffect(() => {
    if (prefersReduced) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % scenes.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [intervalMs, scenes.length, prefersReduced]);

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
    </div>
  );
};
