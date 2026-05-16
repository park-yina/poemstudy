http

    /*
     * JWT 기반 Stateless 인증 구조
     */
    .sessionManagement(session ->
            session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
            )
    )

    /*
     * API 접근 권한 설정
     */
    .authorizeHttpRequests(auth -> auth

            .requestMatchers(
                    "/auth/sign-in",
                    "/auth/refresh"
            ).permitAll()

            .requestMatchers("/api/**")
            .hasAnyRole(anyRoles)

            .anyRequest()
            .authenticated()
    )

    /*
     * JWT 인증 필터 등록
     */
    .addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class
    );    http

    /*
     * JWT 기반 Stateless 인증 구조
     */
    .sessionManagement(session ->
            session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
            )
    )

    /*
     * API 접근 권한 설정
     */
    .authorizeHttpRequests(auth -> auth

            .requestMatchers(
                    "/auth/sign-in",
                    "/auth/refresh"
            ).permitAll()

            .requestMatchers("/api/**")
            .hasAnyRole(anyRoles)

            .anyRequest()
            .authenticated()
    )

    /*
     * JWT 인증 필터 등록
     */
    .addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class
    );
}
