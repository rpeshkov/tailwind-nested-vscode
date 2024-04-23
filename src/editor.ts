import * as vscode from 'vscode';

export function getIndentSize() {
    return Number(vscode.window.activeTextEditor?.options.indentSize) || 2;
}
