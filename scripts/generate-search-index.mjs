import fs from 'fs';

import path from 'path';

import matter from 'gray-matter';

import { globSync } from 'glob';

const docsPath = path.join(
  process.cwd(),
  'docs'
);

const files = globSync(
  '**/*.{md,mdx}',
  {
    cwd: docsPath,
  }
);

const docs = files.map((file) => {
  const fullPath = path.join(
    docsPath,
    file
  );

  const raw = fs.readFileSync(
    fullPath,
    'utf-8'
  );

  const { data } = matter(raw);

  const slug = file
    .replace(/\\/g, '/')
    .replace(/\.mdx?$/, '');

  return {
    title: data.title || '',

    description:
      data.description || '',

    tags: data.tags || [],

    path: `/docs/${slug}`,
  };
});

const outputPath = path.join(
  process.cwd(),
  'src/generated/search-docs.json'
);

fs.mkdirSync(
  path.dirname(outputPath),
  {
    recursive: true,
  }
);

fs.writeFileSync(
  outputPath,
  JSON.stringify(docs, null, 2)
);

console.log(
  '✅ search index generated'
);