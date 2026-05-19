---
title: fakejumping-admin
description: 관리자 인증, 디바이스 관리, 운영 흐름을 중심으로 구축된 Spring Boot 기반 운영 시스템.
status: developing
stack: Spring Boot / JWT / MyBatis / Docker / AWS
workspaceHref: /workspace/fakejumping
tags:
  - spring-boot
  - jwt
  - mybatis
  - docker
  - aws
---

# fakejumping-admin

Spring Boot 기반으로 구축된 관리자 운영 시스템입니다.

현재 구현 범위:

- JWT 기반 인증 및 Refresh Token 구조
- 관리자 권한 처리 및 인증 필터
- KPI 및 운영 관리 기능
- 가상 Device 등록 / 삭제 / 조회 기능
- Runtime 상태 관리 및 운영 흐름 처리
- Docker 기반 배포 환경 구성