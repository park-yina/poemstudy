    public String rotateRefreshToken(String refreshToken){
        if (refreshToken == null || !jwtUtils.isValidToken(refreshToken)) {
            throw new RuntimeException("Refresh Token 이 유효하지 않습니다.");
        }
        Long adminId = jwtUtils.getAdminId(refreshToken);
        Long storeId=jwtUtils.getStoreId(refreshToken);

        AdminRefreshToken stored = tokenMapper.findByAdminId(adminId);
        if (stored == null) {
            throw new RuntimeException("저장된 토큰 없음");
        }
        if (!refreshToken.equals(stored.getRefreshToken())) {
            throw new RuntimeException("토큰 불일치 (탈취 가능)");
        }

        String username = jwtUtils.getUsername(refreshToken);
        AdminRole role = AdminRole.valueOf(jwtUtils.getRole(refreshToken));
        String newToken = jwtUtils.createRefreshToken(adminId, username, role,storeId);
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(7);
        tokenMapper.upsertRefreshToken(adminId, newToken, expiresAt);

        return newToken;
}