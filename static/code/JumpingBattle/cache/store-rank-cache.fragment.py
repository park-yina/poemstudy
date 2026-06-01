with store_rank_lock:

    cached = store_rank_cache.get(cache_key)

if cached:
    return cached


result = {
    "map_info": map_info,
    "rank_data": {
        "rank_list": rank_list
    }
}

with store_rank_lock:

    store_rank_cache[cache_key] = result