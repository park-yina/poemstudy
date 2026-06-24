import React, { useEffect, useRef, useState } from 'react';

import BookShelf from './BookShelf';
import DecodingPanel from './DecodingPanel';
import GateSelection from './GateSelection';
import PageFlurry from './PageFlurry';
import {
  appPrimaryBooks,
  appSecondaryBooks,
  backendPrimaryBooks,
  fullstackPrimaryBooks,
  fullstackSecondaryBooks,
  futureBooks,
} from './archive-books';

import styles from './archive-room.module.css';
import bookStyles from './book-transition.module.css';
import tarotStyles from './tarot-cards.module.css';

export {
  appPrimaryBooks,
  appSecondaryBooks,
  backendPrimaryBooks,
  cameraControlBook,
  fullstackPrimaryBooks,
  fullstackSecondaryBooks,
  futureBooks,
  jumpingBattleBook,
  jumpingBattledownloadBook,
} from './archive-books';

function FortuneArchive({
  book,
}) {
  const records =
    book.records ?? [];

  const [isOpen, setIsOpen] =
    useState(false);
  const [openedRecordIndexes, setOpenedRecordIndexes] =
    useState([]);
  const latestRecordRef =
    useRef(null);

  const remainingCount =
    Math.max(0, records.length - openedRecordIndexes.length);
  const allRecordsOpened =
    records.length > 0 &&
    remainingCount === 0;

  const revealOneRecord = () => {
    const nextIndex =
      records.findIndex((record, index) =>
        record &&
        !openedRecordIndexes.includes(index)
      );

    if (nextIndex < 0) {
      return;
    }

    setIsOpen(true);
    setOpenedRecordIndexes((current) => [
      ...current,
      nextIndex,
    ]);
  };

  const revealAllRecords = () => {
    setIsOpen(true);
    setOpenedRecordIndexes(
      records.map((record, index) => index)
    );
  };

  useEffect(() => {
    if (!isOpen || openedRecordIndexes.length === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      latestRecordRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }, 80);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isOpen, openedRecordIndexes.length]);

  const getRecordSealStyle = (index) => {
    const angle =
      (index / Math.max(records.length, 1)) * Math.PI * 2;
    const orbit =
      25 + ((index % 3) * 7);
    const x =
      50 + Math.cos(angle) * orbit;
    const y =
      50 + Math.sin(angle) * orbit * 0.72;
    const hue =
      (book.id.length * 29 + index * 47) % 360;

    return {
      '--seal-x': `${x}%`,
      '--seal-y': `${y}%`,
      '--seal-size': `${20 + (index % 4) * 4}px`,
      '--seal-hue': hue,
      '--seal-delay': `${index * -0.38}s`,
    };
  };

  const getRecordText = (record) =>
    typeof record === 'string'
      ? record
      : record?.text ?? '';

  const getFortuneNoteStyle = (record) => {
    const sealColor =
      typeof record === 'string'
        ? null
        : record?.sealColor ?? record?.noteColor ?? record?.color;

    return sealColor
      ? {
        '--fortune-note-seal-color': sealColor,
      }
      : undefined;
  };

  return (
    <section className={styles.fortuneArchive}>
      <button
        type="button"
        className={styles.crystalVault}
        onClick={() =>
          setIsOpen((open) => !open)
        }
        aria-expanded={isOpen}
      >
        <span className={styles.crystalAura} />
        <span className={styles.crystalOrb}>
          <span className={styles.crystalReflection} />
          {records.map((record, index) => {
            const isRecordOpened =
              openedRecordIndexes.includes(index);

            return (
              <span
                key={`${book.id}-seal-${index}`}
                className={`
                  ${styles.crystalRecordSeal}
                  ${isRecordOpened ? styles.crystalRecordSealOpen : ''}
                `}
                style={getRecordSealStyle(index)}
                aria-hidden="true"
              />
            );
          })}
        </span>
        <span className={styles.crystalBase} />
      </button>

      <div
        className={`
          ${styles.fortunePanel}
          ${isOpen ? styles.fortunePanelOpen : ''}
        `}
      >
        <div className={styles.fortuneHeader}>
          <span>SEALED SIDE ARCHIVE</span>
          <strong>
            남은 기록 {remainingCount}장
          </strong>
        </div>

        <h3>{book.title}</h3>

        <p>
          {book.description}
        </p>

        <div className={styles.fortuneActions}>
          <button
            type="button"
            onClick={revealOneRecord}
            disabled={remainingCount === 0}
          >
            한 장 펼치기
          </button>

          <button
            type="button"
            onClick={revealAllRecords}
            disabled={remainingCount === 0}
          >
            모두 펼치기
          </button>
        </div>

        <div className={styles.fortuneRecordStack}>
          {openedRecordIndexes.map((recordIndex, stackIndex) => {
            const isLatestRecord =
              stackIndex === openedRecordIndexes.length - 1;

            return (
              <article
                key={`${book.id}-${recordIndex}`}
                ref={isLatestRecord ? latestRecordRef : null}
                className={styles.fortuneNote}
                style={getFortuneNoteStyle(records[recordIndex])}
              >
                <span>
                  RECORD {String(recordIndex + 1).padStart(2, '0')}
                </span>
                <p>{getRecordText(records[recordIndex])}</p>
              </article>
            );
          })}
        </div>

        {allRecordsOpened && (
          <div className={styles.fortuneComplete}>
            모든 기록을 확인했습니다.
          </div>
        )}
      </div>
    </section>
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
  const [decodingCardFlipped, setDecodingCardFlipped] =
    useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState(null);
  const handledDecodingExitRequestRef =
    useRef(decodingExitRequest);
useEffect(() => {

  if (!setDecodingMode) {
    return;
  }

  setDecodingMode(
    decodingCard !== null
  );

}, [decodingCard, setDecodingMode]);
  useEffect(() => {
    setDecodingCardFlipped(false);
    setSelectedRecord(null);
  }, [decodingCard]);
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
      if (selectedRecord) {
        setSelectedRecord(null);
        return;
      }

      setDecodingCard(null);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [decodingCard, selectedRecord]);
  useEffect(() => {
    if (
      decodingExitRequest <=
      handledDecodingExitRequestRef.current
    ) {
      return;
    }

    handledDecodingExitRequestRef.current =
      decodingExitRequest;

    if (selectedRecord) {
      setSelectedRecord(null);
      return;
    }

    setDecodingCard(null);
  }, [decodingExitRequest, selectedRecord]);
  useEffect(() => {

    const timer = setTimeout(() => {

      setLineupMode(true);

    }, 1600);

    return () => clearTimeout(timer);

  }, []);

const cards =
  selectedGate?.cards ?? [];

  const cardWithRelatedRecords =
    decodingCard
      ? decodingCard
      : null;

  const toggleDecodingCard = () => {
    setDecodingCardFlipped((flipped) => !flipped);
  };

  const handleDecodingCardKeyDown = (event) => {
    if (
      event.key !== 'Enter' &&
      event.key !== ' '
    ) {
      return;
    }

    event.preventDefault();
    toggleDecodingCard();
  };

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

            onClick={() => {
              setDecodingCard(null);
              setSelectedRecord(null);
            }}
          >
            CLOSE
          </button>

          <div className={tarotStyles.decodingLayout}>

            <div
              className={`
                ${tarotStyles.decodingCardPreview}
                ${
                  decodingCardFlipped
                    ? tarotStyles.decodingCardPreviewFlipped
                    : ''
                }
              `}
              onClick={toggleDecodingCard}
              onKeyDown={handleDecodingCardKeyDown}
              role="button"
              tabIndex={0}
              aria-pressed={decodingCardFlipped}
              aria-label="Flip decoded card"
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
                  src={decodingCard.artwork}
                  alt={decodingCard.title}
                  className={tarotStyles.cardArtwork}
                />

                <div className={tarotStyles.cardFrame}>

                  <span className={tarotStyles.cardLabel}>
                    {decodingCard.label}
                  </span>

                  <h3>
                    {decodingCard.title}
                  </h3>

                  <p>
                    {decodingCard.subtitle}
                  </p>

                </div>

              </div>

            </div>

            <DecodingPanel
              card={cardWithRelatedRecords}
              selectedRecord={selectedRecord}
              onSelectRecord={setSelectedRecord}
              onBackToArchiveCard={() =>
                setSelectedRecord(null)
              }
            />

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

          onClick={() => {
            setDecodingCard(null);
            setSelectedRecord(null);
          }}
        >
          CLOSE
        </button>

        <div className={tarotStyles.decodingLayout}>

          <div
            className={`
              ${tarotStyles.decodingCardPreview}
              ${
                decodingCardFlipped
                  ? tarotStyles.decodingCardPreviewFlipped
                  : ''
              }
            `}
            onClick={toggleDecodingCard}
            onKeyDown={handleDecodingCardKeyDown}
            role="button"
            tabIndex={0}
            aria-pressed={decodingCardFlipped}
            aria-label="Flip decoded card"
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
                src={decodingCard.artwork}
                alt={decodingCard.title}
                className={tarotStyles.cardArtwork}
              />

              <div className={tarotStyles.cardFrame}>

                <span className={tarotStyles.cardLabel}>
                  {decodingCard.label}
                </span>

                <h3>
                  {decodingCard.title}
                </h3>

                <p>
                  {decodingCard.subtitle}
                </p>

              </div>

            </div>

          </div>

          <DecodingPanel
            card={cardWithRelatedRecords}
            selectedRecord={selectedRecord}
            onSelectRecord={setSelectedRecord}
            onBackToArchiveCard={() =>
              setSelectedRecord(null)
            }
          />


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

  const useGates =
    book.useGates !== false;
  const useCrystalArchive =
    book.useCrystalArchive === true ||
    Array.isArray(book.records);

  const flatCardCollection =
    useGates || useCrystalArchive
      ? null
      : {
        id: `${book.id}-cards`,
        cards: book.cards ?? [],
      };

  const visiblePreviewCards =
    useGates
      ? previewGate?.cards
      : book.cards;
  const previewRecords =
    useCrystalArchive
      ? book.records
      : null;

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
                      {visiblePreviewCards ? (
                        visiblePreviewCards.map((record) => (
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
                      ) : previewRecords ? (
                        <div className={styles.recordCardPlaceholder}>
                          봉인된 보조 기록 {previewRecords.length}장이 수정구슬 안에 보관되어 있습니다.
                        </div>
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

          {useGates && (
            <GateSelection
              gates={book.gates ?? []}
              selectedGate={selectedGate}
              previewGate={previewGate}
              setPreviewGate={setPreviewGate}
              setSelectedGate={setSelectedGate}
              visitedGateIds={visitedGateIds}
              setVisitedGateIds={setVisitedGateIds}
            />
          )}

          {useCrystalArchive && (
            <FortuneArchive book={book} />
          )}

          {(selectedGate || flatCardCollection) && (
            <TarotSpread
              book={book}
              selectedGate={selectedGate ?? flatCardCollection}
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
        if (useGates && selectedGate) {
          setSelectedGate(null);
          setDecodingMode(false);
          return;
        }

        onClose();
      }}

      aria-label={
        useGates && selectedGate
          ? 'Back to gates'
          : 'Close opened book'
      }
    >
      {useGates && selectedGate ? '← BACK' : 'CLOSE'}
    </button>

  )
}
      </div>
    </div>
  );
}

function ArchiveBookSection({
  id,
  eyebrow,
  title,
  description,
  primaryTitle,
  primaryDescription,
  primaryBooks,
  secondaryTitle,
  secondaryDescription,
  secondaryBooks,
  overlayActive,
  setOverlayActive,
  setRitualIntensity,
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
  const hasSecondaryBooks =
    Array.isArray(secondaryBooks) &&
    secondaryBooks.length > 0;

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

  useEffect(() => {
    if (!selectedBook) {
      setRitualIntensity?.(0);
      return;
    }

    const visitedCount = Object.keys(visitedGateIds).length;
    const visitedResonance = Math.min(0.18, visitedCount * 0.045);
    const nextIntensity =
      selectedGate
        ? 1
        : previewGate
          ? 0.72
          : visitedResonance;

    setRitualIntensity?.(nextIntensity);
  }, [
    previewGate,
    selectedBook,
    selectedGate,
    setRitualIntensity,
    visitedGateIds,
  ]);

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
  setRitualIntensity?.(0);

  setIsClosing(false);

}, 820);
  };

  return (
    <section
      id={id}
      className={styles.fullstackSection}
    >
      <div className={styles.fullstackIntro}>
        <p className={styles.sectionEyebrow}>
          {eyebrow}
        </p>

        <h2>{title}</h2>

        <p>{description}</p>
      </div>

      <div className={styles.shelfStack}>
        <BookShelf
          title={primaryTitle}
          description={primaryDescription}
          books={primaryBooks}
          selectedBook={selectedBook}
            overlayActive={overlayActive}

          setSelectedBook={openBook}
        />

        {hasSecondaryBooks && (
          <BookShelf
            title={secondaryTitle}
            description={secondaryDescription}
            books={secondaryBooks}
            small
            selectedBook={selectedBook}
              overlayActive={overlayActive}

            setSelectedBook={openBook}
          />
        )}
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

export function AppSection(props) {
  return (
    <ArchiveBookSection
      id="app"
      eyebrow="002 App"
      title="App Records"
      description="앱 서비스로 설계하고 구현한 기록들을 주요 기록과 보조 기록으로 보관합니다."
      primaryTitle="APP ARCHIVE"
      primaryDescription="앱 프로젝트"
      primaryBooks={appPrimaryBooks}
      secondaryTitle="APP SIDE RECORDS"
      secondaryDescription="앱 토이프로젝트"
      secondaryBooks={appSecondaryBooks}
      {...props}
    />
  );
}
export function BackendSection(props) {
  return (
    <ArchiveBookSection
      id="backend"
      eyebrow="003 Backend"
      title="Backend Records"
      description="백엔드 개발자로서 설계하고 구현한 기록들을 보관합니다."
      primaryTitle="BACKEND ARCHIVE"
      primaryDescription="백엔드 프로젝트"
      primaryBooks={backendPrimaryBooks}
      {...props}
    />
  );
}

export function FutureSection(props) {
  return (
    <ArchiveBookSection
      id="future"
      eyebrow="004 Future"
      title="Future Records"
      description="앞으로 진행해갈 프로젝트에 대한 기록입니다."
      primaryTitle="FUTURE ARCHIVE"
      primaryDescription="미래 기록"
      primaryBooks={futureBooks}
      {...props}
    />
  );
}

export default function FullstackSection(props) {
  return (
    <ArchiveBookSection
      id="fullstack"
      eyebrow="001 Fullstack"
      title="Fullstack Records"
      description="실제 운영 환경에서 만들고 다듬었던 시스템들을 주요 기록과 보조 기록으로 나누어 보관합니다."
      primaryTitle="PRIMARY ARCHIVE"
      primaryDescription="핵심 프로젝트"
      primaryBooks={fullstackPrimaryBooks}
      secondaryTitle="SIDE RECORDS"
      secondaryDescription="보조 기록"
      secondaryBooks={fullstackSecondaryBooks}
      {...props}
    />
  );
}

