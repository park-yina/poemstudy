package com.parkvina.fakejumping.service;

import com.parkvina.fakejumping.mapper.AdminMapper;
import com.parkvina.fakejumping.mapper.StoreMapper;

import jakarta.annotation.PostConstruct;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class StoreScheduler {

    private final StoreMapper storeMapper;
    private final AdminMapper adminMapper;

    /*
     * 서버 재시작 시 운영 상태 동기화
     */
    @PostConstruct
    public void init() {

        processClosingStores();
    }

    /*
     * 폐점 매장 관리자 계정 자동 비활성화
     */
    @Scheduled(
            cron = "0 0 0 * * *",
            zone = "Asia/Seoul"
    )
    public void processClosingStores() {

        LocalDateTime now = LocalDateTime.now();

        List<Long> storeIds =
                storeMapper.findStoresToDeactivateAdmins(now);

        for (Long storeId : storeIds) {

            adminMapper.deactivateStoreAdmins(storeId);

            log.info(
                    "[Scheduler] 관리자 비활성화 완료 - storeId={}",
                    storeId
            );
        }
    }
}