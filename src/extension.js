const vscode = require('vscode');
const {
  isUndefined,
  _isFirst,
  _trimFirst, _trim,
  _insert,
} = require('./parts/parts.js')

function activate(context) {

  const extensionMain = (commandName) => {

    if (!vscode.window.activeTextEditor) {
      vscode.window.showInformationMessage(`No editor is active`);
      return;
    }

    vscode.window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: ``,
      prompt: `Input Insert/Delete String`,
      value: vscode.workspace.getConfiguration(`BeginOfLine`).get(`insertString`),
    }).then(inputString => {
      if (isUndefined(inputString)) {
        return;
      }
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage( `No editor is active` );
        return;
      }
      editor.edit(editBuilder => {

        const getIndent = (line) => {
          return line.length - _trimFirst(line, [' ', '\t']).length;
        }

        const getMinIndent = (editor) => {
          let minIndent = Infinity;
          for (let { start, end } of editor.selections) {
            for (let i = start.line; i <= end.line; i += 1) {
              const line = editor.document.lineAt(i).text;
              if (_trim(line) === '') { continue; }
              const indent = getIndent(line);
              if (indent < minIndent) {
                minIndent = indent
              }
            }
          };
          if (minIndent === Infinity) { minIndent = 0; }
          return minIndent;
        }

        switch (commandName) {

          case `InsertBeginLineAllLines`: {
            const runAfterSelections = [];
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                editBuilder.insert(new vscode.Position(i, 0), inputString);
              }
            };
          } break;

          case `InsertBeginLineOnlyTextLines`: {
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                editBuilder.insert(new vscode.Position(i, 0), inputString);
              }
            };
          } break;

          case `InsertBeginLineOnlyMinIndent`: {
            const minIndent = getMinIndent(editor)
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                const indent = getIndent(line);
                if (indent !== minIndent) { continue; }
                editBuilder.insert(new vscode.Position(i, 0), inputString);
              }
            };
          } break;

          case `InsertBeginTextAllLines`: {
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                editBuilder.insert(new vscode.Position(i, getIndent(line)), inputString);
              }
            };
          } break;

          case `InsertBeginTextOnlyTextLines`: {
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                editBuilder.insert(new vscode.Position(i, getIndent(line)), inputString);
              }
            };
          } break;

          case `InsertBeginTextOnlyMinIndent`: {
            const minIndent = getMinIndent(editor)
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                const indent = getIndent(line);
                if (indent !== minIndent) { continue; }
                editBuilder.insert(new vscode.Position(i, getIndent(line)), inputString);
              }
            };
          } break;

          case `InsertMinIndentAllLines`: {
            const minIndent = getMinIndent(editor)
            let includeTabFlag = false;
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (line.includes(`\t`)) {
                  includeTabFlag = true
                }
                if (_trim(line) === '') {
                  editBuilder.insert(
                    new vscode.Position( i, 0),
                    ' '.repeat(minIndent) + inputString,
                  );
                } else {
                  editBuilder.insert(new vscode.Position(i, minIndent), inputString);
                }
              }
            };
            if (includeTabFlag) {
              vscode.window.showInformationMessage( 'This feature of Insert String Each Line Extension does not support tabs.');
            }
          } break;

          case `InsertMinIndentOnlyTextLines`: {
            const minIndent = getMinIndent(editor)
            let includeTabFlag = false;
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (line.includes(`\t`)) {
                  includeTabFlag = true
                }
                if (_trim(line) === '') {
                  continue;
                } else {
                  editBuilder.insert(new vscode.Position(i, minIndent), inputString);
                }
              }
            };
            if (includeTabFlag) {
              vscode.window.showInformationMessage( 'This feature of Insert String Each Line Extension does not support tabs.');
            }
          } break;

          case `DeleteBeginText`: {
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;

                const trimLine = _trimFirst(line, [' ', '\t']);
                const trimFirstInput = _trimFirst(inputString, [' ']);
                const indent = line.length - trimLine.length;
                if (_isFirst(trimLine, trimFirstInput)) {
                  editBuilder.delete(
                    new vscode.Range(
                      i, indent,
                      i, indent + trimFirstInput.length
                    )
                  );
                }
              }
            };
          } break;

          default: {
            new Error(`BeginOfLine extensionMain`);
          }
        }
      } );
    } );
  }

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `BeginOfLine.InsertBeginLineAllLines`, () => {
      extensionMain(`InsertBeginLineAllLines`);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `BeginOfLine.InsertBeginLineOnlyTextLines`, () => {
      extensionMain(`InsertBeginLineOnlyTextLines`);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `BeginOfLine.InsertBeginLineOnlyMinIndent`, () => {
      extensionMain(`InsertBeginLineOnlyMinIndent`);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `BeginOfLine.InsertBeginTextAllLines`, () => {
      extensionMain(`InsertBeginTextAllLines`);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `BeginOfLine.InsertBeginTextOnlyTextLines`, () => {
      extensionMain(`InsertBeginTextOnlyTextLines`);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `BeginOfLine.InsertBeginTextOnlyMinIndent`, () => {
      extensionMain(`InsertBeginTextOnlyMinIndent`);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `BeginOfLine.InsertMinIndentAllLines`, () => {
      extensionMain(`InsertMinIndentAllLines`);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `BeginOfLine.InsertMinIndentOnlyTextLines`, () => {
      extensionMain(`InsertMinIndentOnlyTextLines`);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `BeginOfLine.DeleteBeginText`, () => {
      extensionMain(`DeleteBeginText`);
    })
  );

}

function deactivate() {}

module.exports = {
  activate,
  deactivate
}
