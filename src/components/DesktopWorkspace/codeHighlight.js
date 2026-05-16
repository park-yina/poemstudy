import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {createHighlighter} from 'shiki';

export const runtimeShikiTheme = {
  name: 'runtime-observatory',
  type: 'dark',
  colors: {
    'editor.background': '#050914',
    'editor.foreground': '#dbe4f3',
    'editorLineNumber.foreground': '#687386',
    'editor.selectionBackground': '#26384f66',
    'editor.lineHighlightBackground': '#ffffff08',
  },
  tokenColors: [
    {
      scope: [
        'comment',
        'punctuation.definition.comment',
      ],
      settings: {
        foreground: '#6f7887',
        fontStyle: 'italic',
      },
    },
    {
      scope: [
        'keyword',
        'storage.type',
        'storage.modifier',
      ],
      settings: {
        foreground: '#7f9fca',
      },
    },
    {
      scope: [
        'string',
        'punctuation.definition.string',
      ],
      settings: {
        foreground: '#98bfa3',
      },
    },
    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'support.class',
        'support.type',
      ],
      settings: {
        foreground: '#86b8c7',
      },
    },
    {
      scope: [
        'entity.name.function',
        'support.function',
        'meta.method',
      ],
      settings: {
        foreground: '#ded6bd',
      },
    },
    {
      scope: [
        'meta.annotation',
        'storage.type.annotation',
        'punctuation.definition.annotation',
      ],
      settings: {
        foreground: '#bba46b',
      },
    },
    {
      scope: [
        'constant.numeric',
        'constant.language',
        'variable.other.constant',
      ],
      settings: {
        foreground: '#b4a7cf',
      },
    },
    {
      scope: [
        'variable.parameter',
        'variable.other',
        'variable.language',
      ],
      settings: {
        foreground: '#c3ccd9',
      },
    },
    {
      scope: [
        'keyword.operator',
        'punctuation',
        'meta.brace',
      ],
      settings: {
        foreground: '#a9b3c2',
      },
    },
  ],
};

const supportedLanguages = [
  'css',
  'html',
  'java',
  'javascript',
  'json',
  'jsx',
  'markdown',
  'sql',
  'text',
  'tsx',
  'typescript',
  'xml',
  'yaml',
];

const languageAliasMap = {
  js: 'javascript',
  md: 'markdown',
  ts: 'typescript',
  yml: 'yaml',
};

let highlighterPromise;

function getRuntimeHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [runtimeShikiTheme],
      langs: supportedLanguages,
    });
  }

  return highlighterPromise;
}

export function getLanguageFromFile(file) {
  const explicit =
    file?.language ||
    '';

  if (explicit) {
    return languageAliasMap[explicit] || explicit;
  }

  const source =
    file?.path ||
    file?.previewUrl ||
    file?.title ||
    '';

  const extension =
    source.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();

  return languageAliasMap[extension] || extension || 'text';
}

export function normalizeCodeRows(content) {
  const normalized =
    (content || '').replace(/\r\n/g, '\n');

  const trimmed =
    normalized.endsWith('\n')
      ? normalized.slice(0, -1)
      : normalized;

  return trimmed.split('\n');
}

function getFallbackRows(content) {
  return normalizeCodeRows(content).map((line) => [
    {
      content: line || ' ',
      color: undefined,
      fontStyle: 0,
    },
  ]);
}

export function useRuntimeCodeTokens(
  content,
  language,
) {
  const [tokenRows, setTokenRows] =
    useState(() => getFallbackRows(content));

  const normalizedLanguage =
    useMemo(
      () => languageAliasMap[language] || language || 'text',
      [language],
    );

  useEffect(() => {
    let cancelled = false;

    setTokenRows(getFallbackRows(content));

    getRuntimeHighlighter()
      .then((highlighter) =>
        highlighter.codeToTokensBase(content || '', {
          lang: normalizedLanguage,
          theme: runtimeShikiTheme.name,
        })
      )
      .then((rows) => {
        if (!cancelled) {
          setTokenRows(
            rows.length > 0
              ? rows
              : getFallbackRows(content),
          );
        }
      })
      .catch((error) => {
        console.error(
          'syntax highlighting failed',
          error,
        );

        if (!cancelled) {
          setTokenRows(getFallbackRows(content));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [content, normalizedLanguage]);

  return tokenRows;
}

export function getTokenStyle(token) {
  const style = {};

  if (token.color) {
    style.color = token.color;
  }

  if (token.fontStyle & 1) {
    style.fontStyle = 'italic';
  }

  if (token.fontStyle & 2) {
    style.fontWeight = 600;
  }

  if (token.fontStyle & 4) {
    style.textDecoration = 'underline';
  }

  return style;
}

export function getActiveCodeLineIndex(rows) {
  const publicIndex =
    rows.findIndex((line) =>
      line.some((token) =>
        /\b(public|private|protected|function|const|class)\b/.test(
          token.content,
        )
      )
    );

  return publicIndex >= 0
    ? publicIndex
    : 0;
}
