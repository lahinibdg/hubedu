'use client';

import { useState, useEffect } from 'react';
import styles from './cubes.module.css';

const ROWS = 7;
const COLS = 8;
const TOTAL_CELLS = ROWS * COLS;
const CUBE_CELLS = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 2, 10, 18, 26, 34, 42, 50]; // More cubes for blockchain representation

export default function Cubes() {
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);
  const [rippleIndex, setRippleIndex] = useState<number | null>(null);
  const [chainIndices, setChainIndices] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex(Math.floor(Math.random() * TOTAL_CELLS));
      setTimeout(() => setPulseIndex(null), 1000); // Pulse for 1s
    }, 1500); // Every 1.5s

    // Chain effect for blockchain representation
    const chainInterval = setInterval(() => {
      const startIndex = Math.floor(Math.random() * CUBE_CELLS.length);
      const chain = [];
      for (let i = 0; i < 3; i++) {
        const idx = (startIndex + i) % CUBE_CELLS.length;
        chain.push(CUBE_CELLS[idx]);
      }
      setChainIndices(chain);
      setTimeout(() => setChainIndices([]), 2000);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(chainInterval);
    };
  }, []);

  const handleCellClick = (i: number) => {
    setRippleIndex(i);
    setTimeout(() => setRippleIndex(null), 600); // Ripple for 0.6s
  };

  const handleCellHover = (i: number) => {
    // Optional: add hover effect
  };

  const cells = Array.from({ length: TOTAL_CELLS }, (_, i) => i);

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {cells.map((i) => {
          const isCube = CUBE_CELLS.includes(i);
          const isPulse = pulseIndex === i;
          const isRipple = rippleIndex === i;
          const isChain = chainIndices.includes(i);
          return (
            <div
              key={i}
              className={`${styles.cell} ${isCube ? styles.cube : ''} ${isPulse ? styles.pulse : ''} ${isRipple ? styles.ripple : ''} ${isChain ? styles.chain : ''}`}
              onClick={() => handleCellClick(i)}
              onMouseEnter={() => handleCellHover(i)}
            >
              {isCube && (
                <>
                  <div className={styles.front}></div>
                  <div className={styles.top}></div>
                  <div className={styles.side}></div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}