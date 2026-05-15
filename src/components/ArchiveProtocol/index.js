import React, { useEffect, useState } from 'react';

import styles from './styles.module.css';

const STORAGE_KEY = 'archiveProtocolHidden';

const protocolSections = [
  {
    code: 'NODE 01',
    title: 'ARCHIVE',
    body: '대표 프로젝트 기록과 복구된 개요 문서를 열람합니다.',
  },
  {
    code: 'NODE 02',
    title: 'DEV WIKI',
    body: '구조 설계, 운영 기록, 문제 해결 과정을 정리한 개발 위키입니다.',
  },
  {
    code: 'NODE 03',
    title: 'DEV LOG',
    body: '실험 기록, 시행착오, 구현 과정, 복구 로그를 보존합니다.',
  },
  {
    code: 'NODE 04',
    title: 'LUDAROTA',
    body: '마법의 도서에 봉인된 프로젝트를 확인해보세요. 타로카드가 각 기록을 해석합니다.',    special: true,
  },
];

const revealLines = [
  '[system] 현재 아카이브는 데스크탑 환경을 기준으로 복구되었습니다.',
   '[notice] CMD 종료 시 문서 탐색기가 열립니다.',
  '[sideBar] 개발자에게 최고의 자산은 고객입니다. 상단 카드를 통해 기록과 블로그에 접근할 수 있습니다.',
  '[LudaRota] 일부 기록은 개발 문서가 아닙니다. 사이드바를 통해 다른 아카이브에 접근할 수 있습니다.',
'[system] 이 포트폴리오는 문서보다 경험을 우선합니다.',
];

export default function ArchiveProtocol() {
  const [open, setOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    const hidden =
      window.localStorage.getItem(STORAGE_KEY) === 'true';

    setAcknowledged(hidden);

    if (!hidden) {
      const timer = window.setTimeout(() => {
        setOpen(true);
      }, 1400);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      const hidden =
        window.localStorage.getItem(STORAGE_KEY) === 'true';

      setAcknowledged(hidden);
      setOpen(true);
    };

    window.addEventListener('archive-protocol:open', handleOpen);

    return () => {
      window.removeEventListener('archive-protocol:open', handleOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleAcknowledge = (event) => {
    const checked = event.target.checked;

    setAcknowledged(checked);

    if (checked) {
      window.localStorage.setItem(STORAGE_KEY, 'true');
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setOpen(false);
        }
      }}
    >
      <div className={styles.ashField} aria-hidden="true" />
      <section
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="archive-protocol-title"
      >
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Close archive protocol"
          onClick={() => setOpen(false)}
        >
          x
        </button>

        <div className={styles.panelGlow} aria-hidden="true" />

        <header className={styles.header}>
          <div className={styles.sigils} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <p className={styles.kicker}>ACCESS PROTOCOL / FORBIDDEN RECORDS</p>

          <h2 id="archive-protocol-title">
            아카이빙 포트폴리오 안내서
          </h2>

          <div className={styles.reconstruction}>
            {revealLines.map((line, index) => (
              <span
                key={line}
                style={{ '--delay': `${index * 0.34}s` }}
              >
                {line}
              </span>
            ))}
          </div>
        </header>

        <div className={styles.bodyGrid}>
          {protocolSections.map((section, index) => (
            <article
              key={section.code}
              className={
                section.special
                  ? `${styles.node} ${styles.specialNode}`
                  : styles.node
              }
              style={{ '--delay': `${0.7 + index * 0.16}s` }}
            >
              <span className={styles.nodeCode}>{section.code}</span>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </article>
          ))}
        </div>

        <footer className={styles.footer}>
          <label className={styles.acknowledge}>
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={handleAcknowledge}
            />
            <span>아카이브 프로토콜 이후 SKIP</span>
          </label>

          <div className={styles.statusLog}>
            <strong>[ ARCHIVE STATUS ]</strong>
            <span>runtime stable.</span>
            <span>4 navigation nodes available.</span>
            <span>WARNING: 일부 기록은 decoding process를 포함합니다.</span>
          </div>
        </footer>
      </section>
    </div>
  );
}
