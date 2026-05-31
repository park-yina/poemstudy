def ensure_world_listener(
    group_id,
    item_id
):

    key = make_world_cache_key(
        group_id,
        item_id
    )

    if key in world_rank_listeners:
        return

    attach_listener(
        group_id,
        item_id
    )