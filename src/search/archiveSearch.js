import MiniSearch from 'minisearch';
import records from '../generated/search-docs.json';

const searchableRecords =
  uniqueRecordsById(records);

export const SEARCH_CATEGORIES = [
  'DEV WIKI',
  'ARCHIVE',
];

export const SEARCH_FILTERS = [
  {
    id: 'all',
    label: 'ALL',
    mode: 'all',
  },

  {
    id: 'titles',
    label: 'TITLES',
    mode: 'title',
  },

  {
    id: 'content',
    label: 'CONTENT',
    mode: 'content',
  },

  {
    id: 'dev-wiki',
    label: 'DEV WIKI',
    mode: 'category',
    category: 'DEV WIKI',
  },

  {
    id: 'archive',
    label: 'ARCHIVE',
    mode: 'category',
    category: 'ARCHIVE',
  },
];

const index = new MiniSearch({
  fields: [
    'title',
    'content',
    'description',
    'tagsText',
    'compactText',
  ],

  storeFields: [
    'id',
    'title',
    'description',
    'content',
    'category',
    'path',
    'tags',
  ],

  searchOptions: {
    boost: {
      title: 4,
      description: 2,
      content: 1,
      compactText: 3,
    },

    combineWith: 'OR',

    fuzzy: 0.15,

    prefix: true,
  },

  tokenize,
});

index.addAll(
  searchableRecords.map((record) => {

    const searchableText = `
      ${record.title || ''}
      ${record.description || ''}
      ${record.content || ''}
      ${(record.tags || []).join(' ')}
    `;

    return {
      ...record,

      tagsText:
        (record.tags || []).join(' '),

      compactText:
        normalizeCompact(searchableText),
    };
  })
);

export function runArchiveSearch(
  query,
  filterId = 'all'
) {

  const normalizedQuery =
    normalize(query);

  const compactQuery =
    normalizeCompact(query);

  if (!normalizedQuery) {

    return {
      results: [],
      relatedQueries: [],
    };
  }

  const filter =
    getFilter(filterId);

  const miniResults =
    index.search(normalizedQuery);

  const compactMiniResults =
    compactQuery !== normalizedQuery
      ? index.search(compactQuery)
      : [];

  const fallbackResults =
    searchableRecords
      .map((record) => ({
        ...record,

        score: scoreRecord(
          record,
          normalizedQuery,
          compactQuery
        ),
      }))
      .filter(
        (record) =>
          record.score > 0
      );

  const results =
    mergeResults(
      [
        ...miniResults,
        ...compactMiniResults,
      ],
      fallbackResults
    )
      .filter((record) =>
        matchesFilter(
          record,
          normalizedQuery,
          compactQuery,
          filter
        )
      )
      .map((record) => ({
        ...record,

        snippet:
          createSnippet(
            record,
            normalizedQuery,
            compactQuery,
            filter
          ),
      }))
      .sort(
        (a, b) =>
          b.score - a.score ||
          a.title.localeCompare(
            b.title
          )
      )
      .slice(0, 60);

  const relatedQueries =
    extractRelatedQueries(
      results,
      normalizedQuery,
      compactQuery
    );

  return {
    results,
    relatedQueries,
  };
}

export function groupResultsByCategory(
  results
) {

  return SEARCH_CATEGORIES
    .map((category) => ({
      category,

      results:
        results.filter(
          (result) =>
            result.category === category
        ),
    }))
    .filter(
      (group) =>
        group.results.length > 0
    );
}

export function getFilter(filterId) {

  return (
    SEARCH_FILTERS.find(
      (filter) =>
        filter.id === filterId
    ) || SEARCH_FILTERS[0]
  );
}

function uniqueRecordsById(records) {

  const uniqueRecords =
    new Map();

  records.forEach((record) => {

    if (!record?.id) {
      return;
    }

    uniqueRecords.set(record.id, record);
  });

  return [...uniqueRecords.values()];
}

function tokenize(text) {

  const source =
    normalize(text);

  const compactSource =
    normalizeCompact(text);

  const rawTokens =
    source.match(
      /[a-z0-9+#.]+|[가-힣]+/g
    ) || [];

  const tokens =
    new Set(rawTokens);

  if (compactSource) {
    tokens.add(compactSource);
  }

  rawTokens.forEach((token) => {

    if (token.length >= 2) {

      tokens.add(
        token.replace(/\s+/g, '')
      );
    }

    if (/^[가-힣]+$/.test(token)) {

      for (
        let size = 1;
        size <= Math.min(3, token.length);
        size += 1
      ) {

        for (
          let index = 0;
          index <= token.length - size;
          index += 1
        ) {

          tokens.add(
            token.slice(
              index,
              index + size
            )
          );
        }
      }
    }
  });

  return [...tokens];
}

function normalize(value) {

  return String(value || '')
    .toLowerCase()
    .normalize('NFKC')
    .trim();
}

function normalizeCompact(value) {

  return normalize(value)
    .replace(/\s+/g, '');
}

function mergeResults(
  primary,
  fallback
) {

  const merged =
    new Map();

  [...primary, ...fallback]
    .forEach((record) => {

      const previous =
        merged.get(record.id);

      const score =
        (previous?.score || 0) +
        (record.score || 1);

      merged.set(record.id, {
        ...previous,
        ...record,
        score,
      });
    });

  return [...merged.values()];
}

function scoreRecord(
  record,
  query,
  compactQuery
) {

  const title =
    normalize(record.title);

  const description =
    normalize(record.description);

  const content =
    normalize(record.content);

  const compactTitle =
    normalizeCompact(record.title);

  const compactDescription =
    normalizeCompact(
      record.description
    );

  const compactContent =
    normalizeCompact(
      record.content
    );

  let score = 0;

  if (title.includes(query)) {
    score += 20;
  }

  if (description.includes(query)) {
    score += 8;
  }

  if (content.includes(query)) {
    score += 4;
  }

  if (compactQuery) {

    if (
      compactTitle.includes(
        compactQuery
      )
    ) {
      score += 18;
    }

    if (
      compactDescription.includes(
        compactQuery
      )
    ) {
      score += 7;
    }

    if (
      compactContent.includes(
        compactQuery
      )
    ) {
      score += 3;
    }
  }

  tokenize(query)
    .forEach((token) => {

      if (token.length < 2) {
        return;
      }

      if (
        title.includes(token) ||
        compactTitle.includes(token)
      ) {
        score += 4;
      }

      if (
        description.includes(token) ||
        compactDescription.includes(token)
      ) {
        score += 2;
      }

      if (
        content.includes(token) ||
        compactContent.includes(token)
      ) {
        score += 1;
      }
    });

  return score;
}

function matchesFilter(
  record,
  query,
  compactQuery,
  filter
) {

  if (filter.mode === 'category') {

    return (
      record.category ===
      filter.category
    );
  }

  if (filter.mode === 'title') {

    return (
      normalize(record.title)
        .includes(query)
      ||
      normalizeCompact(record.title)
        .includes(compactQuery)
    );
  }

  if (filter.mode === 'content') {

    const content = `
      ${record.description}
      ${record.content}
    `;

    return (
      normalize(content)
        .includes(query)
      ||
      normalizeCompact(content)
        .includes(compactQuery)
    );
  }

  return true;
}

function createSnippet(
  record,
  query,
  compactQuery,
  filter
) {

  const target =
    filter.mode === 'title'
      ? (
        record.description ||
        record.content ||
        record.title
      )
      : `
          ${record.description || ''}
          ${record.content || ''}
        `;

  const text =
    String(
      target || record.title
    )
      .replace(/\s+/g, ' ')
      .trim();

  const lowerText =
    normalize(text);

  const terms = [
    query,
    compactQuery,

    ...tokenize(query)
      .filter(
        (token) =>
          token.length > 1
      ),
  ];

  const hitIndex =
    terms.reduce(
      (found, term) => {

        if (found >= 0) {
          return found;
        }

        return lowerText.indexOf(term);

      },
      -1
    );

  const compactHitIndex =
    hitIndex >= 0
      ? hitIndex
      : findCompactHitIndex(
          lowerText,
          compactQuery
        );

  const start =
    Math.max(
      0,
      compactHitIndex - 52
    );

  const end =
    Math.min(
      text.length,
      start + 170
    );

  const prefix =
    start > 0
      ? '...'
      : '';

  const suffix =
    end < text.length
      ? '...'
      : '';

  return `
    ${prefix}
    ${text.slice(start, end)}
    ${suffix}
  `.trim();
}

function extractRelatedQueries(
  results,
  query,
  compactQuery
) {

  const tokenScores =
    new Map();

  results.forEach((record) => {

    const text = `
      ${record.title || ''}
      ${record.description || ''}
      ${record.content || ''}
      ${(record.tags || []).join(' ')}
    `;

    tokenize(text)
      .forEach((token) => {

        if (
          token.length < 2
        ) {
          return;
        }

        if (
          token === query ||
          token === compactQuery
        ) {
          return;
        }

        if (
          token.includes(query) ||
          token.includes(compactQuery)
        ) {
          return;
        }

        const prev =
          tokenScores.get(token) || 0;

        tokenScores.set(
          token,
          prev + 1
        );
      });
  });

  return [...tokenScores.entries()]
    .sort(
      (a, b) =>
        b[1] - a[1]
    )
    .slice(0, 12)
    .map(([token]) => token);
}

function findCompactHitIndex(
  text,
  compactQuery
) {

  if (!compactQuery) {
    return -1;
  }

  const compactChars = [];

  const compactIndexToTextIndex = [];

  [...text].forEach(
    (char, index) => {

      if (/\s/.test(char)) {
        return;
      }

      compactIndexToTextIndex.push(index);

      compactChars.push(char);
    }
  );

  const compactIndex =
    compactChars
      .join('')
      .indexOf(compactQuery);

  return compactIndex >= 0
    ? compactIndexToTextIndex[
        compactIndex
      ]
    : -1;
}
