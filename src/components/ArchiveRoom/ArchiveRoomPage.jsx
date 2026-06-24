import React, { useState } from 'react';

import ArchiveSidebar from './ArchiveSidebar';
import ArchiveTopbar from './ArchiveTopbar';
import {
  appPrimaryBooks,
  backendPrimaryBooks,
  fullstackPrimaryBooks,
  futureBooks,
  yinaBooks,
} from './archive-books';
import styles from './archive-room.module.css';
import TempleBackground from './TempleBackground';

export default function ArchiveRoomPage({
  activeSection,
  children,
}) {
  const [overlayActive, setOverlayActive] =
    useState(false);
  const [ritualIntensity, setRitualIntensity] =
    useState(0);

  const backgroundBooksBySection = {
    app: appPrimaryBooks,
    backend: backendPrimaryBooks,
    fullstack: fullstackPrimaryBooks,
    future: futureBooks,
    yina: yinaBooks,
  };

  const backgroundBook =
    backgroundBooksBySection[activeSection]?.[0] ??
    fullstackPrimaryBooks[0];

  return (
    <main
      className={`
        ${styles.archiveRoom}
        ${overlayActive ? styles.overlayActive : ''}
      `}
    >
      <div className={styles.archiveBackgroundImage} />

      <TempleBackground
        gates={backgroundBook?.gates ?? []}
        ritualIntensity={ritualIntensity}
      />

      <ArchiveTopbar />

      {!overlayActive && (
        <ArchiveSidebar activeSection={activeSection} />
      )}

      {children({
        overlayActive,
        setOverlayActive,
        setRitualIntensity,
      })}
    </main>
  );
}
