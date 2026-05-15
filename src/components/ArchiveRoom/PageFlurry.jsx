import React from 'react';

import bookStyles from './book-transition.module.css';

export default function PageFlurry() {
  return (
    <div
      className={bookStyles.pageFlurry}
      aria-hidden="true"
    >
      {Array.from({ length: 9 }).map((_, index) => (
        <span
          key={index}
          className={bookStyles.flippingPage}
        />
      ))}
    </div>
  );
}
