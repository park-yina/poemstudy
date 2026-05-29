listener = doc_ref.on_snapshot(
    world_rank_listener(group_id, item_id)
)
for q in subscribers:

    try:
        q.put(updated_rank_data)

    except:
        pass