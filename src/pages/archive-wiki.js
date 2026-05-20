import ReactMarkdown from 'react-markdown';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';

import archives from '../generated/archive-records.json';
import styles from './archive-wiki.module.css';

export default function ArchiveWikiPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedSlug = normalizeRecordSlug(params.get('record'));
  const recordTree = buildRecordTree(archives);
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
            {recordTree.map((archive) => (
              <div key={archive.id} className={styles.recordGroup}>
                <RecordLink
                  archive={archive}
                  selectedRecord={selectedRecord}
                />

                {archive.children.length > 0 &&
                  isRecordExpanded(archive, selectedRecord) && (
                  <div className={styles.childRecords}>
                    {archive.children.map((child) => (
                      <RecordLink
                        key={child.id}
                        archive={child}
                        selectedRecord={selectedRecord}
                      />
                    ))}
                  </div>
                )}
              </div>
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

function RecordLink({
  archive,
  selectedRecord,
}) {
  return (
    <Link
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
  );
}

function buildRecordTree(records) {
  const recordMap =
    new Map(
      records.map((record) => [
        record.slug,
        {
          ...record,
          children: [],
        },
      ])
    );

  const roots = [];

  recordMap.forEach((record) => {
    const parent =
      record.parentSlug
        ? recordMap.get(record.parentSlug)
        : null;

    if (parent) {
      parent.children.push(record);
      return;
    }

    roots.push(record);
  });

  return roots;
}

function normalizeRecordSlug(slug) {
  return String(slug || '')
    .replace(/\/index$/, '');
}

function isRecordExpanded(
  archive,
  selectedRecord
) {
  return (
    selectedRecord.slug === archive.slug ||
    selectedRecord.parentSlug === archive.slug
  );
}
