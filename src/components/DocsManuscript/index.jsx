import React, {
  createContext,
  isValidElement,
  useContext,
  useMemo,
  useState,
} from 'react';

const DocsDocumentContext = createContext(null);

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

function createDocumentFootnoteState() {
  return {
    noteCounter: 0,
    refCounter: 0,
    notes: [],
    noteByKey: new Map(),
  };
}

function resetDocumentFootnoteState(state) {
  state.noteCounter = 0;
  state.refCounter = 0;
  state.notes = [];
  state.noteByKey = new Map();
}

export function DocsDocumentProvider({children}) {
  const [footnoteState] = useState(() => createDocumentFootnoteState());

  resetDocumentFootnoteState(footnoteState);

  const value = useMemo(
    () => ({
      register(childrenToRegister, options = {}) {
        const refNumber = footnoteState.refCounter + 1;
        const refId = `docs-ref-${refNumber}`;
        const normalizedKey = normalizeFootnoteKey(childrenToRegister);
        const key =
          options.dedupe === false || !normalizedKey
            ? `__ref_${refNumber}`
            : normalizedKey;

        footnoteState.refCounter = refNumber;

        let note = footnoteState.noteByKey.get(key);

        if (!note) {
          const number = footnoteState.noteCounter + 1;

          note = {
            number,
            noteId: `docs-note-${number}`,
            refIds: [],
            content: childrenToRegister,
          };

          footnoteState.noteCounter = number;
          footnoteState.noteByKey.set(key, note);
          footnoteState.notes.push(note);
        }

        note.refIds.push(refId);

        return {
          number: note.number,
          noteId: note.noteId,
          refId,
        };
      },

      getNotes() {
        return footnoteState.notes;
      },
    }),
    [footnoteState],
  );

  return (
    <DocsDocumentContext.Provider value={value}>
      {children}
    </DocsDocumentContext.Provider>
  );
}

export function DocsRef({children, dedupe = true}) {
  const context = useContext(DocsDocumentContext);

  if (!context) {
    throw new Error('DocsRef must be used inside DocsDocumentProvider.');
  }

  const {number, noteId, refId} = context.register(children, {dedupe});

  return (
    <a
      id={refId}
      className="docs-ref"
      href={`#${noteId}`}
      aria-describedby={noteId}
      aria-label={`각주 ${number}로 이동`}
    >
      [{number}]
      <span className="docs-ref-preview" aria-hidden="true">
        {children}
      </span>
    </a>
  );
}

export function DocsFootnotes({title = '각주'}) {
  const context = useContext(DocsDocumentContext);

  if (!context) {
    throw new Error('DocsFootnotes must be used inside DocsDocumentProvider.');
  }

  const notes = context.getNotes();

  if (notes.length === 0) {
    return null;
  }

  return (
    <section className="docs-footnotes" aria-labelledby="docs-footnotes-heading">
      <h2 id="docs-footnotes-heading">{title}</h2>

      {notes.map((note) => (
        <div
          key={note.noteId}
          id={note.noteId}
          className="docs-footnote-row"
          data-footnote={note.number}
        >
          <div className="docs-footnote-index">
            <a
              className="docs-footnote-marker"
              href={`#${note.refIds[0]}`}
              aria-label={`본문 각주 ${note.number}로 이동`}
            >
              [{note.number}]
            </a>
          </div>

          <div className="docs-footnote-content">{note.content}</div>
        </div>
      ))}
    </section>
  );
}
