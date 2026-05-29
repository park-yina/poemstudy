export const sseFolder={
    id: 'sse',

  title: 'sseRuntime',

  type: 'FOLDER',
  children: [

    {
      id: 'worldrankStreamPseudo',

      title: 'worldrankStreamPseudo.py',

      type: 'CODE',

      language: 'python',

      previewUrl:
        '/code/JumpingBattle/sse/worldrankStreamPseudo.py',

      description:
        'Queue 기반 SSE stream 처리 구조. 장시간 연결 유지 환경에서 heartbeat와 subscriber fanout 처리.',

      path:
        'JumpingBattleNow/sse/worldrankStreamPseudo.py',
    },

    {
      id: 'delta-sync-versioning.fragment.py',

      title: 'DeltaSyncVersioning.py',

      type: 'CODE',

      language: 'python',

      previewUrl:
        '/code/JumpingBattle/sse/delta-sync-versioning.fragment.py',

      description:
        '전체 snapshot 재전송 대신 version 기반 delta payload 전략을 사용하여 변경된 랭킹 데이터만 부분 갱신하도록 구성.',

      path:
        'runtime/sse/DeltaSyncVersioning.py',
    },

    {
      id: 'snapshot-stream-bridge.fragment.py',

      title: 'SnapshotStreamBridge.py',

      type: 'CODE',

      language: 'python',

      previewUrl:
        '/code/JumpingBattle/sse/snapshot-stream-bridge.fragment.py',

      description:
        'Firestore snapshot 이벤트를 SSE stream으로 브릿징하여 실시간 랭킹 변경 사항을 클라이언트로 전달하는 구조.',

      path:
        'runtime/sse/SnapshotStreamBridge.py',
    },

    {
      id: 'stream-subscriber-lifecycle.py',

      title: 'StreamSubscriberLifecycle.py',

      type: 'CODE',

      language: 'python',

      previewUrl:
        '/code/JumpingBattle/sse/stream-subscriber-lifecycle.py',

      description:
        'SSE 연결 생성 및 종료 시 subscriber queue를 등록/정리하여 emitter 누적 및 메모리 점유 문제를 방지하는 lifecycle 관리 구조.',

      path:
        'runtime/sse/StreamSubscriberLifecycle.py',
    },

    {
      id: 'worldrank-cache-routing.fragment.py',

      title: 'WorldrankCacheRouting.py',

      type: 'CODE',

      language: 'python',

      previewUrl:
        '/code/JumpingBattle/sse/worldrank-cache-routing.fragment.py',

      description:
        '실시간 랭킹 데이터를 flat cache key 기반으로 관리하여 O(1) 접근 및 부분 갱신이 가능하도록 구성한 cache routing 구조.',

      path:
        'runtime/sse/WorldrankCacheRouting.py',
    },

  ],
};

