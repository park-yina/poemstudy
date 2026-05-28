def make_world_cache_key(group_id, item_id):

    return f"all_{group_id}_{item_id}"


def make_store_cache_key(map_id, group_id, item_id):

    return f"{map_id}_{group_id}_{item_id}"