import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

import styles from './index.module.css';
import { useEffect, useState } from 'react';
const disciplines = ['Development', 'Operation', 'Writing', 'Education'];
const recentNotes = [];
const selectedWorks = [];
const archiveLinks = [];
const bootSequence = [
  {
    type: 'auth',
    text: '[AUTH] writer profile detected...',
  },

  {
    type: 'auth',
    text: '[AUTH] 신이재 attempting login...',
  },

  {
    type: 'ok',
    text: '[OK] developer runtime initialized',
  },

  {
    type: 'ok',
    text: '[OK] operation archive restored',
  },

  {
    type: 'system',
    text: '[SYSTEM] luda-log ready.',
  },
];
const runtimeLogs = [
  '[00:00:00] initializing archive...',
  '[00:00:01] loading operation logs...',
  '[00:00:02] restoring systems...',
  '[00:00:03] rebuilding structures...',
  '[00:00:04] runtime stable.',
];
function BootSequence() {
  const [visible, setVisible] =
    useState([]);

  useEffect(() => {
    bootSequence.forEach((line, index) => {
      setTimeout(() => {
        setVisible((prev) => [
          ...prev,
          line,
        ]);
      }, index * 650);
    });
  }, []);

  return (
    <div className={styles.bootSequence}>
      <div className={styles.bootCommand}>
        $ boot luda-log
      </div>

      {visible.map((line, index) => (
        <div
          key={index}
          className={`
            ${styles.bootLine}
            ${styles[line.type]}
          `}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}
function RuntimeConsole() {
  const [visibleLogs, setVisibleLogs] =
    useState([]);

  useEffect(() => {
    runtimeLogs.forEach((log, index) => {
      setTimeout(() => {
        setVisibleLogs((prev) => [
          ...prev,
          log,
        ]);
      }, index * 850);
    });
  }, []);

  return (
    <div className={styles.consoleBox}>
      {visibleLogs.map((log, index) => (
        <div
          key={index}
          className={styles.consoleLine}
        >
          {log}
        </div>
      ))}
    </div>
  );
}
function HomepageHeader() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroTexture} />

      <div className={styles.heroInner}>
        <section className={styles.heroCopy} aria-labelledby="homepage-title">
<div className={styles.terminalHero}>
<div className={styles.terminalWindow}>

  <div className={styles.windowHeader}>
    <span className={styles.red}></span>
    <span className={styles.yellow}></span>
    <span className={styles.green}></span>

    <div className={styles.windowTitle}>
      luda-commandline
    </div>
  </div>

<div className={styles.terminalBoot}>

  <BootSequence />


  <RuntimeConsole />

  <div className={styles.heroDescription}>
    documenting systems,
    operations and thoughts.
  </div>

  <div className={styles.heroMeta}>
    real-time systems /
    admin platforms /
    developer archive
  </div>

</div>

  <div className={styles.systemStats}>
    <div>
      <span>CPU</span>
      <div className={styles.statBar}>
        <div
          className={styles.cpuFill}
          style={{ width: '82%' }}
        />
      </div>
    </div>

    <div>
      <span>MEMORY</span>
      <div className={styles.statBar}>
        <div
          className={styles.memFill}
          style={{ width: '68%' }}
        />
      </div>
    </div>

    <div>
      <span>STACK</span>
      <strong>
        Spring Boot / Flask / AWS
      </strong>
    </div>
  </div>
</div>
</div>

          <p className={styles.heroLead}>
            문학에서 출발해 개발과 운영으로 건너온 기록입니다.
            <br />
            실시간 시스템, 관리자 도구, 교육 경험, 그리고 구조에 관한 생각을 정리합니다.
          </p>

          <nav className={styles.disciplineNav} aria-label="Portfolio categories">
            {disciplines.map((discipline) => (
              <Link key={discipline} to="#selected-work">
                {discipline}
              </Link>
            ))}
          </nav>
        </section>

        {/* <aside className={styles.recentPanel} aria-label="Recently worked on">
          <div className={styles.panelHeader}>
            <span>Recently worked on</span>
            <Link to="/blog">All logs</Link>
          </div>

          <div className={styles.recentList}>
            {recentNotes.map((note) => (
              <Link key={note.title} to={note.href} className={styles.recentItem}>
                <span>{note.label}</span>
                <strong>{note.title}</strong>
              </Link>
            ))}
          </div>
        </aside> */}
      </div>
    </header>
  );
}

function SelectedWorkSection() {
  return (
    <section id="selected-work" className={styles.selectedSection}>
      <div className="container">
        <div className={styles.sectionIntro}>
          <span className={styles.kicker}>Selected Work</span>
          <h2>문제를 구조로 바꾼 기록</h2>
          <p>
            프로젝트를 썸네일로 포장하기보다, 어떤 문제를 오래 붙잡았고 어떤 방식으로 정리했는지
            보여주는 색인입니다.
          </p>
        </div>

        <div className={styles.workIndex}>
          {selectedWorks.map((work) => (
            <Link key={work.number} to={work.href} className={styles.workRow}>
              <span className={styles.workNumber}>{work.number}</span>

              <div className={styles.workBody}>
                <span className={styles.workField}>{work.field}</span>
                <h3>{work.title}</h3>
                <p>{work.summary}</p>
              </div>

              <span className={styles.workMeta}>{work.meta}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchiveSection() {
  return (
    <section className={styles.archiveSection}>
      <div className="container">
        <div className={styles.archiveHeader}>
          <span className={styles.kicker}>Archive Index</span>
          <h2>읽을 수 있는 형태로 남긴 것들</h2>
        </div>

        <div className={styles.archiveList}>
          {archiveLinks.map((archive, index) => (
            <Link key={archive.title} to={archive.href} className={styles.archiveItem}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{archive.title}</strong>
              <p>{archive.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PerspectiveSection() {
  return (
    <section className={styles.perspectiveSection}>
      <div className="container">
        <div className={styles.perspectiveGrid}>
          <p className={styles.statement}>
            좋은 시스템은 결국 사람이 이해하고, 고치고, 이어갈 수 있는 형태여야 한다고 믿습니다.
          </p>

          <ul className={styles.principles}>
            <li>운영 가능한 구조</li>
            <li>설명 가능한 코드</li>
            <li>오래 남는 기록</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="Luda Log"
      description="개발과 운영, 글쓰기와 교육 경험을 정리한 포트폴리오 아카이브">
      <div className={styles.page}>
        <HomepageHeader />

        <main className={styles.main}>
          <SelectedWorkSection />
          <ArchiveSection />
          <PerspectiveSection />
        </main>
      </div>
    </Layout>
  );
}
