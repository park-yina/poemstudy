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

  ],
};
