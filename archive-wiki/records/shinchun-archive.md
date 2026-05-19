---
title: shinchun-archive
description: 현재 상용중인 서비스인 신춘회관을 사용하며 느낀 불편을 토대로 제작한 신춘문예 당선작 아카이빙 사이트입니다.
status: Deployed
stack: Flask / AWS Lambda / HTML
tags:
  - flask
  - aws-lambda
  - tailwind
  - zappa
---

# shinchun-archive

기존 신춘회관 서비스 사용 과정에서 느꼈던
검색 및 필터링 구조의 불편함을 개선하기 위해 제작한 신춘문예 아카이빙 프로젝트입니다.

특히:

- 모바일 환경에서의 가독성과 탐색 경험
- 작품 검색 및 필터링 흐름 개선
- 빠른 접근성을 고려한 UI 구조
- S3 및 Firebase Storage 기반 백업 구조

등을 중심으로 설계하였습니다.

단순 아카이빙보다,
실제 사용자의 탐색 흐름과 접근 경험 개선에 초점을 두고 진행한 프로젝트입니다.