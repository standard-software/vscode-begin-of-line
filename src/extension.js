const vscode = require('vscode');
const {
  isUndefined,
  _isFirst,
  _trimFirst, _trim,
} = require('./parts/parts.js')

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

function activate(context) {

  context.subscriptions.push(
    vscode.commands.registerCommand(`BeginOfLine.Input`, () => {

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
            prompt: `Input String`,
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

              switch (commandName) {

              case `InsertBeginLineAllLines`: {
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
                throw new Error(`BeginOfLine Input`);
              }
              }
            });
          });
        });
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(`BeginOfLine.SelectEdit`, () => {
      const selectEditCommands = {
        BeginLineAllLines:      { label: `Select Edit | All Lines`, description: "" },
        BeginLineOnlyTextLines: { label: `Select Edit | Only Text Lines`, description: `` },
        BeginLineOnlyMinIndent: { label: `Select Edit | Only Min Indent Text Lines`, description: `` },
        BeginTextAllLines:      { label: `Select Edit | All Lines | Begin Of Text`, description: `` },
        BeginTextOnlyTextLines: { label: `Select Edit | Only Text Lines | Begin Of Text`, description: `` },
        BeginTextOnlyMinIndent: { label: `Select Edit | Only Min Indent Text Lines | Begin Of Text`, description: `` },
        MinIndentAllLines:      { label: `Select Edit | All Lines | Min Indent`, description: `` },
        MinIndentOnlyTextLines: { label: `Select Edit | Only Text Lines | Min Indent`, description: `` },
      }

      vscode.window.showQuickPick(Object.values(selectEditCommands), {
        canPickMany: false,
        placeHolder: "Select Command | Begin Of Line | Select Edit",
      }).then((item) => {
        if (!item) { return; }

        let _commandName = '';
        for (let [key, value] of Object.entries(selectEditCommands)) {
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
          switch (commandName) {

          case `BeginLineAllLines`: {
            const runAfterSelections = [];
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                runAfterSelections.push(
                  new vscode.Selection(i, 0, i, 0)
                )
              }
            };
            editor.selections = runAfterSelections;
          } break;

          case `BeginLineOnlyTextLines`: {
            const runAfterSelections = [];
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                runAfterSelections.push(
                  new vscode.Selection(i, 0, i, 0)
                )
              }
            };
            editor.selections = runAfterSelections;
          } break;

          case `BeginLineOnlyMinIndent`: {
            const runAfterSelections = [];
            const minIndent = getMinIndent(editor)
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                const indent = getIndent(line);
                if (indent !== minIndent) { continue; }
                runAfterSelections.push(
                  new vscode.Selection(i, 0, i, 0)
                )
              }
            };
            editor.selections = runAfterSelections;
          } break;

          case `BeginTextAllLines`: {
            const runAfterSelections = [];
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                runAfterSelections.push(
                  new vscode.Selection(i, getIndent(line), i, getIndent(line))
                )
              }
            };
            editor.selections = runAfterSelections;
          } break;

          case `BeginTextOnlyTextLines`: {
            const runAfterSelections = [];
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                runAfterSelections.push(
                  new vscode.Selection(i, getIndent(line), i, getIndent(line))
                )
              }
            };
            editor.selections = runAfterSelections;
          } break;

          case `BeginTextOnlyMinIndent`: {
            const runAfterSelections = [];
            const minIndent = getMinIndent(editor)
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                const indent = getIndent(line);
                if (indent !== minIndent) { continue; }
                runAfterSelections.push(
                  new vscode.Selection(i, getIndent(line), i, getIndent(line))
                )
              }
            };
            editor.selections = runAfterSelections;
          } break;

          case `MinIndentAllLines`: {
            const runAfterSelections = [];
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
                    ' '.repeat(minIndent),
                  );
                }
                runAfterSelections.push(
                  new vscode.Selection(i, minIndent, i, minIndent)
                )
              }
            };
            editor.selections = runAfterSelections;
            if (includeTabFlag) {
              vscode.window.showInformationMessage( 'This feature of Insert String Each Line Extension does not support tabs.');
            }
          } break;

          case `MinIndentOnlyTextLines`: {
            const runAfterSelections = [];
            const minIndent = getMinIndent(editor)
            let includeTabFlag = false;
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (line.includes(`\t`)) {
                  includeTabFlag = true
                }
                if (_trim(line) === '') { continue; }
                runAfterSelections.push(
                  new vscode.Selection(i, minIndent, i, minIndent)
                )
              }
            };
            editor.selections = runAfterSelections;
            if (includeTabFlag) {
              vscode.window.showInformationMessage( 'This feature of Insert String Each Line Extension does not support tabs.');
            }
          } break;

          default: {
            throw new Error(`BeginOfLine Select Edit`);
          }
          }
        });
      });
    })
  );

}

function deactivate() {}

module.exports = {
  activate,
  deactivate
}
