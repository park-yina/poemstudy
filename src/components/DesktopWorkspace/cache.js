export const cacheFolder = {

  id: 'cache',

  title: 'cacheRuntime',

  type: 'FOLDER',

  children: [

    {
      id: 'worldrank-cache-routing.fragment.py',

      title: 'WorldrankCacheRouting.py',

      type: 'CODE',

      language: 'python',

      previewUrl:
        '/code/JumpingBattle/cache/worldrank-cache-routing.fragment.py',

      description:
        '실시간 랭킹 데이터를 flat cache key 기반으로 관리하여 O(1) 접근 및 부분 갱신이 가능하도록 구성한 cache routing 구조.',

      path:
        'runtime/cache/WorldrankCacheRouting.py',
    },

  {
  id: 'on-demand-store-cache.fragment.py',

  title: 'OnDemandStoreCache.py',

  type: 'CODE',

  language: 'python',

  previewUrl:
    '/code/JumpingBattle/cache/OnDemandStoreCache.py',

  description:
    '전국 랭킹은 초기 캐시와 snapshot listener로 유지하고, 지점별 랭킹은 요청 시점에 cache key 단위로 생성하여 불필요한 Firestore read를 줄이도록 구성한 on-demand store cache 구조.',

  path:
    'runtime/cache/OnDemandStoreCache.py',
},

    {
      id: 'versioned-cache-invalidation.fragment.py',

      title: 'VersionedCacheInvalidation.py',

      type: 'CODE',

      language: 'python',

      previewUrl:
        '/code/JumpingBattle/cache/versioned-cache-invalidation.fragment.py',

      description:
        'cache version 증가 기반 invalidation 전략을 사용하여 부분 갱신 환경에서 stale cache 문제를 완화한 구조.',

      path:
        'runtime/cache/VersionedCacheInvalidation.py',
    },

    {
      id: 'store-rank-cache.fragment.py',

      title: 'StoreRankCache.py',

      type: 'CODE',

      language: 'python',

      previewUrl:
        '/code/JumpingBattle/cache/store-rank-cache.fragment.py',

      description:
        '지점별 랭킹 데이터를 cache key 단위로 관리하여 store rank 조회 시 Firestore read 부하를 줄이기 위한 캐시 구조.',

      path:
        'runtime/cache/StoreRankCache.py',
    },

  ],
};