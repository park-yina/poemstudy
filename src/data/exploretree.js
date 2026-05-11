export const explorerTree = [

  {
    label: 'INTRO',

    items: [

      {
        id: 'summary',
        title: '핵심 요약',
        type: 'DOCUMENT',
      },

      {
        id: 'strength',
        title: '운영 관점의 강점',
        type: 'DOCUMENT',
      },
    ],
  },

  {
    label: 'PROJECTS',

    groups: [

      {
        title: '외주 프로젝트',

        children: [

          {
            title: '점핑배틀 스트리밍 플랫폼',

            children: [

              {
                id: 'jumpingbattle-intro',
                title: '프로젝트 소개',
                type: 'DOCUMENT',
              },

              {
                id: 'jumpingbattle-planning',
                title: '기획 / 운영 관점',
                type: 'DOCUMENT',
              },

              {
                id: 'jumpingbattle-implementation',
                title: '기술 구현',
                type: 'DOCUMENT',
              },

              {
                id: 'jumpingbattle-trouble',
                title: '트러블슈팅',
                type: 'DOCUMENT',
              },
            ],
          },
        ],
      },
    ],
  },
];