package static.code.service;

 public StoreStatus resolveStatus(Store store) {
        LocalDateTime now = LocalDateTime.now();
        if (store.getClosedAt() != null) {
            if (!store.getClosedAt().isAfter(now)) {
                return StoreStatus.CLOSED;
            }
        }

        if (store.getIsActive()
                && store.getOpenAt() != null
                && store.getOpenAt().isAfter(now)) {
            return StoreStatus.SCHEDULED;
        }

        // 운영중 (폐점 예정 포함)
        if (store.getIsActive()
                && store.getOpenAt() != null
                && !store.getOpenAt().isAfter(now)) {
            return StoreStatus.OPERATING;
        }

        if (store.getIsActive()
                && store.getOpenAt() == null) {
            return StoreStatus.NOT_OPENED;
        }

        return StoreStatus.NOT_OPENED;
}