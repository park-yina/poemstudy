import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useHistory, useLocation } from '@docusaurus/router';
import {
  SEARCH_FILTERS,
  groupResultsByCategory,
  runArchiveSearch,
} from '../search/archiveSearch';
import styles from './search.module.css';

export default function SearchPage() {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get('q') || '';
  const initialFilter = params.get('filter') || 'all';
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    setQuery(initialQuery);
    setFilter(initialFilter);
  }, [initialQuery, initialFilter]);

  const results = useMemo(
    () => runArchiveSearch(initialQuery, initialFilter),
    [initialQuery, initialFilter]
  );
  const groupedResults = useMemo(() => groupResultsByCategory(results), [results]);

  const submitSearch = (nextFilter = filter) => {
    const trimmed = query.trim();
    const searchParams = new URLSearchParams();

    if (trimmed) searchParams.set('q', trimmed);
    if (nextFilter !== 'all') searchParams.set('filter', nextFilter);

    history.push(`/search?${searchParams.toString()}`);
  };

  const selectFilter = (nextFilter) => {
    setFilter(nextFilter);

    const searchParams = new URLSearchParams(location.search);

    if (query.trim()) searchParams.set('q', query.trim());
    if (nextFilter === 'all') {
      searchParams.delete('filter');
    } else {
      searchParams.set('filter', nextFilter);
    }

    history.push(`/search?${searchParams.toString()}`);
  };

  return (
    <Layout
      title="Archive Search"
      description="Local archive retrieval system"
    >
      <main className={styles.page}>
        <section className={styles.shell}>
            <span className={styles.kicker}>아카이브 검색 시스템</span>
            <h1>블로그화 된 콘텐츠만 검색됩니다.</h1>
<p>
  DEV WIKI · DEV LOG · ARCHIVE 기록이 색인되었습니다.
  LudaRota는 봉인 상태를 유지합니다.
</p>

          <div className={styles.console}>
            <div className={styles.consoleBar}>
              <span>LOCAL INDEX</span>
              <span>{results.length} MATCHES</span>
            </div>

            <label className={styles.queryLabel} htmlFor="archive-page-query">
              archive.query
            </label>

            <div className={styles.queryRow}>
              <span aria-hidden="true">&gt;</span>
              <input
                id="archive-page-query"
                value={query}
                autoFocus
                autoComplete="off"
                spellCheck="false"
                placeholder="sse, polling, jwt, cache..."
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    submitSearch();
                  }
                }}
              />
            </div>

            <div className={styles.filters} aria-label="Search filters">
              {SEARCH_FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === initialFilter ? styles.activeFilter : undefined}
                  onClick={() => selectFilter(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <section className={styles.results} aria-live="polite">
            {!initialQuery.trim() && (
              <div className={styles.empty}>
                Awaiting archive query. Press Enter to retrieve records.
              </div>
            )}

            {initialQuery.trim() && results.length === 0 && (
              <div className={styles.empty}>
                No recovered records matched "{initialQuery}".
              </div>
            )}

            {groupedResults.map((group) => (
              <div key={group.category} className={styles.group}>
                <div className={styles.groupTitle}>
                  <span>[ {group.category} ]</span>
                  <span>{String(group.results.length).padStart(2, '0')}</span>
                </div>

                <div className={styles.groupList}>
                  {group.results.map((result) => (
                    <Link
                      key={result.id}
                      to={result.path}
                      className={styles.result}
                    >
                      <span className={styles.category}>{result.category}</span>
                      <h2>{result.title}</h2>
                      <p>"{result.snippet}"</p>
                      <span className={styles.path}>{result.path}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </section>
      </main>
    </Layout>
  );
}
