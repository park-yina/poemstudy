def update_search_index(cache_key, rank_list):

    for idx, user in enumerate(rank_list):

        name = normalize(user["name"])

        search_index[name].append(
            (cache_key, idx)
        )
