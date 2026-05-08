// @ts-check

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */

const config = {
  title: 'Luda Log',

  tagline: '현실 문제를 코드로 밀어붙인 기록',

  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://poemtudy.site',

  baseUrl: '/',

  organizationName: 'park-yina',

  projectName: 'poemstudy',

  onBrokenLinks: 'throw',

  onBrokenMarkdownLinks: 'warn',

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

        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    ({
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