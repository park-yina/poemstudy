import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { globSync } from 'glob';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import { toHtml } from 'hast-util-to-html';

const root = process.cwd();

const CATEGORY = {
  DEV_WIKI: 'DEV WIKI',
  ARCHIVE: 'ARCHIVE',
};

function readMarkdownCollection(directory, category, pathPrefix, options = {}) {
  const basePath = path.join(root, directory);

  if (!fs.existsSync(basePath)) {
    return [];
  }

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
    const categoryPath = getCategoryPath(basePath, slug);
    const tags = normalizeTags([
      ...(data.tags || []),
      ...categoryPath,
      ...deriveTagsFromSlug(slug),
    ]);

    return {
      id: `${options.idPrefix || category}:${slug}`,
      title,
      description,
      content: cleanContent(content),
      tags,
      categoryPath: categoryPath.join(' / '),
      category,
      source: directory,
      version: options.version || '',
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

function readRuntimeDocsManifest(projectDirectory) {
  const directory = `static/code/${projectDirectory}/docs`;
  const basePath = path.join(root, directory);
  const key = normalizeManifestKey(projectDirectory);

  if (!fs.existsSync(basePath)) {
    return {
      key,
      project: projectDirectory,
      root: 'docs',
      sourcePath: directory,
      basePath: `/code/${projectDirectory}/docs`,
      files: [],
      tree: [],
    };
  }

  const files = globSync('**/*.{md,mdx,html,htm}', {
    cwd: basePath,
    nodir: true,
  })
    .sort((first, second) =>
      first.localeCompare(second)
    )
    .map((file) => {
      const fullPath = path.join(basePath, file);
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const normalizedPath = file.replace(/\\/g, '/');
      const extension = path.extname(file).slice(1).toLowerCase();
      const slug = normalizedPath.replace(/\.(mdx?|html?)$/i, '');
      const directoryName = path.dirname(normalizedPath);
      const directoryParts =
        directoryName === '.'
          ? []
          : directoryName.split('/');

      if (extension === 'md' || extension === 'mdx') {
        const { data, content } = matter(raw);

        return {
          id: slug,
          title: data.title || findFirstHeading(content) || titleFromSlug(slug),
          description: data.description || firstParagraph(content),
          tags: data.tags || [],
          type: 'markdown',
          extension,
          html: renderMarkdownToHtml(content),
          path: normalizedPath,
          publicPath: `/code/${projectDirectory}/docs/${normalizedPath}`,
          directory: directoryParts,
        };
      }

      return {
        id: slug,
        title: findHtmlTitle(raw) || titleFromSlug(slug),
        description: findHtmlDescription(raw),
        tags: [],
        type: 'html',
        extension,
        path: normalizedPath,
        publicPath: `/code/${projectDirectory}/docs/${normalizedPath}`,
        directory: directoryParts,
      };
    });

  return {
    key,
    project: projectDirectory,
    root: 'docs',
    sourcePath: directory,
    basePath: `/code/${projectDirectory}/docs`,
    files,
    tree: buildRuntimeDocsTree(files),
  };
}

function readRuntimeDocsManifests() {
  const basePath = path.join(root, 'static/code');

  if (!fs.existsSync(basePath)) {
    return {};
  }

  return fs.readdirSync(basePath, {
    withFileTypes: true,
  })
    .filter((entry) =>
      entry.isDirectory() &&
      fs.existsSync(path.join(basePath, entry.name, 'docs'))
    )
    .reduce((manifests, entry) => {
      const manifest = readRuntimeDocsManifest(entry.name);
      manifests[manifest.key] = manifest;
      return manifests;
    }, {});
}

function renderMarkdownToHtml(content) {
  const processor =
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, {
        allowDangerousHtml: false,
      });

  const markdownTree =
    processor.parse(content);

  const hastTree =
    processor.runSync(markdownTree);

  return toHtml(hastTree);
}

function findHtmlTitle(content) {
  const match = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? cleanContent(match[1]) : '';
}

function findHtmlDescription(content) {
  const match = content.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  );

  return match ? cleanContent(match[1]) : '';
}

function buildRuntimeDocsTree(files) {
  const rootNode = [];

  files.forEach((file) => {
    let level = rootNode;

    file.directory.forEach((part, index) => {
      let folder = level.find(
        (node) =>
          node.type === 'folder' &&
          node.name === part
      );

      if (!folder) {
        folder = {
          id: file.directory.slice(0, index + 1).join('/'),
          type: 'folder',
          name: part,
          children: [],
        };

        level.push(folder);
      }

      level = folder.children;
    });

    level.push({
      id: file.id,
      type: 'file',
      title: file.title,
      path: file.path,
      extension: file.extension,
    });
  });

  return rootNode;
}

function readArchiveWikiRecords() {
  const directory = 'archive-wiki';
  const basePath = path.join(root, directory);

  if (!fs.existsSync(basePath)) {
    return [];
  }

  return globSync('**/*.{md,mdx}', {
    cwd: basePath,
    ignore: ['index.md', 'index.mdx', '**/_category_.json'],
  })
    .sort((first, second) =>
      first.localeCompare(second)
    )
    .map((file) => {
      const fullPath = path.join(basePath, file);
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const { data, content } = matter(raw);
      const fileSlug = file.replace(/\\/g, '/').replace(/\.mdx?$/, '');
      const slug = normalizeIndexSlug(fileSlug);
      const parentSlug = findParentSlug(slug);
      const title = data.title || findFirstHeading(content) || titleFromSlug(slug);
      const description = data.description || firstParagraph(content);
      const categoryPath = getCategoryPath(basePath, fileSlug);
      const tags = normalizeTags([
        ...(data.tags || []),
        ...categoryPath,
        ...deriveTagsFromSlug(slug),
      ]);
      const anchor = slug.replace(/[^a-z0-9_-]+/gi, '-');
      const wikiPath = `/archive-wiki?record=${encodeURIComponent(slug)}`;
      const workspacePath = data.workspaceHref || data.href || '';
      const devwikiPath = data.devwikiHref || '';

      return {
        id: `${CATEGORY.ARCHIVE}:${slug}`,
        slug,
        title,
        description,
        content: cleanContent(content),
        markdown: content.trim(),
        status: data.status || 'archived',
        stack: data.stack || '',
        order: Number.isFinite(data.order) ? data.order : 0,
        tags,
        categoryPath: categoryPath.join(' / '),
        category: CATEGORY.ARCHIVE,
        source: directory,
        sourcePath: `${directory}/${fileSlug}.md`,
        parentSlug,
        depth: slug.split('/').length,
        anchor,
        wikiPath,
        devwikiPath,
        workspacePath,
        path: wikiPath,
      };
    })
    .sort(sortArchiveRecords);
}

const archiveRecords = readArchiveWikiRecords();

const latestVersion = readLatestDocsVersion();
const latestVersionedDocs = latestVersion
  ? readMarkdownCollection(
      `versioned_docs/version-${latestVersion}`,
      CATEGORY.DEV_WIKI,
      '/docs',
      {
        idPrefix: `${CATEGORY.DEV_WIKI}:${latestVersion}`,
        version: latestVersion,
      },
    )
  : [];

const docs = [
  ...latestVersionedDocs,
  ...readMarkdownCollection('docs', CATEGORY.DEV_WIKI, '/docs/next', {
    idPrefix: `${CATEGORY.DEV_WIKI}:next`,
    version: 'next',
  }),
  ...archiveRecords,
];

const runtimeDocsManifests = readRuntimeDocsManifests();
const runtimeDocsManifest =
  runtimeDocsManifests.fake ||
  readRuntimeDocsManifest('Fake');

writeJsonFile(
  path.join(root, 'src/generated/search-docs.json'),
  docs
);

writeJsonFile(
  path.join(root, 'src/generated/archive-records.json'),
  archiveRecords
);

writeJsonFile(
  path.join(root, 'src/generated/fake-docs-manifest.json'),
  runtimeDocsManifest
);

writeJsonFile(
  path.join(root, 'src/generated/runtime-docs-manifests.json'),
  runtimeDocsManifests
);

console.log(`archive search index generated: ${docs.length} records`);
console.log(`archive wiki generated: ${archiveRecords.length} records`);
console.log(`runtime docs manifest generated: ${runtimeDocsManifest.files.length} records`);
console.log(`runtime docs projects generated: ${Object.keys(runtimeDocsManifests).length} projects`);

function writeJsonFile(outputPath, data) {
  const temporaryOutputPath = `${outputPath}.tmp`;

  fs.mkdirSync(path.dirname(outputPath), {
    recursive: true,
  });

  fs.writeFileSync(temporaryOutputPath, JSON.stringify(data, null, 2));
  fs.renameSync(temporaryOutputPath, outputPath);
}

function normalizeIndexSlug(slug) {
  return slug.replace(/\/index$/, '');
}

function findParentSlug(slug) {
  const parts = slug.split('/');

  if (parts.length <= 2) {
    return '';
  }

  return parts.slice(0, -1).join('/');
}

function sortArchiveRecords(first, second) {
  return (
    first.order - second.order ||
    first.slug.localeCompare(second.slug)
  );
}

function readLatestDocsVersion() {
  const versionsPath = path.join(root, 'versions.json');

  if (!fs.existsSync(versionsPath)) {
    return '';
  }

  const versions = JSON.parse(fs.readFileSync(versionsPath, 'utf-8'));

  return Array.isArray(versions) ? versions[0] : '';
}

function getCategoryPath(basePath, slug) {
  const parts = slug.split('/').slice(0, -1);
  const labels = [];

  parts.forEach((_, index) => {
    const directory = path.join(basePath, ...parts.slice(0, index + 1));
    const categoryPath = path.join(directory, '_category_.json');

    if (!fs.existsSync(categoryPath)) {
      labels.push(parts[index]);
      return;
    }

    try {
      const category = JSON.parse(fs.readFileSync(categoryPath, 'utf-8'));
      labels.push(category.label || parts[index]);

      if (category.link?.description) {
        labels.push(category.link.description);
      }
    } catch {
      labels.push(parts[index]);
    }
  });

  return labels.filter(Boolean);
}

function deriveTagsFromSlug(slug) {
  return slug
    .split(/[\\/]+/)
    .flatMap((part) => part.split(/[-_\s]+/))
    .filter(Boolean);
}

function normalizeTags(tags) {
  return [...new Set(
    tags
      .map((tag) =>
        String(tag || '')
          .trim()
      )
      .filter(Boolean)
  )];
}

function normalizeManifestKey(key) {
  return String(key || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
