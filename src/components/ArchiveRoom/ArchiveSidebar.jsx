import React from 'react';

import styles from './archive-room.module.css';

export default function ArchiveSidebar() {

  return (
    <aside className={styles.sidebar}>

      <div className={styles.sidebarLabel}>
        ARCHIVE INDEX
      </div>

      <nav className={styles.sidebarNav}>

        <a
          href="#fullstack"
          className={styles.activeItem}
        >
          001 Fullstack
        </a>

        <a href="#app">
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