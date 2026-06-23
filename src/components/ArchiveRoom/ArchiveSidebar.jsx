import React from 'react';

import styles from './archive-room.module.css';

export default function ArchiveSidebar({
  activeSection = 'fullstack',
}) {

  return (
    <aside className={styles.sidebar}>

      <div className={styles.sidebarLabel}>
        ARCHIVE INDEX
      </div>

      <nav className={styles.sidebarNav}>

        <a
          href="/archive-room"
          className={
            activeSection === 'fullstack'
              ? styles.activeItem
              : undefined
          }
        >
          001 Fullstack
        </a>

        <a
          href="/archive-room/app"
          className={
            activeSection === 'app'
              ? styles.activeItem
              : undefined
          }
        >
          002 App
        </a>

        <a href="#backend">
          003 Backend
        </a>

        <a href="#essay">
          004 Essay
        </a>

        <a href="#yina">
          005 Yina
        </a>

        <a href="#literature">
          006 Literature
        </a>

      </nav>

    </aside>
  );
}
