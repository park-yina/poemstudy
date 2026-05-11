# Luda Log

개발과 운영, 그리고 기록을 함께 남기는 개발자 포트폴리오 아카이브입니다.

단순한 프로젝트 나열보다,  
“왜 이런 구조를 선택했는가”와  
“운영 환경에서 어떤 문제를 해결했는가”를 중심으로 구성하였습니다.

---

## Overview

Luda Log는 Docusaurus 기반으로 제작된 개인 포트폴리오 사이트입니다.

실제 운영 경험이 있는 프로젝트들을 기반으로:

- 실시간 시스템
- 다운로드/스트리밍 구조
- 관리자 시스템
- CI/CD
- Runtime 통계 시각화
- 운영 아카이빙

등을 하나의 “developer workspace” 컨셉으로 정리했습니다.

---

## Main Features

### Runtime Workspace UI

실제 IDE 및 운영 콘솔을 모티브로 제작한 인터랙티브 포트폴리오 UI입니다.

- draggable / resizable workspace
- explorer sidebar
- runtime preview tabs
- html/pdf preview system
- terminal boot sequence
- runtime logs animation

---

### Runtime Statistics

GitHub Actions + cloc 기반 코드 통계 시스템입니다.

프로젝트별:

- TOTAL LOC
- language ratio
- runtime environment
- branch state

등을 실시간 JSON으로 생성하여 시각화합니다.

예시:

```txt
branch   : stage
runtime  : aws-ec2
stack    : spring boot

TOTAL LOC : 10,875
