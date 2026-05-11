import React from 'react';

import styles from './styles.module.css';

export default function Sidebar({
  currentFolder,
  setCurrentFolder,
}) {

  const folders = [

    {
      key: 'Desktop',

      icon:
        'fa-desktop',

      label:
        'desktop',
    },

    {
      key: 'Projects',

      icon:
        'fa-folder',

      label:
        'projects',
    },

    {
      key: 'Archive',

      icon:
        'fa-box-archive',

      label:
        'archive',
    },

    {
      key: 'Runtime',

      icon:
        'fa-terminal',

      label:
        'runtime',
    },
  ];

  return (

    <aside
      className={styles.sidebar}
    >

      <div
        className={
          styles.sidebarTitle
        }
      >
        EXPLORER
      </div>

      {
        folders.map((folder) => (

          <button
            key={folder.key}

            className={`
              ${styles.sidebarItem}

              ${
                currentFolder ===
                folder.key
                  ? styles.active
                  : ''
              }
            `}

            onClick={() =>
              setCurrentFolder(
                folder.key
              )
            }
          >

            <i
              className={`
                fa-solid
                ${folder.icon}
              `}
            ></i>

            {folder.label}

          </button>

        ))
      }

    </aside>
  );
}