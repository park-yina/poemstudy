export const securityFolder = {

  id: 'security-folder',

  title: 'security',

  type: 'FOLDER',

  children: [

    {
      id: 'auth-service',

      title: 'AuthService.java',

      type: 'CODE',

      language: 'java',

      previewUrl:
        '/code/security/AuthService.java',

      description:
        'Spring Security login flow with access and refresh token rotation.',

      path:
        'src/main/java/com/parkyina/fakejumping/security/AuthService.java',
        
    },
        {
      id: 'refresh-token-rotation',

      title: 'RefreshTokenRotation.java',

      type: 'CODE',

      language: 'java',

      previewUrl:
        '/code/security/RefreshTokenRotation.java',

      description:
        'JWT토큰의 로테이션 구현.',

      path:
        'src/main/java/com/parkyina/fakejumping/security/RefreshTokenRotation.java',
        
    },
    {
  id: 'jwt-authentication-filter',

  title: 'JwtAuthenticationFilter.java',

  type: 'CODE',

  language: 'java',

  previewUrl:
    '/code/security/JwtAuthenticationFilter.java',

  description:
    'JWT 기반 Stateless 인증 필터. AccessToken 검증 후 SecurityContext에 인증 정보를 저장하며, 비활성화 계정 및 비정상 요청을 추가 차단.',

  path:
    'src/main/java/com/parkyina/fakejumping/security/JwtAuthenticationFilter.java',
},
{
  id: 'security-config',

  title: 'SecurityConfig.java',

  type: 'CODE',

  language: 'java',

  previewUrl:
    '/code/security/SecurityConfig.java',

  description:
    'Spring Security 기반 Stateless 인증 설정. JWT 인증 필터를 FilterChain에 연결하고, API별 접근 권한 및 인증 정책을 구성.',

  path:
    'src/main/java/com/parkyina/fakejumping/security/SecurityConfig.java',
},

  ],
};
export const serviceFolder = {

  id: 'service-folder',

  title: 'service',

  type: 'FOLDER',

  children: [

{
  id: 'store-status-resolver',

  title: 'resolveStatus()',

  type: 'CODE',

  language: 'java',

  previewUrl:
    '/code/service/StoreStatus.java',

  description:
    '매장의 운영 상태를 시간 기반으로 동적으로 판정하는 로직. 오픈 예정, 운영중, 폐점, 미오픈 상태를 단순 Boolean이 아닌 운영 정책 기준으로 해석.',

  path:
    'src/main/java/com/parkyina/fakejumping/service/StoreService.java',
},
{
  id: 'store-scheduler',

  title: 'StoreScheduler.java',

  type: 'CODE',

  language: 'java',

  previewUrl:
    '/code/service/StoreScheduler.java',

  description:
    '폐점 매장의 관리자 계정을 자동 비활성화하는 스케줄러. 서버 재시작 이후에도 운영 상태 정합성을 유지하기 위해 초기 동기화를 함께 수행.',

  path:
    'src/main/java/com/parkyina/fakejumping/service/StoreScheduler.java',
},

  ],
};

