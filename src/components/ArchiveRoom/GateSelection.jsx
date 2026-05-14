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
        ${selectedGate ? styles.gateSelectionClosing : ''}
      `}
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
          aria-label={`${gate.gate} room. Click to open.`}
        >
          <div className={styles.gateDoor}>
            <div className={styles.gateSanctuaryAura} aria-hidden="true">
              <span className={styles.gateRune} />
              <span className={styles.gateRune} />
              <span className={styles.gateRune} />
            </div>

            <div className={styles.gateDoorPanel}>
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

            <div className={styles.gateDoorThreshold}>
              <span className={styles.gateDoorKnob} />
            </div>

            <div className={styles.gateCandles} aria-hidden="true">
              <span className={styles.gateCandle} />
              <span className={styles.gateCandle} />
              <span className={styles.gateCandle} />
              <span className={styles.gateCandle} />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
