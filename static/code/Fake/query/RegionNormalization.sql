SELECT DISTINCT
    CASE
        WHEN city IS NULL OR city = '' THEN district
        ELSE city
    END
FROM store
WHERE region = #{region}
ORDER BY 1