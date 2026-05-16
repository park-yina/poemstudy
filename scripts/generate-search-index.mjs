import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { globSync } from 'glob';

const root = process.cwd();

const CATEGORY = {
  DEV_WIKI: 'DEV WIKI',
  ARCHIVE: 'ARCHIVE',
};

const archiveEntries = [
  {
    title: 'fakejumping-admin',
    status: 'live runtime',
    stack: 'Spring Boot / JWT / MyBatis / Docker / AWS',
    href: '/docs/intro',
    description:
      'Operational platform records focused on authentication, admin flows, deployment, and runtime maintenance.',
  },
  {
    title: 'shinchun-archive',
    status: 'archived',
    stack: 'Flask / AWS Lambda / HTML',
    href: '/docs/intro',
    description:
      'A preserved service archive for event-oriented publishing, signed access, and serverless delivery notes.',
  },
  {
    title: 'JumpingBattle',
    status: 'legacy',
    stack: 'Python / Firebase / HTML',
    href: '/docs/intro',
    description:
      'Legacy project notes from real-time interaction work, frontend control surfaces, and Firebase-backed state.',
  },
];

function readMarkdownCollection(directory, category, pathPrefix) {
  const basePath = path.join(root, directory);

  return globSync('**/*.{md,mdx}', {
    cwd: basePath,
    ignore: ['**/_category_.json'],
  }).map((file) => {
    const fullPath = path.join(basePath, file);
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const { data, content } = matter(raw);
    const slug = file.replace(/\\/g, '/').replace(/\.mdx?$/, '');
    const routeSlug = slug.replace(/\/index$/, '');
    const title = data.title || findFirstHeading(content) || titleFromSlug(slug);
    const description = data.description || firstParagraph(content);

    return {
      id: `${category}:${slug}`,
      title,
      description,
      content: cleanContent(content),
      tags: data.tags || [],
      category,
      source: directory,
      path: `${pathPrefix}/${routeSlug}`,
    };
  });
}

function findFirstHeading(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
}

function titleFromSlug(slug) {
  return slug
    .split('/')
    .pop()
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function firstParagraph(content) {
  const paragraph = content
    .replace(/^#.*$/gm, '')
    .split(/\n{2,}/)
    .map((block) => cleanContent(block).trim())
    .find(Boolean);

  return paragraph || '';
}

function cleanContent(content) {
  return content
    .replace(/\{\/\*\s*truncate\s*\*\/\}/gi, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const docs = [
  ...readMarkdownCollection('docs', CATEGORY.DEV_WIKI, '/docs'),
  ...archiveEntries.map((entry) => ({
    id: `${CATEGORY.ARCHIVE}:${entry.title}`,
    title: entry.title,
    description: entry.description,
    content: `${entry.description} ${entry.status} ${entry.stack}`,
    tags: [entry.status, entry.stack],
    category: CATEGORY.ARCHIVE,
    source: 'archive',
    path: entry.href,
  })),
];

const outputPath = path.join(root, 'src/generated/search-docs.json');

fs.mkdirSync(path.dirname(outputPath), {
  recursive: true,
});

fs.writeFileSync(outputPath, JSON.stringify(docs, null, 2));

console.log(`archive search index generated: ${docs.length} records`);
