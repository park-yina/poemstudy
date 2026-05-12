import React from 'react';

import styles from './archive-room.module.css';

export default function ArchiveTopbar() {

  return (
    <header className={styles.topbar}>

      <div className={styles.brandSection}>

        <div className={styles.brandIcon}>
          ✦
        </div>

        <div className={styles.brandText}>

          <strong>
            Luda Log
          </strong>

          <span>
            ARCHIVE ROOM
          </span>

        </div>

      </div>

      <nav className={styles.nav}>

        <a href="#records">
          Records
        </a>

        <a href="#ludarota">
          Ludarota
        </a>

        <a href="#runtime">
          Runtime
        </a>

        <a href="#logs">
          Logs
        </a>

      </nav>

      <a
        href="/"
        className={styles.exitButton}
      >
        Exit Archive
      </a>

    </header>
  );
}