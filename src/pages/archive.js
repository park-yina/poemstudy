import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

import archives from '../generated/archive-records.json';
import styles from './archive.module.css';

export default function ArchivePage() {
  return (
    <Layout
      title="Archive"
      description="Runtime and project archive index"
    >
      <main className={styles.page}>
<section className={styles.hero}>
  <div className="container">

    <p className={styles.kicker}>
      ARCHIVE INDEX
    </p>

    <h1>
      개발 기록과 워크스페이스를<br />
      정리한 아카이브 공간입니다.
    </h1>

    <p className={styles.lead}>
      Runtime Workspace,
      기술 문서,
      프로젝트 기록과 운영 노트들을
      카테고리별로 정리해두었습니다.<br />

      보다 정리된 형태의 개발 문서와
      아카이브 시스템으로 이동할 수 있습니다.
    </p>

  </div>
</section>

        <section className={styles.archiveList}>
          <div className="container">
            {archives.map((archive, index) => (
              <article
                id={archive.anchor}
                key={archive.id}
                className={styles.archiveItem}
              >
                <span className={styles.number}>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className={styles.archiveBody}>
                  <div className={styles.archiveMeta}>
                    <span>{archive.status}</span>
                    {archive.stack && <span>{archive.stack}</span>}
                  </div>

                  <h2>{archive.title}</h2>
                  <p>{archive.description}</p>

                  <div className={styles.archiveActions}>
                    <Link to={archive.wikiPath}>Archive Wiki</Link>
                    {archive.workspacePath && (
                      <Link to={archive.workspacePath}>Workspace</Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
