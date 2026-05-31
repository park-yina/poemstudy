import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {translate} from '@docusaurus/Translate';
import IconHome from '@theme/Icon/Home';
import styles from '@docusaurus/theme-classic/lib/theme/DocBreadcrumbs/Items/Home/styles.module.css';

export default function HomeBreadcrumbItem() {
  const homeHref = useBaseUrl('/docs/intro');

  return (
    <li className="breadcrumbs__item">
      <Link
        aria-label={translate({
          id: 'theme.docs.breadcrumbs.home',
          message: 'Intro document',
          description: 'The ARIA label for the intro document in the breadcrumbs',
        })}
        className="breadcrumbs__link"
        href={homeHref}>
        <IconHome className={styles.breadcrumbHomeIcon} />
      </Link>
    </li>
  );
}
