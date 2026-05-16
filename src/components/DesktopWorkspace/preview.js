import React, {
  useEffect,
  useState,
} from 'react';

import styles from './styles.module.css';
import {
  getActiveCodeLineIndex,
  getLanguageFromFile,
  getTokenStyle,
  useRuntimeCodeTokens,
} from './codeHighlight';

import { documents }
from '../../data/documents';

/* =========================================
   DOCUMENT VIEWER
========================================= */

export function DocumentViewer({
  doc,
}) {

  if (!doc) {
    return null;
  }

  return (

    <div className={styles.documentViewer}>

      <div className={styles.breadcrumb}>
        {doc.breadcrumb}
      </div>

      <article className={styles.document}>

        <div className={styles.docType}>
          {doc.typeLabel}
        </div>

        <h1>
          {doc.title}
        </h1>

        <p className={styles.docDescription}>
          {doc.description}
        </p>

        {
          doc.sections?.map((section) => (

            <section
              key={section.title}
            >

              <h2>
                {section.title}
              </h2>

              <p>
                {section.content}
              </p>

              {
                section.chips && (

                  <div className={styles.chips}>

                    {
                      section.chips.map((chip) => (

                        <span
                          key={chip}
                          className={styles.chip}
                        >
                          {chip}
                        </span>

                      ))
                    }

                  </div>

                )
              }

            </section>

          ))
        }

      </article>

    </div>

  );
}

/* =========================================
   PREVIEW PANEL
========================================= */

export function PreviewPanel({

  activeItem,

  openedTabs,

  setActiveTab,

  closeTab,

  minimizePreview,

  previewWidth,

  isResizing,

  setIsResizing,
}) {

  /* =========================================
     EMPTY
  ========================================= */

  if (!activeItem) {
    return null;
  }

  /* =========================================
     TYPES
  ========================================= */

  const isPdf =
    activeItem.type === 'PDF';

  const isDocument =
    activeItem.type === 'DOCUMENT';

  const isCode =
    activeItem.type === 'CODE';

  const currentDocument =
    documents[activeItem.id];

  /* =========================================
     CODE CONTENT
  ========================================= */

  const [codeContent, setCodeContent] =
    useState('');

  const codeRows =
    useRuntimeCodeTokens(
      codeContent,
      getLanguageFromFile(activeItem),
    );

  const activeLineIndex =
    getActiveCodeLineIndex(codeRows);

useEffect(() => {

  if (
    activeItem?.type === 'CODE' &&
    activeItem.previewUrl
  ) {

    fetch(activeItem.previewUrl)

      .then((res) => res.text())

      .then((text) => {

        setCodeContent(text);

      })

      .catch((err) => {

        console.error(
          'code preview load failed',
          err,
        );

        setCodeContent(
          '// failed to load code'
        );

      });

  }

}, [activeItem]);

  return (

    <>

      {/* =========================================
         RESIZE HANDLE
      ========================================= */}

      <div
        className={`${styles.resizeHandle} ${
          isResizing
            ? styles.resizeHandleActive
            : ''
        }`}

        onMouseDown={(e) => {

          if (e.button !== 0) {
            return;
          }

          e.preventDefault();

          setIsResizing(true);

        }}

        onDoubleClick={() =>
          setIsResizing(false)
        }
      />

      {/* =========================================
         PREVIEW PANEL
      ========================================= */}

      <div
        className={styles.previewPanel}

        style={{
          width: `${previewWidth}px`,
        }}
      >

        {/* =========================================
           TABS
        ========================================= */}

        <div className={styles.tabs}>

          {
            openedTabs.map((tab) => (

              <div
                key={tab.id}

                className={`${styles.tab} ${
                  activeItem.id === tab.id
                    ? styles.activeTab
                    : ''
                }`}

                onClick={() =>
                  setActiveTab(tab)
                }
              >

                {
                  tab.image ? (

                    <img
                      src={tab.image}
                      alt=""
                      className={styles.tabImageIcon}
                    />

                  ) : (

                    tab.icon && (

                      <i
                        className={`fa-solid ${tab.icon} ${styles.tabIcon}`}
                        style={{
                          color: tab.color,
                        }}
                        aria-hidden="true"
                      />

                    )
                  )
                }

                <span className={styles.tabTitle}>
                  {tab.title}
                </span>

                <button
                  className={styles.closeButton}

                  onClick={(e) => {

                    e.stopPropagation();

                    closeTab(tab.id);

                  }}
                >
                  ×
                </button>

              </div>

            ))
          }

        </div>

        <button
          type="button"
          className={styles.previewMinimizeButton}
          onClick={() =>
            minimizePreview?.()
          }
          aria-label={`Minimize ${activeItem.title}`}
        >
          <i className="fa-solid fa-minus" />
        </button>

        {/* =========================================
           TOOLBAR
        ========================================= */}

        <div className={styles.toolbar}>

          <div className={styles.toolbarLeft}>
          </div>

          <div className={styles.toolbarRight}>
          </div>

        </div>

        {/* =========================================
           CONTENT
        ========================================= */}

        <div className={styles.previewContent}>

          {/* =========================================
             INTERNAL DOCUMENT
          ========================================= */}

          {
            isDocument &&
            currentDocument && (

              <DocumentViewer
                doc={currentDocument}
              />

            )
          }

          {/* =========================================
             CODE VIEWER
          ========================================= */}

          {
            isCode && (

              <div
                className={styles.previewCode}
                role="region"
                aria-label={`${activeItem.title} source`}
              >

                <code className={styles.previewCodeInner}>
                  {
                    codeRows.map((line, index) => (

                      <span
                        key={`${activeItem.id}-${index}`}
                        className={`${styles.previewCodeLine} ${
                          index === activeLineIndex
                            ? styles.previewCodeLineActive
                            : ''
                        }`}
                      >
                        <span className={styles.previewLineNumber}>
                          {index + 1}
                        </span>

                        <span className={styles.previewLineText}>
                          {
                            line.map((token, tokenIndex) => (

                              <span
                                key={`${activeItem.id}-${index}-${tokenIndex}`}
                                style={getTokenStyle(token)}
                              >
                                {token.content || ' '}
                              </span>

                            ))
                          }
                        </span>
                      </span>

                    ))
                  }
                </code>

              </div>

            )
          }

          {/* =========================================
             PDF VIEWER
          ========================================= */}

          {
            isPdf && (

              <iframe
                title={activeItem.title}

                src={activeItem.url}

                className={`${styles.previewIframe} ${
                  isResizing
                    ? styles.previewIframeResizing
                    : ''
                }`}
              />

            )
          }

          {/* =========================================
             HTML FILE VIEWER
          ========================================= */}

          {
            activeItem.type === 'html' &&
            activeItem.url && (

              <iframe

                title={activeItem.title}

                src={activeItem.url}

                className={`${styles.previewIframe} ${
                  isResizing
                    ? styles.previewIframeResizing
                    : ''
                }`}

                sandbox="
                  allow-same-origin
                  allow-scripts
                "
              />

            )
          }

        </div>

      </div>

    </>

  );
}
