const worldrankStreamPseudo = `
q = Queue()

subscribers.append(q)

while True:

    try:
        data = q.get(timeout=30)

        yield sse(data)

    except Empty:

        yield ping()
`;