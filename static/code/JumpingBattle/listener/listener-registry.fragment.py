key = make_world_cache_key(
    group_id,
    item_id
)

if key in world_rank_listeners:
    return

world_rank_listeners[key] = (
    listener
)