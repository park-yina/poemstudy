import React from 'react';

import styles from './archive-room.module.css';

function ArchiveBook({
  book,
  small = false,
  selected,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      className={`
        ${styles.archiveBook}
        ${small ? styles.smallBook : ''}
        ${selected ? styles.selectedBook : ''}
      `}
      aria-pressed={selected}
    >
      <div
        className={`
          ${styles.bookSticky}
          ${styles[book.stickyColor]}
        `}
      >
        {book.sticky}
      </div>

      <div className={styles.bookInner}>
        <span className={styles.bookTitle}>
          {book.title}
        </span>
      </div>
    </button>
  );
}

export default function BookShelf({
  title,
  description,
  books,
  small = false,
  selectedBook,
  setSelectedBook,
  overlayActive,
}) {
  return (
    <section
      className={`
        ${styles.bookShelf}
        ${overlayActive ? styles.shelfDissolve : ''}
      `}
    >
      <div className={styles.shelfHeader}>
        <p>{title}</p>
        <span>{description}</span>
      </div>

      <div className={styles.booksRow}>
        {books.map((book) => (
          <ArchiveBook
            key={book.id}
            book={book}
            small={small}
            selected={selectedBook?.id === book.id}
            onSelect={setSelectedBook}
          />
        ))}
      </div>

      <div className={styles.shelfBase} />
    </section>
  );
}
