export const listenerFolder = {

  id: 'listener',

  title: 'listenerRuntime',

  type: 'FOLDER',

  children: [

    {
      id: 'firestore-snapshot-listener.fragment.py',

      title: 'FirestoreSnapshotListener.py',

      type: 'CODE',

      language: 'python',

      previewUrl:
        '/code/JumpingBattle/listener/firestore-snapshot-listener.fragment.py',

      description:
        'Firestore snapshot 이벤트를 수신하여 실시간 랭킹 캐시를 갱신하는 listener 등록 구조.',

      path:
        'runtime/listener/FirestoreSnapshotListener.py',
    },

    {
      id: 'listener-registry.fragment.py',

      title: 'ListenerRegistry.py',

      type: 'CODE',

      language: 'python',

      previewUrl:
        '/code/JumpingBattle/listener/listener-registry.fragment.py',

      description:
        '중복 listener 등록을 방지하기 위해 활성 listener를 registry 형태로 관리하는 구조.',

      path:
        'runtime/listener/ListenerRegistry.py',
    },

    {
      id: 'lazy-listener-attach.fragment.py',

      title: 'LazyListenerAttach.py',

      type: 'CODE',

      language: 'python',

      previewUrl:
        '/code/JumpingBattle/listener/lazy-listener-attach.fragment.py',

      description:
        '사용자가 실제로 조회한 랭킹에 대해서만 listener를 연결하여 불필요한 Firestore watch 비용을 줄이기 위한 구조.',

      path:
        'runtime/listener/LazyListenerAttach.py',
    },

    {
      id: 'listener-cleanup.fragment.py',

      title: 'ListenerCleanup.py',

      type: 'CODE',

      language: 'python',

      previewUrl:
        '/code/JumpingBattle/listener/listener-cleanup.fragment.py',

      description:
        '사용하지 않는 listener를 해제하여 장시간 운영 환경에서 리소스 점유를 줄이기 위한 lifecycle 관리 구조.',

      path:
        'runtime/listener/ListenerCleanup.py',
    },

  ],
};