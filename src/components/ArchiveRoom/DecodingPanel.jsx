import React from 'react';

import tarotStyles from './tarot-cards.module.css';

export default function DecodingPanel({
  book,
  card,
}) {
  const decoding =
    card.decoding ?? {};

  const sections = [
    {
      id: 'problem',
      title: 'PROBLEM',
      items: decoding.problem,
    },
    {
      id: 'solution',
      title: 'SOLUTION',
      items: decoding.solution,
    },
    {
      id: 'result',
      title: 'RESULT',
      items: decoding.result,
    },
  ].filter((section) =>
    Array.isArray(section.items) &&
    section.items.length > 0
  );

  return (
    <div className={tarotStyles.decodingPanel}>
      <span className={tarotStyles.decodingEyebrow}>
        RECORD DECODING
      </span>

      <h2>
        {card.title}
      </h2>

      <p className={tarotStyles.decodingSubtitle}>
        {card.subtitle}
      </p>

      <div className={tarotStyles.decodingKeywords}>
        <span>{card.label}</span>

        {card.keyword && (
          <span>{card.keyword}</span>
        )}

        <span>{book.arcana}</span>
      </div>

      <div className={tarotStyles.decodingBody}>
        {decoding.summary && (
          <p className={tarotStyles.decodingSummary}>
            {decoding.summary}
          </p>
        )}

        {sections.map((section) => (
          <section
            key={section.id}
            className={tarotStyles.decodingSection}
          >
            <h3>{section.title}</h3>

            <ul>
              {section.items.map((item) => (
                <li key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
