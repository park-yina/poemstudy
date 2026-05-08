import React, { useMemo, useState } from 'react';

import Link from '@docusaurus/Link';

import docs from '../../generated/search-docs.json';

import styles from './styles.module.css';

export default function NavbarSearch() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];

    return docs.filter((doc) => {
      const target = `
        ${doc.title}
        ${doc.description}
        ${(doc.tags || []).join(' ')}
      `.toLowerCase();

      return target.includes(
        query.toLowerCase()
      );
    });
  }, [query]);

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        className={styles.input}
        placeholder="Search..."
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
      />

      {results.length > 0 && (
        <div className={styles.dropdown}>
          {results.map((doc) => (
            <Link
              key={doc.path}
              to={doc.path}
              className={styles.item}
            >
              <div className={styles.title}>
                {doc.title}
              </div>

              <div className={styles.desc}>
                {doc.description}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}