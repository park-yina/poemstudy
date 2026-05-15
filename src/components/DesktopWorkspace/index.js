import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {createPortal} from 'react-dom';
import {
  parsedItems,
  runtimeLinks,
  weatherMap,
  getExtension
} from './variables';
import {PreviewPanel} from './preview';
import  DocumentViewer from './preview';
import Link from '@docusaurus/Link';
import Sidebar from '../DesktopWorkspace/sidebar';
import {
  runtimeConfig,
} from '../../config/runtime';
import baseStyles from './styles.module.css';
import workspaceOverlayStyles from './workspaceOverlay.module.css';

const styles = {
  ...baseStyles,
  ...workspaceOverlayStyles,
};

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

function RuntimeCmdWindow({
  item,
  onClose,
}) {

  const entries =
    item.logEntries || [];

  const [visibleCount, setVisibleCount] =
    useState(0);

  const [position, setPosition] =
    useState({
      x: 210,
      y: 116,
    });

  const streamRef =
    useRef(null);

  const dragRef =
    useRef(null);

  useEffect(() => {

    setVisibleCount(0);
    setPosition({
      x: 210,
      y: 116,
    });

    const timers =
      entries.map((entry, index) =>
        setTimeout(() => {
          setVisibleCount((count) =>
            Math.min(
              count + 1,
              entries.length,
            )
          );
        }, 900 + index * 1450)
      );

    return () => {
      timers.forEach((timer) =>
        clearTimeout(timer)
      );
    };

  }, [item.id, entries]);

  useEffect(() => {

    const stream =
      streamRef.current;

    if (!stream) {
      return;
    }

    stream.scrollTo({
      top: stream.scrollHeight,
      behavior: 'smooth',
    });

  }, [visibleCount]);

  useEffect(() => {

    const handleMove = (event) => {

      if (!dragRef.current) {
        return;
      }

      const nextX =
        event.clientX - dragRef.current.offsetX;

      const nextY =
        event.clientY - dragRef.current.offsetY;

      setPosition({
        x: Math.max(24, nextX),
        y: Math.max(78, nextY),
      });
    };

    const handleUp = () => {
      dragRef.current = null;
    };

    window.addEventListener(
      'mousemove',
      handleMove,
    );

    window.addEventListener(
      'mouseup',
      handleUp,
    );

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMove,
      );

      window.removeEventListener(
        'mouseup',
        handleUp,
      );
    };

  }, []);

  const visibleEntries =
    entries.slice(0, visibleCount);

  return (

    <section
      className={styles.runtimeCmdWindow}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      aria-label={`${item.logLabel} runtime session`}
    >

      <div
        className={styles.runtimeCmdTitlebar}
        onMouseDown={(event) => {
          dragRef.current = {
            offsetX: event.clientX - position.x,
            offsetY: event.clientY - position.y,
          };
        }}
      >

        <div className={styles.runtimeCmdControls}>
          <button
            type="button"
            className={`${styles.runtimeCmdControl} ${styles.runtimeCmdClose}`}
            onMouseDown={(event) => {
              event.stopPropagation();
              onClose();
            }}
            aria-label="Terminate runtime session"
          />

          <button
            type="button"
            className={`${styles.runtimeCmdControl} ${styles.runtimeCmdMinimize}`}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            aria-label="Minimize runtime session"
          />

          <button
            type="button"
            className={`${styles.runtimeCmdControl} ${styles.runtimeCmdExpand}`}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            aria-label="Expand runtime session"
          />
        </div>

        <span className={styles.runtimeCmdTitle}>
          {item.title} - runtime session
        </span>

      </div>

      <div
        ref={streamRef}
        className={styles.runtimeCmdStream}
      >
        <p className={styles.runtimeCmdCommand}>
          <span>{'C:\\runtime>'}</span>
          stream --source {item.logLabel} --mode live
        </p>

        {
          visibleEntries.map((entry, index) => {

            const age =
              visibleEntries.length - index;

            return (

              <p
                key={entry}
                className={styles.runtimeCmdLine}
                data-age={
                  age > 4
                    ? 'old'
                    : age > 2
                      ? 'settled'
                      : 'new'
                }
              >
                <span>
                  [{item.logLabel}]
                </span>

                {entry}
              </p>

            );
          })
        }
      </div>

    </section>

  );
}

function WorkspaceOverlayView({
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

  }, [item, initialFile]);

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
  getCodeRows(activeContent);

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
                folders.map((folder) => (

                  <div
                    key={folder.id}
                    className={styles.treeFolder}
                  >
                    <div className={styles.treeFolderName}>
                      <i className="fa-solid fa-lock" />
                      {folder.title}
                    </div>

                    {
                      folder.children?.map((file) => (

                        <button
                          key={file.id}
                          type="button"
                          className={`${styles.treeFile} ${
                            activeFile?.id === file.id
                              ? styles.treeFileActive
                              : ''
                          }`}
                          onClick={() =>
                            openFile(file)
                          }
                        >
                          <i
                            className={`fa-solid ${
                              file.type === 'MARKDOWN'
                                ? 'fa-file-lines'
                                : 'fa-file-code'
                            }`}
                          />
                          {file.title}
                        </button>

                      ))
                    }
                  </div>

                ))
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
                                className={styles.editorCodeLine}
                              >
                                <span className={styles.editorLineNumber}>
                                  {index + 1}
                                </span>

                                <span className={styles.editorLineText}>
                                  {line || ' '}
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
/* =========================
   FILE META
========================= */


export default function DesktopWorkspace({
  onBoot,
}) {
  const [previewUrl, setPreviewUrl] =
  useState(null);
const [menuState, setMenuState] =
  useState(null);

  const [openedTabs, setOpenedTabs] =
    useState([]);

  const [activeTab, setActiveTab] =
    useState(null);

  const [previewWidth, setPreviewWidth] =
    useState(1100);

  const [isResizing, setIsResizing] =
    useState(false);

  const [weather, setWeather] =
    useState('⚙ weather runtime loading...');
    const [currentFolder, setCurrentFolder] =
  useState('Desktop');

const [runtimeLink, setRuntimeLink] =
  useState(runtimeLinks[0]);

const [workspaceItem, setWorkspaceItem] =
  useState(null);

const [minimizedWorkspaceItem, setMinimizedWorkspaceItem] =
  useState(null);

const [minimizedPreviewTabs, setMinimizedPreviewTabs] =
  useState([]);

const [runtimeCmdItem, setRuntimeCmdItem] =
  useState(null);

  useEffect(() => {

  const interval = setInterval(() => {

    const random =
      runtimeLinks[
        Math.floor(
          Math.random() *
          runtimeLinks.length
        )
      ];

    setRuntimeLink(random);

  }, 5000);

  return () =>
    clearInterval(interval);

}, []);
  /* =========================
     RESIZE
  ========================= */

  useEffect(() => {

    if (isResizing) {
      document.body.style.cursor =
        'col-resize';

      document.body.style.userSelect =
        'none';
    }

    const handleMouseMove = (e) => {

      if (!isResizing) {
        return;
      }

      if (e.buttons === 0) {
        setIsResizing(false);

        return;
      }

      const newWidth =
        window.innerWidth - e.clientX;

      const clamped =
        Math.max(
          420,
          Math.min(1100, newWidth),
        );

      setPreviewWidth(clamped);
    };

    const handleResizeEnd = () => {

      setIsResizing(false);
    };

    window.addEventListener(
      'mousemove',
      handleMouseMove,
    );

    window.addEventListener(
      'mouseup',
      handleResizeEnd,
      true,
    );

    window.addEventListener(
      'blur',
      handleResizeEnd,
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
        handleResizeEnd,
        true,
      );

      window.removeEventListener(
        'blur',
        handleResizeEnd,
      );
    };

  }, [isResizing]);

  /* =========================
     WEATHER
  ========================= */

  useEffect(() => {

    const fetchWeather = async () => {

      try {

        const res = await fetch(
          'https://wttr.in/Seoul?format=j1'
        );

        const data = await res.json();

        const current =
          data.current_condition[0];

        const temp =
          current.temp_C;

        const rawDesc =
          current.weatherDesc[0].value;

        const desc =
          weatherMap[rawDesc] ||
          rawDesc;

        let icon = '☁️';

        if (desc.includes('맑')) {
          icon = '☀️';
        }

        if (desc.includes('비')) {
          icon = '🌧';
        }

        if (desc.includes('눈')) {
          icon = '❄️';
        }

        setWeather(
          `${icon} ${temp}°C · 서울 · ${desc}`
        );

      } catch {

        setWeather(
          '⚙ runtime weather offline'
        );
      }
    };

    fetchWeather();

  }, []);

  useEffect(() => {

    if (!workspaceItem) {
      return undefined;
    }

    const previousBodyOverflow =
      document.body.style.overflow;

    const previousDocumentOverflow =
      document.documentElement.style.overflow;

    document.body.style.overflow =
      'hidden';

    document.documentElement.style.overflow =
      'hidden';

    return () => {

      document.body.style.overflow =
        previousBodyOverflow;

      document.documentElement.style.overflow =
        previousDocumentOverflow;
    };

  }, [workspaceItem]);


  /* =========================
     ACTIVE ITEM
  ========================= */

  const activeItem =
    useMemo(() => {

      if (!activeTab) {
        return null;
      }

      return openedTabs.find(
        (tab) =>
          tab.id === activeTab.id,
      );

    }, [openedTabs, activeTab]);

  /* =========================
     OPEN ITEM
  ========================= */
useEffect(() => {

  const loadPreview =
    async () => {

      if (!activeItem) {

        setPreviewUrl(null);

        return;
      }

      if (
        activeItem.launch?.type !==
        'secure'
      ) {

        setPreviewUrl(null);

        return;
      }

      try {

        const res =
          await fetch(

            `${runtimeConfig.runtimeApi}?file=${activeItem.launch.file}`
          );

        const data =
          await res.json();

        setPreviewUrl(
          data.url
        );

      } catch {

        setPreviewUrl(null);
      }
    };

  loadPreview();

}, [activeItem]);
const openItem = (item) => {

  if (
    item.workspace ||
    item.type === 'FOLDER' ||
    item.type === 'LOG'
  ) {
    return;
  }

  const exists =
    openedTabs.some(
      (tab) =>
        tab.id === item.id,
    );

  if (!exists) {

    setOpenedTabs([
      ...openedTabs,
      item,
    ]);
  }

  setActiveTab(item);

  setMinimizedPreviewTabs((prev) =>
    prev.filter((tab) =>
      tab.id !== item.id
    )
  );
};

  /* =========================
     DOUBLE CLICK
  ========================= */

const handleLaunch =
  async (item) => {

   if (
     item.type === 'LOG'
   ) {

      setRuntimeCmdItem(item);

      return;
    }

   if (
  item.workspace
) {

      setMinimizedWorkspaceItem(null);

      setWorkspaceItem(item);

      return;
    }

    const launch =
      item.launch;

    if (!launch) {
      return;
    }

    switch (launch.type) {

      case 'secure': {

        const res =
          await fetch(

            `${runtimeConfig.runtimeApi}?file=${launch.file}`
          );

        const data =
          await res.json();

        window.open(
          data.url,
          '_blank'
        );

        break;
      }

      case 'github':

        window.open(
          launch.url,
          '_blank'
        );

        break;

      case 'download':

        window.open(
          launch.url,
          '_blank'
        );

        break;

      default:
        break;
    }
  };
const handleDownload =
  async (item) => {

    const launch =
      item.launch;

    if (!launch) {
      return;
    }

    if (
      launch.type !== 'secure'
    ) {
      return;
    }

    try {

      const res =
        await fetch(

          `${runtimeConfig.runtimeApi}?file=${launch.file}`
        );

      const data =
        await res.json();

      const fileResponse =
        await fetch(data.url);

      const blob =
        await fileResponse.blob();

      const blobUrl =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href =
        blobUrl;

      link.download =
        item.title;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        blobUrl
      );

    } catch (e) {

      console.error(
        'download failed',
        e
      );
    }
};
const handleContextMenu = (
  e,
  item,
) => {

  e.preventDefault();

  e.stopPropagation();

  const rect =
    e.currentTarget
      .closest(`.${styles.desktopArea}`)
      .getBoundingClientRect();

  setMenuState({

    x:
      e.clientX -
      rect.left,

    y:
      e.clientY -
      rect.top,

    item,
  });
};

const ProjectWorkspaceOverlay = ({
  item,
  onClose,
}) => {
const folders =
  item.workspace?.folders || [];

  const firstFolder =
    folders[0];

  const files =
    firstFolder?.children || [];

  const [openedFiles, setOpenedFiles] =
    useState(
      files[1]
        ? [files[1]]
        : files[0]
          ? [files[0]]
          : []
    );

  const [activeFile, setActiveFile] =
    useState(files[1] || files[0] || null);

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

      const nextFiles =
        prev.filter(
          (file) =>
            file.id !== fileId
        );

      if (activeFile?.id === fileId) {
        setActiveFile(
          nextFiles[nextFiles.length - 1] ||
          null
        );
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

  return (

    <div
      className={styles.workspaceOverlay}
      onClick={onClose}
    >

      <div
        className={styles.workspaceExplorer}
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

          <span className={`${styles.workspaceWindowDot} ${styles.workspaceWindowMinimize}`} />

          <span className={`${styles.workspaceWindowDot} ${styles.workspaceWindowExpand}`} />
        </div>

        <aside className={styles.workspaceGuide}>
          <div className={styles.workspaceBadge}>
            Curated Workspace
          </div>

          <h2>
            {item.title}
          </h2>

          <p>
            핵심 기능과 아키텍처 단위로 정리한 프로젝트 워크스페이스입니다.
          </p>

          <div className={styles.workspaceChips}>
            <span>security</span>
            <span>code + docs</span>
            <span>runtime note</span>
          </div>
        </aside>

        <section className={styles.workspaceMain}>

          <div className={styles.workspaceTree}>
            <div className={styles.treeTitle}>
              WORKSPACE
            </div>

            <div className={styles.treeRoot}>
              {item.title}
            </div>

            {
              folders.map((folder) => (

                <div
                  key={folder.id}
                  className={styles.treeFolder}
                >
                  <div className={styles.treeFolderName}>
                    <i className="fa-solid fa-lock" />
                    {folder.title}
                  </div>

                  {
                    folder.children?.map((file) => (

                      <button
                        key={file.id}
                        type="button"
                        className={`${styles.treeFile} ${
                          activeFile?.id === file.id
                            ? styles.treeFileActive
                            : ''
                        }`}
                        onClick={() =>
                          openFile(file)
                        }
                      >
                        <i
                          className={`fa-solid ${
                            file.type === 'MARKDOWN'
                              ? 'fa-file-lines'
                              : 'fa-file-code'
                          }`}
                        />
                        {file.title}
                      </button>

                    ))
                  }
                </div>

              ))
            }
          </div>

          <article className={styles.workspaceEditor}>
            <div className={styles.editorTabs}>
              <span className={styles.editorGuideTab}>
                README.md
              </span>

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

            <div className={styles.editorHeader}>
              <h3>
                {activeFile?.title}
              </h3>

              <p>
                {activeFile?.description}
              </p>
            </div>

            <pre className={styles.editorCode}>
              <code>
                {activeFile?.preview?.trim()}
              </code>
            </pre>

            <div className={styles.editorPath}>
              위치: src/main/java/com/parkyina/fakejumping/security/{activeFile?.title}
            </div>
          </article>

          <aside className={styles.workspaceRelated}>
            <button
              type="button"
              className={styles.workspaceClose}
              onClick={onClose}
              aria-label="Close workspace"
            >
              ×
            </button>

            <h3>
              관련 문서
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
              관련 코드
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

  );
};

  /* =========================
     CLOSE TAB
  ========================= */

const closeTab = (
  tabId,
  options = {},
) => {

  const filtered =
    openedTabs.filter(
      (tab) =>
        tab.id !== tabId,
    );

  setOpenedTabs(filtered);

  if (options.removeMinimized !== false) {

    setMinimizedPreviewTabs((prev) =>
      prev.filter((tab) =>
        tab.id !== tabId
      )
    );
  }

  if (
    activeTab &&
    activeTab.id === tabId
  ) {

    setActiveTab(
      filtered[0] || null,
    );
  }
};

const minimizePreview = () => {

  if (!activeItem) {
    return;
  }

  setMinimizedPreviewTabs((prev) => {

    const exists =
      prev.some((tab) =>
        tab.id === activeItem.id
      );

    if (exists) {
      return prev;
    }

    return [
      ...prev,
      activeItem,
    ];
  });

  closeTab(
    activeItem.id,
    {
      removeMinimized: false,
    },
  );
};

const restorePreview = (item) => {

  setMinimizedPreviewTabs((prev) =>
    prev.filter((tab) =>
      tab.id !== item.id
    )
  );

  setOpenedTabs((prev) => {

    const exists =
      prev.some((tab) =>
        tab.id === item.id
      );

    if (exists) {
      return prev;
    }

    return [
      ...prev,
      item,
    ];
  });

  setActiveTab(item);
};

if (workspaceItem) {

  if (typeof document === 'undefined') {
    return null;
  }

  return (

    createPortal(
      <WorkspaceOverlayView
        item={workspaceItem}
        onClose={() => {

          setWorkspaceItem(null);
          setMinimizedWorkspaceItem(null);
        }}
        onMinimize={() => {

          setMinimizedWorkspaceItem(workspaceItem);
          setWorkspaceItem(null);
        }}
      />,
      document.body,
    )

  );
}

  /* =========================
     RENDER
  ========================= */

return (

  <div
    className={styles.workspaceWindow}

    onClick={() =>
      setMenuState(null)
    }

    onContextMenu={(e) =>
      e.preventDefault()
    }
  >
  

      {/* HEADER */}

      <div className={styles.workspaceHeader}>

        {
          !activeItem && (

        <div className={styles.windowButtons}>

          <span
            className={styles.red}
            onClick={onBoot}
          ></span>

          <span className={styles.yellow}></span>

          <span className={styles.green}></span>

        </div>

          )
        }

        <span className={styles.workspaceTitle}>
          developer-workspace
        </span>

      </div>

      {/* BODY */}

      <div className={styles.workspaceBody}>

        {/* SIDEBAR */}

<Sidebar
  currentFolder={currentFolder}
  setCurrentFolder={setCurrentFolder}
/>

        {/* DESKTOP */}

<div className={styles.desktopArea}>

{
  runtimeCmdItem && (
    <div
      className={styles.runtimeCmdBackdrop}
      aria-hidden="true"
    />
  )
}

  <div className={styles.desktopGrid}>

{
  parsedItems.filter((item) => {

      switch (currentFolder) {

        case 'Projects':
          return item.location === 'Projects';

        case 'Runtime':
          return item.location === 'Runtime';

        case 'Archive':
          return item.location === 'Archive';

        case 'Documents':
          return item.location === 'Documents';

        case 'Desktop':
        default:
          return !(
            item.location === 'Projects' &&
            (
              item.workspace ||
              item.type === 'FOLDER'
            )
          );
      }
    })

    .map((item) => (

<div
  key={item.id}

  className={`
    ${styles.desktopIcon}

    ${
      activeItem &&
      activeItem.id === item.id
        ? styles.active
        : runtimeCmdItem &&
          runtimeCmdItem.id === item.id
        ? styles.active
        : ''
    }

    ${
      item.shortcut
        ? styles.shortcutItem
        : ''
    }
  `}

  /* =========================
     SINGLE CLICK
  ========================= */

  onClick={(e) => {

    e.stopPropagation();

    openItem(item);
  }}

  /* =========================
     DOUBLE CLICK
  ========================= */

  onDoubleClick={(e) => {

    e.stopPropagation();

    handleLaunch(item);
  }}

  /* =========================
     CONTEXT MENU
  ========================= */

  onContextMenu={(e) =>
    handleContextMenu(
      e,
      item
    )
  }
>

  {/* =========================
     ICON
  ========================= */}

  <div
    className={
      styles.fileIconWrapper
    }
  >

    {/* main icon */}

    {
      item.image ? (

        <img
          src={item.image}
          alt={item.title}
          className={
            styles.customFileImage
          }
        />

      ) : (

        <i
          className={`
            fa-solid
            ${item.icon}
            ${styles.mainFileIcon}
          `}
          style={{
            color: item.color,
          }}
        ></i>

      )
    }

  </div>

  {/* =========================
     FILE NAME
  ========================= */}

  <span
    className={
      styles.desktopLabel
    }
  >
    {item.title}
  </span>

</div>

    ))
}
  </div>

  {

    menuState && (

      <div
        className={styles.contextMenu}

        style={{

          top: menuState.y,

          left: menuState.x,
        }}

        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <button
          className={styles.contextMenuItem}

          onClick={() => {

            handleLaunch(
              menuState.item
            );

            setMenuState(null);
          }}
        >
          open
        </button>

        <button
          className={styles.contextMenuItem}

          onClick={() => {

            handleDownload(
  menuState.item
)

            setMenuState(null);
          }}
        >
          download
        </button>
        <button
          className={styles.contextMenuItem}

          onClick={() => {

            handleLaunch(
              menuState.item
            );

            setMenuState(null);
          }}
        >
         properties(속성)
        </button>
      </div>

    )
  }

</div>
{/* PREVIEW */}

{

<PreviewPanel
  activeItem={activeItem}
  openedTabs={openedTabs}
  setActiveTab={setActiveTab}
  closeTab={closeTab}
  minimizePreview={minimizePreview}
  previewWidth={previewWidth}
  isResizing={isResizing}
  setIsResizing={setIsResizing}
/>
}

{
  runtimeCmdItem && (

    <RuntimeCmdWindow
      item={runtimeCmdItem}
      onClose={() =>
        setRuntimeCmdItem(null)
      }
    />

  )
}

      </div>

      {/* TASKBAR */}

      <div className={styles.taskbar}>

        {/* LEFT */}

        <div className={styles.taskbarLeft}>

          <button
            className={styles.runtimeButton}

            onClick={onBoot}
          >
            {'>_'}
          </button>

          <div className={styles.weatherBlock}>

            <div className={styles.weatherText}>
              {weather}
            </div>

            <div className={styles.runtimeTicker}>
<a
  href={runtimeLink.href}

  target="_blank"

  rel="noreferrer"

  className={styles.runtimeTicker}
>
  {runtimeLink.label}
</a>            </div>

          </div>

        </div>

        {/* CENTER */}

        <div className={styles.taskbarApps}>

          <button className={styles.taskbarIcon}>
            <i className="fa-solid fa-folder"></i>
          </button>

          {
            minimizedWorkspaceItem && (

              <button
                type="button"
                className={`${styles.taskbarIcon} ${styles.taskbarIconActive}`}
                onClick={() => {

                  setWorkspaceItem(minimizedWorkspaceItem);
                  setMinimizedWorkspaceItem(null);
                }}
                title={minimizedWorkspaceItem.title}
                aria-label={`Restore ${minimizedWorkspaceItem.title}`}
              >
                <i className="fa-solid fa-code"></i>
              </button>

            )
          }

          {
            minimizedPreviewTabs.map((item) => (

              <button
                key={item.id}
                type="button"
                className={`${styles.taskbarIcon} ${styles.taskbarIconActive}`}
                onClick={() =>
                  restorePreview(item)
                }
                title={item.title}
                aria-label={`Restore ${item.title}`}
              >
                <i
                  className={`fa-solid ${
                    item.type === 'PDF'
                      ? 'fa-file-pdf'
                      : item.type === 'html'
                        ? 'fa-code'
                        : 'fa-file-lines'
                  }`}
                ></i>
              </button>

            ))
          }

          <a
            href="https://github.com/park-yina"

            target="_blank"

            rel="noreferrer"

            className={styles.taskbarIcon}
          >
            <i className="fa-brands fa-github"></i>
          </a>

          <a
            href="mailto:kln99988@gmail.com"

            className={styles.taskbarIcon}
          >
            <i className="fa-solid fa-envelope"></i>
          </a>

        </div>

        {/* RIGHT */}

        <div className={styles.taskbarRight}>

          <span>
            MEM 68%
          </span>

          <span>
            AWS ONLINE
          </span>

          <span>
            {
              new Date().toLocaleTimeString(
                'ko-KR',
                {
                  hour: '2-digit',
                  minute: '2-digit',
                },
              )
            }
          </span>

        </div>

      </div>

    </div>

  );
}
