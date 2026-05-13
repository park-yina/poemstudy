import React, { useEffect, useRef, useState } from 'react';

import styles from './archive-room.module.css';
import bookStyles from './book-transition.module.css';
import tarotStyles from './tarot-cards.module.css';

export const jumpingBattleBook = {

  id: 'jumping-battle',

  title: 'JUMPING BATTLE',

  subtitle:
    'Streaming / Ranking / Device Ecosystem',

  type: 'ARCHIVE',

  arcana: 'syslog',

  sticky: 'LIVE OPS',

  stickyColor: 'yellow',

  description:
    '30개 이상의 매장에서 운영된 스트리밍 및 실시간 랭킹 시스템 기록',

  gates: [

    /* ========================================
       REALTIME
    ======================================== */

    {
      id: 'realtime',

      gate: 'REALTIME',

      icon: '⌁',

      description:
        '실시간 랭킹과 이벤트 스트림 구조',

      cards: [

        {
          title:
            'Polling 구조의 트래픽 증가 문제',

          subtitle:
            'Traffic Incident',

          label:
            'INCIDENT',

          keyword:
            'TRAFFIC',

          artwork:
            '/img/cards/INCIDENT.png',

          decoding: {

            summary:
              'Polling 기반 구조에서 발생했던 요청 폭증 문제',

            problem: [
              '3초 polling 기반 구조',
              '동시 접속 증가',
              'EC2 트래픽 증가',
            ],

            solution: [
              'SSE 기반 구조 도입',
              '부분 갱신 전략',
              'Version patch 구조',
            ],

            result: [
              '트래픽 감소',
              '부분 갱신 성공',
              '운영 비용 감소',
            ],
          },
        },

        {
          title:
            'SSE 기반 부분 갱신 구조 설계',

          subtitle:
            'Realtime Stream',

          label:
            'PATCH',

          keyword:
            'SSE',

          artwork:
            '/img/cards/PATCH.png',

          decoding: {

            summary:
              'SSE를 활용한 부분 갱신 구조',

            problem: [
              '전체 데이터 재요청 문제',
              '실시간성 대비 과도한 polling',
            ],

            solution: [
              'delta patch 설계',
              '부분 payload 업데이트',
              'Version snapshot 비교',
            ],

            result: [
              '데이터 흐름 최적화',
              '실시간 UX 개선',
            ],
          },
        },

        {
          title:
            'Version 기반 캐시 동기화',

          subtitle:
            'Consistency Layer',

          label:
            'CACHE',

          keyword:
            'VERSION',

          artwork:
            '/img/cards/CACHE.png',

          decoding: {

            summary:
              'Version snapshot 기반 캐시 갱신 구조',

            problem: [
              '불필요한 전체 갱신',
              'stale cache 발생',
            ],

            solution: [
              '버전 비교 기반 sync',
              '부분 refresh 전략',
            ],

            result: [
              '데이터 정합성 향상',
              '대역폭 절감',
            ],
          },
        },
      ],
    },

    /* ========================================
       INFRA
    ======================================== */

    {
      id: 'infra',

      gate: 'INFRA',

      icon: '◈',

      description:
        '운영 환경과 서버 인프라 기록',

      cards: [

        {
          title:
            'EC2 트래픽 비용 최적화',

          subtitle:
            'Infrastructure',

          label:
            'TRAFFIC',

          keyword:
            'EC2',

          artwork:
            '/img/cards/INFRA.png',

          decoding: {

            summary:
              '실시간 polling 구조로 인한 트래픽 문제',

            problem: [
              '동시 요청 증가',
              '비효율적인 데이터 흐름',
            ],

            solution: [
              'SSE 구조 전환',
              'payload 최소화',
            ],

            result: [
              '운영 비용 감소',
              '네트워크 안정성 증가',
            ],
          },
        },

        {
          title:
            'AWS Lambda 분리 운영',

          subtitle:
            'Serverless Split',

          label:
            'LAMBDA',

          keyword:
            'AWS',

          artwork:
            '/img/cards/LAMBDA.png',

          decoding: {

            summary:
              '기능 단위 Lambda 분리 구조',

            problem: [
              '기능 집중도 증가',
              '배포 단위 관리 필요',
            ],

            solution: [
              'Lambda 단위 역할 분리',
              'Flask 기반 lightweight API',
            ],

            result: [
              '배포 유연성 증가',
              '운영 구조 단순화',
            ],
          },
        },
      ],
    },

    /* ========================================
       SECURITY
    ======================================== */

    {
      id: 'security',

      gate: 'SECURITY',

      icon: '✦',

      description:
        '다운로드 보안 및 접근 제어',

      cards: [

        {
          title:
            'Signed URL 기반 접근 정책',

          subtitle:
            'Access Control',

          label:
            'SIGNED',

          keyword:
            'URL',

          artwork:
            '/img/cards/SIGNED.png',

          decoding: {

            summary:
              'Signed URL 기반 다운로드 보안',

            problem: [
              '무제한 공유 가능성',
              '외부 접근 문제',
            ],

            solution: [
              '만료 시간 기반 URL',
              '사용 횟수 제한',
            ],

            result: [
              '접근 제어 강화',
              '다운로드 보안 확보',
            ],
          },
        },
      ],
    },

    /* ========================================
       DEVICE
    ======================================== */

    {
      id: 'device',

      gate: 'DEVICE',

      icon: '⌬',

      description:
        '장비 생태계 및 제어 구조',

      cards: [

        {
          title:
            'WebRTC 기반 원격 장비 제어',

          subtitle:
            'Realtime Control',

          label:
            'CONTROL',

          keyword:
            'WEBRTC',

          artwork:
            '/img/cards/DEVICE.png',

          decoding: {

            summary:
              'WebRTC 기반 원격 장비 제어 구조',

            problem: [
              '실시간 제어 지연',
              '장비 식별 문제',
            ],

            solution: [
              'device uuid 구조',
              'WebRTC signaling',
            ],

            result: [
              '실시간 반응성 확보',
              '운영 안정성 증가',
            ],
          },
        },
      ],
    },
  ],
};

const primaryBooks = [jumpingBattleBook];

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
function GateSelection({
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
function TarotSpread({
  book,
    selectedGate,

  isClosing,
  setDecodingMode,
  decodingExitRequest,
}){

  const [activeCard, setActiveCard] =
    useState(null);

  const [lineupMode, setLineupMode] =
    useState(false);
    const [decodingCard, setDecodingCard] =
    useState(null);
useEffect(() => {

  if (!setDecodingMode) {
    return;
  }

  setDecodingMode(
    decodingCard !== null
  );

}, [decodingCard, setDecodingMode]);
  useEffect(() => {
    if (!decodingCard) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setDecodingCard(null);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [decodingCard]);
  useEffect(() => {
    if (decodingExitRequest > 0) {
      setDecodingCard(null);
    }
  }, [decodingExitRequest]);
  useEffect(() => {

    const timer = setTimeout(() => {

      setLineupMode(true);

    }, 1600);

    return () => clearTimeout(timer);

  }, []);

const cards =
  selectedGate?.cards ?? [];

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

    <>

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
            key={`${card.label}-${card.title}`}

            onClick={() =>
              setActiveCard(
                activeCard === index
                  ? null
                  : index
              )
            }

            onDoubleClick={() =>
              setDecodingCard(card)
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

            <div className={tarotStyles.cardFront}>

              <img
                src={card.artwork}
                alt={card.title}
                className={tarotStyles.cardArtwork}
              />

              <div className={tarotStyles.cardFrame}>

                <span className={tarotStyles.cardLabel}>
                    {card.label}

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

      {decodingCard && (

        <div
          className={tarotStyles.decodingOverlay}
          data-decoding-overlay="true"
        >

          <button
            className={tarotStyles.decodingClose}

            onClick={() =>
              setDecodingCard(null)
            }
          >
            CLOSE
          </button>

          <div className={tarotStyles.decodingLayout}>

            <div className={tarotStyles.decodingCardPreview}>

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

            </div>

            <div className={tarotStyles.decodingPanel}>

              <span className={tarotStyles.decodingEyebrow}>
                RECORD DECODING
              </span>

              <h2>
                {decodingCard.title}
              </h2>

              <p className={tarotStyles.decodingSubtitle}>
                {decodingCard.subtitle}
              </p>

            </div>

          </div>

        </div>
      )}

    </>

  );
}

  /* ========================================
     SPREAD / ALTAR
  ======================================== */

return (

  <>

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

        if (layoutMode === 'spread') {

          position =
            spreadPositions[index] ?? {
              x: 0,
              y: 0,
              z: 0,
              r: 0,
            };
        }

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
            key={`${card.label}-${card.title}`}

            onClick={() =>
              setActiveCard(
                activeCard === index
                  ? null
                  : index
              )
            }

            onDoubleClick={() =>
              setDecodingCard(card)
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

              <img
                src={card.artwork}
                alt={card.title}
                className={tarotStyles.cardArtwork}
              />

              <div className={tarotStyles.cardFrame}>

                <span className={tarotStyles.cardLabel}>
                  {card.label}
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

    {decodingCard && (

      <div
        className={tarotStyles.decodingOverlay}
        data-decoding-overlay="true"
      >

        <button
          className={tarotStyles.decodingClose}

          onClick={() =>
            setDecodingCard(null)
          }
        >
          CLOSE
        </button>

        <div className={tarotStyles.decodingLayout}>

          <div className={tarotStyles.decodingCardPreview}>

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

          </div>

          <div className={tarotStyles.decodingPanel}>

            <span className={tarotStyles.decodingEyebrow}>
              RECORD DECODING
            </span>

            <h2>
              {decodingCard.title}
            </h2>

            <p className={tarotStyles.decodingSubtitle}>
              {decodingCard.subtitle}
            </p>

            <div className={tarotStyles.decodingKeywords}>

              <span>SYSTEM</span>

              <span>ARCHIVE</span>

              <span>{book.arcana}</span>

            </div>

            <div className={tarotStyles.decodingBody}>

              <p>
                여기에 실제 상세 기록,
                트러블슈팅,
                기술 선택 이유,
                운영 경험 등을 넣는다.
              </p>

            </div>

          </div>

        </div>

      </div>
    )}

  </>

);
}
function OpenedBook({
  book,
  selectedGate,
  previewGate,
  setSelectedGate,
  setPreviewGate,
  isClosing,
  onClose,
  decodingMode,
  setDecodingMode,
  decodingExitRequest,
  requestDecodingExit,
  visitedGateIds,
  setVisitedGateIds,
}){
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
                      {previewGate ? (
                        previewGate.cards.map((record) => (
                          <div
                            key={record.title}
                            className={styles.recordCard}
                          >
                            <div className={styles.recordCardLabel}>
                              {record.label}
                            </div>

                            <strong>{record.title}</strong>

                            <p>{record.subtitle}</p>
                          </div>
                        ))
                      ) : (
                        <div className={styles.recordCardPlaceholder}>
                          Hover a gate to reveal the room. Double click to enter.
                        </div>
                      )}
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

          <GateSelection
            gates={book.gates ?? []}
            selectedGate={selectedGate}
            previewGate={previewGate}
            setPreviewGate={setPreviewGate}
            setSelectedGate={setSelectedGate}
            visitedGateIds={visitedGateIds}
            setVisitedGateIds={setVisitedGateIds}
          />

          {selectedGate && (
            <TarotSpread
              book={book}
              selectedGate={selectedGate}
              isClosing={isClosing}
              setDecodingMode={setDecodingMode}
              decodingExitRequest={decodingExitRequest}
            />
          )}
        </div>

        <div className={bookStyles.escapeHint}>
          {
            decodingMode
              ? 'PRESS ESC TO RETURN'
              : 'PRESS ESC TO EXIT ARCHIVE'
          }
        </div>

        {
          decodingMode ? (
            <button
              type="button"
              className={`${styles.closeButton} ${bookStyles.closeButton}`}
              onClick={(event) => {
                event.stopPropagation();
                requestDecodingExit();
              }}
              aria-label="Back to records"
            >
              ← BACK
            </button>
          ) : (

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

  )
}
      </div>
    </div>
  );
}

export default function FullstackSection({
  overlayActive,
  setOverlayActive,
}) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedGate, setSelectedGate] =
  useState(null);
  const [previewGate, setPreviewGate] =
    useState(null);
  const [decodingMode, setDecodingMode] =
  useState(false);
  const [decodingExitRequest, setDecodingExitRequest] =
    useState(0);
  const [visitedGateIds, setVisitedGateIds] =
    useState({});
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (!selectedBook) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (
        decodingMode ||
        document.querySelector('[data-decoding-overlay="true"]')
      ) {
        return;
      }

      if (selectedGate) {
        setSelectedGate(null);
        setDecodingMode(false);
        return;
      }

      closeBook();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedBook, selectedGate, isClosing, decodingMode]);

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
  setSelectedGate(null);
  setPreviewGate(null);
  setDecodingMode(false);
};

  const closeBook = () => {
    if (!selectedBook || isClosing) {
      return;
    }

    setIsClosing(true);

closeTimerRef.current = setTimeout(() => {

  setSelectedBook(null);
setSelectedGate(null);
  setPreviewGate(null);
  setDecodingMode(false);
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
  selectedGate={selectedGate}
  previewGate={previewGate}
setSelectedGate={setSelectedGate}
  setPreviewGate={setPreviewGate}
  isClosing={isClosing}
  onClose={closeBook}
  decodingMode={decodingMode}
  setDecodingMode={setDecodingMode}
  decodingExitRequest={decodingExitRequest}
  requestDecodingExit={() =>
    setDecodingExitRequest((request) => request + 1)
  }
  visitedGateIds={visitedGateIds}
  setVisitedGateIds={setVisitedGateIds}
/>
    </section>
  );
}
