import React, {useEffect, useMemo} from 'react';
import {useLocation} from '@docusaurus/router';
import {HtmlClassNameProvider} from '@docusaurus/theme-common';
import {DocProvider} from '@docusaurus/plugin-content-docs/client';
import DocItemMetadata from '@theme/DocItem/Metadata';
import DocItemLayout from '@theme/DocItem/Layout';
import {setDocReadState} from '../../utils/docReadProgress';

function normalizeManuscriptTheme(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '');
}

function titleFromDocId(id) {
  return id
    .split('/')
    .pop()
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getFallbackMetadata(pathname, content) {
  const id =
    pathname
      .replace(/^\/docs\/next\/?/, '')
      .replace(/^\/docs\/?/, '')
      .replace(/\/$/, '') ||
    'intro';

  return {
    id,
    title: content?.contentTitle || titleFromDocId(id),
    description: '',
    permalink: pathname,
    source: '',
    sourceDirName: '.',
    slug: `/${id}`,
    draft: false,
    unlisted: false,
    tags: [],
    frontMatter: content?.frontMatter || {},
  };
}

function withDocStatics(content, fallbackMetadata) {
  const MDXComponent = content;
  const metadata = content?.metadata || fallbackMetadata;
  const frontMatter = content?.frontMatter || metadata.frontMatter || {};

  function EnhancedDocContent(props) {
    return <MDXComponent {...props} />;
  }

  EnhancedDocContent.metadata = metadata;
  EnhancedDocContent.frontMatter = frontMatter;
  EnhancedDocContent.assets = content?.assets || {};
  EnhancedDocContent.contentTitle = content?.contentTitle;
  EnhancedDocContent.toc = content?.toc || [];

  return EnhancedDocContent;
}

function useDocReadProgress(pathname) {
  useEffect(() => {
    setDocReadState(pathname, 'visited');

    const markCompletedAtPageEnd = () => {
      const scrollElement = document.documentElement;
      const distanceFromEnd =
        scrollElement.scrollHeight - window.scrollY - window.innerHeight;

      if (distanceFromEnd <= 96) {
        setDocReadState(pathname, 'completed');
      }
    };

    window.requestAnimationFrame(markCompletedAtPageEnd);
    window.addEventListener('scroll', markCompletedAtPageEnd, {passive: true});
    window.addEventListener('resize', markCompletedAtPageEnd);

    return () => {
      window.removeEventListener('scroll', markCompletedAtPageEnd);
      window.removeEventListener('resize', markCompletedAtPageEnd);
    };
  }, [pathname]);
}

function useHtmlManuscriptTheme(manuscriptTheme) {
  useEffect(() => {
    if (!manuscriptTheme || typeof document === 'undefined') {
      return undefined;
    }

    document.documentElement.dataset.manuscriptTheme = manuscriptTheme;

    return () => {
      delete document.documentElement.dataset.manuscriptTheme;
    };
  }, [manuscriptTheme]);
}

export default function DocItem(props) {
  const location = useLocation();
  const content = props.content;

  const enhancedContent = useMemo(() => {
    if (!content) {
      return null;
    }

    return withDocStatics(
      content,
      getFallbackMetadata(location.pathname, content),
    );
  }, [content, location.pathname]);

  useDocReadProgress(location.pathname);

  const manuscriptTheme = normalizeManuscriptTheme(
    enhancedContent?.frontMatter.manuscriptTheme,
  );

  useHtmlManuscriptTheme(manuscriptTheme);

  if (!enhancedContent) {
    return null;
  }

  const docHtmlClassName = `docs-doc-id-${enhancedContent.metadata.id}`;
  const docModeClassName = enhancedContent.frontMatter.archiveManuscript
    ? 'docs-archive-manuscript'
    : '';
  const MDXComponent = enhancedContent;

  return (
    <DocProvider content={enhancedContent}>
      <HtmlClassNameProvider className={`${docHtmlClassName} ${docModeClassName}`}>
        <DocItemMetadata />
        <div
          className="docs-manuscript-root"
          data-manuscript-theme={manuscriptTheme || undefined}
        >
          <DocItemLayout>
            <MDXComponent />
          </DocItemLayout>
        </div>
      </HtmlClassNameProvider>
    </DocProvider>
  );
}
