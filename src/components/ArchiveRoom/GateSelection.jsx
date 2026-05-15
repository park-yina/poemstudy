import React from 'react';

import styles from './archive-room.module.css';

export default function GateSelection({
  gates,
  selectedGate,
  previewGate,
  setPreviewGate,
  setSelectedGate,
  visitedGateIds,
  setVisitedGateIds,
}) {
  const openGate = (gate) => {
    setPreviewGate(gate);
    setSelectedGate(gate);
    setVisitedGateIds((visitedIds) => ({
      ...visitedIds,
      [gate.id]: true,
    }));
  };

  return (
    <div
      className={`
        ${styles.gateSelection}
        ${selectedGate ? styles.shrineEntering : ''}
      `}
      onMouseLeave={() => {
        if (!selectedGate) {
          setPreviewGate(null);
        }
      }}
    >
      {gates.map((gate) => (
        <button
          key={gate.id}
          type="button"
          onClick={() =>
            openGate(gate)
          }
          onDoubleClick={() =>
            openGate(gate)
          }
          onMouseEnter={() =>
            setPreviewGate(gate)
          }
          onFocus={() =>
            setPreviewGate(gate)
          }
          onBlur={() => {
            if (!selectedGate) {
              setPreviewGate(null);
            }
          }}
          className={`
            ${styles.gatePortal}
            ${
              selectedGate?.id === gate.id
                ? styles.activeGate
                : ''
            }
            ${
              previewGate?.id === gate.id
                ? styles.previewGate
                : ''
            }
            ${
              visitedGateIds[gate.id]
                ? styles.visitedGate
                : ''
            }
          `}
          aria-label={`${gate.gate} archive candle`}
        >
          <div className={styles.candleCase}>
            <div className={styles.candleGlass} aria-hidden="true">
              <span className={styles.candleGlow} />
              <span className={styles.candleFlame} />
              <span className={styles.candleWick} />
              <span className={styles.candleWax} />
            </div>

            <div className={styles.candleMeta}>
              <span className={styles.gateIcon}>
                {gate.icon}
              </span>

              <span className={styles.gateTitle}>
                {gate.gate}
              </span>

              <span className={styles.gateDescription}>
                {gate.description}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
