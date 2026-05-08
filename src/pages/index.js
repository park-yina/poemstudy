import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

import styles from './index.module.css';

const disciplines = ['Development', 'Operation', 'Writing', 'Education'];

const recentNotes = [
  {
    label: 'Development Note',
    title: 'SSE 기반 실시간 랭킹 시스템 설계',
    href: '/docs/realtime/sse-ranking',
  },
  {
    label: 'Backend Note',
    title: 'JWT Refresh Token Rotation 구현',
    href: '/docs/backend/jwt-refresh',
  },
  {
    label: 'Education Note',
    title: '비전공자는 어떻게 기술을 배워야 하는가',
    href: '/docs/education/non-cs-learning',
  },
];

const selectedWorks = [
  {
    number: '01',
    field: 'Development',
    title: 'Real-time Ranking System',
    summary:
      'SSE 기반 실시간 상태 전달, 운영 환경에서의 랭킹 갱신 흐름, 장애 가능성을 고려한 백엔드 구조 설계.',
    meta: 'Spring Boot / SSE / Redis / MySQL',
    href: '/docs/realtime/sse-ranking',
  },
  {
    number: '02',
    field: 'Operation',
    title: 'Integrated Admin Platform',
    summary:
      '매장 운영, 권한 분리, KPI, VOC 흐름을 한 화면에서 다루기 위한 관리자 시스템의 구조와 경험.',
    meta: 'JWT / MyBatis / Docker / AWS',
    href: '/docs/development',
  },
  {
    number: '03',
    field: 'Education',
    title: 'Education & Writing',
    summary:
      '문학에서 출발한 개발자로서 비전공자 학습, 설명하는 기술, 오래 남는 기록 방식을 정리합니다.',
    meta: 'Learning / Teaching / Essay',
    href: '/docs/education',
  },
];

const archiveLinks = [
  {
    title: 'Development Archive',
    description: '실시간 시스템, 백엔드 구조, 인프라와 운영 중 마주친 문제 해결 기록.',
    href: '/docs/development',
  },
  {
    title: 'Essays & Philosophy',
    description: '개발, 글쓰기, 구조, 사람과 기록에 관한 긴 호흡의 문장들.',
    href: '/docs/essays',
  },
  {
    title: 'Education Archive',
    description: '비전공자 학습과 설명하는 기술, 교육 경험을 정리한 공간.',
    href: '/docs/education',
  },
];

function HomepageHeader() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroTexture} />

      <div className={styles.heroInner}>
        <section className={styles.heroCopy} aria-labelledby="homepage-title">
          <span className={styles.kicker}>Portfolio Archive / Luda Log</span>

          <h1 id="homepage-title" className={styles.heroTitle}>
            Luda Log.
          </h1>

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

        <aside className={styles.recentPanel} aria-label="Recently worked on">
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
        </aside>
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
