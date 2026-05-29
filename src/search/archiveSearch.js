import MiniSearch from 'minisearch';
import records from '../generated/search-docs.json';

const searchableRecords = uniqueRecordsById(records);

const CONTENT_INDEX_LIMIT = 900;

const TAG_ALIASES = {
  realtime: ['real-time', 'real time', '실시간'],
  ranking: ['rank', 'leaderboard', '랭킹', '순위'],
  sse: ['server sent events', 'server-sent-events', 'eventsource'],
  jwt: ['json web token', 'access token', 'refresh token'],
  webrtc: ['web rtc', 'rtc'],
  aws: ['amazon web services'],
  'signed-url': ['signed url', 'presigned url', 'pre-signed-url'],
};

const SYNONYM_MAP = {
  실시간랭킹: ['실시간 랭킹', 'realtime ranking', 'real-time ranking', 'leaderboard'],
  실시간: ['realtime', 'real-time'],
  랭킹: ['ranking', 'leaderboard', 'rank'],
  스트리밍: ['streaming'],
  관리자: ['admin'],
  인증: ['auth', 'authentication', 'jwt'],
  캐시: ['cache', 'caching'],
  배포: ['deploy', 'deployment', 'ci cd', 'ci/cd'],
};

export const SEARCH_CATEGORIES = [
  'DEV WIKI',
  'ARCHIVE',
];

export const SEARCH_FILTERS = [
  { id: 'all', label: 'ALL', mode: 'all' },
  { id: 'titles', label: 'TITLES', mode: 'title' },
  { id: 'content', label: 'CONTENT', mode: 'content' },
  { id: 'dev-wiki', label: 'DEV WIKI', mode: 'category', category: 'DEV WIKI' },
  { id: 'archive', label: 'ARCHIVE', mode: 'category', category: 'ARCHIVE' },
];

const index = new MiniSearch({
fields: [
  'title',
  'titleCompact',
  'tagsText',
  'categoryText',
  'description',
],

  storeFields: [
    'id',
    'title',
    'description',
    'category',
    'categoryPath',
    'path',
    'tags',
  ],

searchOptions: {
  boost: {
    title: 30,
    titleCompact: 24,
    tagsText: 22,
    categoryText: 14,
    description: 5,
  },
  combineWith: 'AND',
  fuzzy: false,
  prefix: termPrefix,
},

  tokenize,
});

index.addAll(
  searchableRecords.map((record) => {
    const tags =
      expandTags(record.tags || []);

    const categoryText = [
      record.category,
      record.categoryPath,
      record.source,
      record.slug,
      record.id,
    ].filter(Boolean).join(' ');

    return {
      ...record,
      titleCompact: normalizeCompact(record.title),
      tagsText: tags.join(' '),
      categoryText,
      contentPreview: String(record.content || '').slice(0, CONTENT_INDEX_LIMIT),
    };
  })
);

export function runArchiveSearch(query, filterId = 'all') {
  const preparedQuery =
    prepareQuery(query);

  if (!preparedQuery.normalized) {
    return {
      results: [],
      relatedQueries: [],
      correctedQuery: '',
    };
  }

  const filter =
    getFilter(filterId);

const miniResults = index.search(preparedQuery.normalized, {
  combineWith: preparedQuery.tokens.length > 1 ? 'AND' : 'OR',
});

  const fallbackResults =
    searchableRecords
      .map((record) => ({
        ...record,
        score: scoreRecord(record, preparedQuery),
      }))
      .filter((record) => record.score > 0);

  const results =
    mergeResults(miniResults, fallbackResults)
      .filter((record) =>
        matchesFilter(record, preparedQuery, filter)
      )
      .map((record) =>
        decorateResult(record, preparedQuery, filter)
      )
      .sort(sortResults)
      .slice(0, 60);

  const relatedQueries =
    extractRelatedQueries(results, preparedQuery);

  return {
    results,
    relatedQueries,
    correctedQuery: preparedQuery.corrected,
  };
}

export function groupResultsByCategory(results) {
  return SEARCH_CATEGORIES
    .map((category) => ({
      category,
      results:
        results.filter((result) =>
          result.category === category
        ),
    }))
    .filter((group) => group.results.length > 0);
}

export function getFilter(filterId) {
  return (
    SEARCH_FILTERS.find((filter) =>
      filter.id === filterId
    ) || SEARCH_FILTERS[0]
  );
}

function uniqueRecordsById(sourceRecords) {
  const uniqueRecords = new Map();

  sourceRecords.forEach((record) => {
    if (!record?.id) {
      return;
    }

    uniqueRecords.set(record.id, record);
  });

  return [...uniqueRecords.values()];
}

function prepareQuery(query) {
  const normalized =
    normalize(query);

  const corrected =
    normalizeKnownCompound(normalized);

  const expandedQueries =
    expandQuery(corrected);

  const tokens =
    unique(expandedQueries.flatMap(tokenize))
      .filter((token) => token.length > 1);

  const compact =
    normalizeCompact(corrected);

  const variants =
    unique([
      corrected,
      compact,
      ...expandedQueries,
      ...tokens,
    ].filter(Boolean));

  return {
    raw: query,
    normalized: corrected,
    corrected,
    compact,
    variants,
    tokens,
  };
}

function tokenize(text) {
  const source =
    splitStructuredText(text);

  const compactSource =
    normalizeCompact(source);

  const rawTokens =
    source.match(/[a-z0-9+#.]+|[가-힣]+/g) || [];

  const tokens =
    new Set(rawTokens);

  if (compactSource && compactSource.length <= 48) {
    tokens.add(compactSource);
  }

  rawTokens.forEach((token) => {
    splitKnownCompound(token)
      .forEach((part) => tokens.add(part));

    if (/^[가-힣]+$/.test(token)) {
      koreanNgrams(token)
        .forEach((part) => tokens.add(part));
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
    .replace(/[\s/_-]+/g, '');
}

function splitStructuredText(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([a-z])([0-9])/gi, '$1 $2')
    .replace(/([0-9])([a-z])/gi, '$1 $2')
    .replace(/[-_/]+/g, ' ')
    .replace(/([가-힣])([a-z0-9])/gi, '$1 $2')
    .replace(/([a-z0-9])([가-힣])/gi, '$1 $2')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeKnownCompound(value) {
  let output =
    splitStructuredText(value);

  Object.keys(SYNONYM_MAP)
    .sort((first, second) => second.length - first.length)
    .forEach((compound) => {
      const spaced =
        splitKnownCompound(compound).join(' ');

      output =
        output.replaceAll(compound, spaced);
    });

  return output.replace(/\s+/g, ' ').trim();
}

function splitKnownCompound(token) {
  const compact =
    normalizeCompact(token);

  if (compact === '실시간랭킹') {
    return ['실시간', '랭킹'];
  }

  return [token];
}

function koreanNgrams(token) {
  if (token.length <= 2) {
    return [token];
  }

  const grams = [];
  const maxSize = Math.min(4, token.length);

  for (let size = 2; size <= maxSize; size += 1) {
    for (let index = 0; index <= token.length - size; index += 1) {
      grams.push(token.slice(index, index + size));
    }
  }

  return grams;
}

function expandQuery(query) {
  const base =
    normalizeKnownCompound(query);

  const tokens =
    splitStructuredText(base).split(/\s+/).filter(Boolean);

  const expanded =
    new Set([base, normalizeCompact(base), ...tokens]);

  [base, normalizeCompact(base), ...tokens]
    .forEach((term) => {
      (SYNONYM_MAP[term] || [])
        .forEach((synonym) => expanded.add(synonym));
    });

  return [...expanded];
}

function expandTags(tags) {
  const expanded =
    new Set();

  tags.forEach((tag) => {
    const normalized =
      splitStructuredText(normalize(tag));

    expanded.add(normalized);
    expanded.add(normalizeCompact(normalized));

    (TAG_ALIASES[normalized] || [])
      .forEach((alias) => expanded.add(alias));
  });

  return [...expanded];
}

function termPrefix(term) {
  return term.length >= 2;
}

function termFuzzy(term) {
  if (/^[가-힣]+$/.test(term)) {
    return false;
  }

  return term.length >= 5 ? 0.12 : false;
}

function scoreRecord(record, query) {
  const haystack =
    buildRecordHaystack(record);

  const titleScore =
    scoreField(haystack.title, haystack.compactTitle, query, {
      exact: 130,
      includes: 72,
      prefix: 46,
      token: 15,
    });

  const tagScore =
    scoreField(haystack.tags, haystack.compactTags, query, {
      exact: 84,
      includes: 42,
      prefix: 32,
      token: 12,
    });

  const categoryScore =
    scoreField(haystack.category, haystack.compactCategory, query, {
      exact: 52,
      includes: 28,
      prefix: 20,
      token: 8,
    });

  const descriptionScore =
    scoreField(haystack.description, haystack.compactDescription, query, {
      exact: 34,
      includes: 18,
      prefix: 11,
      token: 5,
    });

  const contentScore =
    Math.min(
      10,
      scoreField(haystack.content, haystack.compactContent, query, {
        exact: 8,
        includes: 5,
        prefix: 2,
        token: 0.7,
      })
    );

  const intentBonus =
    computeIntentBonus(haystack, query);

  const lengthPenalty =
    computeLengthPenalty(record);

  return (
    titleScore +
    tagScore +
    categoryScore +
    descriptionScore +
    contentScore +
    intentBonus
  ) * lengthPenalty;
}

function buildRecordHaystack(record) {
  const title =
    normalize(record.title);

  const tags =
    expandTags(record.tags || []).join(' ');

  const category =
    normalize([
      record.category,
      record.categoryPath,
      record.source,
      record.slug,
      record.id,
    ].filter(Boolean).join(' '));

  const description =
    normalize(record.description);

  const content =
    normalize(record.content);

  return {
    title,
    tags,
    category,
    description,
    content,
    compactTitle: normalizeCompact(title),
    compactTags: normalizeCompact(tags),
    compactCategory: normalizeCompact(category),
    compactDescription: normalizeCompact(description),
    compactContent: normalizeCompact(content),
  };
}

function scoreField(field, compactField, query, weights) {
  if (!field && !compactField) {
    return 0;
  }

  let score = 0;
  const compactQuery =
    query.compact;

  if (field === query.normalized || compactField === compactQuery) {
    score += weights.exact;
  } else {
    if (field.includes(query.normalized) || compactField.includes(compactQuery)) {
      score += weights.includes;
    }

    if (field.startsWith(query.normalized) || compactField.startsWith(compactQuery)) {
      score += weights.prefix;
    }
  }

  query.tokens.forEach((token) => {
    if (field.includes(token) || compactField.includes(token)) {
      score += weights.token;
    }
  });

  return score;
}

function computeIntentBonus(haystack, query) {
  const strongText = [
    haystack.title,
    haystack.tags,
    haystack.category,
    haystack.description,
  ].join(' ');

  const strongCompact =
    normalizeCompact(strongText);

  const matchedTokenCount =
    query.tokens.filter((token) =>
      strongText.includes(token) || strongCompact.includes(token)
    ).length;

  if (query.tokens.length <= 1) {
    return matchedTokenCount > 0 ? 8 : 0;
  }

  return matchedTokenCount === query.tokens.length
    ? 34
    : matchedTokenCount * 6;
}

function computeLengthPenalty(record) {
  const length =
    String(record.content || '').length;

  if (length <= 1200) {
    return 1;
  }

  return Math.max(0.78, 1 - Math.log10(length / 1200) * 0.12);
}

function mergeResults(primary, fallback) {
  const merged =
    new Map();

  [...primary, ...fallback].forEach((record) => {
    const previous =
      merged.get(record.id);

    const miniScore =
      primary.includes(record)
        ? (record.score || 1) * 0.18
        : 0;

    const score =
      Math.max(previous?.score || 0, record.score || 0) + miniScore;

    merged.set(record.id, {
      ...previous,
      ...record,
      score,
    });
  });

  return [...merged.values()];
}

function matchesFilter(record, query, filter) {
  if (filter.mode === 'category') {
    return record.category === filter.category;
  }

  const haystack =
    buildRecordHaystack(record);

  if (filter.mode === 'title') {
    return (
      haystack.title.includes(query.normalized) ||
      haystack.compactTitle.includes(query.compact) ||
      query.tokens.some((token) => haystack.title.includes(token))
    );
  }

  if (filter.mode === 'content') {
    return (
      haystack.description.includes(query.normalized) ||
      haystack.content.includes(query.normalized) ||
      haystack.compactDescription.includes(query.compact) ||
      haystack.compactContent.includes(query.compact)
    );
  }

  return true;
}

function decorateResult(record, query, filter) {
  const tags =
    record.tags || [];

  const summary =
    createSummary(record, query, filter);

  return {
    ...record,
    tags,
    summary,
    snippet: summary,
    matchLabel: createMatchLabel(record, query),
  };
}

function createSummary(record, query, filter) {
  if (record.description) {
    return record.description;
  }

  if (filter.mode !== 'content') {
    return record.categoryPath || record.path;
  }

  return createContentSnippet(record, query);
}

function createContentSnippet(record, query) {
  const text =
    String(record.content || record.description || record.title || '')
      .replace(/\s+/g, ' ')
      .trim();

  const lowerText =
    normalize(text);

  const hitIndex =
    [query.normalized, query.compact, ...query.tokens]
      .reduce((found, term) => {
        if (found >= 0) {
          return found;
        }

        return lowerText.indexOf(term);
      }, -1);

  const start =
    Math.max(0, hitIndex - 42);

  const end =
    Math.min(text.length, start + 150);

  return `${start > 0 ? '...' : ''}${text.slice(start, end)}${end < text.length ? '...' : ''}`;
}

function createMatchLabel(record, query) {
  const haystack =
    buildRecordHaystack(record);

  if (haystack.title === query.normalized || haystack.compactTitle === query.compact) {
    return 'TITLE EXACT';
  }

  if (haystack.title.includes(query.normalized) || haystack.compactTitle.includes(query.compact)) {
    return 'TITLE';
  }

  if (haystack.tags.includes(query.normalized) || haystack.compactTags.includes(query.compact)) {
    return 'TAG';
  }

  if (haystack.category.includes(query.normalized) || haystack.compactCategory.includes(query.compact)) {
    return 'CATEGORY';
  }

  if (haystack.description.includes(query.normalized) || haystack.compactDescription.includes(query.compact)) {
    return 'DESCRIPTION';
  }

  return 'CONTENT';
}

function sortResults(first, second) {
  return (
    second.score - first.score ||
    scoreCategoryOrder(first) - scoreCategoryOrder(second) ||
    first.title.localeCompare(second.title)
  );
}

function scoreCategoryOrder(record) {
  return SEARCH_CATEGORIES.indexOf(record.category);
}

function extractRelatedQueries(results, query) {
  const tokenScores =
    new Map();

  results.forEach((record) => {
    const text = [
      record.title,
      record.categoryPath,
      ...(record.tags || []),
      record.description,
    ].filter(Boolean).join(' ');

    tokenize(text).forEach((token) => {
      if (token.length < 2 || query.tokens.includes(token)) {
        return;
      }

      if (token.includes(query.normalized) || token.includes(query.compact)) {
        return;
      }

      tokenScores.set(token, (tokenScores.get(token) || 0) + 1);
    });
  });

  return [...tokenScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([token]) => token);
}

function unique(values) {
  return [...new Set(values)];
}
