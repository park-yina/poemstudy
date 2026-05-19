    @Select("""
            SELECT DISTINCT s.id
            FROM store s
            JOIN admin a ON a.store_id = s.id
            WHERE s.closed_at <= #{now}
            AND a.status = 'ACTIVE'
            AND a.role = 'STORE_ADMIN'
            """)
    List<Long> findStoresToDeactivateAdmins(LocalDateTime now);
    @Select("""
    SELECT COUNT(*)
    FROM store
    WHERE is_active = 1
      AND open_at IS NOT NULL
      AND open_at <= NOW()
      AND (closed_at IS NULL OR closed_at > NOW())
      AND name NOT LIKE '%테스트%'
""")
    Long countOperatingStores();