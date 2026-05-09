import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from '@docusaurus/Link';

import styles from './styles.module.css';

/* =========================
   FILE META
========================= */

const extensionMap = {

  pdf: {
    icon: 'fa-file-pdf',
    color: '#ff6b6b',
    type: 'PDF',
  },

  md: {
    icon: 'fa-file-code',
    color: '#60a5fa',
    type: 'MD',
  },

  log: {
    icon: 'fa-terminal',
    color: '#4ade80',
    type: 'LOG',
  },

  folder: {
    icon: 'fa-folder',
    color: '#ffd166',
    type: 'PROJECT',
  },

  default: {
    icon: 'fa-file',
    color: '#d1d5db',
    type: 'FILE',
  },
};

function getExtension(title) {

  if (!title.includes('.')) {
    return 'folder';
  }

  return title
    .split('.')
    .pop()
    .toLowerCase();
}

/* =========================
   FILES
========================= */

const desktopItems = [

  {
    id: 'resume',

    title: 'resume.pdf',

    download:
      '/files/resume.pdf',

    preview: `
# Runtime Archive

Backend Developer

Spring Boot
Flask
AWS
MySQL

Operational Systems
Real-time Runtime
Architecture
    `,
  },

  {
    id: 'career',

    title: 'career-record.pdf',

    download:
      '/files/career-record.pdf',

    preview: `
# Career Record

외주 프로젝트 3건 수행

- 실시간 랭킹 시스템 운영
- 관리자 플랫폼 구축
- 운영 자동화 경험

Runtime / Operations
    `,
  },

  {
    id: 'portfolio',

    title: 'fakejumping-admin',

    github:
      'https://github.com/park-yina',

    preview: `
# fakejumping-admin

Spring Boot
JWT
MyBatis
Docker
AWS

실시간 운영 환경 기반
관리자 플랫폼 프로젝트
    `,
  },

  {
    id: 'philosophy',

    title: 'developer-philosophy.md',

    github:
      'https://github.com/park-yina',

    preview: `
# Developer Philosophy

작은 불편을 발견하고
구조적으로 해결하는 개발자.

운영 가능한 시스템과
설명 가능한 구조를 지향합니다.
    `,
  },

  {
    id: 'runtime',

    title: 'runtime.log',

    preview: `
[00:00:00]
runtime initialized

[00:00:03]
system stable

[00:00:05]
archive synced
    `,
  },

];

/* =========================
   WEATHER
========================= */

const weatherMap = {

  Clear: '맑음',

  Sunny: '맑음',

  Cloudy: '흐림',

  Overcast: '흐림',

  Mist: '안개',

  Fog: '안개',

  Rain: '비',

  Snow: '눈',

  'Patchy rain nearby': '비',

  'Light rain': '약한 비',

  'Moderate rain': '비',
};

const runtimeLinks = [

  {

    label:
      '📄resume.pdf',

    href:
      'https://docs.google.com/document/d/1PK8ubFl7t42jCNr2vq5GE4fumimmwL1XyFljrEL0xYA/edit?usp=sharing',
  },

  {

    label:
      '📦 fakejumping-admin repository',

    href:
      'https://github.com/park-yina/FakeJumping',
  },

  {

    label:
      '✍ GitHub Blog',

    href:
      'https://park-yina.github.io/',
  },

  {

    label:
      '🐙 github runtime archive',

    href:
      'https://github.com/park-yina',
  },

  {

    label:
      '📝 신춘문예 아카이빙 사이트',

    href:
      'https://mjhdvazytc.execute-api.us-east-1.amazonaws.com/dev/shinchun',
  },

  {

    label:
      '⚙ runtime architecture notes',

    href:
      '/docs/intro',
  },

];
/* =========================
   PARSE ITEMS
========================= */

const parsedItems =
  desktopItems.map((item) => {

    const ext =
      getExtension(item.title);

    const meta =
      extensionMap[ext] ||
      extensionMap.default;

    return {

      ...item,

      ...meta,
    };
  });

/* =========================
   COMPONENT
========================= */

export default function DesktopWorkspace({
  onBoot,
}) {

  const [openedTabs, setOpenedTabs] =
    useState([]);

  const [activeTab, setActiveTab] =
    useState(null);

  const [previewWidth, setPreviewWidth] =
    useState(620);

  const [isResizing, setIsResizing] =
    useState(false);

  const [weather, setWeather] =
    useState('⚙ weather runtime loading...');

const [runtimeLink, setRuntimeLink] =
  useState(runtimeLinks[0]);
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

    const handleMouseMove = (e) => {

      if (!isResizing) {
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

    const handleMouseUp = () => {

      setIsResizing(false);
    };

    window.addEventListener(
      'mousemove',
      handleMouseMove,
    );

    window.addEventListener(
      'mouseup',
      handleMouseUp,
    );

    return () => {

      window.removeEventListener(
        'mousemove',
        handleMouseMove,
      );

      window.removeEventListener(
        'mouseup',
        handleMouseUp,
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

  const openItem = (item) => {

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
  };

  /* =========================
     DOUBLE CLICK
  ========================= */

  const handleLaunch = (item) => {

    if (item.download) {

      window.open(
        item.download,
        '_blank',
      );
    }

    if (item.github) {

      window.open(
        item.github,
        '_blank',
      );
    }
  };

  /* =========================
     CLOSE TAB
  ========================= */

  const closeTab = (
    e,
    tabId,
  ) => {

    e.stopPropagation();

    const filtered =
      openedTabs.filter(
        (tab) =>
          tab.id !== tabId,
      );

    setOpenedTabs(filtered);

    if (
      activeTab &&
      activeTab.id === tabId
    ) {

      setActiveTab(
        filtered[0] || null,
      );
    }
  };

  /* =========================
     RENDER
  ========================= */

  return (

    <div className={styles.workspaceWindow}>

      {/* HEADER */}

      <div className={styles.workspaceHeader}>

        <div className={styles.windowButtons}>

          <span
            className={styles.red}
            onClick={onBoot}
          ></span>

          <span className={styles.yellow}></span>

          <span className={styles.green}></span>

        </div>

        <span className={styles.workspaceTitle}>
          developer-workspace
        </span>

      </div>

      {/* BODY */}

      <div className={styles.workspaceBody}>

        {/* SIDEBAR */}

        <aside className={styles.sidebar}>

          <div className={styles.sidebarTitle}>
            EXPLORER
          </div>

          <button className={styles.sidebarItem}>
            <i className="fa-solid fa-desktop"></i>
            desktop
          </button>

          <button className={styles.sidebarItem}>
            <i className="fa-solid fa-folder"></i>
            projects
          </button>

          <button className={styles.sidebarItem}>
            <i className="fa-solid fa-box-archive"></i>
            archive
          </button>

          <button className={styles.sidebarItem}>
            <i className="fa-solid fa-terminal"></i>
            runtime
          </button>

        </aside>

        {/* DESKTOP */}

        <div className={styles.desktopArea}>

          <div className={styles.desktopGrid}>

            {parsedItems.map((item) => (

              <div
                key={item.id}

                className={`
                  ${styles.desktopIcon}

                  ${
                    activeItem &&
                    activeItem.id === item.id
                      ? styles.active
                      : ''
                  }
                `}

                onClick={() =>
                  openItem(item)
                }

                onDoubleClick={() =>
                  handleLaunch(item)
                }
              >

                <i
                  className={`fa-solid ${item.icon}`}
                  style={{
                    color: item.color,
                  }}
                ></i>

                <div className={styles.iconMeta}>

                  <span className={styles.iconTitle}>
                    {item.title}
                  </span>

                  <span className={styles.iconType}>
                    {item.type}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* PREVIEW */}

        {

          activeItem && (

            <>

              <div
                className={styles.resizeHandle}

                onMouseDown={() =>
                  setIsResizing(true)
                }
              />

              <div
                className={styles.previewPanel}

                style={{
                  width: `${previewWidth}px`,
                }}
              >

                <div className={styles.previewTabs}>

                  {openedTabs.map((tab) => (

                    <div
                      key={tab.id}

                      className={`
                        ${styles.previewTab}

                        ${
                          activeItem.id === tab.id
                            ? styles.activeTab
                            : ''
                        }
                      `}

                      onClick={() =>
                        setActiveTab(tab)
                      }
                    >

                      <i
                        className={`fa-solid ${tab.icon}`}
                        style={{
                          color: tab.color,
                        }}
                      ></i>

                      <span>
                        {tab.title}
                      </span>

                      {

                        openedTabs.length > 1 && (

                          <button
                            className={
                              styles.closeTab
                            }

                            onClick={(e) =>
                              closeTab(
                                e,
                                tab.id,
                              )
                            }
                          >
                            ×
                          </button>

                        )
                      }

                    </div>

                  ))}

                </div>

                {/* TOOLBAR */}

                <div className={styles.previewToolbar}>

                  <div className={styles.previewMeta}>

                    <span className={styles.previewLabel}>
                      {activeItem.type}
                    </span>

                    <span className={styles.previewPath}>
                      runtime archive
                    </span>

                  </div>

                  <div className={styles.previewActions}>

                    {

                      activeItem.download && (

                        <a
                          href={
                            activeItem.download
                          }

                          target="_blank"

                          rel="noreferrer"

                          className={
                            styles.downloadButton
                          }
                        >
                          download
                        </a>

                      )
                    }

                    {

                      activeItem.github && (

                        <a
                          href={
                            activeItem.github
                          }

                          target="_blank"

                          rel="noreferrer"

                          className={
                            styles.downloadButton
                          }
                        >
                          github
                        </a>

                      )
                    }

                  </div>

                </div>

                {/* CONTENT */}

                <div className={styles.previewContent}>

                  <div className={styles.previewDocument}>

                    {

                      activeItem.type === 'PDF' ? (

                        <iframe
                          src={
                            activeItem.download
                          }

                          className={
                            styles.pdfViewer
                          }

                          title={
                            activeItem.title
                          }
                        />

                      ) : (

                        <pre>
                          {activeItem.preview}
                        </pre>

                      )
                    }

                  </div>

                </div>

              </div>

            </>

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