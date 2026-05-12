import React from 'react';

import styles from './archive-room.module.css';

export default function ArchiveContent() {

  return (
    <section className={styles.content}>

      <p className={styles.label}>
        Developer Archive
      </p>

      <h1 className={styles.title}>
        Archive Room
      </h1>

      <p className={styles.subtitle}>
        운영 기록과 개발 로그,
        그리고 문제 해결의 흔적을
        보관하는 디지털 기록실.
      </p>

    </section>
  );
}