with version_lock:

    world_rank_versions[cache_key] = (
        world_rank_versions.get(cache_key, 0) + 1
    )
def make_search_cache_key(query, key):

    version_sum = sum(
        world_rank_versions.values()
    )

    return f"{query}_{key}_{version_sum}"