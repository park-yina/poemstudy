import React from 'react';

import clsx from 'clsx';

import {
  useThemeConfig,
  ErrorCauseBoundary,
  ThemeClassNames,
} from '@docusaurus/theme-common';

import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';

import NavbarItem from '@theme/NavbarItem';

import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';

import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';

import NavbarLogo from '@theme/Navbar/Logo';

import NavbarSearch from '../../../components/NavbarSearch';

import styles from './styles.module.css';

function useNavbarItems() {
  return useThemeConfig().navbar.items;
}

function NavbarItems({ items }) {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.
Please double-check the following navbar item:

${JSON.stringify(item, null, 2)}`,
              { cause: error }
            )
          }
        >
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

function NavbarContentLayout({ left, right }) {
  return (
    <div className="navbar__inner">
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerLeft,
          'navbar__items'
        )}
      >
        {left}
      </div>

      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerRight,
          'navbar__items navbar__items--right'
        )}
      >
        {right}
      </div>
    </div>
  );
}

export default function NavbarContent() {
  const mobileSidebar =
    useNavbarMobileSidebar();

  const items = useNavbarItems();

  const [leftItems, rightItems] =
    splitNavbarItems(items);

  const openArchiveProtocol = () => {
    window.dispatchEvent(
      new CustomEvent('archive-protocol:open')
    );
  };

  return (
    <NavbarContentLayout
      left={
        <>
          {!mobileSidebar.disabled && (
            <NavbarMobileSidebarToggle />
          )}

          <NavbarLogo />

          <NavbarItems items={leftItems} />
        </>
      }
      right={
        <>
          <NavbarItems items={rightItems} />

          <button
            type="button"
            className={styles.protocolEntry}
            onClick={openArchiveProtocol}
          >
            기록 안내서
          </button>

          <NavbarSearch />

          <NavbarColorModeToggle
            className={styles.colorModeToggle}
          />
        </>
      }
    />
  );
}
