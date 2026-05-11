import React from 'react';

import styles from './styles.module.css';
import { documents }
from '../../data/documents';

/* =========================================
   DOCUMENT VIEWER
========================================= */

export  function DocumentViewer({
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


export  function PreviewPanel({

  activeItem,

  openedTabs,

  setActiveTab,

  closeTab,

  previewWidth,

  setIsResizing,
}) {

  /* =========================================
     EMPTY
  ========================================= */

if (
  !activeItem ||
  activeItem.type === 'PDF'
) {
  return null;
}

  /* =========================================
     TYPES
  ========================================= */

  const isPdf =
    activeItem.type === 'PDF';

  const isExternalHtml =
    activeItem.type === 'HTML_FILE';

  const isDocument =
    activeItem.type === 'DOCUMENT';

  const currentDocument =
    documents[activeItem.id];

  return (

    <>

      {/* =========================================
         RESIZE HANDLE
      ========================================= *

      <div
        className={styles.resizeHandle}

        onMouseDown={() =>
          setIsResizing(true)
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
              >

                {/* tab button */}

                <button
                  className={styles.tabButton}

                  onClick={() =>
  setActiveTab(tab)
}
                >

                  {
                    tab.icon && (

                      <span
                        className={styles.tabIcon}
                      >
                        {tab.icon}
                      </span>

                    )
                  }

                  {tab.title}

                </button>

                {/* close */}

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

        {/* =========================================
           TOOLBAR
        ========================================= */}

        <div className={styles.toolbar}>

          <div className={styles.toolbarLeft}>

            <span>
              Runtime Preview
            </span>

          </div>

          <div className={styles.toolbarRight}>

            <span>
              {activeItem.type}
            </span>

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
            isDocument && currentDocument && (

              <DocumentViewer
                doc={currentDocument}
              />

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

                className={styles.previewIframe}
              />

            )
          }

          {/* =========================================
             HTML FILE VIEWER
          ========================================= */}

          {
            isExternalHtml && (

              <iframe

                title={activeItem.title}

                src={activeItem.url}

                className={styles.previewIframe}

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