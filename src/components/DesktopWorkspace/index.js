import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
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
import styles from './styles.module.css';
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
    useState(620);

  const [isResizing, setIsResizing] =
    useState(false);

  const [weather, setWeather] =
    useState('⚙ weather runtime loading...');
    const [currentFolder, setCurrentFolder] =
  useState('Desktop');

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

  /* =========================
     PREVIEW 불가능 타입
  ========================= */

  if (
    item.type === 'PDF'
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
};

  /* =========================
     DOUBLE CLICK
  ========================= */

const handleLaunch =
  async (item) => {

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

  /* =========================
     CLOSE TAB
  ========================= */

const closeTab = (
  tabId,
) => {

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

<Sidebar
  currentFolder={currentFolder}
  setCurrentFolder={setCurrentFolder}
/>

        {/* DESKTOP */}

<div className={styles.desktopArea}>

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
          return true;
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
  previewWidth={previewWidth}
  setIsResizing={setIsResizing}
/>
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