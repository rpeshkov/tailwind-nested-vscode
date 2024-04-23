import * as vscode from 'vscode';
import { expand, findStringRange, isStructured, structurize, traverse } from './utils';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerTextEditorCommand('tailwind-nested.toggle', (editor) => {
    // Not bothering with user-selected area for now
    if (!editor.selection.isEmpty) {
      return;
    }

    const stringRange = findStringRange(editor);
    const startIndent = editor.document.lineAt(
      stringRange.start.line,
    ).firstNonWhitespaceCharacterIndex;
    const text = editor.document.getText(stringRange);

    if (!isStructured(text)) {
      const structure = structurize(text);
      const padding = ' '.repeat(startIndent + 2);
      const lines = [...traverse(structure), ''].map(x => padding + x);

      editor.edit(x => {
        x.replace(stringRange, '\n' + lines.join('\n'));
      });
    } else {
      const t = expand(text);
      editor.edit(x => {
        x.replace(stringRange, t.join(' ').trim());
      });
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
