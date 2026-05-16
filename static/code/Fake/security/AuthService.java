package com.parkyina.fakejumping.security;

import java.time.LocalDateTime;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AdminMapper adminMapper;
    private final TokenMapper tokenMapper;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
        AdminMapper adminMapper,
        TokenMapper tokenMapper,
        JwtUtils jwtUtils,
        PasswordEncoder passwordEncoder
    ) {
        this.adminMapper = adminMapper;
        this.tokenMapper = tokenMapper;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public TokenResult signIn(LoginRequest request) {

        Admin admin =
            adminMapper.findByUsername(
                request.getUsername()
            );

        validateCredentials(
            request,
            admin
        );

        String accessToken =
            jwtUtils.createAccessToken(
                admin.getId(),
                admin.getUsername(),
                admin.getRole()
            );

        String refreshToken =
            jwtUtils.createRefreshToken(
                admin.getId(),
                admin.getUsername(),
                admin.getRole()
            );

        tokenMapper.upsertRefreshToken(
            admin.getId(),
            refreshToken,
            LocalDateTime.now().plusDays(7)
        );

        return new TokenResult(
            accessToken,
            refreshToken,
            "Bearer",
            3600L
        );
    }

    private void validateCredentials(
        LoginRequest request,
        Admin admin
    ) {

        if (admin == null) {
            throw invalidCredentials();
        }

        boolean matched =
            passwordEncoder.matches(
                request.getPassword(),
                admin.getPassword()
            );

        if (!matched) {
            throw invalidCredentials();
        }
    }

    private IllegalArgumentException invalidCredentials() {

        return new IllegalArgumentException(
            "Invalid username or password"
        );
    }
}
