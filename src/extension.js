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

    switch (commandName) {
    case `Input`: {
      extensionMainInput();
    } break;

    case `SelectEdit`: {

    } break;

    default: {
      new Error(`BeginOfLine extensionMain`);
    }

    }


  }

  const extensionMainInput = () => {
    const inputCommands = {
      InsertBeginLineAllLines:      { label: `Insert | All Lines`, description: "" },
      InsertBeginLineOnlyTextLines: { label: `Insert | Only Text Lines`, description: `` },
      InsertBeginLineOnlyMinIndent: { label: `Insert | Only Min Indent Text Lines`, description: `` },
      InsertBeginTextAllLines:      { label: `Insert | All Lines | Begin Of Text`, description: `` },
      InsertBeginTextOnlyTextLines: { label: `Insert | Only Text Lines | Begin Of Text`, description: `` },
      InsertBeginTextOnlyMinIndent: { label: `Insert | Only Min Indent Text Lines | Begin Of Text`, description: `` },
      InsertMinIndentAllLines:      { label: `Insert | All Lines | Min Indent`, description: `` },
      InsertMinIndentOnlyTextLines: { label: `Insert | Only Text Lines | Min Indent`, description: `` },
      DeleteBeginText:              { label: `Delete | Begin Of Text`, description: `` },
    }

    vscode.window.showQuickPick(Object.values(inputCommands), {
      canPickMany: false,
      placeHolder: "Select Command | Begin Of Line | Input",
    }).then((item) => {
      if (!item) { return; }

      let _commandName = '';
      for (let [key, value] of Object.entries(inputCommands)) {
        console.log({ key, value });
        if (item === value) {
          _commandName = key;
          break;
        }
      }
      if (_commandName === '') { return; }
      const commandName = _commandName;

      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage(`No editor is active`);
        return;
      }
      editor.edit(editBuilder => {

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
                // const runAfterSelections = [];
                // for (let { start, end } of editor.selections) {
                //   for (let i = start.line; i <= end.line; i += 1) {
                //     editBuilder.insert(new vscode.Position(i, 0), inputString);
                //     runAfterSelections.push(
                //       new vscode.Selection(i, 0, i, 0)
                //     )
                //   }
                // };
                // editor.selections = runAfterSelections;
                // return;
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
        });


      });

      });

  }

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `BeginOfLine.Input`, () => {
      extensionMain(`Input`);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `BeginOfLine.SelectEdit`, () => {
      extensionMain(`SelectEdit`);
    })
  );

}

function deactivate() {}

module.exports = {
  activate,
  deactivate
}
