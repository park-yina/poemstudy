export const searchFolder = {

  id: 'search',

  title: 'searchRuntime',

  type: 'FOLDER',

  children: [

    {
      id: 'incremental-search-index.fragment.py',

      title: 'IncrementalSearchIndex.py',

      type: 'CODE',

      language: 'python',

      previewUrl:
        '/code/JumpingBattle/search/incremental-search-index.fragment.py',

      description:
        '실시간 랭킹 데이터 변경 시 전체 재색인을 수행하지 않고 변경된 section만 부분 갱신하도록 구성한 incremental indexing 구조.',

      path:
        'runtime/search/IncrementalSearchIndex.py',
    },

    {
      id: 'search-index-dirty-flag.fragment.py',

      title: 'SearchIndexDirtyFlag.py',

      type: 'CODE',

      language: 'python',

      previewUrl:
        '/code/JumpingBattle/search/search-index-dirty-flag.fragment.py',

      description:
        '잦은 실시간 갱신 환경에서 search index 재생성 비용을 줄이기 위해 dirty flag 기반 rebuild 전략을 적용한 구조.',

      path:
        'runtime/search/SearchIndexDirtyFlag.py',
    },

  ],
};