if key in world_rank_listeners:

    unsubscribe = (
        world_rank_listeners[key]
    )

    unsubscribe()

    del world_rank_listeners[key]