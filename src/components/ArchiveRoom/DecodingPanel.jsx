import React from 'react';

import tarotStyles from './tarot-cards.module.css';

export default function DecodingPanel({
  card,
  selectedRecord,
  onSelectRecord,
  onBackToArchiveCard,
}) {
  const decoding =
    card.decoding ?? {};

  const relatedRecords =
    Array.isArray(card.subcards)
      ? card.subcards
      : [];

  const activeRecord =
    selectedRecord ?? null;

  const activeRecordDecoding =
    activeRecord?.decoding ?? {};

  const activeRecordSummary =
    activeRecordDecoding.summary ??
    activeRecord?.decodingSummary ??
    activeRecord?.description;

  const activeRecordSections = [
    {
      id: 'anomaly',
      title: 'ANOMALY',
      items:
        activeRecordDecoding.anomaly ??
        activeRecordDecoding.problem ??
        activeRecord?.anomaly ??
        activeRecord?.problem,
    },
    {
      id: 'patch',
      title: 'PATCH',
      items:
        activeRecordDecoding.patch ??
        activeRecordDecoding.solution ??
        activeRecord?.patch ??
        activeRecord?.solution,
    },
    {
      id: 'result',
      title: 'RESULT',
      items:
        activeRecordDecoding.result ??
        activeRecord?.result,
    },
  ].filter((section) =>
    Array.isArray(section.items) &&
    section.items.length > 0
  );

  const sections = [
    {
      id: 'problem',
      title: 'PROBLEM',
      items: decoding.problem,
    },
    {
      id: 'solution',
      title: 'SOLUTION',
      items: decoding.solution,
    },
    {
      id: 'result',
      title: 'RESULT',
      items: decoding.result,
    },
  ].filter((section) =>
    Array.isArray(section.items) &&
    section.items.length > 0
  );

  if (activeRecord) {
    const reconstructionLines = [
      `ACCESS REQUEST / ${activeRecord.keyword ?? 'RELATED'} RECORD`,
      `SOURCE ARCHIVE / ${card.keyword ?? card.label ?? 'CARD'}`,
      `RECONSTRUCT / ${activeRecord.title}`,
      `CHECKSUM / ${activeRecord.title.length}-${card.title.length}`,
    ];

    return (
      <div className={`${tarotStyles.decodingPanel} ${tarotStyles.recordDecodingPanel}`}>
        <div className={tarotStyles.recordAccessHeader}>
          <button
            type="button"
            className={tarotStyles.recordBackButton}
            onClick={onBackToArchiveCard}
          >
            BACK TO ARCHIVE CARD
          </button>

          <span className={tarotStyles.recordAccessState}>
            RECORD ACCESS GRANTED
          </span>
        </div>

        <div className={tarotStyles.recordAccessTrace} aria-hidden="true">
          <span>INDEX LOCK RELEASED</span>
          <span>MANUSCRIPT UNSEALED</span>
          <span>DECODING CHANNEL OPEN</span>
        </div>

        <div className={tarotStyles.recordDecodeGrid}>
          <div className={tarotStyles.recordArtifact}>
            <img
              src={activeRecord.artwork ?? card.artwork}
              alt={activeRecord.title}
            />

            <div className={tarotStyles.recordArtifactSeal}>
              {activeRecord.keyword ?? 'LOG'}
            </div>
          </div>

          <div className={tarotStyles.recordTerminal}>
            <span className={tarotStyles.decodingEyebrow}>
              RELATED RECORD DECODING
            </span>

            <h2>
              {activeRecord.title}
            </h2>

            <div className={tarotStyles.decodingKeywords}>
              <span>RELATED RECORD</span>

              {activeRecord.keyword && (
                <span>{activeRecord.keyword}</span>
              )}

              <span>{card.label}</span>
            </div>

            <p className={tarotStyles.recordProgressLabel}>
              reconstructing sealed technical manuscript
            </p>

            <div className={tarotStyles.decodingProgress}>
              <span />
            </div>

            <div className={tarotStyles.reconstructionConsole}>
              {reconstructionLines.map((line) => (
                <p key={line} data-text={line}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className={tarotStyles.recordDecodedBody}>
          <div className={tarotStyles.recordDecodedHeader}>
            <span>DECODED RECORD BODY</span>
            <span>{activeRecord.keyword ?? 'RELATED'}</span>
          </div>

          {activeRecordSummary && (
            <p className={tarotStyles.corruptedReveal}>
              {activeRecordSummary}
            </p>
          )}

          {activeRecordSections.map((section) => (
            <section
              key={section.id}
              className={tarotStyles.decodingSection}
            >
              <h3>{section.title}</h3>

              <ul>
                {section.items.map((item) => (
                  <li key={item} className={tarotStyles.corruptedReveal}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={tarotStyles.decodingPanel}>
      <span className={tarotStyles.decodingEyebrow}>
        RECORD DECODING
      </span>

      <h2>
        {card.title}
      </h2>

      <p className={tarotStyles.decodingSubtitle}>
        {card.subtitle}
      </p>

      <div className={tarotStyles.decodingKeywords}>
        <span>{card.label}</span>

        {card.keyword && (
          <span>{card.keyword}</span>
        )}

        {relatedRecords.length > 0 && (
          <span>
            {relatedRecords.length} RELATED RECORDS
          </span>
        )}
      </div>

      <div className={tarotStyles.decodingBody}>
        {decoding.summary && (
          <p className={tarotStyles.decodingSummary}>
            {decoding.summary}
          </p>
        )}

        {sections.map((section) => (
          <section
            key={section.id}
            className={tarotStyles.decodingSection}
          >
            <h3>{section.title}</h3>

            <ul>
              {section.items.map((item) => (
                <li key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {relatedRecords.length > 0 && (
        <section className={tarotStyles.relatedRecords}>
          <div className={tarotStyles.relatedRecordsHeader}>
            <div className={tarotStyles.relatedRecordsSignal}>
              <span>RELATED RECORDS DETECTED</span>
            </div>

            <h3>
              Classified Record Index
            </h3>

            <p>
              Select a sealed record to open its independent decoding interface.
            </p>
          </div>

          <div className={tarotStyles.relatedRecordsGrid}>
            {relatedRecords.map((record, index) => (
              <button
                type="button"
                key={`${record.keyword ?? record.label}-${record.title}`}
                className={tarotStyles.relatedRecordCard}
                onClick={() =>
                  onSelectRecord?.(record)
                }
              >
                <span className={tarotStyles.relatedRecordAccess}>
                  ACCESS RECORD
                </span>

                <div className={tarotStyles.relatedRecordArtwork}>
                  <img
                    src={record.artwork ?? card.artwork}
                    alt=""
                  />
                </div>

                <div className={tarotStyles.relatedRecordBack}>
                  <span className={tarotStyles.relatedRecordIndex}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className={tarotStyles.relatedRecordFace}>
                  <span className={tarotStyles.relatedRecordKeyword}>
                    {record.keyword ?? record.label}
                  </span>

                  <h3>
                    {record.title}
                  </h3>

                  <p>
                    {record.description ?? record.subtitle ?? record.decoding?.summary}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
