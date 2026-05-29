import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useMemo,
  useState,
} from 'react';

const DocsDocumentContext = createContext(null);

const MARKER_GLYPHS = {
  diamond: '⋄',
  dot: '•',
  circle: '○',
  sharp: '#',
  none: '',
};

function getSummaryLabel(summary) {
  const navLabel = summary.getAttribute('data-nav');

  if (navLabel?.trim()) {
    return navLabel.trim();
  }

  return summary.textContent?.replace(/\s+/g, ' ').trim() || summary.id;
}

export function DocsNavigationRail({
  marker = 'diamond',
  renderMarker,
  observeActive = true,
  summarySelector = 'details.wiki-fold > summary[id]',
  summaryTargetSelector = '.docs-summary',
  topLabel = '맨 위',
  summaryLabel = '목차',
  bottomLabel = '맨 아래',
}) {
  const railRef = useRef(null);
  const {items, activeId, setActiveId} = useDocsSummaryNavigation({
    rootRef: railRef,
    selector: summarySelector,
    observeActive,
  });

  const scrollToTop = () => {
    if (typeof window === 'undefined') {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToSummary = () => {
    if (typeof document === 'undefined') {
      return;
    }

    document.querySelector(summaryTargetSelector)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const scrollToBottom = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const scrollToItem = (item) => {
    if (typeof document === 'undefined') {
      return;
    }

    document.getElementById(item.id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    setActiveId(item.id);
  };

  const getMarker = (item, active) =>
    renderMarker
      ? renderMarker(item, active)
      : renderDefaultMarker(marker);

  return (
    <nav
      ref={railRef}
      className="docs-nav-rail"
      aria-label="Docs manuscript navigation"
    >
      <div className="docs-nav-rail__utility" aria-label="Manuscript controls">
        <button
          type="button"
          className="docs-nav-rail__control"
          data-label={topLabel}
          aria-label={`${topLabel}로 이동`}
          onClick={scrollToTop}
        >
          <span aria-hidden="true">↑</span>
        </button>

        <button
          type="button"
          className="docs-nav-rail__control"
          data-label={summaryLabel}
          aria-label={`${summaryLabel}로 이동`}
          onClick={scrollToSummary}
        >
          <span aria-hidden="true">☰</span>
        </button>
      </div>

      <div className="docs-nav-rail__nodes" aria-label="Manuscript sections">
        {items.map((item) => {
          const active = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              className="docs-nav-rail__node"
              data-label={item.label}
              data-active={active ? 'true' : undefined}
              aria-current={active ? 'true' : undefined}
              aria-label={`${item.label}로 이동`}
              onClick={() => scrollToItem(item)}
            >
              <span className="docs-nav-rail__marker" aria-hidden="true">
                {getMarker(item, active)}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="docs-nav-rail__utility docs-nav-rail__utility--bottom"
        aria-label="Manuscript end control"
      >
        <button
          type="button"
          className="docs-nav-rail__control"
          data-label={bottomLabel}
          aria-label={`${bottomLabel}로 이동`}
          onClick={scrollToBottom}
        >
          <span aria-hidden="true">↓</span>
        </button>
      </div>
    </nav>
  );
}

function collectSummaryNavigationItems(root, selector = 'summary[id]') {
  if (!root) {
    return [];
  }

  return Array.from(root.querySelectorAll(selector))
    .filter((summary) => summary.id)
    .map((summary, index) => ({
      id: summary.id,
      label: getSummaryLabel(summary),
      index,
    }));
}

function areNavigationItemsEqual(firstItems, nextItems) {
  if (firstItems.length !== nextItems.length) {
    return false;
  }

  return firstItems.every((item, index) => {
    const nextItem = nextItems[index];

    return item.id === nextItem.id && item.label === nextItem.label;
  });
}

function renderDefaultMarker(marker) {
  if (React.isValidElement(marker)) {
    return marker;
  }

  return MARKER_GLYPHS[marker] ?? marker ?? MARKER_GLYPHS.diamond;
}

export function useDocsSummaryNavigation({
  rootRef,
  selector = 'details.wiki-fold > summary[id]',
  observeActive = true,
} = {}) {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const root =
      rootRef?.current?.closest('.docs-manuscript') ||
      rootRef?.current?.parentElement ||
      document;

    const collect = () => {
      const nextItems = collectSummaryNavigationItems(root, selector);

      setItems((currentItems) =>
        areNavigationItemsEqual(currentItems, nextItems)
          ? currentItems
          : nextItems,
      );

      setActiveId((currentActiveId) => {
        if (currentActiveId && nextItems.some((item) => item.id === currentActiveId)) {
          return currentActiveId;
        }

        return nextItems[0]?.id ?? null;
      });
    };

    collect();

    if (typeof MutationObserver === 'undefined') {
      return undefined;
    }

    const observer = new MutationObserver(collect);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['id', 'data-nav'],
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [rootRef, selector]);

  useEffect(() => {
    if (
      !observeActive ||
      typeof document === 'undefined' ||
      typeof IntersectionObserver === 'undefined' ||
      items.length === 0
    ) {
      return undefined;
    }

    const visibleItems = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleItems.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visibleItems.delete(entry.target.id);
          }
        });

        const nextActiveId = Array.from(visibleItems.entries())
          .sort((first, second) => Math.abs(first[1]) - Math.abs(second[1]))[0]?.[0];

        if (nextActiveId) {
          setActiveId(nextActiveId);
        }
      },
      {
        rootMargin: '-18% 0px -62% 0px',
        threshold: [0, 0.15, 0.4, 0.75],
      },
    );

    items.forEach((item) => {
      const target = document.getElementById(item.id);

      if (target) {
        observer.observe(target);
      }
    });

    return () => observer.disconnect();
  }, [items, observeActive]);

  return {
    items,
    activeId,
    setActiveId,
  };
}

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
