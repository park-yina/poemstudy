q = Queue()

with subscribers_lock:
    subscribers.append(q)

try:

    while True:
        data = q.get()

        yield sse(data)

finally:

    with subscribers_lock:

        if q in subscribers:
            subscribers.remove(q)