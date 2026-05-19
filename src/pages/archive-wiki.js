import ReactMarkdown from 'react-markdown';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';

import archives from '../generated/archive-records.json';
import styles from './archive-wiki.module.css';

export default function ArchiveWikiPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedSlug = params.get('record');
  const selectedRecord =
    archives.find((archive) => archive.slug === selectedSlug) || archives[0];

  return (
    <Layout
      title="Archive Wiki"
      description="Archive-only wiki records"
    >
      <main className={styles.page}>
        <aside className={styles.sidebar} aria-label="Archive wiki records">
          <p className={styles.kicker}>Archive Wiki</p>
          <nav className={styles.recordNav}>
            {archives.map((archive) => (
              <Link
                key={archive.id}
                to={archive.wikiPath}
                className={
                  archive.slug === selectedRecord.slug
                    ? styles.activeRecord
                    : undefined
                }
              >
                <span>{archive.status}</span>
                <strong>{archive.title}</strong>
              </Link>
            ))}
          </nav>
        </aside>

        <article className={styles.document}>
          <header className={styles.header}>
            <div>
              <p className={styles.kicker}>{selectedRecord.sourcePath}</p>
              <h1>{selectedRecord.title}</h1>
              <p>{selectedRecord.description}</p>
            </div>

            <div className={styles.actions}>
              <Link to="/archive">Archive Index</Link>
              {selectedRecord.workspacePath && (
                <Link to={selectedRecord.workspacePath}>Workspace</Link>
              )}
            </div>
          </header>

          <dl className={styles.metadata}>
            <div>
              <dt>Status</dt>
              <dd>{selectedRecord.status}</dd>
            </div>
            {selectedRecord.stack && (
              <div>
                <dt>Stack</dt>
                <dd>{selectedRecord.stack}</dd>
              </div>
            )}
            <div>
              <dt>Source</dt>
              <dd>{selectedRecord.sourcePath}</dd>
            </div>
          </dl>

          <div className={styles.markdown}>
            <ReactMarkdown>{selectedRecord.markdown}</ReactMarkdown>
          </div>
        </article>
      </main>
    </Layout>
  );
}

