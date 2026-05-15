import React, { useState } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

export default function NavbarSearch() {
  const history = useHistory();
  const location = useLocation();
  const [query, setQuery] = useState(
    new URLSearchParams(location.search).get('q') || ''
  );

  const submitQuery = () => {
    const trimmed = query.trim();

    if (!trimmed) return;

    history.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor="archive-query">
        archive query
      </label>

      <div className={styles.inputFrame}>
        <span className={styles.prompt} aria-hidden="true">
          &gt;
        </span>

        <input
          id="archive-query"
          type="search"
          className={styles.input}
          placeholder="query archive"
          value={query}
          autoComplete="off"
          spellCheck="false"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              submitQuery();
            }
          }}
        />
      </div>
    </div>
  );
}
