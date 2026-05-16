import React, { useState } from 'react';

import {
  useHistory,
  useLocation,
} from '@docusaurus/router';

import styles from './styles.module.css';

const MAX_QUERY_LENGTH = 120;

const normalizeQuery = (value) => {
  return value
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_QUERY_LENGTH);
};

export default function NavbarSearch() {
  const history = useHistory();

  const location = useLocation();

  const [query, setQuery] = useState(
    new URLSearchParams(location.search).get('q') || ''
  );

  const submitQuery = () => {
    const normalized = normalizeQuery(query);

    if (!normalized) {
      return;
    }

    history.push(
      `/search?q=${encodeURIComponent(normalized)}`
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputFrame}>
        <span
          className={styles.queryIcon}
          aria-hidden="true"
        >
          <i className="fa-solid fa-magnifying-glass" />
        </span>

        <input
          id="archive-query"
          type="search"
          className={styles.input}
          placeholder="Search"
          value={query}
          autoComplete="off"
          spellCheck={false}
          maxLength={MAX_QUERY_LENGTH}
          onChange={(event) => {
            const nextValue = event.target.value
              .replace(/\s+/g, ' ')
              .slice(0, MAX_QUERY_LENGTH);

            setQuery(nextValue);
          }}
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