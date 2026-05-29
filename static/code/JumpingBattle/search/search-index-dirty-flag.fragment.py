search-index-dirty-flag.fragment.py
while True:

    time.sleep(3)

    if search_index_dirty:

        rebuild_search_index()