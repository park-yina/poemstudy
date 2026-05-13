// @ts-check

import { language } from 'gray-matter';
import { themes as prismThemes }
from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {

  title: 'Luda Log',

  tagline: '현실 문제를 코드로 밀어붙인 기록',

  favicon: 'img/favicon.ico',

  url: 'https://poemtudy.site',

  baseUrl: '/',

  organizationName: 'park-yina',

  projectName: 'poemstudy',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // 👇 여기 추가
  stylesheets: [

    {
      href:
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',

      type: 'text/css',
    },

  ],

  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },

        blog: {
          showReadingTime: true,

          blogSidebarCount: 'ALL',

          blogSidebarTitle: '최근 기록',

          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },

          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        
  gtag: {

    trackingID: 'G-ZQXL3P8QPV',

    anonymizeIP: true,
  },

        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig: ({
    image: 'img/social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
      defaultMode: 'dark',
    },

    navbar: {
     
  title: 'Luda Log',

  hideOnScroll: true,

      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Projects',
        },

        {
          to: '/blog',
          label: 'Dev Log',
          position: 'left',
        },

        {
          to: '/archive',
          label: 'Archive',
          position: 'left',
        },
        {
          to: '/archive-room',
          label: 'LudaRota',
          position: 'left',
        },

        {
          href: 'https://github.com/park-yina',
          label: 'GitHub',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub',
        },

        {
          href: 'https://park-yina.github.io/',
          label: 'Blog',
          position: 'right',
          className: 'header-blog-link',
          'aria-label': 'GitHub Blog',
        },
      ],
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.nightOwl,
    },
  }),
};

export default config;
