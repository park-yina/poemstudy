import java.time.LocalDateTime;

public class TokenMapper {
        @Insert("""
INSERT INTO admin_refresh_token (admin_id, refresh_token, expires_at)
VALUES (#{adminId}, #{refreshToken}, #{expiresAt})
ON DUPLICATE KEY UPDATE
    refresh_token = #{refreshToken},
    expires_at = #{expiresAt},
    updated_at = NOW()
""")
    void upsertRefreshToken(
            @Param("adminId") Long adminId,
            @Param("refreshToken") String refreshToken,
            @Param("expiresAt") LocalDateTime expiresAt
    );
}
