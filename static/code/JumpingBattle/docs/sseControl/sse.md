---
title: SSE Introduction
links:
  - label: Making Realtime Ranking
    href: /docs/category/making-realtime-ranking
---

실시간 랭킹 기능은 실제 외주 서비스인 JumpingBattle에서 사용된 구조를 기반으로 구성되었습니다.

Workspace에 수록된 코드들은 전체 서비스 소스가 아닌,
운영 과정에서 핵심이 되었던 Runtime Fragment들로 구성되어 있습니다.

부분 갱신(Delta Sync),
전국/지점 랭킹 분리 설계,
SSE 기반 실시간 전송,
구독자 관리 및 캐시 최적화와 관련된 코드들을 포함하고 있습니다.

자세한 설계 배경과 기술 의사결정은 오른쪽 링크 패널에서 확인할 수 있습니다.
