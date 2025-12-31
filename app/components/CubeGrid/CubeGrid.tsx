'use client';

import { useState, useEffect } from 'react';

const ROWS = 6;
const COLS = 8;
const TOTAL_CELLS = ROWS * COLS;

export default function CubeGrid() {
  const [activeIndexes, setActiveIndexes] = useState<Set<number>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const newActive = new Set<number>();
      const numActive = Math.floor(Math.random() * 3) + 1; // 1-3 random cells active
      for (let i = 0; i < numActive; i++) {
        newActive.add(Math.floor(Math.random() * TOTAL_CELLS));
      }
      setActiveIndexes(newActive);
    }, 2500); // every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  const cells = Array.from({ length: TOTAL_CELLS }, (_, i) => i);

  return (
    <div className="grid grid-cols-8 gap-1 w-full max-w-lg mx-auto aspect-[4/3]">
      {cells.map((i) => {
        const isActive = activeIndexes.has(i);
        return (
          <div
            key={i}
            tabIndex={0} // for focus-visible
            className={`aspect-square border border-dashed border-white/15 rounded-sm transition-all duration-300 hover:border-purple-400/70 hover:shadow-lg hover:shadow-purple-400/50 hover:transform hover:-rotate-x-3 hover:rotate-y-3 hover:scale-110 focus-visible:border-purple-400/70 focus-visible:shadow-lg focus-visible:shadow-purple-400/50 focus-visible:transform focus-visible:-rotate-x-3 focus-visible:rotate-y-3 focus-visible:scale-110 ${
              isActive
                ? 'border-purple-400/70 shadow-lg shadow-purple-400/50 transform -rotate-x-3 rotate-y-3 scale-110'
                : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          />
        );
      })}
    </div>
  );
}