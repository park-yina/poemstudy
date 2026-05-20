---
title: ISC컨트롤러 및 AWS-WEBRTC를 통한 카메라 제어
description: 서울예대 재학시절 알게된 임베디드 개발자와 협업을 통해 진행한 프로젝트입니다.
status: Deployed
stack: Flutter / Flask / JS / Node.js
tags:
  - flutter
  - flask
  - webrtc
  - aws
  - realtime
  - streaming
  - synchronization
  - remote-control
  - camera-control
  - runtime
  - mvp
  - vibe-coding
  - collaboration
---
# IoT

서울예술대학교 재학 시절 알게 된 임베디드 개발자와의 협업으로 진행한 프로젝트입니다.

ISC 컨트롤러 프로젝트는 개발 도중 중단되었으나,
AWS WebRTC 기반 카메라 제어 프로젝트는 이후 외주 형태로 이어져
(2026.05 기준) 실제 상용 환경에 납품 및 운영이 완료되었습니다.

프로젝트 진행 과정에서는:

- 통신 프로토콜 기반 신호 검증
- 동시 제어 요청 발생 시 충돌 처리
- 제한된 기간 내 MVP 구조 설계
- 새로운 기술 스택(Node.js) 기반의 빠른 구현
- iOS / AOS 환경 대응 및 웹앱 구조 검증
- LTE 환경에서 안정적으로 동작할 수 있는 백엔드 구조 설계

등의 문제를 중심으로 구조를 설계했습니다.

특히 짧은 기간 안에
실제 동작 가능한 제어 구조를 우선 검증해야 했기 때문에,
속도와 안정성 사이의 균형을 지속적으로 고민했던 프로젝트였습니다.