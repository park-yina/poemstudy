import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

import styles from './archive.module.css';

const archives = [
  {
    title: 'fakejumping-admin',
    status: 'live runtime',
    stack: 'Spring Boot / JWT / MyBatis / Docker / AWS',
    href: '/docs/intro',
    description:
      'Operational platform records focused on authentication, admin flows, deployment, and runtime maintenance.',
  },
  {
    title: 'shinchun-archive',
    status: 'archived',
    stack: 'Flask / AWS Lambda / HTML',
    href: '/docs/intro',
    description:
      'A preserved service archive for event-oriented publishing, signed access, and serverless delivery notes.',
  },
  {
    title: 'JumpingBattle',
    status: 'legacy',
    stack: 'Python / Firebase / HTML',
    href: '/docs/intro',
    description:
      'Legacy project notes from real-time interaction work, frontend control surfaces, and Firebase-backed state.',
  },
];

export default function ArchivePage() {
  return (
    <Layout
      title="Archive"
      description="Runtime and project archive index"
    >
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.kicker}>Archive Index</p>
            <h1>Runtime records, moved out of the home page.</h1>
            <p className={styles.lead}>
              Older systems and project notes live here so the home page can stay focused on the current profile.
            </p>
          </div>
        </section>

        <section className={styles.archiveList}>
          <div className="container">
            {archives.map((archive, index) => (
              <Link
                key={archive.title}
                to={archive.href}
                className={styles.archiveItem}
              >
                <span className={styles.number}>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className={styles.archiveBody}>
                  <div className={styles.archiveMeta}>
                    <span>{archive.status}</span>
                    <span>{archive.stack}</span>
                  </div>

                  <h2>{archive.title}</h2>
                  <p>{archive.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
