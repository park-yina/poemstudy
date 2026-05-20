import React, {useEffect, useMemo} from 'react';
import {useLocation} from '@docusaurus/router';
import {HtmlClassNameProvider} from '@docusaurus/theme-common';
import {DocProvider} from '@docusaurus/plugin-content-docs/client';
import DocItemMetadata from '@theme/DocItem/Metadata';
import DocItemLayout from '@theme/DocItem/Layout';
import {setDocReadState} from '../../utils/docReadProgress';

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

  function EnhancedDocContent(props) {
    return <MDXComponent {...props} />;
  }

  EnhancedDocContent.metadata = content?.metadata || fallbackMetadata;
  EnhancedDocContent.frontMatter = content?.frontMatter || {};
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
        <DocItemLayout>
          <MDXComponent />import versions from '@site/versions.json';

        </DocItemLayout>
      </HtmlClassNameProvider>
    </DocProvider>
  );
}
