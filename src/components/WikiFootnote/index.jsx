import React, {
  createContext,
  isValidElement,
  useContext,
  useMemo,
  useRef,
} from 'react';

const WikiFootnoteContext = createContext(null);

function normalizeFootnoteKey(children) {
  const read = (value) => {
    if (value == null || typeof value === 'boolean') {
      return '';
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value.map(read).join('');
    }

    if (isValidElement(value)) {
      return read(value.props.children);
    }

    return '';
  };

  return read(children).replace(/\s+/g, ' ').trim();
}

function createEmptyRegistry() {
  return {
    noteCounter: 0,
    refCounter: 0,
    notes: [],
    noteByKey: new Map(),
  };
}

export function WikiFootnoteProvider({children}) {
  const registryRef = useRef(createEmptyRegistry());

  registryRef.current.noteCounter = 0;
  registryRef.current.refCounter = 0;
  registryRef.current.notes = [];
  registryRef.current.noteByKey = new Map();

  const value = useMemo(
    () => ({
      register(childrenToRegister, options = {}) {
        const registry = registryRef.current;
        const refNumber = registry.refCounter + 1;
        const refId = `ref-${refNumber}`;
        const normalizedKey = normalizeFootnoteKey(childrenToRegister);
        const key =
          options.dedupe === false || !normalizedKey
            ? `__ref_${refNumber}`
            : normalizedKey;

        registry.refCounter = refNumber;

        let note = registry.noteByKey.get(key);

        if (!note) {
          const number = registry.noteCounter + 1;

          note = {
            number,
            noteId: `note-${number}`,
            refIds: [],
            content: childrenToRegister,
          };

          registry.noteCounter = number;
          registry.noteByKey.set(key, note);
          registry.notes.push(note);
        }

        note.refIds.push(refId);

        return {
          number: note.number,
          noteId: note.noteId,
          refId,
        };
      },

      getNotes() {
        return registryRef.current.notes;
      },
    }),
    [],
  );

  return (
    <WikiFootnoteContext.Provider value={value}>
      {children}
    </WikiFootnoteContext.Provider>
  );
}

export function WikiRef({children, dedupe = true}) {
  const context = useContext(WikiFootnoteContext);

  if (!context) {
    throw new Error('WikiRef must be used inside WikiFootnoteProvider.');
  }

  const {number, noteId, refId} = context.register(children, {dedupe});

  return (
    <a
      id={refId}
      className="wiki-ref"
      href={`#${noteId}`}
      aria-describedby={noteId}
      aria-label={`각주 ${number}로 이동`}
    >
      [{number}]
      <span className="wiki-ref-preview" aria-hidden="true">
        {children}
      </span>
    </a>
  );
}

export function WikiFootnotes({title = '각주'}) {
  const context = useContext(WikiFootnoteContext);

  if (!context) {
    throw new Error('WikiFootnotes must be used inside WikiFootnoteProvider.');
  }

  const notes = context.getNotes();

  if (notes.length === 0) {
    return null;
  }

  return (
    <section className="wiki-footnotes" aria-labelledby="wiki-footnotes-heading">
      <h2 id="wiki-footnotes-heading">{title}</h2>

      {notes.map((note) => (
        <div
          key={note.noteId}
          id={note.noteId}
          className="wiki-footnote-row"
          data-footnote={note.number}
        >
          <div className="wiki-footnote-index">
            <a
              className="wiki-footnote-marker"
              href={`#${note.refIds[0]}`}
              aria-label={`본문 각주 ${note.number}로 이동`}
            >
              [{note.number}]
            </a>
          </div>

          <div className="wiki-footnote-content">{note.content}</div>
        </div>
      ))}
    </section>
  );
}
