import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  getActiveCodeLineIndex,
  getLanguageFromFile,
  getTokenStyle,
  useRuntimeCodeTokens,
} from './codeHighlight';
import baseStyles from './styles.module.css';
import workspaceOverlayStyles from './workspaceOverlay.module.css';

const styles = {
  ...baseStyles,
  ...workspaceOverlayStyles,
};

const codeFileIconMap = {
  css: 'fa-brands fa-css3-alt',
  html: 'fa-brands fa-html5',
  java: 'fa-solid fa-mug-hot',
  js: 'fa-brands fa-js',
  jsx: 'fa-brands fa-react',
  md: 'fa-brands fa-markdown',
  py: 'fa-brands fa-python',
  sql: 'fa-solid fa-database',
  ts: 'fa-solid fa-file-code',
  tsx: 'fa-brands fa-react',
  xml: 'fa-solid fa-file-code',
  yaml: 'fa-solid fa-sitemap',
  yml: 'fa-solid fa-sitemap',
};

function getWorkspaceFileExtension(
  file,
) {

  const source =
    file?.path ||
    file?.title ||
    '';

  const match =
    source.match(/\.([a-z0-9]+)$/i);

  return match
    ? match[1].toLowerCase()
    : '';
}

function getWorkspaceFileIconClass(
  file,
) {

  if (file?.type === 'MARKDOWN') {
    return 'fa-brands fa-markdown';
  }

  if (file?.type !== 'CODE') {
    return 'fa-solid fa-file-lines';
  }

  const extension =
    getWorkspaceFileExtension(file);

  return (
    codeFileIconMap[extension] ||
    'fa-solid fa-file-code'
  );
}

function getWorkspaceInitialFiles(
  folders,
) {

  const firstFolder =
    folders[0];

  const files =
    firstFolder?.children || [];

  const initialFile =
    files[1] || files[0] || null;

  return {
    files,
    initialFile,
  };
}

function getCodeRows(content) {
  const normalized = (content || '').replace(/\r\n/g, '\n');
  // 끝의 단일 개행만 제거 (빈 마지막 줄 방지)
  const trimmed = normalized.endsWith('\n')
    ? normalized.slice(0, -1)
    : normalized;
  return trimmed.split('\n');
}
function clampPaneWidth(
  value,
  min,
  max,
) {

  return Math.max(
    min,
    Math.min(
      max,
      value,
    ),
  );
}


export function WorkspaceOverlayView({
  item,
  onClose,
  onMinimize,
}) {

  const [isMaximized, setIsMaximized] =
    useState(false);

  const folders =
    item.workspace?.folders || [];

  const {
    files,
    initialFile,
  } = getWorkspaceInitialFiles(folders);

  const [openedFiles, setOpenedFiles] =
    useState(
      initialFile
        ? [initialFile]
        : []
    );

  const [activeFile, setActiveFile] =
    useState(initialFile);

  const [collapsedFolders, setCollapsedFolders] =
    useState({});

  const [visitedFiles, setVisitedFiles] =
    useState(() => (
      initialFile
        ? {[initialFile.id]: true}
        : {}
    ));

  const [fileContentMap, setFileContentMap] =
    useState({});

  const [treePaneWidth, setTreePaneWidth] =
    useState(176);

  const [relatedPaneWidth, setRelatedPaneWidth] =
    useState(168);

  const [resizingPane, setResizingPane] =
    useState(null);

  const [bottomPanelHeight, setBottomPanelHeight] =
    useState(58);

  const [bottomPanelTab, setBottomPanelTab] =
    useState('runtime');

  const workspaceMainRef =
    useRef(null);

  useEffect(() => {

    setOpenedFiles(
      initialFile
        ? [initialFile]
        : []
    );

    setActiveFile(initialFile);

    setFileContentMap({});

    setCollapsedFolders({});

    setVisitedFiles(
      initialFile
        ? {[initialFile.id]: true}
        : {}
    );

  }, [item, initialFile]);

  const toggleFolder = (folderId) => {

    setCollapsedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const openFolderFile = (
    folderId,
    file,
  ) => {

    setVisitedFiles((prev) => ({
      ...prev,
      [file.id]: true,
    }));

    openFile(file);
  };

  useEffect(() => {

    if (!activeFile) {
      return;
    }

    if (activeFile.preview) {

      setFileContentMap((prev) => ({
        ...prev,
        [activeFile.id]: activeFile.preview,
      }));

      return;
    }

    if (!activeFile.previewUrl) {
      return;
    }

    let cancelled =
      false;

    setFileContentMap((prev) => ({
      ...prev,
      [activeFile.id]:
        prev[activeFile.id] ||
        '// loading source from static/code...',
    }));

    fetch(activeFile.previewUrl)
      .then((res) => {

        if (!res.ok) {
          throw new Error(
            `Failed to load ${activeFile.previewUrl}`
          );
        }

        return res.text();
      })
      .then((text) => {

        if (cancelled) {
          return;
        }

        setFileContentMap((prev) => ({
          ...prev,
          [activeFile.id]: text,
        }));
      })
      .catch(() => {

        if (cancelled) {
          return;
        }

        setFileContentMap((prev) => ({
          ...prev,
          [activeFile.id]:
            '// failed to load source file',
        }));
      });

    return () => {

      cancelled =
        true;
    };

  }, [activeFile]);

  useEffect(() => {

    if (
      resizingPane !== 'tree' &&
      resizingPane !== 'related'
    ) {
      return undefined;
    }

    document.body.style.cursor =
      'col-resize';

    document.body.style.userSelect =
      'none';

    const handleMouseMove = (e) => {

      const workspaceMain =
        workspaceMainRef.current;

      if (!workspaceMain) {
        return;
      }

      const rect =
        workspaceMain.getBoundingClientRect();

      if (resizingPane === 'tree') {

        setTreePaneWidth(
          clampPaneWidth(
            e.clientX - rect.left,
            140,
            260,
          )
        );

        return;
      }

      setRelatedPaneWidth(
        clampPaneWidth(
          rect.right - e.clientX,
          132,
          240,
        )
      );
    };

    const stopResize = () => {

      setResizingPane(null);
    };

    window.addEventListener(
      'mousemove',
      handleMouseMove,
    );

    window.addEventListener(
      'mouseup',
      stopResize,
      true,
    );

    window.addEventListener(
      'blur',
      stopResize,
    );

    return () => {

      document.body.style.cursor =
        '';

      document.body.style.userSelect =
        '';

      window.removeEventListener(
        'mousemove',
        handleMouseMove,
      );

      window.removeEventListener(
        'mouseup',
        stopResize,
        true,
      );

      window.removeEventListener(
        'blur',
        stopResize,
      );
    };

  }, [resizingPane]);

  useEffect(() => {

    if (resizingPane !== 'bottom') {
      return undefined;
    }

    document.body.style.cursor =
      'row-resize';

    document.body.style.userSelect =
      'none';

    const handleMouseMove = (e) => {

      const workspaceMain =
        workspaceMainRef.current;

      if (!workspaceMain) {
        return;
      }

      const rect =
        workspaceMain.getBoundingClientRect();

      setBottomPanelHeight(
        clampPaneWidth(
          rect.bottom - e.clientY,
          58,
          Math.min(280, rect.height * 0.45),
        )
      );
    };

    const stopResize = () => {

      setResizingPane(null);
    };

    window.addEventListener(
      'mousemove',
      handleMouseMove,
    );

    window.addEventListener(
      'mouseup',
      stopResize,
      true,
    );

    window.addEventListener(
      'blur',
      stopResize,
    );

    return () => {

      document.body.style.cursor =
        '';

      document.body.style.userSelect =
        '';

      window.removeEventListener(
        'mousemove',
        handleMouseMove,
      );

      window.removeEventListener(
        'mouseup',
        stopResize,
        true,
      );

      window.removeEventListener(
        'blur',
        stopResize,
      );
    };

  }, [resizingPane]);

  const openFile = (file) => {

    setOpenedFiles((prev) => {

      const exists =
        prev.some(
          (openedFile) =>
            openedFile.id === file.id
        );

      if (exists) {
        return prev;
      }

      return [
        ...prev,
        file,
      ];
    });

    setActiveFile(file);
  };

  const closeFile = (fileId) => {

    setOpenedFiles((prev) => {

      const closingIndex =
        prev.findIndex(
          (file) =>
            file.id === fileId
        );

      const nextFiles =
        prev.filter(
          (file) =>
            file.id !== fileId
        );

      if (activeFile?.id === fileId) {

        const nextActive =
          nextFiles[
            Math.max(
              0,
              closingIndex - 1
            )
          ] || nextFiles[0] || null;

        setActiveFile(nextActive);
      }

      return nextFiles;
    });
  };

  const relatedDocs =
    files.filter((file) =>
      file.type === 'MARKDOWN'
    );

  const relatedCode =
    files.filter((file) =>
      file.type === 'CODE' &&
      file.id !== activeFile?.id
    );

  const activeContent =
    activeFile
      ? fileContentMap[activeFile.id] ||
        activeFile.preview ||
        ''
      : '';

  const activeRows =
    useRuntimeCodeTokens(
      activeContent,
      getLanguageFromFile(activeFile),
    );

  const activeLineIndex =
    getActiveCodeLineIndex(activeRows);

  return (

    <div
      className={styles.workspaceOverlay}
      onClick={onClose}
    >

      <div
        className={`${styles.workspaceExplorer} ${
          isMaximized
            ? styles.workspaceExplorerMaximized
            : ''
        }`}
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className={styles.workspaceWindowBar}>
          <button
            type="button"
            className={`${styles.workspaceWindowDot} ${styles.workspaceWindowClose}`}
            onClick={onClose}
            aria-label="Close workspace"
          />

          <button
            type="button"
            className={`${styles.workspaceWindowDot} ${styles.workspaceWindowMinimize}`}
            onClick={onMinimize}
            aria-label="Minimize workspace"
          />

          <button
            type="button"
            className={`${styles.workspaceWindowDot} ${styles.workspaceWindowExpand}`}
            onClick={() =>
              setIsMaximized((current) =>
                !current
              )
            }
            aria-label={
              isMaximized
                ? 'Restore workspace'
                : 'Maximize workspace'
            }
          />
        </div>

        <div className={styles.workspaceContent}>
          <aside className={styles.workspaceGuide}>
            <div className={styles.workspaceBadge}>
              DEV
            </div>

            <h2>
              {item.title}
            </h2>

            <p>
              Core files and notes are grouped into a compact project workspace.
            </p>

            <div className={styles.workspaceChips}>
              <span>security</span>
              <span>code + docs</span>
              <span>runtime note</span>
            </div>
          </aside>

          <section
            ref={workspaceMainRef}
            className={`${styles.workspaceMain} ${
              resizingPane === 'tree' ||
              resizingPane === 'related'
                ? styles.workspaceMainResizing
                : ''
            }`}
            style={{
              '--tree-pane-width':
                `${treePaneWidth}px`,
              '--related-pane-width':
                `${relatedPaneWidth}px`,
              '--bottom-panel-height':
                `${bottomPanelHeight}px`,
            }}
          >
            <div className={styles.workspaceTree}>
              <div className={styles.treeTitle}>
                WORKSPACE
              </div>

              <div className={styles.treeRoot}>
                {item.title}
              </div>

              {
                folders.map((folder) => {

                  const isCollapsed =
                    Boolean(
                      collapsedFolders[folder.id]
                    );

                  const folderChildren =
                    folder.children || [];

                  const isVisited =
                    folderChildren.length > 0 &&
                    folderChildren.every((file) =>
                      Boolean(
                        visitedFiles[file.id]
                      )
                    );

                  return (

                  <div
                    key={folder.id}
                    className={styles.treeFolder}
                  >
                    <button
                      type="button"
                      className={`${styles.treeFolderName} ${
                        isVisited
                          ? styles.treeFolderNameVisited
                          : ''
                      }`}
                      onClick={() =>
                        toggleFolder(folder.id)
                      }
                      aria-expanded={!isCollapsed}
                    >
                      <span className={styles.treeFolderLabel}>
                        <i
                          className={`fa-solid ${
                            isCollapsed
                              ? 'fa-folder'
                              : 'fa-folder-open'
                          }`}
                        />
                        {folder.title}
                      </span>

                      <i
                        className={`fa-solid ${
                          isCollapsed
                            ? 'fa-chevron-down'
                            : 'fa-chevron-up'
                        } ${styles.treeFolderToggle}`}
                        aria-hidden="true"
                      />
                    </button>

                    {
                      !isCollapsed &&
                      folderChildren.map((file) => {

                        const isFileVisited =
                          Boolean(
                            visitedFiles[file.id]
                          );

                        return (

                        <button
                          key={file.id}
                          type="button"
                          className={`${styles.treeFile} ${
                            activeFile?.id === file.id
                              ? styles.treeFileActive
                              : ''
                          } ${
                            isFileVisited
                              ? styles.treeFileVisited
                              : ''
                          }`}
                          onClick={() =>
                            openFolderFile(
                              folder.id,
                              file,
                            )
                          }
                        >
                          <i
                            className={getWorkspaceFileIconClass(file)}
                          />
                          {file.title}
                        </button>

                        );
                      })
                    }
                  </div>

                  );
                })
              }
            </div>

            <div
              role="separator"
              aria-label="Resize file explorer"
              aria-orientation="vertical"
              className={`${styles.workspacePaneHandle} ${
                resizingPane === 'tree'
                  ? styles.workspacePaneHandleActive
                  : ''
              }`}
              onMouseDown={(e) => {

                e.preventDefault();

                setResizingPane('tree');
              }}
            />

            <article className={styles.workspaceEditor}>
              <div className={styles.editorTabs}>
                {
                  openedFiles.map((file) => (

                    <div
                      key={file.id}
                      className={`${styles.editorTab} ${
                        activeFile?.id === file.id
                          ? styles.editorTabActive
                          : ''
                      }`}
                    >
                      <button
                        type="button"
                        className={styles.editorTabButton}
                        onClick={() =>
                          setActiveFile(file)
                        }
                      >
                        {file.title}
                      </button>

                      <button
                        type="button"
                        className={styles.editorTabClose}
                        onClick={() =>
                          closeFile(file.id)
                        }
                        aria-label={`Close ${file.title}`}
                      >
                        x
                      </button>
                    </div>

                  ))
                }
              </div>

              {
                activeFile ? (

                  <>
                    <div className={styles.editorCodeFrame}>
                      <div
                        className={styles.editorCode}
                        role="region"
                        aria-label={`${activeFile.title} source`}
                      >
                        <code className={styles.editorCodeInner}>
                          {
                            activeRows.map((line, index) => (

                              <span
                                key={`${activeFile.id}-${index}`}
                                className={`${styles.editorCodeLine} ${
                                  index === activeLineIndex
                                    ? styles.editorCodeLineActive
                                    : ''
                                }`}
                              >
                                <span className={styles.editorLineNumber}>
                                  {index + 1}
                                </span>

                                <span className={styles.editorLineText}>
                                  {
                                    line.map((token, tokenIndex) => (

                                      <span
                                        key={`${activeFile.id}-${index}-${tokenIndex}`}
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
                    </div>

                    <div className={styles.editorPath}>
                      Path: {activeFile.path || `src/main/java/com/parkyina/fakejumping/security/${activeFile.title}`}
                    </div>

                    <div
                      role="separator"
                      aria-label="Resize runtime panel"
                      aria-orientation="horizontal"
                      className={`${styles.bottomPanelResizeHandle} ${
                        resizingPane === 'bottom'
                          ? styles.bottomPanelResizeHandleActive
                          : ''
                      }`}
                      onMouseDown={(e) => {

                        e.preventDefault();

                        setResizingPane('bottom');
                      }}
                    />

                    <div className={styles.workspaceBottomPanel}>
                      <div className={styles.bottomPanelTabs}>
                        <button
                          type="button"
                          className={
                            bottomPanelTab === 'runtime'
                              ? styles.bottomPanelTabActive
                              : ''
                          }
                          onClick={() =>
                            setBottomPanelTab('runtime')
                          }
                        >
                          SECURITY RUNTIME
                        </button>
                        <button
                          type="button"
                          className={
                            bottomPanelTab === 'output'
                              ? styles.bottomPanelTabActive
                              : ''
                          }
                          onClick={() =>
                            setBottomPanelTab('output')
                          }
                        >
                          OUTPUT
                        </button>
                        <button
                          type="button"
                          className={
                            bottomPanelTab === 'problems'
                              ? styles.bottomPanelTabActive
                              : ''
                          }
                          onClick={() =>
                            setBottomPanelTab('problems')
                          }
                        >
                          PROBLEMS
                        </button>
                      </div>

                      <div className={styles.bottomPanelBody}>
                        {
                          bottomPanelTab === 'runtime' && (
                            <>
                              <div className={styles.portRow}>
                                <span className={styles.runtimeSignal}>
                                  ACTIVE
                                </span>
                                <span>JWT FILTER ACTIVE</span>
                                <span>access-token chain</span>
                                <span className={styles.portStatus}>online</span>
                              </div>

                              <div className={styles.portRow}>
                                <span className={styles.runtimeSignal}>
                                  SYNC
                                </span>
                                <span>REFRESH ROTATION ENABLED</span>
                                <span>mysql session store</span>
                                <span className={styles.portStatus}>connected</span>
                              </div>

                              <div className={styles.portRow}>
                                <span className={styles.runtimeSignal}>
                                  TRACE
                                </span>
                                <span>SPRING SECURITY ONLINE</span>
                                <span>AuthService.signIn</span>
                                <span className={styles.portStatus}>200ms</span>
                              </div>
                            </>
                          )
                        }

                        {
                          bottomPanelTab === 'output' && (
                            <>
                              <div className={styles.portRow}>
                                <span className={styles.runtimeSignal}>INFO</span>
                                <span>SecurityContext initialized</span>
                                <span>JwtAuthenticationFilter</span>
                                <span className={styles.portStatus}>ok</span>
                              </div>
                              <div className={styles.portRow}>
                                <span className={styles.runtimeSignal}>SQL</span>
                                <span>refresh_tokens upsert completed</span>
                                <span>TokenMapper</span>
                                <span className={styles.portStatus}>1 row</span>
                              </div>
                            </>
                          )
                        }

                        {
                          bottomPanelTab === 'problems' && (
                            <div className={styles.portRow}>
                              <span className={styles.runtimeSignal}>0</span>
                              <span>No security runtime problems detected</span>
                              <span>workspace</span>
                              <span className={styles.portStatus}>clean</span>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </>

                ) : (

                  <div className={styles.editorEmpty}>
                    Select a file from the tree to open it.
                  </div>

                )
              }
            </article>

            <div
              role="separator"
              aria-label="Resize related panel"
              aria-orientation="vertical"
              className={`${styles.workspacePaneHandle} ${
                resizingPane === 'related'
                  ? styles.workspacePaneHandleActive
                  : ''
              }`}
              onMouseDown={(e) => {

                e.preventDefault();

                setResizingPane('related');
              }}
            />

            <aside className={styles.workspaceRelated}>
              <h3>
                Related Docs
              </h3>

              {
                relatedDocs.map((file) => (

                  <button
                    key={file.id}
                    type="button"
                    className={styles.relatedItem}
                    onClick={() =>
                      openFile(file)
                    }
                  >
                    <strong>
                      {file.title}
                    </strong>
                    <span>
                      {file.description}
                    </span>
                  </button>

                ))
              }

              <h3>
                Related Code
              </h3>

              {
                relatedCode.map((file) => (

                  <button
                    key={file.id}
                    type="button"
                    className={styles.relatedItem}
                    onClick={() =>
                      openFile(file)
                    }
                  >
                    <strong>
                      {file.title}
                    </strong>
                    <span>
                      {file.description}
                    </span>
                  </button>

                ))
              }
            </aside>
          </section>
        </div>

      </div>

    </div>

  );
}
