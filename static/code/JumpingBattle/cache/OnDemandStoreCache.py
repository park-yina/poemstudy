with cache_lock:

    if cache_key not in store_rank_cache:

        store_rank_cache[cache_key] = (
            read_store_rank_data_for_id(
                map_id,
                group_id,
                item_id
            )
        )