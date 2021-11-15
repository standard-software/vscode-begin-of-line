const vscode = require('vscode');
const {
  isUndefined,
  _isFirst,
  _trimFirst,
  _insert,
} = require('./parts/parts.js')

function activate(context) {

  const extensionMain = (commandName) => {

    const editor = vscode.window.activeTextEditor;
    if ( !editor ) {
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
      if (!vscode.window.activeTextEditor) {
        vscode.window.showInformationMessage( `No editor is active` );
        return;
      }
      editor.edit(ed => {

        const editorSelectionsLoop = (func) => {
          editor.selections.forEach(select => {
            const range = new vscode.Range(
              select.start.line, 0, select.end.line, select.end.character
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

          case `InsertBeginLineAllLines`:
            editorSelectionsLoop((range, text) => {
              text = textLoopAllLines(text, (lines, i) => {
                lines[i] = inputString + lines[i];
              })
              ed.replace(range, text);
            })
            break;

          case `InsertBeginLineOnlyTextLines`:
            editorSelectionsLoop((range, text) => {
              text = textLoopOnlyTextLines(text, (lines, i) => {
                lines[i] = inputString + lines[i];
              })
              ed.replace(range, text);
            })
            break;

          case `InsertBeginLineOnlyMinIndent`:
            editorSelectionsLoop((range, text) => {
              text = textLoopOnlyMinIndent(text, (lines, i) => {
                lines[i] = inputString + lines[i];
              })
              ed.replace(range, text);
            })
            break;

          case `InsertBeginTextAllLines`:
            editorSelectionsLoop((range, text) => {
              text = textLoopAllLines(text, (lines, i) => {
                lines[i] = _insert(
                  lines[i], inputString,
                  getIndent(lines[i]),
                );
              })
              ed.replace(range, text);
            })
            break;

          case `InsertBeginTextOnlyTextLines`:
            editorSelectionsLoop((range, text) => {
              text = textLoopOnlyTextLines(text, (lines, i) => {
                lines[i] = _insert(
                  lines[i], inputString,
                  getIndent(lines[i]),
                );
              });
              ed.replace(range, text);
            })
            break;

          case `InsertBeginTextOnlyMinIndent`:
            editorSelectionsLoopUnsupportTab((range, text) => {
              text = textLoopOnlyMinIndent(text, (lines, i, indent) => {
                lines[i] = _insert(
                  lines[i], inputString,
                  indent,
                );
              });
              ed.replace(range, text);
            })
            break;

          case `InsertMinIndentAllLines`:
            editorSelectionsLoopUnsupportTab((range, text) => {
              text = textLoopAllLines(text, (lines, i, minIndent) => {
                if (lines[i].trim() === '') {
                  lines[i] = ' '.repeat(minIndent) + inputString;
                  return;
                }
                lines[i] = _insert(lines[i], inputString, minIndent)
              }, getMinIndent);
              ed.replace(range, text);
            })
            break;

          case `InsertMinIndentOnlyTextLines`:
            editorSelectionsLoopUnsupportTab((range, text) => {
              text = textLoopOnlyTextLines(text, (lines, i, minIndent) => {
                lines[i] = _insert(lines[i], inputString, minIndent)
              }, getMinIndent);
              ed.replace(range, text);
            })
            break;

          case `DeleteBeginText`:
            editorSelectionsLoop((range, text) => {
              text = textLoopOnlyTextLines(text, (lines, i) => {
                const trimLine = _trimFirst(lines[i], [' ', '\t']);
                const trimFirstInput = _trimFirst(inputString, [' ']);
                if (_isFirst(trimLine, trimFirstInput)) {
                  lines[i] = lines[i].replace(inputString, '');
                }
              })
              ed.replace(range, text);
            })
            break;

          default:
            new Error(`BeginOfLine extensionMain`);
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
