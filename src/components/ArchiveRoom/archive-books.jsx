import React from 'react';

export const jumpingBattleBook = {

  id: 'jumping-battle',

 title: (
  <>
    JUMPING BATTLE 1
    <br />
        <br />

    랭킹편
  </>
),

  subtitle:
    'Streaming / Ranking',

  type: 'ARCHIVE',

  arcana: 'syslog',

  sticky: 'LIVE OPS',

  stickyColor: 'yellow',

  description:
    '30개 이상의 매장에서 운영된 스트리밍 및 실시간 랭킹 시스템 기록',

  gates: [
{
  id: 'realtime',

  gate: 'REALTIME',

  icon: '?',

  description:
    '실시간 랭킹과 이벤트 스트림 구조',

  cards: [

    {
      title:
        'Polling VS SSE VS WebSocket',

      subtitle:
        '느슨한 실시간성과 운영비용의 균형',

      label:
        'BATTLE',

      keyword:
        'BALANCE',

      artwork:
        '/img/cards/BALANCE.png',

      decoding: {

        summary:
          '실시간 요구사항과 운영 비용 사이의 구조 선택 기록',

        problem: [
          'Polling 구조 채택 시 증가하는 반복 읽기 요청과 네트워크 부하',
          '잦은 랭킹 갱신 환경에서 발생 가능한 쓰기 지연 문제',
          'WebSocket 연결 유지에 따른 서버 자원 비용 증가',
          '단방향 이벤트 중심 구조에서 불필요한 양방향 통신',
        ],

        solution: [
          'SSE 기반 단방향 이벤트 구조 도입',
          'store_meta 기반 변경 감지 구조 설계',
          '읽기 비용 감소를 위한 메타 데이터 분리',
        ],

        result: [
          '반복 읽기 요청 감소',
          '운영 비용 중심 구조 확보',
          '느슨한 실시간성 환경 최적화',
        ],
      },
    },

    {
      title:
        'SSE 기반 부분 갱신 구조 설계',

      subtitle:
        '이유없는 지연은 없다',

      label:
        'PATCH',

      keyword:
        'SSE',

      artwork:
        '/img/cards/SSE.png',

      decoding: {

        summary:
          'SSE를 활용한 부분 갱신 구조',

        problem: [
          '전체 데이터 재요청 문제',
          '상위랭커 캐싱 전략의 실패',
          '스냅샷의 과도한 읽기 비용으로 인한 UI교체 지연',
        ],

        solution: [
          '랭킹 변동시 필요한 데이터의 단위를 재정의',
          '고유 키 기반으로 최소 단위의 랭킹 변경만 전달하도록 구조 분리',
          '랭킹 데이터와 메타 데이터의 분리',
        ],

        result: [
          '읽기 비용 감소',
          '부분 갱신 중심의 실시간 흐름 확보',
        ],
      },
    },

    {
      title:
        'Version Snapshot Guard',

      subtitle:
        'Consistency Layer',

      label:
        'VERSION',

      keyword:
        'SYNC',

      artwork:
        '/img/cards/CACHE.png',

      decoding: {

        summary:
          'SSE 이벤트의 순서와 누락을 version snapshot으로 검증하는 기록',

        problem: [
          '네트워크 재연결 후 일부 이벤트가 건너뛰어질 수 있었다',
          '오래된 이벤트가 최신 UI 상태를 덮어쓸 위험이 있었다',
        ],

        solution: [
          '이벤트마다 monotonically increasing version 부여',
          '클라이언트의 마지막 적용 버전과 서버 버전 비교',
          'version gap 감지 시 snapshot fallback 실행',
        ],

        result: [
          'stale update 차단',
          '재연결 이후 상태 복구 안정화',
        ],
      },
    },

  ],
},

{
  id: 'trouble',

  gate: 'TROUBLE',

  icon: '?',

  description:
    '운영 과정에서 발생한 장애와 구조 개선 기록',

  cards: [

    {
      title:
        '상위 랭킹 캐싱 전략의 실패',

      subtitle:
        'Top Rank Cache Collapse',

      label:
        'FAILURE',

      keyword:
        'CACHE',

      artwork:
        '/img/cards/FAIL.png',

      decoding: {

        summary:
          '상위 랭킹 중심 캐시 전략이 실제 운영 환경에서 실패한 기록',

        problem: [
          '상위권 교체 빈도가 예상보다 높았다',
          'cache invalidation이 반복적으로 발생했다',
          '전체 랭킹 비교 비용이 증가했다',
        ],

        solution: [
          'Top Rank 중심 전략 폐기',
          'storeId 기반 캐시 경계 재설계',
          '지점 단위 캐시 구조로 전환',
        ],

        result: [
          '캐시 안정성 확보',
          '불필요한 invalidation 감소',
        ],
      },
    },

    {
      title:
        'Signed URL 기반 다운로드 보안',

      subtitle:
        'Controlled Access',

      label:
        'SECURITY',

      keyword:
        'SIGNED',

      artwork:
        '/img/cards/SIGNED.png',

      decoding: {

        summary:
          '다운로드 링크 직접 공유 문제를 해결하기 위한 접근 제어 구조',

        problem: [
          '파일 URL 직접 공유 가능',
          '외부 접근 제어 불가',
        ],

        solution: [
          '만료 시간 기반 Signed URL 도입',
          '다운로드 횟수 제한 적용',
        ],

        result: [
          '접근 제어 강화',
          '다운로드 보안 확보',
        ],
      },
    },

    {
      title:
        'Lambda 다운로드 서버 분리',

      subtitle:
        'Serverless Distribution',

      label:
        'LAMBDA',

      keyword:
        'SERVERLESS',

      artwork:
        '/img/cards/LAMBDA.png',

      decoding: {

        summary:
          '파일 전송 기능을 별도 서버리스 구조로 분리한 기록',

        problem: [
          '다운로드 요청 편차가 컸다',
          '실시간 랭킹 서버와 역할 분리가 필요했다',
        ],

        solution: [
          'Lambda 기반 다운로드 API 분리',
          'Firebase Storage 직접 연동',
        ],

        result: [
          '기능별 독립 배포 가능',
          '운영 구조 단순화',
        ],
      },
    },

  ],
},


  ],
};
export const jumpingBattledownloadBook = {
  id: 'jumping-battle-download',

  useGates: false,

  title: (
    <>
      JUMPING BATTLE 2
      <br />
      <br />
      다운로드편
    </>
  ),

  subtitle:
    'Download / Firebase Storage',

  type: 'ARCHIVE',

  arcana: 'syslog',

  sticky: 'LIVE OPS',

  stickyColor: 'yellow',

  description:
    'Firebase Storage 기반 다운로드, 접근 제어, 서버리스 분리 기록',

  cards: [
    {
      title:
        'Lambda로의 이사',

      subtitle:
        'Serverless',

      label:
        'LAMBDA',

      keyword:
        'SERVERLESS',

      artwork:
        '/img/cards/LAMBDA.png',

      decoding: {
        summary:
          '다운로드 요청을 별도 Lambda API로 분리한 기록',

        problem: [
          '다운로드 요청 편차가 컸다',
          '실시간 랭킹 서버와 파일 전송 역할을 분리해야 했다',
          '항상 켜진 서버로 다운로드 트래픽을 감당하면 비용 부담이 커졌다',
        ],

        solution: [
          'Lambda 기반 다운로드 API 분리',
          'Firebase Storage와 직접 연동',
          '다운로드 흐름을 랭킹 런타임과 독립 배포',
        ],

        result: [
          '기능별 독립 배포 가능',
          '유휴 시간 비용 감소',
          '운영 구조 단순화',
        ],
      },
    },

    {
      title:
        'Signed URL 기반 접근 제어',

      subtitle:
        '저장소의 노출은 위험하다.',

      label:
        'SIGNED',

      keyword:
        'SECURITY',

      artwork:
        '/img/cards/SIGNED.png',

      decoding: {
        summary:
          '직접 파일 URL 공유를 막기 위해 만료 가능한 접근 URL을 도입한 기록',

        problem: [
          '파일 URL이 노출되면 외부 공유가 가능했다',
          '고정 URL은 접근 권한의 수명을 제어하기 어려웠다',
          '프록시 다운로드는 서버 트래픽 비용을 증가시켰다',
        ],

        solution: [
          '만료 시간 기반 Signed URL 생성',
          '서버에서 권한 확인 후 임시 URL 반환',
          'Storage 직접 접근은 유지하되 접근 수명을 제한',
        ],

        result: [
          '다운로드 보안 강화',
          '서버 전송 부하 감소',
          '콘텐츠 배포 흐름 단순화',
        ],
      },
    },

    {
      title:
        'Download Limit Policy',

      subtitle:
        '다운로드 운영비용 증가 예방',

      label:
        'LIMIT',

      keyword:
        'COUNT',

      artwork:
        '/img/cards/DANGER.png',

      decoding: {
        summary:
          '반복 다운로드와 링크 남용을 제어하기 위한 제한 정책 기록',

        problem: [
          '짧은 시간에 반복 다운로드가 발생할 수 있었다',
          '링크 공유 이후 다운로드 횟수를 추적하기 어려웠다',
          '무제한 접근은 Storage 비용 증가로 이어질 수 있었다',
        ],

        solution: [
          '요청 단위 다운로드 카운트 기록',
          '사용자와 파일 기준 제한 정책 적용',
          '만료 URL과 다운로드 횟수 제한을 함께 사용',
        ],

        result: [
          '비정상 반복 요청 억제',
          '운영 비용 예측 가능성 향상',
          '다운로드 접근 제어 강화',
        ],
      },
    },

  ],
};
export const cameraControlBook={
    id: 'aws-webrtc-camera-control',
      useGates: true,

  title: (
    <>
      카메라  <br />
      제어  <br />
      <br />프로젝트
      <br />
      <br />
      With 임베디드 협업
    </>
  ),
subtitle:
  'Real-time Camera Control',

  type: 'ARCHIVE',

  arcana: 'syslog',

  sticky: 'LIVE OPS',

  stickyColor: 'amber',

  description:
    '임베디드 개발자와의 협업 프로젝트로 웹을 통해 카메라를 제어하는 기록이 담겨있습니다.',
  gates: [
{
  id: 'decision',

  gate: 'DECISION',

  icon: '◇',


  description:
  '기술 설계 및 협업 과정에서의 의사결정 기록',
    cards:[
        {title:
        'KVS AWS WEBERC VS HandMade',

      subtitle:
  '협업 비용과 운영 비용의 균형',

      label:
        'BATTLE',

      keyword:
        'BALANCE',

      artwork:
        '/img/cards/BALANCE.png',

      decoding: {

       summary:
  '기술적 우수성보다 프로젝트 현실성을 우선하여 관리형 서비스를 선택한 기록',

     problem: [
  '직접 구축 시 높은 인프라 운영 비용',
  '협업 프로젝트에서 증가하는 QA 비용',
  'WebRTC 연결 품질 확보를 위한 추가 개발 부담',
  '제한된 일정 내 MVP 구축 필요',
],

solution: [
  'AWS WebRTC 관리형 서비스 채택',
  '연결 계층보다 제어 기능 구현에 개발 역량 집중',
  '자동화 테스트를 통한 검증 비용 절감',
],

result: [
  '서비스 비용으로 운영 복잡도 일부 대체',
  '협업 비용 감소',
  '빠른 MVP 구축 및 안정적인 서비스 제공',
],
      },
    },
{
  title:
    'Protocol QA VS Device QA',
      subtitle:
  '반복 검증 비용의 최소화',
      label:
        'BATTLE',

        keyword: 'ISOLATION',

      artwork:
        '/img/cards/QA.png',

      decoding: {

       summary:
  '하드웨어 개발과 병렬로 프로토콜을 검증하기 위해 Mock Client 기반 테스트 환경을 구축한 기록',

problem: [
  '기능 검증 시마다 임베디드 장비 연결이 필요',
  '하드웨어 개발 중 반복적인 QA 요청 발생',
  '프로토콜 수정마다 전체 장비 테스트가 필요',
  '검증 과정이 개발 일정을 지연시키는 협업 병목 발생',
],

solution: [
  'Python 기반 Mock Client 구축',
  '제어 프로토콜 송수신 자동 검증',
  '장비 없이 명령 처리 로직 테스트 가능',
  '프로토콜 계층과 하드웨어 계층 분리',
],

result: [
  '프로토콜 검증 속도 향상',
  '임베디드 개발 의존도 감소',
  '반복 QA 비용 감소',
  '하드웨어 개발과 병렬 작업 가능',
],
      },
    },
  ]
},
{
  id:'realTime',
  gate: 'REALTIME',
  icon:'?',
  description:
  '실시간 시스템이 가진 연결·동기화·복구 문제를 다룬 기록',
  cards:[
{
  title:
    'Connection Ownership',

  subtitle:
    '실시간 연결의 식별 문제',

  label:
    'DANGER',

  keyword:
    'OWNERSHIP',

  artwork:
    '/img/cards/DANGER.png',

  decoding: {

    summary:
      '여러 클라이언트가 동일 제어 대상에 접근하면서 연결 상태 충돌이 발생한 기록',

    problem: [
      '여러 클라이언트가 하나의 제어 대상에 동시에 접속 가능',
      '모바일 환경에서 네트워크 재연결이 빈번하게 발생',
      '연결 등록과 제어 명령이 거의 동시에 처리되며 Race Condition 발생',
      '단순 Set 기반 관리만으로는 연결 순서를 보장할 수 없음',
    ],

    solution: [
      'IP 기반 연결 식별 적용',
      '가장 오래된 연결을 제어 주체로 유지',
      '추가 접속은 거부하고 이벤트 로그 기록',
      '연결 상태 변경 이력을 추적할 수 있도록 개선',
    ],

    result: [
      '동시 접속으로 인한 연결 충돌 제거',
      '제어 권한 일관성 확보',
      '모바일 재연결 환경 안정성 향상',
      '운영 중 원인 추적을 위한 로그 기반 분석 가능',
    ],
  },
}
  ]
}
  ]

};
export const fullstackPrimaryBooks = [
  jumpingBattleBook,
  jumpingBattledownloadBook,
  cameraControlBook,
];

export const fullstackSecondaryBooks = [
  {
    id: 'pain-diary',
    title: 'PAIN DIARY',
    subtitle: 'WEB / 기록 서비스',
    type: 'SIDE',
    sticky: 'DIARY',
    stickyColor: 'orange',
    description:
      '크래프톤 정글의 crud프로젝트의 일환으로 통증에 대한 기록 및 분석을 제공합니다.',
records: [
  '통증 발생 시간과 강도를 캘린더에 기록',
  '사용자별 통증 이력 영구 저장',
  '비공개 캘린더를 통한 개인 기록 보호',
  '공지 게시판을 통한 서비스 운영',
    'Spring Boot 기반 CRUD 구현',
    '나의 지난 일정 모아보기 기능',
    '종일 지속되는 통증에 대한 기록 가능'
],
  },
  {
    id: 'ledger-automation',
    title: 'LEDGER AUTOMATION',
    subtitle: '장부 / 자동화',
    type: 'SIDE',
    sticky: 'AUTO',
    stickyColor: 'blue',
    description:
      '매장 장부 자동화와 데이터 정리 흐름을 설계한 기록입니다.',
records: [
  '수기 장부 자동화',
  '객실 현황 실시간 시각화',
  'RGB 색상 분석 기반 상태 판별',
  '크롤링 없이 화면 구조 변화 대응',
  '청소시간의 20%이상 단축'
]
  },
];

export const appPrimaryBooks = [{
      id: 'catholic-diary',

  title: (
    <>
      Cat<br></br>Holic<br></br>Diary
    </>
  ),
subtitle:
  '종교의 다이어리화',

  type: 'ARCHIVE',

  arcana: 'diary',

  sticky: 'UserTest',

  stickyColor: 'blue',
useGates: false,
useCrystalArchive: true,
 description:
  '신앙 활동을 일회성 경험이 아닌 지속적으로 축적되는 개인 기록으로 전환하기 위해 제작한 프로젝트입니다.',
records: [
  {
    text:
      '전례력 데이터는 변경 주기가 매우 긴 공용 데이터였기 때문에 로컬 캐시를 우선 조회하는 구조를 적용했습니다.',
    sealColor:
      '#7c5cff',
  },
  {
    text:
      '미사와 묵상 중 발생하는 알림을 줄이기 위해 원터치 방해 금지 모드 기능을 설계했습니다.',
    sealColor:
      'midnightblue',
  },
  {
    text:
      'GPS를 활용하여 성당 방문 기록을 남기고 신앙 활동을 장소와 함께 아카이빙할 수 있도록 구성했습니다.',
    sealColor:
      'seagreen',
  },
  {
    text:
      '신앙 활동을 단순 일정이 아닌 누적되는 기록으로 바라보며 개인 다이어리 구조를 설계했습니다.',
    sealColor:
      'goldenrod',
  },
],
}

];

export const appSecondaryBooks = [{
      id: 'poemDay-app',

  title: (
    <>
      시요일
    </>
  ),
subtitle:
  '스터디 운영 과정의 불편함을 해결',

type: 'ARCHIVE',

arcana: 'diary',

sticky: 'USER TEST',

stickyColor: 'blue',

useGates: false,

useCrystalArchive: true,

description:
  '실제 시 스터디 운영 과정에서 반복적으로 발생하던 자료 공유와 기록 관리 문제를 해결하기 위해 제작한 크로스플랫폼 애플리케이션입니다.',
records: [
  {
    text:
      'Google Docs와 Firebase를 연동하여 스터디 자료 변경 사항을 자동으로 동기화했습니다.',
    sealColor:
      'cornflowerblue',
  },
  {
    text:
      '수동 공지와 자료 전달 과정을 줄이기 위해 Drive Webhook 기반 변경 감지 구조를 적용했습니다.',
    sealColor:
      '#7c5cff',
  },
  {
    text:
      '스터디 참여자가 항상 최신 자료를 확인할 수 있도록 문서 상태를 통합 관리했습니다.',
    sealColor:
      'seagreen',
  },
  {
    text:
      '실제 사용자 피드백을 반영하며 기능을 개선하고 운영 도구 형태로 발전시켰습니다.',
    sealColor:
      'goldenrod',
  },
  {
    text:
      '시는 줄바꿈과 행간 자체가 의미가 되기 때문에 산문시와 자유시 모두를 안정적으로 표현할 수 있도록 렌더링 구조를 별도로 설계했습니다.',
    sealColor:
      '#9f2430',
  },
],
}
  
];

