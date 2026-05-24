import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

const DocsDocumentContext = createContext(null);

function createDocumentFootnoteState() {
  return {
    noteCounter: 0,
    refCounter: 0,
    notes: [],
    noteById: new Map(),
  };
}

function resetDocumentFootnoteState(state) {
  state.noteCounter = 0;
  state.refCounter = 0;
  state.notes = [];
  state.noteById = new Map();
}

export function DocsDocumentProvider({children}) {
  const [footnoteState] = useState(() => createDocumentFootnoteState());

  resetDocumentFootnoteState(footnoteState);

  const value = useMemo(
    () => {
      const addFootnote = ({id, content}) => {
        const refNumber = footnoteState.refCounter + 1;
        const refId = `docs-ref-${refNumber}`;
        const noteKey = id || `docs-note-entry-${refNumber}`;

        footnoteState.refCounter = refNumber;

        let note = footnoteState.noteById.get(noteKey);

        if (!note) {
          const number = footnoteState.noteCounter + 1;

          note = {
            id: noteKey,
            number,
            noteId: `docs-note-${number}`,
            refIds: [],
            content,
          };

          footnoteState.noteCounter = number;
          footnoteState.noteById.set(noteKey, note);
          footnoteState.notes.push(note);
        }

        note.refIds.push(refId);

        return {
          number: note.number,
          noteId: note.noteId,
          refId,
        };
      };

      return {
        addFootnote,

        register(content, options = {}) {
          return addFootnote({
            id: options.id,
            content,
          });
        },

        getNotes() {
          return footnoteState.notes;
        },
      };
    },
    [footnoteState],
  );

  return (
    <DocsDocumentContext.Provider value={value}>
      {children}
    </DocsDocumentContext.Provider>
  );
}

export function DocsRef({children, id}) {
  const context = useContext(DocsDocumentContext);

  if (!context) {
    throw new Error('DocsRef must be used inside DocsDocumentProvider.');
  }

  const {number, noteId, refId} = context.addFootnote({
    id,
    content: children,
  });

  return (
    <span className="docs-ref-shell">
      <a
        id={refId}
        className="docs-ref"
        href={`#${noteId}`}
        aria-describedby={noteId}
        aria-label={`각주 ${number}로 이동`}
      >
        [{number}]
      </a>
      <span className="docs-ref-preview" role="note">
        {children}
      </span>
    </span>
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
