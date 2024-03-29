import { browser } from '@atlaskit/editor-common';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export const toggleBold = makeKeyMapWithCommon('Bold', 'Mod-b');
export const toggleItalic = makeKeyMapWithCommon('Italic', 'Mod-i');
export const toggleUnderline = makeKeyMapWithCommon('Underline', 'Mod-u');
export const toggleStrikethrough = makeKeyMapWithCommon(
  'Strikethrough',
  'Mod-Shift-s',
);
export const toggleCode = makeKeyMapWithCommon('Code', 'Mod-Shift-m');
export const pastePlainText = makeKeyMapWithCommon(
  'Paste Plain Text',
  'Mod-Shift-v',
);
export const clearFormatting = makeKeyMapWithCommon(
  'Clear formatting',
  'Mod-\\',
);
export const setNormalText = makeKeymap('Normal text', '', 'Cmd-Alt-0');
export const toggleHeading1 = makeKeymap('Heading 1', '', 'Cmd-Alt-1');
export const toggleHeading2 = makeKeymap('Heading 2', '', 'Cmd-Alt-2');
export const toggleHeading3 = makeKeymap('Heading 3', '', 'Cmd-Alt-3');
export const toggleHeading4 = makeKeymap('Heading 4', '', 'Cmd-Alt-4');
export const toggleHeading5 = makeKeymap('Heading 5', '', 'Cmd-Alt-5');
export const toggleOrderedList = makeKeymap('Numbered list', '', 'Cmd-Shift-7');
export const toggleBulletList = makeKeymap('Bullet list', '', 'Cmd-Shift-8');
export const toggleBlockQuote = makeKeymap('Block quote', '', 'Cmd-Alt-9');
export const insertNewLine = makeKeyMapWithCommon(
  'Insert new line',
  'Shift-Enter',
);
export const shiftBackspace = makeKeyMapWithCommon(
  'Shift Backspace',
  'Shift-Backspace',
);
export const splitCodeBlock = makeKeyMapWithCommon('Split code block', 'Enter');
export const splitListItem = makeKeyMapWithCommon('Split list item', 'Enter');
export const insertRule = makeKeyMapWithCommon(
  'Insert horizontal rule',
  'Mod-Shift--',
);
export const undo = makeKeyMapWithCommon('Undo', 'Mod-z');
export const moveUp = makeKeyMapWithCommon('Move up', 'ArrowUp');
export const moveDown = makeKeyMapWithCommon('Move down', 'ArrowDown');
export const moveLeft = makeKeyMapWithCommon('Move left', 'ArrowLeft');
export const moveRight = makeKeyMapWithCommon('Move right', 'ArrowRight');
export const indentList = makeKeyMapWithCommon('Indent List', 'Tab');
export const outdentList = makeKeyMapWithCommon('Outdent List', 'Shift-Tab');
export const redo = makeKeymap('Redo', 'Ctrl-y', 'Cmd-Shift-z');
export const redoBarred = makeKeymap('Redo Barred', 'Ctrl-Shift-z', 'Cmd-y');
export const openHelp = makeKeyMapWithCommon('Open Help', 'Mod-/');
export const addLink = makeKeyMapWithCommon('Link', 'Mod-k');
export const submit = makeKeyMapWithCommon('Submit Content', 'Mod-Enter');
export const enter = makeKeyMapWithCommon('Enter', 'Enter');
export const tab = makeKeyMapWithCommon('Tab', 'Tab');
export const backspace = makeKeyMapWithCommon('Backspace', 'Backspace');
export const deleteKey = makeKeyMapWithCommon('Delete', 'Delete');
export const space = makeKeyMapWithCommon('Space', 'Space');
export const escape = makeKeyMapWithCommon('Escape', 'Escape');
export const nextCell = makeKeyMapWithCommon('Next cell', 'Tab');
export const previousCell = makeKeyMapWithCommon('Previous cell', 'Shift-Tab');
export const toggleTable = makeKeyMapWithCommon('Table', 'Shift-Alt-t');
export const cut = makeKeyMapWithCommon('Cut', 'Mod-x');
export const copy = makeKeyMapWithCommon('Copy', 'Mod-c');
export const paste = makeKeyMapWithCommon('Paste', 'Mod-v');
export const altPaste = makeKeyMapWithCommon('Paste', 'Mod-Shift-v');

export function tooltip(
  keymap: Keymap | undefined,
  description?: string,
): string | undefined {
  if (keymap) {
    let shortcut: string;
    if (browser.mac) {
      shortcut = keymap.mac
        .replace(/Cmd/i, '⌘')
        .replace(/Shift/i, '⇧')
        .replace(/Ctrl/i, '^')
        .replace(/Alt/i, '⌥');
    } else {
      shortcut = keymap.windows;
    }
    const keys = shortcut.split('-');
    keys[keys.length - 1] = keys[keys.length - 1].toUpperCase();
    shortcut = keys.join(browser.mac ? '' : '+');
    return description ? `${description} ${shortcut}` : shortcut;
  }
}

export function findKeymapByDescription(
  description: string,
): Keymap | undefined {
  const matches = ALL.filter(
    keymap => keymap.description.toUpperCase() === description.toUpperCase(),
  );
  return matches[0];
}

export function findShortcutByDescription(
  description: string,
): string | undefined {
  const keymap = findKeymapByDescription(description);
  if (keymap) {
    return findShortcutByKeymap(keymap);
  }
}

export function findShortcutByKeymap(keymap: Keymap): string | undefined {
  if (browser.mac) {
    return keymap.mac;
  }

  return keymap.windows;
}

const ALL = [
  toggleOrderedList,
  toggleBulletList,
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleStrikethrough,
  toggleCode,
  setNormalText,
  toggleHeading1,
  toggleHeading2,
  toggleHeading3,
  toggleHeading4,
  toggleHeading5,
  toggleBlockQuote,
  insertNewLine,
  insertRule,
  splitCodeBlock,
  splitListItem,
  redo,
  undo,
];

function makeKeymap(
  description: string,
  windows: string,
  mac: string,
  common?: string,
): Keymap {
  return {
    description: description,
    windows: windows,
    mac: mac,
    common: common,
  };
}

function makeKeyMapWithCommon(description: string, common: string): Keymap {
  const windows = common.replace(/Mod/i, 'Ctrl');
  const mac = common.replace(/Mod/i, 'Cmd');
  return makeKeymap(description, windows, mac, common);
}

export interface Keymap {
  description: string;
  windows: string;
  mac: string;
  common?: string;
}

export function bindKeymapWithCommand(
  shortcut: string,
  cmd: (
    state: EditorState,
    dispatch: (tr: Transaction) => void,
    editorView?: EditorView,
  ) => boolean,
  keymap: { [key: string]: Function },
) {
  const oldCmd = keymap[shortcut];
  let newCmd = cmd;
  if (keymap[shortcut]) {
    newCmd = (
      state: EditorState,
      dispatch: (tr: Transaction) => void,
      editorView?: EditorView,
    ): boolean => {
      return oldCmd(state, dispatch) || cmd(state, dispatch, editorView);
    };
  }
  keymap[shortcut] = newCmd;
}

export function findKeyMapForBrowser(kayMap: Keymap): string | undefined {
  if (kayMap) {
    if (browser.mac) {
      return kayMap.mac;
    }

    return kayMap.windows;
  }
}

export const LEFT = 37;
export const RIGHT = 39;
export const UP = 38;
export const DOWN = 40;
