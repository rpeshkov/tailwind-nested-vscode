// eslint-disable-next-line @typescript-eslint/naming-convention
import _ from 'lodash';
import * as vscode from 'vscode';
import { getIndentSize } from './editor';

/**
 * Function that checks whether provided class definition represents nested format
 *
 * @param text Input text
 * @returns true - for structured, false for normal
 */
export function isStructured(text: string) {
  const re = /:[\s$]/g;
  return re.test(text);
}

/**
 * Calculate the amount of leading spaces for the string
 *
 * @param text Input text
 * @returns amount of leading spaces
 */
export function countLeadingSpaces(text: string) {
  let i = 0;
  while (text.at(i) === ' ') {
    ++i;
  }
  return i;
}

export function expand(text: string) {
  const editorIndentLevel = getIndentSize();

  const prefix: string[] = [];
  const result: string[] = [];
  const items = text.split('\n');
  let finalIndent = 0;
  let currentLevel = 0;
  for (const line of items) {
    if (line.trim().length === 0) {
      continue;
    }

    const indent = countLeadingSpaces(line);
    if (finalIndent === 0) {
      finalIndent = indent;
    }
    const isGroup = line.trimEnd().endsWith(':');

    if (indent < currentLevel) {
      currentLevel = indent;
    }

    if (indent === currentLevel) {
      prefix.pop();
      currentLevel -= editorIndentLevel;
    }

    if (indent >= currentLevel && isGroup) {
      currentLevel = indent;
      prefix.push(line.trim());
      continue;
    }

    result.push([...prefix, line.trim()].join(''));
  }
  return result;
}

export function traverse(structure: object, level: number = 0) {
  const indent = getIndentSize();
  const result: string[] = [];
  for (const [k, v] of Object.entries(structure)) {
    if (!v) {
      result.push(' '.repeat(level * indent) + k.trim());
    } else {
      result.push(' '.repeat(level * indent) + k + ':');
      result.push(...traverse(v, level + 1));
    }
  }
  // Remove empty lines
  return result.filter(x => x);
}

export function structurize(text: string): object {
  const structure = {};
  const items = text.split(' ').filter(x => x);
  for (const item of items) {
    const atoms = item.split(':');
    _.set(structure, atoms, null);
  }
  return structure;
}

/**
 * Find the boundaries of the string under cursor
 *
 * @param editor VSCode editor instance
 * @returns VSCode range of the string
 */
export function findStringRange(editor: vscode.TextEditor): vscode.Range {
  const { line, character } = editor.selection.start;
  let startLineNumber = line;
  let endLineNumber = line;

  const document = editor.document;

  // Searching for a lines where quote is present
  while (!document.lineAt(startLineNumber).text.includes('"')) {
    startLineNumber--;
  }

  while (!document.lineAt(endLineNumber).text.includes('"')) {
    endLineNumber++;
  }

  let startCol: number;
  let endCol: number;

  const startLine = editor.document.lineAt(startLineNumber);
  const endLine = editor.document.lineAt(endLineNumber);

  if (startLineNumber === endLineNumber) {
    startCol = startLine.text.lastIndexOf('"', character - 1) + 1;
    endCol = endLine.text.indexOf('"', character);
  } else {
    startCol = startLine.text.indexOf('"') + 1;
    endCol = endLine.text.indexOf('"');
  }

  return new vscode.Range(startLineNumber, startCol, endLineNumber, endCol);
}
