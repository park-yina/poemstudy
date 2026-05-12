import React, { useEffect, useRef, useState } from 'react';

import styles from './archive-room.module.css';
import bookStyles from './book-transition.module.css';
import tarotStyles from './tarot-cards.module.css';

const primaryBooks = [
  {
    id: 'realtime-ranking',

    title: 'REALTIME RANKING',

    subtitle: 'SSE / 운영 성능',

    type: 'MAIN',

    arcana: 'syslog',

    sticky: 'SSE PATCH',

    stickyColor: 'yellow',

    description:
      'Polling 구조와 SSE, WebSocket 구조를 비교하고 실제 운영 환경에서 SSE를 선택했던 기록입니다.',

    records: [
      'Polling 구조의 트래픽 증가 문제',
      'SSE 기반 부분 갱신 구조 설계',
      'Version 기반 캐시 갱신 전략',
      '테스트',
      '목업',
      '10개채우기',
      '하아',
      '인생'
    ],
  },

  {
    id: 'record-control',

    title: 'RECORD CONTROL',

    subtitle: 'WebRTC / 장비 제어',

    type: 'MAIN',

    arcana: 'protocol',

    sticky: 'DEVICE',

    stickyColor: 'blue',

    description:
      'WebRTC 기반 원격 제어와 장비 생태계 구조를 분리해서 설계했던 기록입니다.',

    records: [
      'Raspberry Pi 장비 생태계',
      'WebRTC 기반 제어 구조',
      'LTE fallback 환경 테스트',
    ],
  },

  {
    id: 'download-system',

    title: 'DOWNLOAD SYSTEM',

    subtitle: 'Signed URL / 만료 정책',

    type: 'MAIN',

    arcana: 'protocol',

    sticky: 'SECURITY',

    stickyColor: 'gold',

    description:
      'Signed URL 기반 다운로드 만료 정책과 접근 제어를 설계한 기록입니다.',

    records: [
      '다운로드 횟수 제한',
      '만료 기반 접근 정책',
      'Firebase Storage 연동',
    ],
  },

  {
    id: 'fakejumping-admin',

    title: 'FAKEJUMPING ADMIN',

    subtitle: 'Spring / KPI / 관리자',

    type: 'MAIN',

    arcana: 'chronicle',

    sticky: 'KPI',

    stickyColor: 'purple',

    description:
      '운영 KPI와 관리자 시스템을 Spring 기반으로 재구축한 기록입니다.',

    records: [
      '운영 상태 enum 정규화',
      '매장 KPI 시각화',
      '다중 조건 기반 상태 변경',
    ],
  },
];

const secondaryBooks = [
  {
    id: 'pain-diary',
    title: 'PAIN DIARY',
    subtitle: 'App / 기록 서비스',
    type: 'SIDE',
    sticky: 'DIARY',
    stickyColor: 'orange',
    description:
      '통증을 기록하고 공유하기 위한 앱 서비스 구조를 정리한 기록입니다.',
    records: [
      '감정 기록 구조',
      '통증 데이터 저장',
    ],
  },
  {
    id: 'ledger-automation',
    title: 'LEDGER AUTOMATION',
    subtitle: '장부 / 자동화',
    type: 'SIDE',
    sticky: 'AUTO',
    stickyColor: 'blue',
    description:
      '매장 장부 자동화와 데이터 정리 흐름을 설계한 기록입니다.',
    records: [
      '수기 장부 자동화',
      '데이터 정리 흐름',
    ],
  },
];

function ArchiveBook({
  book,
  small = false,
  selected,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      className={`
        ${styles.archiveBook}
        ${small ? styles.smallBook : ''}
        ${selected ? styles.selectedBook : ''}
      `}
      aria-pressed={selected}
    >
      <div
        className={`
          ${styles.bookSticky}
          ${styles[book.stickyColor]}
        `}
      >
        {book.sticky}
      </div>

      <div className={styles.bookInner}>
        <span className={styles.bookType}>
          {book.type}
        </span>

        <span className={styles.bookTitle}>
          {book.title}
        </span>

        <span className={styles.bookSubtitle}>
          {book.subtitle}
        </span>
      </div>
    </button>
  );
}

function BookShelf({
  title,
  description,
  books,
  small = false,
  selectedBook,
  setSelectedBook,
    overlayActive,
}) {
  return (
<section
  className={`
    ${styles.bookShelf}

    ${
      overlayActive
        ? styles.shelfDissolve
        : ''
    }
  `}
>      
<div className={styles.shelfHeader}>
        <p>{title}</p>
        <span>{description}</span>
      </div>

      <div className={styles.booksRow}>
        {books.map((book) => (
          <ArchiveBook
            key={book.id}
            book={book}
            small={small}
            selected={selectedBook?.id === book.id}
            onSelect={setSelectedBook}
          />
        ))}
      </div>

      <div className={styles.shelfBase} />
    </section>
  );
}

function PageFlurry() {

  return (

    <div
      className={bookStyles.pageFlurry}
      aria-hidden="true"
    >

      {Array.from({ length: 9 }).map((_, index) => (

        <span
          key={index}
          className={bookStyles.flippingPage}
        />

      ))}

    </div>
  );
}

function TarotSpread({ book, isClosing }) {

  const [activeCard, setActiveCard] =
    useState(null);

  const [lineupMode, setLineupMode] =
    useState(false);

  useEffect(() => {

    const timer = setTimeout(() => {

      setLineupMode(true);

    }, 1600);

    return () => clearTimeout(timer);

  }, []);

  const cards = [
    {
      title: book.title,
      subtitle: book.subtitle,
      type: book.type,
    },

    ...(book.records ?? []).map((record, index) => ({
      title: record,

      subtitle:
        index === 0
          ? 'Origin'
          : index === 1
            ? 'Pattern'
            : 'Result',

      type: `ARCANA ${index + 1}`,
    })),
  ];

  /* ========================================
     LAYOUT MODE
  ======================================== */

  const layoutMode =
    cards.length <= 5
      ? 'spread'
      : 'grid';

  /* ========================================
     POSITION PRESETS
  ======================================== */

  const spreadPositions = [
    { x: -355, y: -46, z: 24, r: -16 },
    { x: -165, y: -82, z: 54, r: -7 },
    { x: 0, y: -96, z: 84, r: 0 },
    { x: 165, y: -82, z: 54, r: 7 },
    { x: 355, y: -46, z: 24, r: 16 },
  ];

  const altarPositions = [
    { x: -260, y: -140, z: 54, r: -10 },
    { x: 0, y: -170, z: 86, r: 0 },
    { x: 260, y: -140, z: 54, r: 10 },

    { x: -140, y: 120, z: 34, r: -4 },
    { x: 140, y: 120, z: 34, r: 4 },

    { x: -260, y: 360, z: 12, r: -8 },
    { x: 0, y: 390, z: 22, r: 0 },
    { x: 260, y: 360, z: 12, r: 8 },
  ];

  /* ========================================
     GRID MODE
  ======================================== */

  if (layoutMode === 'grid') {

    return (

      <div
        className={`
          ${tarotStyles.gridSpread}
          ${cards.length > 9 ? tarotStyles.gridFour : tarotStyles.gridThree}

          ${
            isClosing
              ? tarotStyles.closingSpread
              : ''
          }
        `}
        aria-hidden="true"
      >

        {cards.map((card, index) => (

          <div
            key={`${card.type}-${card.title}`}

            onClick={() =>
              setActiveCard(
                activeCard === index
                  ? null
                  : index
              )
            }

            className={`
              ${tarotStyles.gridCard}

              ${tarotStyles[book.arcana]}

              ${
                activeCard === index
                  ? tarotStyles.activeCard
                  : ''
              }
            `}
          >

            {/* CARD BACK */}

            <div className={tarotStyles.cardBack}>

              <div className={tarotStyles.arcanaFrame} />

              <div className={tarotStyles.arcanaGrid} />

              <div className={tarotStyles.arcanaSeal} />

              <div className={tarotStyles.arcanaGlyph}>
                {book.arcana}
              </div>

              <div className={tarotStyles.arcanaRing} />

              <div className={tarotStyles.arcanaNoise} />

            </div>

            {/* CARD FRONT */}

            <div className={tarotStyles.cardFront}>

              <div className={tarotStyles.cardFrame}>

                <span className={tarotStyles.cardLabel}>
                  {card.type}
                </span>

                <h3>
                  {card.title}
                </h3>

                <p>
                  {card.subtitle}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>
    );
  }

  /* ========================================
     SPREAD / ALTAR
  ======================================== */

  return (

    <div
      className={`
        ${tarotStyles.cardSpread}

        ${tarotStyles[layoutMode]}

        ${
          lineupMode
            ? tarotStyles.lineup
            : ''
        }

        ${
          isClosing
            ? tarotStyles.closingSpread
            : ''
        }
      `}
      aria-hidden="true"
    >

      {cards.map((card, index) => {

        let position;

        /* ========================================
           SPREAD
        ======================================== */

        if (layoutMode === 'spread') {

          position =
            spreadPositions[index] ?? {
              x: 0,
              y: 0,
              z: 0,
              r: 0,
            };
        }

        /* ========================================
           ALTAR
        ======================================== */

        else {

          position =
            altarPositions[index] ?? {
              x: 0,
              y: 0,
              z: 0,
              r: 0,
            };
        }

        return (

          <div
            key={`${card.type}-${card.title}`}

            onClick={() =>
              setActiveCard(
                activeCard === index
                  ? null
                  : index
              )
            }

            style={{
              '--card-x': `${position.x}px`,
              '--card-y': `${position.y}px`,
              '--card-z': `${position.z}px`,
              '--card-rotate': `${position.r}deg`,
            }}

className={`
  ${tarotStyles.tarotCard}

  ${
    layoutMode === 'grid'
      ? tarotStyles.gridCard
      : ''
  }

  ${tarotStyles[book.arcana]}

  ${
    activeCard === index
      ? tarotStyles.activeCard
      : ''
  }
`}
          >

            {/* CARD BACK */}

            <div className={tarotStyles.cardBack}>

              <div className={tarotStyles.arcanaFrame} />

              <div className={tarotStyles.arcanaGrid} />

              <div className={tarotStyles.arcanaSeal} />

              <div className={tarotStyles.arcanaGlyph}>
                {book.arcana}
              </div>

              <div className={tarotStyles.arcanaRing} />

              <div className={tarotStyles.arcanaNoise} />

            </div>

            {/* CARD FRONT */}

            <div className={tarotStyles.cardFront}>

              <div className={tarotStyles.cardFrame}>

                <span className={tarotStyles.cardLabel}>
                  {card.type}
                </span>

                <h3>
                  {card.title}
                </h3>

                <p>
                  {card.subtitle}
                </p>

              </div>

            </div>

          </div>

        );
      })}

    </div>
  );
}
function OpenedBook({ book, isClosing, onClose }) {
  if (!book) {
    return null;
  }

  return (
    <div
      className={`
        ${bookStyles.openedOverlay}
        ${isClosing ? bookStyles.closingOverlay : ''}
      `}
      onClick={onClose}
      role="presentation"
    >
      <div className={bookStyles.dimensionFog} aria-hidden="true" />

      <div
        className={bookStyles.recordStage}
      >
        <div
          className={bookStyles.recordScroll}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={bookStyles.bookArtifact}>
            <div className={bookStyles.openedBook}>
              <div className={bookStyles.bookInnerPages}>
                <div className={bookStyles.leftPage}>
                  <div className={bookStyles.pageInner}>
                    <div className={styles.recordLabel}>
                      ARCHIVE RECORD
                    </div>

                    <p className={styles.openedDescription}>
                      {book.description}
                    </p>
                  </div>
                </div>

                <div className={bookStyles.rightPage}>
                  <div className={bookStyles.pageInner}>
                    <div className={styles.recordList}>
                      {book.records?.map((record) => (
                        <div
                          key={record}
                          className={styles.recordCard}
                        >
                          {record}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <PageFlurry />

              <div className={bookStyles.bookCover}>
                <div className={bookStyles.coverFront}>
                  <span className={styles.openedType}>
                    {book.type}
                  </span>

                  <h2 className={styles.openedTitle}>
                    {book.title}
                  </h2>

                  <p className={styles.openedSubtitle}>
                    {book.subtitle}
                  </p>
                </div>
              </div>

              <div className={bookStyles.openedSpine} aria-hidden="true" />
            </div>
          </div>

          <TarotSpread book={book} isClosing={isClosing} />
        </div>

        <div className={bookStyles.escapeHint}>
          PRESS ESC TO EXIT ARCHIVE
        </div>

        <button
          type="button"
          className={`${styles.closeButton} ${bookStyles.closeButton}`}
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          aria-label="Close opened book"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}

export default function FullstackSection({
  overlayActive,
  setOverlayActive,
}) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (!selectedBook) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeBook();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedBook, isClosing]);

  useEffect(() => (
    () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    }
  ), []);

const openBook = (book) => {

  if (closeTimerRef.current) {
    clearTimeout(closeTimerRef.current);
  }

  setOverlayActive(true);

  setIsClosing(false);

  setSelectedBook(book);
};

  const closeBook = () => {
    if (!selectedBook || isClosing) {
      return;
    }

    setIsClosing(true);

closeTimerRef.current = setTimeout(() => {

  setSelectedBook(null);

  setOverlayActive(false);

  setIsClosing(false);

}, 820);
  };

  return (
    <section
      id="fullstack"
      className={styles.fullstackSection}
    >
      <div className={styles.fullstackIntro}>
        <p className={styles.sectionEyebrow}>
          001 Fullstack
        </p>

        <h2>Fullstack Records</h2>

        <p>
          실제 운영 환경에서 만들고 다듬었던 시스템들을 주요 기록과
          보조 기록으로 나누어 보관합니다.
        </p>
      </div>

      <div className={styles.shelfStack}>
        <BookShelf
          title="PRIMARY ARCHIVE"
          description="핵심 프로젝트"
          books={primaryBooks}
          selectedBook={selectedBook}
            overlayActive={overlayActive}

          setSelectedBook={openBook}
        />

        <BookShelf
          title="SIDE RECORDS"
          description="보조 기록"
          books={secondaryBooks}
          small
          selectedBook={selectedBook}
            overlayActive={overlayActive}

          setSelectedBook={openBook}
        />
      </div>

      <OpenedBook
        key={selectedBook?.id ?? 'closed'}
        book={selectedBook}
        isClosing={isClosing}
        onClose={closeBook}
      />
    </section>
  );
}
