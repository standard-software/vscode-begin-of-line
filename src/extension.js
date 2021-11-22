const vscode = require('vscode');
const {
  isUndefined,
  _isFirst,
  _trimFirst, _trim,
  _subIndex,
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

  const registerCommand = (commandName, func) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(
        commandName, func
      )
    );
  }

  registerCommand(`BeginOfLine.SelectFunction`, () => {

    let select1Space, select1Input, select1Select;
    const commands = [
      [`Space`,         '', () => { select1Space(); }],
      [`Input`,         '', () => { select1Input(); }],
      [`Select Cursor`, '', () => { select1Select(); }],
    ].map(c => ({label:c[0], description:c[1], func:c[2]}));
    vscode.window.showQuickPick(
      commands.map(({label, description}) => ({label, description})),
      {
        canPickMany: false,
        placeHolder: "Begin Of Line | Select Function"
      }
    ).then((item) => {
      if (!item) { return; }
      commands.find(({label}) => label === item.label).func();
    });

    select1Space = () => {
      const commands = [
        [`Space 2 to 4`,  '', () => { mainSpace(`Space2To4`); }],
        [`Space 4 to 2`,  '', () => { mainSpace(`Space4To2`); }],
        [`Space 4 to Tab`,'', () => { mainSpace(`Space4ToTab`); }],
        [`Tab to Space 4`,'', () => { mainSpace(`TabToSpace4`); }],
        [`Trim Begin`,    '', () => { mainSpace(`TrimBegin`); }],
      ].map(c => ({label:c[0], description:c[1], func:c[2]}));
      vscode.window.showQuickPick(
        commands.map(({label, description}) => ({label, description})),
        {
          canPickMany: false,
          placeHolder: "Begin Of Line | Space",
        }
      ).then((item) => {
        if (!item) { return; }
        commands.find(({label}) => label === item.label).func();
      });

    }

    select1Input = () => {
      let select2InsertBeginOfLine, select2InsertBeginOfText, select2InsertMinIndent, select2DeleteBeginOfText
      const commands = [
        [`Insert Begin Of Line`,  '', () => { select2InsertBeginOfLine(); }],
        [`Insert Begin Of Text`,  '', () => { select2InsertBeginOfText(); }],
        [`Insert Min Indent`,     '', () => { select2InsertMinIndent(); }],
        [`Delete Begin Of Text`,  '', () => { select2DeleteBeginOfText(); }],
      ].map(c => ({label:c[0], description:c[1], func:c[2]}));
      vscode.window.showQuickPick(
        commands.map(({label, description}) => ({label, description})),
        {
          canPickMany: false,
          placeHolder: "Begin Of Line | Input",
        }
      ).then((item) => {
        if (!item) { return; }
        commands.find(({label}) => label === item.label).func();
      });

      select2InsertBeginOfLine = () => {
        const commands = [
          [`All Lines`,         '', () => { mainInput(`InsertBeginLineAll`) }],
          [`Text Lines`,        '', () => { mainInput(`InsertBeginLineText`) }],
          [`Min Indent Lines`,  '', () => { mainInput(`InsertBeginLineMinIndent`) }],
        ].map(c => ({label:c[0], description:c[1], func:c[2]}));
        vscode.window.showQuickPick(
          commands.map(({label, description}) => ({label, description})),
          {
            canPickMany: false,
            placeHolder: "Begin Of Line | Input | Insert Begin Of Line",
          }
        ).then((item) => {
          if (!item) { return; }
          commands.find(({label}) => label === item.label).func();
        });
      }

      select2InsertBeginOfText = () => {
        const commands = [
          [`All Lines`,         '', () => { mainInput(`InsertBeginTextAll`); }],
          [`Text Lines`,        '', () => { mainInput(`InsertBeginTextText`); }],
          [`Min Indent Lines`,  '', () => { mainInput(`InsertBeginTextMinIndent`); }],
        ].map(c => ({label:c[0], description:c[1], func:c[2]}));
        vscode.window.showQuickPick(
          commands.map(({label, description}) => ({label, description})),
          {
            canPickMany: false,
            placeHolder: "Begin Of Line | Input | Insert Begin Of Text",
          }
        ).then((item) => {
          if (!item) { return; }
          commands.find(({label}) => label === item.label).func();
        });
      }

      select2InsertMinIndent = () => {
        const commands = [
          [`All Lines`,   '', () => { mainInput(`InsertMinIndentAll`); }],
          [`Text Lines`,  '', () => { mainInput(`InsertMinIndentText`); }],
        ].map(c => ({label:c[0], description:c[1], func:c[2]}));
        vscode.window.showQuickPick(
          commands.map(({label, description}) => ({label, description})),
          {
            canPickMany: false,
            placeHolder: "Begin Of Line | Input | Insert Min Indent",
          }
        ).then((item) => {
          if (!item) { return; }
          commands.find(({label}) => label === item.label).func();
        });
      }

      select2DeleteBeginOfText = () => {
        mainInput(`DeleteBeginText`);
      }
    }

    select1Select = () => {
      const commands = [
        [`All Lines`,         '', () => { mainSelect(`SelectBeginLineAll`); }],
        [`Text Lines`,        '', () => { mainSelect(`SelectBeginLineText`); }],
        [`Min Indent Lines`,  '', () => { mainSelect(`SelectBeginLineMinIndent`); }],
      ].map(c => ({label:c[0], description:c[1], func:c[2]}));
      vscode.window.showQuickPick(
        commands.map(({label, description}) => ({label, description})),
        {
          canPickMany: false,
          placeHolder: "Begin Of Line | Select Cursor",
        }
      ).then((item) => {
        if (!item) { return; }
        commands.find(({label}) => label === item.label).func();
      });
    }

  });

  const mainSpace = (commandName) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage(`No editor is active`);
      return;
    }
    editor.edit(editBuilder => {
      switch (commandName) {

        case `Space2To4`: {
          for (let { start, end } of editor.selections) {
            for (let i = start.line; i <= end.line; i += 1) {
              const line = editor.document.lineAt(i).text;
              const trimLine = _trimFirst(line, [' ', '\t']);
              const indent = _subIndex(line, 0, line.length - trimLine.length - 1)
              const range = new vscode.Range(
                i, 0, i, line.length - trimLine.length,
              );
              editBuilder.replace(range, indent.replaceAll('  ', '    '));
            }
          };
        } break;

        case `Space4To2`: {
          for (let { start, end } of editor.selections) {
            for (let i = start.line; i <= end.line; i += 1) {
              const line = editor.document.lineAt(i).text;
              const trimLine = _trimFirst(line, [' ', '\t']);
              const indent = _subIndex(line, 0, line.length - trimLine.length - 1)
              const range = new vscode.Range(
                i, 0, i, line.length - trimLine.length,
              );
              editBuilder.replace(range, indent.replaceAll('    ', '  '));
            }
          };
        } break;

        case `Space4ToTab`: {
          for (let { start, end } of editor.selections) {
            for (let i = start.line; i <= end.line; i += 1) {
              const line = editor.document.lineAt(i).text;
              const trimLine = _trimFirst(line, [' ', '\t']);
              const indent = _subIndex(line, 0, line.length - trimLine.length - 1)
              const range = new vscode.Range(
                i, 0, i, line.length - trimLine.length,
              );
              editBuilder.replace(range, indent.replaceAll('    ', '\t'));
            }
          };
        } break;

        case `TabToSpace4`: {
          for (let { start, end } of editor.selections) {
            for (let i = start.line; i <= end.line; i += 1) {
              const line = editor.document.lineAt(i).text;
              const trimLine = _trimFirst(line, [' ', '\t']);
              const indent = _subIndex(line, 0, line.length - trimLine.length - 1)
              const range = new vscode.Range(
                i, 0, i, line.length - trimLine.length,
              );
              editBuilder.replace(range, indent.replaceAll('\t', '    '));
            }
          };
        } break;

        case `TrimBegin`: {
          for (let { start, end } of editor.selections) {
            for (let i = start.line; i <= end.line; i += 1) {
              const line = editor.document.lineAt(i).text;
              const trimLine = _trimFirst(line, [' ', '\t']);
              const range = new vscode.Range(
                i, 0, i, line.length,
              );
              editBuilder.replace(range, trimLine);
            }
          };
        } break;

      }
    });
  };

  const mainInput = (commandName) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage(`No editor is active`);
      return;
    }

    vscode.window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: ``,
      prompt: `Input String`,
      value: vscode.workspace.getConfiguration(`BeginOfLine`).get(`insertString`),
    }).then(inputString => {
      if (isUndefined(inputString)) { return; }

      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage( `No editor is active` );
        return;
      }
      editor.edit(editBuilder => {

        switch (commandName) {

          case `InsertBeginLineAll`: {
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                editBuilder.insert(new vscode.Position(i, 0), inputString);
              }
            };
          } break;

          case `InsertBeginLineText`: {
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                editBuilder.insert(new vscode.Position(i, 0), inputString);
              }
            };
          } break;

          case `InsertBeginLineMinIndent`: {
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

          case `InsertBeginTextAll`: {
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                const indent = getIndent(line);
                editBuilder.insert(new vscode.Position(i, indent), inputString);
              }
            };
          } break;

          case `InsertBeginTextText`: {
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                const indent = getIndent(line);
                editBuilder.insert(new vscode.Position(i, indent), inputString);
              }
            };
          } break;

          case `InsertBeginTextMinIndent`: {
            const minIndent = getMinIndent(editor)
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                const indent = getIndent(line);
                if (indent !== minIndent) { continue; }
                editBuilder.insert(new vscode.Position(i, indent), inputString);
              }
            };
          } break;

          case `InsertMinIndentAll`: {
            const minIndent = getMinIndent(editor)
            let includeTabFlag = false;
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (line.includes(`\t`)) { includeTabFlag = true }
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
              vscode.window.showInformationMessage( 'This feature of Begin Of Line Extension does not support tabs.');
            }
          } break;

          case `InsertMinIndentText`: {
            const minIndent = getMinIndent(editor)
            let includeTabFlag = false;
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (line.includes(`\t`)) { includeTabFlag = true }
                if (_trim(line) === '') {
                  continue;
                } else {
                  editBuilder.insert(new vscode.Position(i, minIndent), inputString);
                }
              }
            };
            if (includeTabFlag) {
              vscode.window.showInformationMessage( 'This feature of Begin Of Line Extension does not support tabs.');
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

  };

  const mainSelect = (commandName) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage(`No editor is active`);
      return;
    }
    editor.edit(editBuilder => {
      switch (commandName) {

        case `SelectBeginLineAll`: {
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

        case `SelectBeginLineText`: {
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

        case `SelectBeginLineMinIndent`: {
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

        default: {
          throw new Error(`BeginOfLine Select Edit`);
        }
      }
    });
  };

  registerCommand(`BeginOfLine.Space2To4`, () => {
    mainSpace(`Space2To4`);
  });

  registerCommand(`BeginOfLine.Space4To2`, () => {
    mainSpace(`Space4To2`);
  });

  registerCommand(`BeginOfLine.Space4ToTab`, () => {
    mainSpace(`Space4ToTab`);
  });

  registerCommand(`BeginOfLine.TabToSpace4`, () => {
    mainSpace(`TabToSpace4`);
  });

  registerCommand(`BeginOfLine.TrimBegin`, () => {
    mainSpace(`TrimBegin`);
  });

  registerCommand(`BeginOfLine.InsertBeginLineAll`, () => {
    mainInput(`InsertBeginLineAll`);
  });

  registerCommand(`BeginOfLine.InsertBeginLineText`, () => {
    mainInput(`InsertBeginLineText`);
  });

  registerCommand(`BeginOfLine.InsertBeginLineMinIndent`, () => {
    mainInput(`InsertBeginLineMinIndent`);
  });

  registerCommand(`BeginOfLine.InsertBeginTextAll`, () => {
    mainInput(`InsertBeginTextAll`);
  });

  registerCommand(`BeginOfLine.InsertBeginTextText`, () => {
    mainInput(`InsertBeginTextText`);
  });

  registerCommand(`BeginOfLine.InsertBeginTextMinIndent`, () => {
    mainInput(`InsertBeginTextMinIndent`);
  });

  registerCommand(`BeginOfLine.InsertMinIndentAll`, () => {
    mainInput(`InsertMinIndentAll`);
  });

  registerCommand(`BeginOfLine.InsertMinIndentText`, () => {
    mainInput(`InsertMinIndentText`);
  });

  registerCommand(`BeginOfLine.DeleteBeginText`, () => {
    mainInput(`DeleteBeginText`);
  });

  registerCommand(`BeginOfLine.SelectBeginLineAll`, () => {
    mainSelect(`SelectBeginLineAll`);
  });

  registerCommand(`BeginOfLine.SelectBeginLineText`, () => {
    mainSelect(`SelectBeginLineText`);
  });

  registerCommand(`BeginOfLine.SelectBeginLineMinIndent`, () => {
    mainSelect(`SelectBeginLineMinIndent`);
  });

}

function deactivate() {}

module.exports = {
  activate,
  deactivate
}
