import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import DesktopWorkspace from '../components/DesktopWorkspace/index';

import styles from './index.module.css';
import { useEffect, useState } from 'react';
const selectedWorks = [];
const bootSequence = [
  {
    type: 'auth',
    text: '[AUTH] 작가 프로필 "신이재" 종료 중...',
  },

  {
    type: 'auth',
    text: '[AUTH] 개발자 아카이브 접근 권한 확인 중...',
  },

  {
    type: 'ok',
    text: '[OK] 개발자 모드 활성화 완료.',
  },

  {
    type: 'ok',
    text: '[OK] 아카이빙 시스템 초기화 완료.',
  },

  {
    type: 'system',
    text: '[SYSTEM] Luda Log 부팅 완료.',
  },
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
function HomepageHeader() {

  const [shutdown, setShutdown] =
    useState(false);

  const [runtimeStats, setRuntimeStats] =
    useState(null);

  const [ludaLogStats, setLudaLogStats] =
    useState(null);


  useEffect(() => {

    const fetchRuntimeStats = async () => {

      try {

        const res = await fetch(
          'https://luda-runtime-stats.s3.amazonaws.com/fakejumping/stage/stats.json'
        );

        const data =
          await res.json();

        setRuntimeStats(data);

      } catch (e) {

        console.error(
          'fakejumping stats load failed',
          e,
        );
      }
    };

    const fetchLudaLogStats = async () => {

      try {

        const res = await fetch(
          '/runtime/ludalog.json'
        );

        const data =
          await res.json();

        setLudaLogStats(data);

      } catch (e) {

        console.error(
          'ludalog stats load failed',
          e,
        );
      }
    };

    fetchRuntimeStats();
    fetchLudaLogStats();

  }, []);

  const createAsciiBar = (value, total) => {

    const BAR_LENGTH = 14;

    const ratio =
      total > 0
        ? value / total
        : 0;

    const filled =
      Math.round(ratio * BAR_LENGTH);

    const empty =
      BAR_LENGTH - filled;

    return (
      '█'.repeat(filled) +
      '░'.repeat(empty)
    );
  };

const projects = [

  {
    title: 'fakejumping-admin',
    branch: 'stage',
    runtime: 'aws-ec2',
    stack: 'spring boot',
    type: 'live',
  },

  {
    title: 'portfolio',
    branch: 'main',
    runtime: 'githubPages',
    stack: 'docusaurus',
    type: 'custom',
  },
{
  title: 'JumpingBattle',
  branch: 'legacy',
  runtime: 'Flask Runtime',
  stack: 'Python / Firebase / HTML',
  type: 'archive',

  archivedStats: {
    total: 6026,
    Python: 2768,
    HTML: 3258,
  },
}
];

  return (

    <header className={styles.hero}>

      <div className={styles.heroTexture} />

      <div className={styles.heroInner}>

        <section
          className={styles.heroCopy}
          aria-labelledby="homepage-title"
        >

          <div className={styles.terminalHero}>

            {

              shutdown ? (

                <DesktopWorkspace
                  onBoot={() =>
                    setShutdown(false)
                  }
                />

              ) : (

                <div className={styles.terminalWindow}>

                  {/* HEADER */}

                  <div className={styles.windowHeader}>

                    <span
                      className={styles.red}
                      onClick={() =>
                        setShutdown(true)
                      }
                    />

                    <span className={styles.yellow} />

                    <span className={styles.green} />

                    <div className={styles.windowTitle}>
                      Luda-Bootig.log
                    </div>

                  </div>

                  {/* TERMINAL */}

                  <div className={styles.terminalBoot}>

                    <BootSequence />

                    <div className={styles.heroDescription}>

                      documenting systems,
                      operations and runtime archives.

                    </div>

                    <div className={styles.heroMeta}>

                      real-time systems /
                      operational platforms /
                      runtime engineering

                    </div>

                  </div>

                  {/* RUNTIME GRID */}

                  {

                    (runtimeStats || ludaLogStats) && (

                      <div className={styles.runtimeGrid}>

                        {

                          projects.map((project) => {

const stats =
  project.type === 'archive'
    ? project.archivedStats
    : project.type === 'custom'
      ? ludaLogStats
      : runtimeStats;

if (!stats) {
  return null;
}

const total =
  project.type === 'archive'
    ? stats.total
    : stats.SUM?.code || 0;

  return (

    <div
      key={project.title}
      className={styles.runtimeCard}
    >

      <div className={styles.runtimeCardInner}>

        <div className={styles.runtimeAsciiHeader}>

          <span>
            {project.title}
          </span>

          <span>
            ONLINE
          </span>

        </div>

        <div className={styles.runtimeAsciiDivider}>
        </div>

        <div className={styles.runtimeAsciiLine}>
          branch   : {project.branch}
        </div>

        <div className={styles.runtimeAsciiLine}>
          runtime  : {project.runtime}
        </div>

        <div className={styles.runtimeAsciiLine}>
          stack    : {project.stack}
        </div>

        <div className={styles.runtimeAsciiDivider}>
        </div>

        <div className={styles.runtimeAsciiLine}>
          TOTAL LOC : {total.toLocaleString()}
        </div>

        <div className={styles.runtimeAsciiDivider}>
        </div>

        {

          project.type === 'archive' ? (

            <>

              {/* PYTHON */}

              <div className={styles.runtimeLangRow}>

                <span>
                  Python
                </span>

                <span>
                  {stats.Python}
                </span>

                <span className={styles.runtimeBarAscii}>

                  {
                    createAsciiBar(
                      stats.Python,
                      stats.total
                    )
                  }

                </span>

              </div>

              {/* HTML */}

              <div className={styles.runtimeLangRow}>

                <span>
                  HTML
                </span>

                <span>
                  {stats.HTML}
                </span>

                <span className={styles.runtimeBarAscii}>

                  {
                    createAsciiBar(
                      stats.HTML,
                      stats.total
                    )
                  }

                </span>

              </div>

            </>

          ) : (

            <>

              {/* JAVA */}

              <div className={styles.runtimeLangRow}>

                <span>
                  Java
                </span>

                <span>
                  {stats.Java?.code || 0}
                </span>

                <span className={styles.runtimeBarAscii}>

                  {
                    createAsciiBar(
                      stats.Java?.code || 0,
                      total
                    )
                  }

                </span>

              </div>

              {/* XML */}

              <div className={styles.runtimeLangRow}>

                <span>
                  XML
                </span>

                <span>
                  {stats.XML?.code || 0}
                </span>

                <span className={styles.runtimeBarAscii}>

                  {
                    createAsciiBar(
                      stats.XML?.code || 0,
                      total
                    )
                  }

                </span>

              </div>

              {/* JAVASCRIPT */}

              <div className={styles.runtimeLangRow}>

                <span>
                  JavaScript
                </span>

                <span>
                  {stats.JavaScript?.code || 0}
                </span>

                <span className={styles.runtimeBarAscii}>

                  {
                    createAsciiBar(
                      stats.JavaScript?.code || 0,
                      total
                    )
                  }

                </span>

              </div>
<div className={styles.runtimeLangRow}>

  <span>
    CSS
  </span>

  <span>
    {stats.CSS?.code || 0}
  </span>

  <span className={styles.runtimeBarAscii}>

    {
      createAsciiBar(
        stats.CSS?.code || 0,
        total
      )
    }

  </span>

</div>

{/* HTML */}

<div className={styles.runtimeLangRow}>

  <span>
    HTML
  </span>

  <span>
    {stats.HTML?.code || 0}
  </span>

  <span className={styles.runtimeBarAscii}>

    {
      createAsciiBar(
        stats.HTML?.code || 0,
        total
      )
    }

  </span>

</div>
            </>

          )

        }

      </div>

    </div>

  );

})
                        }

                      </div>

                    )
                  }

                </div>

              )
            }

          </div>


        </section>

      </div>

    </header>

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
        </main>
      </div>
    </Layout>
  );
}
