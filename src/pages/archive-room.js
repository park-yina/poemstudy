import React from 'react';

import styles from '../components/ArchiveRoom/archive-room.module.css';

import ArchiveTopbar from '../components/ArchiveRoom/ArchiveTopbar';

import ArchiveSidebar from '../components/ArchiveRoom/ArchiveSidebar';

import ArchiveContent from '../components/ArchiveRoom/ArchiveContent';

export default function ArchiveRoom() {

  return (
    <main className={styles.archiveRoom}>

      <ArchiveTopbar />

      <ArchiveSidebar />

      <ArchiveContent />

    </main>
  );
}