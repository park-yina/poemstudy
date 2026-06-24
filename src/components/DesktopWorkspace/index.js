import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {createPortal} from 'react-dom';
import {useHistory} from '@docusaurus/router';
import {
  parsedItems,
  runtimeLinks,
  weatherMap,
} from './variables';
import {PreviewPanel} from './preview';
import Sidebar from '../DesktopWorkspace/sidebar';
import {
  runtimeConfig,
} from '../../config/runtime';
import {
  WorkspaceOverlayView,
} from './codeRuntime';
import {
  ArchiveRuntimeApplication,
  WorkspacePackageView,
} from './docsRuntime';
import baseStyles from './styles.module.css';
import workspaceOverlayStyles from './workspaceOverlay.module.css';

const styles = {
  ...baseStyles,
  ...workspaceOverlayStyles,
};

const PREVIEW_MIN_WIDTH =
  420;

const PREVIEW_MOBILE_MIN_WIDTH =
  320;

const PREVIEW_MAX_WIDTH =
  1100;

const WORKSPACE_SIDEBAR_WIDTH =
  120;

const PREVIEW_RESIZE_HANDLE_WIDTH =
  12;

const DESKTOP_MIN_WIDTH =
  360;

const AWS_STATUS_REGION =
  'us-east-1';

const AWS_STATUS_RSS_URL =
  'https://status.aws.amazon.com/rss/ec2-us-east-1.rss';

function getWorkspaceSlug(item) {

  if (!item?.workspace) {
    return null;
  }

  const slugSource =
    item.workspaceSlug ||
    item.title ||
    item.id;

  return slugSource
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') ||
    null;
}

function parseAwsStatusRss(xmlText) {

  const document =
    new DOMParser()
      .parseFromString(
        xmlText,
        'text/xml',
      );

  if (document.querySelector('parsererror')) {
    throw new Error('Invalid AWS status RSS XML');
  }

  const firstItem =
    document.querySelector('item');

  const channelTitle =
    document.querySelector('channel > title')
      ?.textContent
      ?.trim() ||
    'AWS Service Health RSS';

  if (!firstItem) {
    return {
      label: 'AWS OK',
      detail: `${AWS_STATUS_REGION} no active RSS items`,
      source: channelTitle,
      severity: 'ok',
    };
  }

  const title =
    firstItem.querySelector('title')
      ?.textContent
      ?.trim() ||
    '';

  const description =
    firstItem.querySelector('description')
      ?.textContent
      ?.trim() ||
    '';

  const combined =
    `${title} ${description}`.toLowerCase();

  const isNormal =
    combined.includes('operating normally') ||
    combined.includes('service is operating normally');

  const hasIssue =
    /investigating|increased|degraded|degradation|error|errors|issue|issues|impair|outage|unavailable|delayed|latency/.test(
      combined,
    );

  const severity =
    hasIssue && !isNormal
      ? 'issue'
      : 'ok';

  return {
    label:
      severity === 'issue'
        ? 'AWS EVENT'
        : 'AWS OK',
    detail:
      title ||
      `${AWS_STATUS_REGION} status parsed`,
    source: channelTitle,
    severity,
  };
}

function RuntimeCmdWindow({
  item,
  onClose,
  onMinimize,
  stackIndex = 0,
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

  const [isMaximized, setIsMaximized] =
    useState(false);

  const streamRef =
    useRef(null);

  const windowRef =
    useRef(null);

  const dragRef =
    useRef(null);

  const clampPosition = (nextX, nextY) => {

    const runtimeWindow =
      windowRef.current;

    if (!runtimeWindow || typeof window === 'undefined') {
      return {
        x: Math.max(16, nextX),
        y: Math.max(16, nextY),
      };
    }

    const runtimeRect =
      runtimeWindow.getBoundingClientRect();

    const titlebarSafeWidth =
      Math.min(
        180,
        runtimeRect.width,
      );

    const titlebarSafeHeight =
      42;

    const minX =
      Math.min(
        16,
        window.innerWidth - titlebarSafeWidth,
      );

    const minY =
      16;

    const maxX =
      Math.max(
        minX,
        window.innerWidth - titlebarSafeWidth,
      );

    const maxY =
      Math.max(
        minY,
        window.innerHeight - titlebarSafeHeight - 16,
      );

    return {
      x: Math.min(
        Math.max(minX, nextX),
        maxX,
      ),
      y: Math.min(
        Math.max(minY, nextY),
        maxY,
      ),
    };
  };

  useEffect(() => {

    setVisibleCount(0);
    setPosition({
      x: 210 + stackIndex * 28,
      y: 116 + stackIndex * 28,
    });

    setIsMaximized(false);

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

  }, [item.id, entries, stackIndex]);

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

      setPosition(
        clampPosition(nextX, nextY),
      );
    };

    const handleUp = () => {
      dragRef.current = null;
    };

    window.addEventListener(
      'pointermove',
      handleMove,
    );

    window.addEventListener(
      'pointerup',
      handleUp,
    );

    window.addEventListener(
      'pointercancel',
      handleUp,
    );

    return () => {
      window.removeEventListener(
        'pointermove',
        handleMove,
      );

      window.removeEventListener(
        'pointerup',
        handleUp,
      );

      window.removeEventListener(
        'pointercancel',
        handleUp,
      );
    };

  }, []);

  const visibleEntries =
    entries.slice(0, visibleCount);

  return (

    <section
      ref={windowRef}
      className={`${styles.runtimeCmdWindow} ${
        isMaximized
          ? styles.runtimeCmdWindowMaximized
          : ''
      }`}
      style={{
        transform: isMaximized
          ? 'translate(0, 0)'
          : `translate(${position.x}px, ${position.y}px)`,
      }}
      aria-label={`${item.logLabel} runtime session`}
    >

      <div
        className={styles.runtimeCmdTitlebar}
        onPointerDown={(event) => {
          if (isMaximized) {
            return;
          }

          event.currentTarget.setPointerCapture?.(
            event.pointerId,
          );

          dragRef.current = {
            offsetX: event.clientX - position.x,
            offsetY: event.clientY - position.y,
          };
        }}
      >

        <div className={styles.runtimeCmdControls}>
          {
            isMaximized ? (
              <>
                <button
                  type="button"
                  className={`${styles.runtimeCmdControl} ${styles.runtimeCmdMinimizeIcon}`}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                  onClick={() => {
                    onMinimize();
                  }}
                  aria-label="Minimize runtime session"
                />

                <button
                  type="button"
                  className={`${styles.runtimeCmdControl} ${styles.runtimeCmdRestore}`}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                  onClick={() => {
                    setIsMaximized(false);
                  }}
                  aria-label="Restore runtime session"
                />

                <button
                  type="button"
                  className={`${styles.runtimeCmdControl} ${styles.runtimeCmdCloseIcon}`}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                  onClick={() => {
                    onClose();
                  }}
                  aria-label="Terminate runtime session"
                />
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={`${styles.runtimeCmdControl} ${styles.runtimeCmdClose}`}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                  onClick={() => {
                    onClose();
                  }}
                  aria-label="Terminate runtime session"
                />

                <button
                  type="button"
                  className={`${styles.runtimeCmdControl} ${styles.runtimeCmdMinimize}`}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                  onClick={() => {
                    onMinimize();
                  }}
                  aria-label="Minimize runtime session"
                />

                <button
                  type="button"
                  className={`${styles.runtimeCmdControl} ${styles.runtimeCmdExpand}`}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                  onClick={() => {
                    setIsMaximized(true);
                  }}
                  aria-label="Expand runtime session"
                />
              </>
            )
          }
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

/* =========================
   FILE META
========================= */


export default function DesktopWorkspace({
  onBoot,
  initialWorkspaceSlug,
}) {
  const history = useHistory();
  const closeWorkspaceApp =
    onBoot ||
    (() => {
      history.push('/');
    });
  const [previewUrl, setPreviewUrl] =
  useState(null);
const [menuState, setMenuState] =
  useState(null);

const [taskbarMenuState, setTaskbarMenuState] =
  useState(null);

  const [openedTabs, setOpenedTabs] =
    useState([]);

  const [activeTab, setActiveTab] =
    useState(null);

  const [previewWidth, setPreviewWidth] =
    useState(1100);

  const [isResizing, setIsResizing] =
    useState(false);

  const workspaceBodyRef =
    useRef(null);

  const desktopAreaRef =
    useRef(null);

  const [showDesktopScrollHint, setShowDesktopScrollHint] =
    useState(false);

  const [weather, setWeather] =
    useState('⚙ weather runtime loading...');
    const [currentFolder, setCurrentFolder] =
  useState('Desktop');

const [runtimeLink, setRuntimeLink] =
  useState(runtimeLinks[0]);

const [workspaceItem, setWorkspaceItem] =
  useState(null);

const [packageItem, setPackageItem] =
  useState(null);

const [archiveItem, setArchiveItem] =
  useState(null);

const [minimizedWorkspaceItem, setMinimizedWorkspaceItem] =
  useState(null);

const [minimizedArchiveItem, setMinimizedArchiveItem] =
  useState(null);

const [minimizedPreviewTabs, setMinimizedPreviewTabs] =
  useState([]);

const [runtimeCmdItems, setRuntimeCmdItems] =
  useState([]);

const [minimizedRuntimeCmdItems, setMinimizedRuntimeCmdItems] =
  useState([]);

const [runtimeSwitcherOpen, setRuntimeSwitcherOpen] =
  useState(false);

const [awsStatus, setAwsStatus] =
  useState({
    label: 'AWS CHECKING',
    detail:
      `${AWS_STATUS_REGION} RSS pending`,
    source:
      AWS_STATUS_RSS_URL,
    severity:
      'pending',
  });

  const updateDesktopScrollHint =
    useCallback(() => {
      const desktopArea =
        desktopAreaRef.current;

      if (!desktopArea || packageItem) {
        setShowDesktopScrollHint(false);
        return;
      }

      const maxScrollTop =
        desktopArea.scrollHeight -
        desktopArea.clientHeight;

      setShowDesktopScrollHint(
        maxScrollTop > 8 &&
        desktopArea.scrollTop < maxScrollTop - 8
      );
    }, [packageItem]);

  const resetDesktopScroll =
    useCallback(() => {
      const desktopArea =
        desktopAreaRef.current;

      if (!desktopArea) {
        return;
      }

      desktopArea.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
    }, []);

  const scheduleDesktopScrollReset =
    useCallback(() => {
      resetDesktopScroll();

      window.requestAnimationFrame(() => {
        resetDesktopScroll();
        updateDesktopScrollHint();
      });
    }, [
      resetDesktopScroll,
      updateDesktopScrollHint,
    ]);

  useEffect(() => {
    const desktopArea =
      desktopAreaRef.current;

    if (!desktopArea) {
      return undefined;
    }

    const animationFrame =
      window.requestAnimationFrame(
        updateDesktopScrollHint
      );

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(updateDesktopScrollHint);

    resizeObserver?.observe(desktopArea);

    window.addEventListener(
      'resize',
      updateDesktopScrollHint
    );

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      window.removeEventListener(
        'resize',
        updateDesktopScrollHint
      );
    };
  }, [
    currentFolder,
    packageItem,
    previewWidth,
    updateDesktopScrollHint,
  ]);

  useEffect(() => {
    scheduleDesktopScrollReset();
  }, [
    currentFolder,
    packageItem?.id,
    scheduleDesktopScrollReset,
  ]);

  useEffect(() => {
    if (!initialWorkspaceSlug) {
      return;
    }

    const normalizedSlug =
      initialWorkspaceSlug.toLowerCase();

    const matchedItem =
      parsedItems.find((item) => {
        if (!item.workspace) {
          return false;
        }

        const workspaceSlug =
          getWorkspaceSlug(item);

        return (
          item.id === normalizedSlug ||
          workspaceSlug === normalizedSlug
        );
      });

    setCurrentFolder('Projects');

    if (matchedItem) {
      setMinimizedWorkspaceItem(null);
      setPackageItem(matchedItem);
    }
  }, [initialWorkspaceSlug]);

  const getPreviewWidthBounds =
    useCallback(() => {

      const bodyWidth =
        workspaceBodyRef.current
          ?.getBoundingClientRect()
          .width ||
        window.innerWidth;

      const availablePreviewWidth =
        bodyWidth -
        WORKSPACE_SIDEBAR_WIDTH -
        PREVIEW_RESIZE_HANDLE_WIDTH -
        DESKTOP_MIN_WIDTH;

      const max =
        Math.max(
          PREVIEW_MOBILE_MIN_WIDTH,
          Math.min(
            PREVIEW_MAX_WIDTH,
            availablePreviewWidth,
          ),
        );

      return {
        min: Math.min(
          PREVIEW_MIN_WIDTH,
          max,
        ),
        max,
      };
    }, []);

  const clampPreviewWidth =
    useCallback((width) => {

      const {
        min,
        max,
      } = getPreviewWidthBounds();

      return Math.max(
        min,
        Math.min(
          max,
          width,
        ),
      );
    }, [getPreviewWidthBounds]);

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

  useEffect(() => {

    let cancelled =
      false;

    const fetchAwsStatus = async () => {

      try {
        const res =
          await fetch(
            AWS_STATUS_RSS_URL,
            {
              cache: 'no-store',
            },
          );

        if (!res.ok) {
          throw new Error(
            `AWS status RSS returned ${res.status}`
          );
        }

        const xml =
          await res.text();

        const parsed =
          parseAwsStatusRss(xml);

        if (cancelled) {
          return;
        }

        setAwsStatus(parsed);

      } catch {

        if (cancelled) {
          return;
        }

        setAwsStatus({
          label: 'AWS RSS UNREACHABLE',
          detail:
            `${AWS_STATUS_REGION} status fetch failed`,
          source:
            AWS_STATUS_RSS_URL,
          severity:
            'unknown',
        });
      }
    };

    fetchAwsStatus();

    const interval =
      setInterval(
        fetchAwsStatus,
        5 * 60 * 1000,
      );

    return () => {
      cancelled = true;
      clearInterval(interval);
    };

  }, []);

  useEffect(() => {

    const closeTaskbarMenu = () =>
      setTaskbarMenuState(null);

    window.addEventListener(
      'click',
      closeTaskbarMenu,
    );

    return () =>
      window.removeEventListener(
        'click',
        closeTaskbarMenu,
      );

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

      const bodyRect =
        workspaceBodyRef.current
          ?.getBoundingClientRect();

      const newWidth =
        bodyRect
          ? bodyRect.right - e.clientX
          : window.innerWidth - e.clientX;

      setPreviewWidth(
        clampPreviewWidth(newWidth)
      );
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

  }, [clampPreviewWidth, isResizing]);

  useEffect(() => {

    const handleWindowResize = () => {

      setPreviewWidth((width) =>
        clampPreviewWidth(width)
      );
    };

    handleWindowResize();

    window.addEventListener(
      'resize',
      handleWindowResize,
    );

    return () => {

      window.removeEventListener(
        'resize',
        handleWindowResize,
      );
    };

  }, [clampPreviewWidth]);

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

  if (item.workspace) {
    const workspaceSlug =
      getWorkspaceSlug(item);

    if (workspaceSlug) {
      history.push(`/workspace/${workspaceSlug}`);
    }

    setPackageItem(item);
    setArchiveItem(null);
    setRuntimeCmdItems([]);
    setMinimizedRuntimeCmdItems([]);
    setRuntimeSwitcherOpen(false);

    return;
  }

  if (item.type === 'FOLDER') {
    setPackageItem(item);
    setArchiveItem(null);
    setRuntimeCmdItems([]);
    setMinimizedRuntimeCmdItems([]);
    setRuntimeSwitcherOpen(false);

    return;
  }

  if (
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

      setRuntimeCmdItems((prev) => {
        if (
          prev.some((session) =>
            session.id === item.id
          )
        ) {
          return prev;
        }

        return [
          ...prev,
          item,
        ];
      });

      setMinimizedRuntimeCmdItems((prev) =>
        prev.filter((session) =>
          session.id !== item.id
        )
      );

      setRuntimeSwitcherOpen(false);

      return;
    }

    if (
  item.workspace
) {
      const workspaceSlug =
        getWorkspaceSlug(item);

      if (workspaceSlug) {
        history.push(`/workspace/${workspaceSlug}`);
      }

      setPackageItem(item);
      setArchiveItem(null);

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

  setTaskbarMenuState(null);
};

const handleTaskbarAppMenu = (
  e,
  task,
) => {

  e.preventDefault();

  e.stopPropagation();

  setTaskbarMenuState({

    x:
      e.clientX,

    y:
      e.clientY,

    task,
  });

  setMenuState(null);
};

const restoreTaskbarItem = (task) => {

  if (task.type === 'code') {

    setWorkspaceItem(task.item);
    setPackageItem(null);
    setArchiveItem(null);
    setMinimizedWorkspaceItem(null);

    return;
  }

  if (task.type === 'docs') {

    setArchiveItem(task.item);
    setPackageItem(null);
    setWorkspaceItem(null);
    setMinimizedArchiveItem(null);

    return;
  }

  if (task.type === 'preview') {

    restorePreview(task.item);

    return;
  }

  if (task.type === 'runtime') {

    if (task.item?.type === 'LOG') {
      setRuntimeCmdItems((prev) => {
        if (
          prev.some((session) =>
            session.id === task.item.id
          )
        ) {
          return prev;
        }

        return [
          ...prev,
          task.item,
        ];
      });

      setMinimizedRuntimeCmdItems((prev) =>
        prev.filter((session) =>
          session.id !== task.item.id
        )
      );

      setRuntimeSwitcherOpen(false);

      return;
    }

    closeWorkspaceApp();
  }
};

const removeTaskbarItem = (task) => {

  if (task.type === 'code') {

    setMinimizedWorkspaceItem(null);

    return;
  }

  if (task.type === 'docs') {

    setMinimizedArchiveItem(null);

    return;
  }

  if (task.type === 'preview') {

    setMinimizedPreviewTabs((prev) =>
      prev.filter((tab) =>
        tab.id !== task.item.id
      )
    );

    return;
  }

  if (task.type === 'runtime') {

    if (task.item?.type === 'LOG') {
      setRuntimeCmdItems((prev) =>
        prev.filter((session) =>
          session.id !== task.item.id
        )
      );

      setMinimizedRuntimeCmdItems((prev) =>
        prev.filter((session) =>
          session.id !== task.item.id
        )
      );

      setRuntimeSwitcherOpen(false);

      return;
    }

    closeWorkspaceApp();
  }
};

const minimizeTaskbarItem = () => {

  setTaskbarMenuState(null);
};

const handleFolderChange = (folder) => {

  resetDesktopScroll();
  setCurrentFolder(folder);
  setPackageItem(null);
  setMenuState(null);
  setTaskbarMenuState(null);
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

  const [collapsedFolders, setCollapsedFolders] =
    useState({});

  const [visitedFiles, setVisitedFiles] =
    useState(() => (
      files[1] || files[0]
        ? {[files[1]?.id || files[0].id]: true}
        : {}
    ));

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
    if (!fileId) {
      return;
    }

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

if (archiveItem) {

  if (typeof document === 'undefined') {
    return null;
  }

  return (

    createPortal(
      <ArchiveRuntimeApplication
        item={archiveItem}
        onClose={() => {

          setPackageItem(archiveItem);
          setArchiveItem(null);
        }}
        onMinimize={() => {

          setMinimizedArchiveItem(archiveItem);
          setPackageItem(archiveItem);
          setArchiveItem(null);
        }}
      />,
      document.body,
    )

  );
}

if (workspaceItem) {

  if (typeof document === 'undefined') {
    return null;
  }

  return (

    createPortal(
      <WorkspaceOverlayView
        item={workspaceItem}
        onClose={() => {

          setPackageItem(workspaceItem);
          setWorkspaceItem(null);
          setMinimizedWorkspaceItem(null);
        }}
        onMinimize={() => {

          setMinimizedWorkspaceItem(workspaceItem);
          setPackageItem(workspaceItem);
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

const runtimeTaskbarItems = [
  ...runtimeCmdItems,
  ...minimizedRuntimeCmdItems.filter(
    (minimizedSession) =>
      !runtimeCmdItems.some((session) =>
        session.id === minimizedSession.id
      ),
  ),
];

return (

  <div
    className={styles.workspaceWindow}
 
    onClick={() => {

      setMenuState(null);
      setTaskbarMenuState(null);
      setRuntimeSwitcherOpen(false);
    }}

    onContextMenu={(e) => {

      e.preventDefault();
      setMenuState(null);
      setTaskbarMenuState(null);
      setRuntimeSwitcherOpen(false);
    }}
  >
  

      {/* HEADER */}

      <div className={styles.workspaceHeader}>

        {
          !activeItem && (

        <div className={styles.windowButtons}>

          <span
            className={styles.red}
            onClick={closeWorkspaceApp}
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

      <div
        ref={workspaceBodyRef}
        className={styles.workspaceBody}
      >

        {/* SIDEBAR */}

<Sidebar
  currentFolder={currentFolder}
  setCurrentFolder={handleFolderChange}
/>

        {/* DESKTOP */}

<div className={styles.desktopArea}>
  <div
    ref={desktopAreaRef}
    className={styles.desktopScrollViewport}
    onScroll={updateDesktopScrollHint}
  >

{
  runtimeCmdItems.length > 0 && (
    <div
      className={styles.runtimeCmdBackdrop}
      aria-hidden="true"
    />
  )
}

{
  packageItem ? (

    <WorkspacePackageView
      item={packageItem}
      onBack={() =>
        setPackageItem(null)
      }
      onOpenCode={() => {

        setWorkspaceItem(packageItem);
        setPackageItem(null);
        setArchiveItem(null);
        setMinimizedWorkspaceItem(null);
      }}
      onOpenDocs={() => {

        setArchiveItem(packageItem);
        setPackageItem(null);
        setWorkspaceItem(null);
        setMinimizedArchiveItem(null);
      }}
    />

  ) : (

  <>

  <div className={styles.desktopGrid}>

{
  parsedItems.filter((item) => {

      switch (currentFolder) {

        case 'Projects':
          return item.location === 'Projects';

        case 'Runtime':
          return item.location === 'Runtime';


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
        : runtimeCmdItems.some((session) =>
            session.id === item.id
          ) ||
          minimizedRuntimeCmdItems.some((session) =>
            session.id === item.id
          )
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

  </>

  )
}

  </div>

  {
    showDesktopScrollHint && (
      <div
        className={styles.desktopScrollHint}
        aria-hidden="true"
      >
        <i className="fa-solid fa-chevron-down" />
        <span />
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
  runtimeCmdItems.length > 0 &&
  typeof document !== 'undefined' &&
  createPortal(

    <>
      {
        runtimeCmdItems.map((runtimeItem, index) => (

          <RuntimeCmdWindow
            key={runtimeItem.id}
            item={runtimeItem}
            stackIndex={index}
            onClose={() => {
              setRuntimeCmdItems((prev) =>
                prev.filter((session) =>
                  session.id !== runtimeItem.id
                )
              );

              setMinimizedRuntimeCmdItems((prev) =>
                prev.filter((session) =>
                  session.id !== runtimeItem.id
                )
              );
            }}
            onMinimize={() => {
              setMinimizedRuntimeCmdItems((prev) => {
                if (
                  prev.some((session) =>
                    session.id === runtimeItem.id
                  )
                ) {
                  return prev;
                }

                return [
                  ...prev,
                  runtimeItem,
                ];
              });

              setRuntimeCmdItems((prev) =>
                prev.filter((session) =>
                  session.id !== runtimeItem.id
                )
              );
            }}
          />

        ))
      }
    </>,

    document.body,
  )
}

      </div>

      {/* TASKBAR */}

      <div className={styles.taskbar}>

        {/* LEFT */}

        <div className={styles.taskbarLeft}>

          <button
            className={styles.runtimeButton}
 
            onClick={closeWorkspaceApp}
            onContextMenu={(e) =>
              handleTaskbarAppMenu(
                e,
                {
                  type: 'runtime',
                  item: {
                    title: 'runtime',
                  },
                },
              )
            }
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

          {/* <button className={styles.taskbarIcon}>
            <i className="fa-solid fa-folder"></i>
          </button> */}

{
  runtimeTaskbarItems.length > 0 && (

    <div
      className={styles.taskbarRuntimeGroup}
      onMouseEnter={() => {
        setRuntimeSwitcherOpen(true);
      }}
      onMouseLeave={() => {
        setRuntimeSwitcherOpen(false);
      }}
    >
      <button
        type="button"
        className={`${styles.taskbarIcon} ${styles.taskbarIconActive}`}
        onClick={(event) => {
          event.stopPropagation();
          setRuntimeSwitcherOpen((value) =>
            !value
          );
        }}
        onContextMenu={(e) =>
          handleTaskbarAppMenu(
            e,
            {
              type: 'runtime',
              item:
                runtimeTaskbarItems[0],
            },
          )
        }
        title="runtime sessions"
        aria-label="Show runtime sessions"
      >
        <i className="fa-solid fa-terminal"></i>
      </button>

      {
        runtimeSwitcherOpen && (
          <div className={styles.runtimeSwitcher}>
            {
              runtimeTaskbarItems.map((runtimeItem) => {

                const isMinimized =
                  minimizedRuntimeCmdItems.some((session) =>
                    session.id === runtimeItem.id
                  );

                const previewEntries =
                  (runtimeItem.logEntries || [])
                    .slice(0, 3);

                return (

                  <button
                    key={runtimeItem.id}
                    type="button"
                    className={styles.runtimeSwitcherCard}
                    onClick={(event) => {
                      event.stopPropagation();

                      if (isMinimized) {
                        restoreTaskbarItem({
                          type: 'runtime',
                          item: runtimeItem,
                        });
                      } else {
                        setRuntimeCmdItems((prev) => [
                          ...prev.filter((session) =>
                            session.id !== runtimeItem.id
                          ),
                          runtimeItem,
                        ]);
                      }

                      setRuntimeSwitcherOpen(false);
                    }}
                  >
                    <span className={styles.runtimeSwitcherTitle}>
                      <i className="fa-solid fa-terminal"></i>
                      {runtimeItem.title}
                    </span>

                    <span className={styles.runtimeSwitcherPreview}>
                      {
                        previewEntries.map((entry) => (
                          <span key={entry}>
                            {entry}
                          </span>
                        ))
                      }
                    </span>
                  </button>

                );
              })
            }
          </div>
        )
      }
    </div>

  )
}

{
  minimizedWorkspaceItem && (

    <button
      type="button"
      className={`${styles.taskbarIcon} ${styles.taskbarIconActive}`}
      onClick={() =>
        restoreTaskbarItem({
          type: 'code',
          item: minimizedWorkspaceItem,
        })
      }
      onContextMenu={(e) =>
        handleTaskbarAppMenu(
          e,
          {
            type: 'code',
            item: minimizedWorkspaceItem,
          },
        )
      }
      title={minimizedWorkspaceItem.title}
      aria-label={`Restore ${minimizedWorkspaceItem.title}`}
    >
      <i className="fa-solid fa-code"></i>
    </button>

  )
}

{
  minimizedArchiveItem && (

    <button
      type="button"
      className={`${styles.taskbarIcon} ${styles.taskbarIconActive}`}
      onClick={() =>
        restoreTaskbarItem({
          type: 'docs',
          item: minimizedArchiveItem,
        })
      }
      onContextMenu={(e) =>
        handleTaskbarAppMenu(
          e,
          {
            type: 'docs',
            item: minimizedArchiveItem,
          },
        )
      }
      title={`${minimizedArchiveItem.title} docs`}
      aria-label={`Restore ${minimizedArchiveItem.title} docs`}
    >
      <i className="fa-solid fa-scroll"></i>
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
        restoreTaskbarItem({
          type: 'preview',
          item,
        })
      }
      onContextMenu={(e) =>
        handleTaskbarAppMenu(
          e,
          {
            type: 'preview',
            item,
          },
        )
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

{
  taskbarMenuState &&

  createPortal(

    <div
      className={`
        ${styles.contextMenu}
        ${styles.taskbarContextMenu}
      `}
      style={{
        top: taskbarMenuState.y,
        left: taskbarMenuState.x,
      }}
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      <button
        type="button"
        className={styles.contextMenuItem}
        onClick={() => {

          restoreTaskbarItem(
            taskbarMenuState.task
          );

          setTaskbarMenuState(null);
        }}
      >
        열기
      </button>


<button
  type="button"
  className={styles.contextMenuItem}
  onClick={() => {

    removeTaskbarItem(
      taskbarMenuState.task
    );

    setTaskbarMenuState(null);
  }}
>
<i
  className="fa-solid fa-thumbtack"
  style={{ marginRight: '0.45rem' }}
/>
  작업표시줄에서 제거
</button>

    </div>,

    document.body
  )
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
            BUILD 48%
          </span>

          <span
            className={`${styles.awsStatus} ${
              awsStatus.severity === 'issue'
                ? styles.awsStatusIssue
                : awsStatus.severity === 'unknown'
                  ? styles.awsStatusUnknown
                  : styles.awsStatusOk
            }`}
            title={`${awsStatus.source} | ${awsStatus.detail}`}
          >
            {awsStatus.label}
            {' · '}
            {AWS_STATUS_REGION}
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
