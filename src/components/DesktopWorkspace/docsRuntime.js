import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import docsManifests from '../../generated/runtime-docs-manifests.json';
import baseStyles from './styles.module.css';
import docsRuntimeStyles from './docsRuntime.module.css';
import workspaceOverlayStyles from './workspaceOverlay.module.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
const styles = {
  ...baseStyles,
  ...docsRuntimeStyles,
  ...workspaceOverlayStyles,
};

const EMPTY_DOCS_MANIFEST = {
  root: 'docs',
  sourcePath: '',
  basePath: '',
  files: [],
  tree: [],
};

function normalizeDocsManifestKey(key) {
  return String(key || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getWorkspaceDocsManifest(item) {
  const key =
    normalizeDocsManifestKey(
      item.workspace?.docsManifestKey ||
      item.docsManifestKey ||
      item.workspaceSlug ||
      item.id ||
      item.title
    );

  return docsManifests[key] || EMPTY_DOCS_MANIFEST;
}

function getWorkspaceRuntimeRecords(item) {

  const folders =
    item.workspace?.folders || [];

  return folders.flatMap((folder) =>
    (folder.children || []).map((file) => ({
      ...file,
      subsystem:
        folder.title,
    }))
  );
}

function getInitialRuntimeDoc(manifest) {

  return manifest.files?.[0] || null;
}

function isSameDirectory(firstDoc, secondDoc) {
  return (
    (firstDoc?.directory || []).join('/') ===
    (secondDoc?.directory || []).join('/')
  );
}

function isExternalHref(href) {
  return /^https?:\/\//i.test(href || '');
}

function stripMarkdownFrontMatter(content) {
  return String(content || '')
    .replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n|$)/, '');
}

function RuntimeDocsTree({
  nodes,
  selectedDoc,
  onSelect,
}) {

  return (
    <div className={styles.docsTreeNodes}>
      {
        nodes.map((node) => {
          if (node.type === 'folder') {
            return (
              <div
                key={node.id}
                className={styles.docsTreeFolder}
              >
                <div className={styles.docsTreeFolderName}>
                  <i className="fa-solid fa-folder" />
                  {node.name}
                </div>

                <RuntimeDocsTree
                  nodes={node.children || []}
                  selectedDoc={selectedDoc}
                  onSelect={onSelect}
                />
              </div>
            );
          }

          const isActive =
            selectedDoc?.path === node.path;

          return (
            <button
              key={node.path}
              type="button"
              className={`${styles.docsTreeFile} ${
                isActive
                  ? styles.docsTreeFileActive
                  : ''
              }`}
              onClick={() =>
                onSelect(node.path)
              }
            >
              <i
                className={`fa-solid ${
                  node.extension === 'html' ||
                  node.extension === 'htm'
                    ? 'fa-file-code'
                    : 'fa-file-lines'
                }`}
              />
              {node.title}
            </button>
          );
        })
      }
    </div>
  );
}

export function WorkspacePackageView({
  item,
  onBack,
  onOpenCode,
  onOpenDocs,
}) {

  const records =
    getWorkspaceRuntimeRecords(item);

  return (

      <section
        className={styles.workspacePackageSurface}
        aria-label={`${item.title} workspace package`}
      >
        <header className={styles.workspacePackageHeader}>
          <div>
            <span className={styles.workspacePackageKicker}>
              WORKSPACE
            </span>

            <h2>
              {item.title}
            </h2>

<p>
  이 워크스페이스에는 프로젝트 기록과 개발 문서를 열람할 수 있는 런타임 앱이 포함되어 있습니다.
</p>
          </div>

          <button
            type="button"
            className={styles.workspacePackageClose}
            onClick={onBack}
            aria-label="Back to desktop"
          >
            <i className="fa-solid fa-arrow-left" />
          </button>
        </header>

        <div className={styles.workspacePackagePath}>
          <span>{item.title}</span>
          <span>applications</span>
          <span>{records.length} indexed records</span>
        </div>

        <div className={styles.workspaceObjectGrid}>
          <button
            type="button"
            className={`${styles.workspaceExecutableObject} ${styles.codeAppEntry}`}
            onDoubleClick={onOpenCode}
            onClick={onOpenCode}
          >
            <span className={styles.codeAppIcon}>
              <i className="fa-solid fa-code" />
              <span
                className={styles.appShortcutBadge}
                aria-hidden="true"
              >
                <i className="fa-solid fa-arrow-up-right-from-square" />
              </span>
            </span>

            <strong>CODE</strong>
            <small>code열람.exe</small>
          </button>

          <button
            type="button"
            className={`${styles.workspaceExecutableObject} ${styles.docsAppEntry}`}
            onDoubleClick={onOpenDocs}
            onClick={onOpenDocs}
          >
            <span className={styles.docsAppIcon}>
              <i className="fa-solid fa-scroll" />
              <span
                className={styles.appShortcutBadge}
                aria-hidden="true"
              >
                <i className="fa-solid fa-arrow-up-right-from-square" />
              </span>
            </span>

            <strong>DOCS</strong>
            <small>아카이빙.app</small>
          </button>
        </div>
      </section>

  );
}

export function ArchiveRuntimeApplication({
  item,
  onClose,
  onMinimize,
}) {
  const docsManifest =
    useMemo(() =>
      getWorkspaceDocsManifest(item),
      [item]
    );

  const bootLines = [
    'Archive record opened',
    'Preparing manuscript view',
    'Index ready',
  ];

  const [bootIndex, setBootIndex] =
    useState(0);

  const [selectedDocPath, setSelectedDocPath] =
    useState(() =>
      getInitialRuntimeDoc(docsManifest)?.path || ''
    );

  const [documentContent, setDocumentContent] =
    useState('');

  const [documentStatus, setDocumentStatus] =
    useState('idle');

  useEffect(() => {

    setBootIndex(0);

    const timers =
      bootLines.map((line, index) =>
        setTimeout(() => {
          setBootIndex(index + 1);
        }, 280 + index * 520)
      );

    return () => {
      timers.forEach((timer) =>
        clearTimeout(timer)
      );
    };

  }, [item.id]);

  useEffect(() => {
    setSelectedDocPath(
      getInitialRuntimeDoc(docsManifest)?.path || ''
    );
  }, [docsManifest]);

  const selectedDoc =
    useMemo(() => {
      const initialDoc =
        getInitialRuntimeDoc(docsManifest);

      return (
        docsManifest.files?.find((doc) =>
          doc.path === selectedDocPath
        ) ||
        initialDoc
      );
    }, [docsManifest, selectedDocPath]);

  useEffect(() => {

    if (!selectedDoc) {
      setDocumentContent('');
      setDocumentStatus('empty');
      return;
    }

    let cancelled =
      false;

    setDocumentStatus('loading');

    fetch(selectedDoc.publicPath)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to load ${selectedDoc.publicPath}`
          );
        }

        return res.text();
      })
      .then((text) => {
        if (cancelled) {
          return;
        }

        setDocumentContent(
          selectedDoc.type === 'markdown'
            ? stripMarkdownFrontMatter(text)
            : text
        );
        setDocumentStatus('ready');
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setDocumentContent('');
        setDocumentStatus('error');
      });

    return () => {
      cancelled = true;
    };

  }, [selectedDoc]);

  const relatedDocs =
    useMemo(() =>
      (docsManifest.files || [])
        .filter((doc) =>
          selectedDoc &&
          doc.path !== selectedDoc.path &&
          isSameDirectory(doc, selectedDoc)
        )
        .slice(0, 6),
      [docsManifest, selectedDoc]
    );

  return (

    <div
      className={styles.archiveAppOverlay}
    >
      <section
        className={styles.archiveAppWindow}
        aria-label={`${item.title} document archive`}
      >
        <div className={styles.archiveWindowBar}>
          <div className={styles.archiveWindowControls}>
            <button
              type="button"
              className={`${styles.archiveWindowDot} ${styles.archiveWindowClose}`}
              onClick={onClose}
              aria-label="Close document archive"
            />

            <button
              type="button"
              className={`${styles.archiveWindowDot} ${styles.archiveWindowMinimize}`}
              onClick={onMinimize}
              aria-label="Minimize document archive"
            />

            <span className={`${styles.archiveWindowDot} ${styles.archiveWindowExpand}`} />
          </div>

          <span className={styles.archiveWindowTitle}>
            document-archive / {item.title}
          </span>
        </div>

        <header className={styles.archiveRuntimeHeader}>
          <div>
            <span className={styles.archiveRuntimeKicker}>
              Document Archive
            </span>

            <h1>
              {item.title}
            </h1>
          </div>
        </header>

        <div className={styles.archiveBootTrace}>
          {
            bootLines
              .slice(0, bootIndex)
              .map((line) => (
                <span key={line}>
                  {line}
                </span>
              ))
          }
        </div>

        <div className={styles.archiveDocumentRuntimeBody}>
          <aside className={styles.archiveDocsNavigator}>
            <div className={styles.archiveLedgerTitle}>
              document archive
            </div>

            <RuntimeDocsTree
              nodes={docsManifest.tree || []}
              selectedDoc={selectedDoc}
              onSelect={setSelectedDocPath}
            />
          </aside>

          <article className={styles.archiveDocumentPage}>
            {
              !selectedDoc && (
                <div className={styles.archiveEmptyState}>
                  <h2>No documents indexed</h2>

                  <p>
                    Add md or html files under {docsManifest.sourcePath || 'static/code/{Project}/docs'} and refresh the archive.
                  </p>
                </div>
              )
            }

            {
              selectedDoc && (
                <>
                  <header className={styles.archiveDocumentHeader}>
                    <div>
                      <span>
                        {selectedDoc.path}
                      </span>

                      <h2>
                        {selectedDoc.title}
                      </h2>
                    </div>

                    <strong>
                      {selectedDoc.extension}
                    </strong>
                  </header>

                  {
                    documentStatus === 'loading' && (
                      <p className={styles.archiveDocumentStatus}>
                        loading document...
                      </p>
                    )
                  }

                  {
                    documentStatus === 'error' && (
                      <p className={styles.archiveDocumentStatus}>
                        document load failed
                      </p>
                    )
                  }

                  {
                    selectedDoc.type === 'html' &&
                    documentStatus === 'ready' && (
                      <iframe
                        title={selectedDoc.title}
                        src={selectedDoc.publicPath}
                        className={styles.archiveHtmlDocument}
                      />
                    )
                  }

{
  selectedDoc.type === 'markdown' &&
  documentStatus === 'ready' && (

    <div className={styles.archiveMarkdownDocument}>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {documentContent}
      </ReactMarkdown>

    </div>
  )
}
                </>
              )
            }
          </article>

          <aside className={styles.archiveDocumentAside}>
            <div className={styles.archiveLedgerTitle}>
              metadata
            </div>

            <dl className={styles.archiveMetadata}>
              <div>
                <dt>path</dt>
                <dd>{selectedDoc?.path || 'none'}</dd>
              </div>

              <div>
                <dt>type</dt>
                <dd>{selectedDoc?.type || 'empty'}</dd>
              </div>

            </dl>

            {
              selectedDoc?.tags?.length > 0 && (
                <div className={styles.archiveTags}>
                  {
                    selectedDoc.tags.map((tag) => (
                      <span key={tag}>
                        {tag}
                      </span>
                    ))
                  }
                </div>
              )
            }

            {
              relatedDocs.length > 0 && (
                <>
                  <div className={styles.archiveLedgerTitle}>
                    related documents
                  </div>

                  {
                    relatedDocs.map((doc) => (
                      <button
                        key={doc.path}
                        type="button"
                        className={styles.archiveLinkedRecord}
                        onClick={() =>
                          setSelectedDocPath(doc.path)
                        }
                      >
                        <strong>
                          {doc.title}
                        </strong>

                        <span>
                          {doc.path}
                        </span>
                      </button>
                    ))
                  }
                </>
              )
            }

            {
              selectedDoc?.links?.length > 0 && (
                <>
                  <div className={styles.archiveLedgerTitle}>
                    links
                  </div>

                  {
                    selectedDoc.links.map((link) => (
                      <a
                        key={`${link.href}-${link.label}`}
                        className={styles.archiveLinkedRecord}
                        href={link.href}
                        target={
                          isExternalHref(link.href)
                            ? '_blank'
                            : undefined
                        }
                        rel={
                          isExternalHref(link.href)
                            ? 'noreferrer'
                            : undefined
                        }
                      >
                        <strong>
                          {link.label}
                        </strong>

                        <span>
                          {link.href}
                        </span>
                      </a>
                    ))
                  }
                </>
              )
            }

          </aside>
        </div>
      </section>
    </div>

  );
}
