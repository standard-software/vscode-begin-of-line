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
      editor.edit(ed => {

        const editorSelectionsLoop = (func) => {
          editor.selections.forEach(select => {
            const range = new vscode.Range(
              select.start.line, 0,
              select.end.line,
              // select.end.character,
              editor.document.lineAt(select.end.line).range.end.character
            );
            const text = editor.document.getText(range);
            func(range, text);
          });
        }

        const editorSelectionsLoopUnsupportTab = (func) => {
          let includeTabFlag = false;
          editor.selections.forEach(select => {
            const range = new vscode.Range(
              select.start.line, 0, select.end.line, select.end.character
            );
            const text = editor.document.getText(range);
            if (text.includes(`\t`)) {
              includeTabFlag = true
            }
            func(range, text);
          });
          if (includeTabFlag) {
            vscode.window.showInformationMessage( 'This feature of Insert String Each Line Extension does not support tabs.');
          }
        }

        const getIndent = (line) => {
          return line.length - _trimFirst(line, [' ', '\t']).length;
        }

        const getMinIndent = (lines) => {
          let minIndent = Infinity;
          for (let i = 0; i < lines.length; i += 1) {
            if (lines[i].trim() === '') { continue; }
            const indent = getIndent(lines[i])
            if (indent < minIndent) {
              minIndent = indent
            }
          }
          if (minIndent === Infinity) { minIndent = 0; }
          return minIndent;
        }

        const textLoopAllLines = (text, func, linesFunc = () => {}) => {
          const lines = text.split(`\n`);
          const linesFuncResult = linesFunc(lines);
          for (let i = 0; i < lines.length; i += 1) {
            func(lines, i, linesFuncResult);
          };
          return lines.join('\n');
        }

        const textLoopOnlyTextLines = (text, func, linesFunc = () => {}) => {
          const lines = text.split(`\n`);
          const linesFuncResult = linesFunc(lines);
          for (let i = 0; i < lines.length; i += 1) {
            if (lines[i].trim() === '') { continue; }
            func(lines, i, linesFuncResult);
          };
          return lines.join('\n');
        }

        const textLoopOnlyMinIndent = (text, func) => {
          const lines = text.split(`\n`);
          const minIndent = getMinIndent(lines);
          for (let i = 0; i < lines.length; i += 1) {
            if (lines[i].trim() === '') { continue; }
            const indent = getIndent(lines[i]);
            if (indent !== minIndent) { continue; }
            func(lines, i, indent);
          };
          return lines.join('\n');
        }

        switch (commandName) {

          case `InsertBeginLineAllLines`: {
            editor.selections.forEach(select => {
              for (let i = select.start.line; i <= select.end.line; i += 1) {
                ed.insert(new vscode.Position(i, 0), inputString);
              }
            });
          } break;

          case `InsertBeginLineOnlyTextLines`: {
            editor.selections.forEach(select => {
              for (let i = select.start.line; i <= select.end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                ed.insert(new vscode.Position(i, 0), inputString);
              }
            });
          } break;

          case `InsertBeginLineOnlyMinIndent`: {
            let minIndent = Infinity;
            editor.selections.forEach(select => {
              for (let i = select.start.line; i <= select.end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                const indent = getIndent(line);
                if (indent < minIndent) {
                  minIndent = indent
                }
              }
            });
            if (minIndent === Infinity) { minIndent = 0; }

            editor.selections.forEach(select => {
              for (let i = select.start.line; i <= select.end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                const indent = getIndent(line);
                if (indent !== minIndent) { continue; }
                ed.insert(new vscode.Position(i, 0), inputString);
              }
            });

          } break;

          case `InsertBeginTextAllLines`: {
            editor.selections.forEach(select => {
              for (let i = select.start.line; i <= select.end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                ed.insert(new vscode.Position(i, getIndent(line)), inputString);
              }
            });
          } break;

          case `InsertBeginTextOnlyTextLines`: {
            editor.selections.forEach(select => {
              for (let i = select.start.line; i <= select.end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                ed.insert(new vscode.Position(i, getIndent(line)), inputString);
              }
            });
          } break;

          case `InsertBeginTextOnlyMinIndent`: {

            let minIndent = Infinity;
            editor.selections.forEach(select => {
              for (let i = select.start.line; i <= select.end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                const indent = getIndent(line);
                if (indent < minIndent) {
                  minIndent = indent
                }
              }
            });
            if (minIndent === Infinity) { minIndent = 0; }

            editor.selections.forEach(select => {
              for (let i = select.start.line; i <= select.end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                const indent = getIndent(line);
                if (indent !== minIndent) { continue; }
                ed.insert(new vscode.Position(i, getIndent(line)), inputString);
              }
            });

          } break;

          case `InsertMinIndentAllLines`: {

            let minIndent = Infinity;
            editor.selections.forEach(select => {
              for (let i = select.start.line; i <= select.end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                const indent = getIndent(line);
                if (indent < minIndent) {
                  minIndent = indent
                }
              }
            });
            if (minIndent === Infinity) { minIndent = 0; }

            let includeTabFlag = false;
            editor.selections.forEach(select => {
              for (let i = select.start.line; i <= select.end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (line.includes(`\t`)) {
                  includeTabFlag = true
                }
                if (_trim(line) === '') {
                  ed.insert(
                    new vscode.Position( i, 0),
                    ' '.repeat(minIndent) + inputString,
                  );
                } else {
                  ed.insert(new vscode.Position(i, minIndent), inputString);
                }
              }
            });
            if (includeTabFlag) {
              vscode.window.showInformationMessage( 'This feature of Insert String Each Line Extension does not support tabs.');
            }

          } break;

          case `InsertMinIndentOnlyTextLines`: {

            let minIndent = Infinity;
            editor.selections.forEach(select => {
              for (let i = select.start.line; i <= select.end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                const indent = getIndent(line);
                if (indent < minIndent) {
                  minIndent = indent
                }
              }
            });
            if (minIndent === Infinity) { minIndent = 0; }

            let includeTabFlag = false;
            editor.selections.forEach(select => {
              for (let i = select.start.line; i <= select.end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (line.includes(`\t`)) {
                  includeTabFlag = true
                }
                if (_trim(line) === '') {
                  continue;
                } else {
                  ed.insert(new vscode.Position(i, minIndent), inputString);
                }
              }
            });
            if (includeTabFlag) {
              vscode.window.showInformationMessage( 'This feature of Insert String Each Line Extension does not support tabs.');
            }

          } break;

          case `DeleteBeginText`: {
            editor.selections.forEach(select => {
              for (let i = select.start.line; i <= select.end.line; i += 1) {
                const line = editor.document.lineAt(i).text;

                const trimLine = _trimFirst(line, [' ', '\t']);
                const trimFirstInput = _trimFirst(inputString, [' ']);
                const indent = line.length - trimLine.length;
                if (_isFirst(trimLine, trimFirstInput)) {
                  ed.delete(
                    new vscode.Range(
                      i, indent,
                      i, indent + trimFirstInput.length
                    )
                  );
                }
              }
            });
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
