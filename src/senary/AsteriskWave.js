import React from 'react';
import { styles } from './styles';

const asteriskLine =
  ' * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ';

export function AsteriskWave() {
  const waveRows = 38;
  const amplitude = 45;
  const gradientColor = (i) => {
    const t = i / (waveRows - 1);
    const r = Math.round(28 + (138 - 28) * t);
    const g = Math.round(28 + (138 - 28) * t);
    const b = Math.round(28 + (138 - 28) * t);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="asterisk-wave" style={styles.asteriskWave} aria-hidden>
      {Array.from({ length: waveRows }, (_, i) => (
        <div
          key={i}
          style={{
            ...styles.asteriskRow(Math.sin(i * 0.35) * amplitude, gradientColor(i), i * 0.065),
            top: `${(i / waveRows) * 100}%`,
          }}
        >
          {asteriskLine}
        </div>
      ))}
    </div>
  );
}
