import React from 'react';

import styles from './archive-room.module.css';

const primaryBooks = [
  {
    title: 'REALTIME RANKING',
    subtitle: 'SSE / 운영 랭킹',
    type: 'MAIN',
  },
  {
    title: 'RECORD CONTROL',
    subtitle: 'WebRTC / 장비 제어',
    type: 'MAIN',
  },
  {
    title: 'DOWNLOAD SYSTEM',
    subtitle: 'Signed URL / 만료 정책',
    type: 'MAIN',
  },
  {
    title: 'FAKEJUMPING ADMIN',
    subtitle: 'Spring / KPI / 관리자',
    type: 'MAIN',
  },
];

const secondaryBooks = [
  {
    title: 'PAIN DIARY',
    subtitle: 'App / 기록 서비스',
    type: 'SIDE',
  },
  {
    title: 'LEDGER AUTOMATION',
    subtitle: '장부 / 자동화',
    type: 'SIDE',
  },
];

function ArchiveBook({ book, small = false }) {
  return (
    <button
      type="button"
      className={`${styles.archiveBook} ${small ? styles.smallBook : ''}`}
    >
      <span className={styles.bookType}>{book.type}</span>

      <span className={styles.bookTitle}>{book.title}</span>

      <span className={styles.bookSubtitle}>{book.subtitle}</span>
    </button>
  );
}

function BookShelf({ title, description, books, small = false }) {
  return (
    <section className={styles.bookShelf}>
      <div className={styles.shelfHeader}>
        <p>{title}</p>
        <span>{description}</span>
      </div>

      <div className={styles.booksRow}>
        {books.map((book) => (
          <ArchiveBook
            key={book.title}
            book={book}
            small={small}
          />
        ))}
      </div>

      <div className={styles.shelfBase} />
    </section>
  );
}

export default function FullstackSection() {
  return (
    <section
      id="fullstack"
      className={styles.fullstackSection}
    >
      <div className={styles.fullstackIntro}>
        <p className={styles.sectionEyebrow}>001 Fullstack</p>

        <h2>Fullstack Records</h2>

        <p>
          실제 운영 환경에서 만들고 다듬었던 시스템들을
          대표 기록과 보조 기록으로 나누어 보관합니다.
        </p>
      </div>

      <div className={styles.shelfStack}>
        <BookShelf
          title="PRIMARY ARCHIVE"
          description="대표 프로젝트"
          books={primaryBooks}
        />

        <BookShelf
          title="SIDE RECORDS"
          description="보조 기록"
          books={secondaryBooks}
          small
        />
      </div>
    </section>
  );
}