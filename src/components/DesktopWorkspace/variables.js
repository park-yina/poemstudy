export const extensionMap = {

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
html: {

  image:
    '/img/free-icon-html-file-1891365.png',

  type: 'DOCUMENT',
},
  default: {
    icon: 'fa-file',
    color: '#d1d5db',
    type: 'FILE',
  },
  
};

/* =========================
   DESKTOP ITEMS
========================= */

export const desktopItems = [

{
  id: 'resume-pdf',

  title: 'resume.pdf',

  type: 'PDF',

  location: 'Documents',

  icon: 'fa-file-pdf',

  color: '#ff5f57',

  launch: {

    type: 'secure',

    file: 'resume.pdf',
  },
},
{
  id: 'InvetorySkills-html',
  title: '경력기술서.html',
  type: 'html',

  location: 'Documents',
url: '/preview/runtime-profile.html',
  launch: {

  type: 'secure',

  file: 'InventorySkills.html',
  
},
},

  {
    id: 'portfolio',

    title: 'fakejumping-admin',

    location: 'Projects',

    shortcut: true,

    launch: {

      type: 'github',

      url:
        'https://github.com/park-yina',
    },

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

    location: 'Documents',

    shortcut: true,

    launch: {

      type: 'github',

      url:
        'https://github.com/park-yina',
    },

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

    location: 'Runtime',

    shortcut: false,

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

export const weatherMap = {

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

/* =========================
   RUNTIME LINKS
========================= */

export const runtimeLinks = [

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
   HELPERS
========================= */

export function getExtension(title) {

  if (!title.includes('.')) {
    return 'folder';
  }

  return title
    .split('.')
    .pop()
    .toLowerCase();
}

/* =========================
   PARSED ITEMS
========================= */

export const parsedItems =
  desktopItems.map((item) => {

    const ext =
      getExtension(item.title);

    const meta =
      extensionMap[ext] ||
      extensionMap.default;

    return {

      ...meta,

      ...item,
    };
  });