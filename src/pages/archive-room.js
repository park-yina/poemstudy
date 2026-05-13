import React, { useState } from 'react';

import styles from '../components/ArchiveRoom/archive-room.module.css';

import ArchiveTopbar from '../components/ArchiveRoom/ArchiveTopbar';

import ArchiveSidebar from '../components/ArchiveRoom/ArchiveSidebar';

import FullstackSection from '../components/ArchiveRoom/FullstackSection';
import TempleBackground from '../components/ArchiveRoom/TempleBackground';

export default function ArchiveRoom() {

  const [overlayActive, setOverlayActive] =
    useState(false);

  return (

    <main
      className={`
        ${styles.archiveRoom}

        ${
          overlayActive
            ? styles.overlayActive
            : ''
        }
      `}
    >

      <TempleBackground />

      <ArchiveTopbar />
{
  !overlayActive && (
    <ArchiveSidebar />
  )
}

      <FullstackSection
        overlayActive={overlayActive}
        setOverlayActive={setOverlayActive}
      />

    </main>
  );
}
