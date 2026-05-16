import MiniSearch from 'minisearch';
import records from '../generated/search-docs.json';

export const SEARCH_CATEGORIES = ['DEV WIKI', , 'ARCHIVE'];

export const SEARCH_FILTERS = [
  { id: 'all', label: 'ALL', mode: 'all' },
  { id: 'titles', label: 'TITLES', mode: 'title' },
  { id: 'content', label: 'CONTENT', mode: 'content' },
  { id: 'dev-wiki', label: 'DEV WIKI', mode: 'category', category: 'DEV WIKI' },
  { id: 'archive', label: 'ARCHIVE', mode: 'category', category: 'ARCHIVE' },
];

const index = new MiniSearch({
  fields: ['title', 'content', 'description', 'tagsText'],
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
    },
    combineWith: 'OR',
    fuzzy: 0.15,
    prefix: true,
  },
  tokenize,
});

index.addAll(
  records.map((record) => ({
    ...record,
    tagsText: (record.tags || []).join(' '),
  }))
);

export function runArchiveSearch(query, filterId = 'all') {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return [];
  }

  const filter = getFilter(filterId);
  const miniResults = index.search(normalizedQuery);
  const fallbackResults = records
    .map((record) => ({
      ...record,
      score: scoreRecord(record, normalizedQuery),
    }))
    .filter((record) => record.score > 0);

  return mergeResults(miniResults, fallbackResults)
    .filter((record) => matchesFilter(record, normalizedQuery, filter))
    .map((record) => ({
      ...record,
      snippet: createSnippet(record, normalizedQuery, filter),
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 60);
}

export function groupResultsByCategory(results) {
  return SEARCH_CATEGORIES.map((category) => ({
    category,
    results: results.filter((result) => result.category === category),
  })).filter((group) => group.results.length > 0);
}

export function getFilter(filterId) {
  return SEARCH_FILTERS.find((filter) => filter.id === filterId) || SEARCH_FILTERS[0];
}

function tokenize(text) {
  const source = normalize(text);
  const rawTokens = source.match(/[a-z0-9+#.]+|[가-힣]+/g) || [];
  const tokens = new Set(rawTokens);

  rawTokens.forEach((token) => {
    if (/^[가-힣]+$/.test(token)) {
      for (let size = 1; size <= Math.min(3, token.length); size += 1) {
        for (let index = 0; index <= token.length - size; index += 1) {
          tokens.add(token.slice(index, index + size));
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

function mergeResults(primary, fallback) {
  const merged = new Map();

  [...primary, ...fallback].forEach((record) => {
    const previous = merged.get(record.id);
    const score = (previous?.score || 0) + (record.score || 1);

    merged.set(record.id, {
      ...previous,
      ...record,
      score,
    });
  });

  return [...merged.values()];
}

function scoreRecord(record, query) {
  const title = normalize(record.title);
  const description = normalize(record.description);
  const content = normalize(record.content);
  let score = 0;

  if (title.includes(query)) score += 20;
  if (description.includes(query)) score += 8;
  if (content.includes(query)) score += 4;

  tokenize(query).forEach((token) => {
    if (token.length < 2) return;
    if (title.includes(token)) score += 4;
    if (description.includes(token)) score += 2;
    if (content.includes(token)) score += 1;
  });

  return score;
}

function matchesFilter(record, query, filter) {
  if (filter.mode === 'category') {
    return record.category === filter.category;
  }

  if (filter.mode === 'title') {
    return normalize(record.title).includes(query);
  }

  if (filter.mode === 'content') {
    return normalize(`${record.description} ${record.content}`).includes(query);
  }

  return true;
}

function createSnippet(record, query, filter) {
  const target =
    filter.mode === 'title'
      ? record.description || record.content || record.title
      : `${record.description || ''} ${record.content || ''}`;
  const text = String(target || record.title).replace(/\s+/g, ' ').trim();
  const lowerText = normalize(text);
  const terms = [query, ...tokenize(query).filter((token) => token.length > 1)];
  const hitIndex = terms.reduce((found, term) => {
    if (found >= 0) return found;
    return lowerText.indexOf(term);
  }, -1);
  const start = Math.max(0, hitIndex - 52);
  const end = Math.min(text.length, start + 170);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < text.length ? '...' : '';

  return `${prefix}${text.slice(start, end)}${suffix}`;
}
