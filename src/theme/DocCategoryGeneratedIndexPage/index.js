/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {useEffect} from 'react';
import {PageMetadata, HtmlClassNameProvider} from '@docusaurus/theme-common';
import {
  findFirstSidebarItemLink,
  useCurrentSidebarCategory,
  useDocById,
} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import DocPaginator from '@theme/DocPaginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

function useCategoryManuscriptTheme(theme) {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    document.documentElement.dataset.manuscriptTheme = theme;

    return () => {
      delete document.documentElement.dataset.manuscriptTheme;
    };
  }, [theme]);
}

function normalizeThemeText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣/_ -]/g, '');
}

function inferArchiveThemeFromText(value) {
  const text = normalizeThemeText(value);

  if (/jumpingbattle|jumping-battle|jumping battle/.test(text)) {
    return 'jumpingbattle';
  }

  if (/ludarota|luda rota/.test(text)) {
    return 'ludarota';
  }

  if (/workspace|ide|blueprint/.test(text)) {
    return 'workspace';
  }

  if (/devwiki|dev wiki|wiki|technical|기술/.test(text)) {
    return 'devwiki';
  }

  if (/archive|planning|기획/.test(text)) {
    return 'archive';
  }

  return 'archive';
}

function getCategoryTheme(categoryGeneratedIndex, category) {
  const searchableText = [
    categoryGeneratedIndex.title,
    categoryGeneratedIndex.description,
    categoryGeneratedIndex.slug,
    categoryGeneratedIndex.permalink,
    category?.label,
  ].join(' ');

  return inferArchiveThemeFromText(searchableText);
}

function getItemTheme(item) {
  return inferArchiveThemeFromText(
    [
      item.label,
      item.docId,
      item.href,
      item.description,
    ].join(' '),
  );
}

function getItemHref(item) {
  if (item.type === 'link') {
    return item.href;
  }

  if (item.type === 'category') {
    return item.href ?? findFirstSidebarItemLink(item);
  }

  return undefined;
}

function textLooksBroken(value) {
  return (
    typeof value !== 'string' ||
    value.trim().length === 0 ||
    /[�媛湲곕줉듭떖]/.test(value)
  );
}

function getFallbackDescription(item, isCategory) {
  const label = item.label ?? '';

  if (/기획|Planning/i.test(label)) {
    return '프로젝트의 방향, 화면 구성, 기록 경험을 정리한 문서 묶음입니다. 아이디어가 실제 구조로 옮겨지는 과정과 판단 근거를 함께 확인할 수 있습니다.';
  }

  if (/기술결정|Technical/i.test(label)) {
    return '구현 과정에서 선택한 기술과 운영상의 판단을 남긴 문서 묶음입니다. 특정 구조를 택한 이유와 이후 유지보수 맥락을 확인할 수 있습니다.';
  }

  if (/tutorial/i.test(label)) {
    return 'Docusaurus 기본 튜토리얼과 보조 문서를 모아 둔 참고 영역입니다.';
  }

  if (isCategory) {
    return '관련 문서를 주제별로 모아 둔 색인입니다. 하위 문서를 통해 기록의 흐름과 세부 내용을 확인할 수 있습니다.';
  }

  return '개별 기록 문서입니다. 작성 배경, 결정 사항, 구현 과정의 맥락을 본문에서 확인할 수 있습니다.';
}

function getDescription(item, doc, isCategory) {
  const description = item.description ?? doc?.description;

  if (!textLooksBroken(description)) {
    return description;
  }

  return getFallbackDescription(item, isCategory);
}

function getChildItems(item) {
  if (item.type !== 'category') {
    return [];
  }

  return (item.items ?? []).slice(0, 5);
}

function IndexEntry({item}) {
  const doc = useDocById(item.type === 'link' ? item.docId : undefined);
  const href = getItemHref(item);
  const isCategory = item.type === 'category';
  const childItems = getChildItems(item);
  const description = getDescription(item, doc, isCategory);
  const itemTheme = getItemTheme(item);

  if (!href) {
    return null;
  }

  return (
    <li className={styles.indexItem} data-index-item-theme={itemTheme}>
      <Link className={styles.indexLink} href={href}>
        <Heading as="h2" className={styles.indexTitle}>
          {item.label}
        </Heading>
        <p className={styles.indexDescription}>{description}</p>
        {childItems.length > 0 && (
          <ul className={styles.childList}>
            {childItems.map((child) => (
              <li key={`${child.type}-${child.label}`}>
                {child.label}
              </li>
            ))}
          </ul>
        )}
      </Link>
    </li>
  );
}

function ArchiveIndexList({items}) {
  return (
    <ol className={styles.indexList}>
      {items.map((item, index) => (
        <IndexEntry
          key={`${item.type}-${item.label}-${index}`}
          item={item}
        />
      ))}
    </ol>
  );
}

function DocCategoryGeneratedIndexPageMetadata({categoryGeneratedIndex}) {
  return (
    <PageMetadata
      title={categoryGeneratedIndex.title}
      description={categoryGeneratedIndex.description}
      keywords={categoryGeneratedIndex.keywords}
      image={useBaseUrl(categoryGeneratedIndex.image)}
    />
  );
}

function DocCategoryGeneratedIndexPageContent({categoryGeneratedIndex}) {
  const category = useCurrentSidebarCategory();
  const categoryTheme = getCategoryTheme(categoryGeneratedIndex, category);
  const pageDescription = textLooksBroken(categoryGeneratedIndex.description)
    ? getFallbackDescription(
        {label: categoryGeneratedIndex.title},
        true,
      )
    : categoryGeneratedIndex.description;

  useCategoryManuscriptTheme(categoryTheme);

  return (
    <HtmlClassNameProvider className="docs-archive-manuscript docs-category-manuscript-html">
      <div
        className={styles.generatedIndexPage}
        data-manuscript-theme={categoryTheme}>
        <DocVersionBanner />
        <DocBreadcrumbs />
        <DocVersionBadge />
        <header className={styles.header}>
          <Heading as="h1" className={styles.title}>
            {categoryGeneratedIndex.title}
          </Heading>
          {pageDescription && (
            <p className={styles.description}>
              {pageDescription}
            </p>
          )}
        </header>
        <article className={styles.indexSection}>
          <ArchiveIndexList items={category.items} />
        </article>
        <footer className={styles.footer}>
          <DocPaginator
            previous={categoryGeneratedIndex.navigation.previous}
            next={categoryGeneratedIndex.navigation.next}
          />
        </footer>
      </div>
    </HtmlClassNameProvider>
  );
}

export default function DocCategoryGeneratedIndexPage(props) {
  return (
    <>
      <DocCategoryGeneratedIndexPageMetadata {...props} />
      <DocCategoryGeneratedIndexPageContent {...props} />
    </>
  );
}
