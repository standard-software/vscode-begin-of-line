const vscode = require(`vscode`);
const {
  isUndefined,
  _isFirst,
  _trimFirst, _trim,
} = require(`./parts/parts.js`);

const getIndent = (line) => {
  return line.length - _trimFirst(line, [` `, `\t`]).length;
};

const getMinIndent = (editor) => {
  let minIndent = Infinity;
  for (let { start, end } of editor.selections) {
    for (let i = start.line; i <= end.line; i += 1) {
      const line = editor.document.lineAt(i).text;
      if (_trim(line) === ``) { continue; }
      const indent = getIndent(line);
      if (indent < minIndent) {
        minIndent = indent;
      }
    }
  };
  if (minIndent === Infinity) { minIndent = 0; }
  return minIndent;
};

const commandQuickPick = (commandsArray, placeHolder) => {
  const commands = commandsArray.map(c => ({label:c[0], description:c[1], func:c[2]}));
  vscode.window.showQuickPick(
    commands.map(({label, description}) => ({label, description})),
    {
      canPickMany: false,
      placeHolder
    }
  ).then((item) => {
    if (!item) { return; }
    commands.find(({label}) => label === item.label).func();
  });
};

function activate(context) {

  const registerCommand = (commandName, func) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(
        commandName, func
      )
    );
  };

  const mark = vscode.workspace.getConfiguration(`BeginOfLine`).get(`subMenuMark`);

  registerCommand(`BeginOfLine.SelectFunction`, () => {

    commandQuickPick([
      [`Input`,         `${mark}`,           () => { commandQuickPick([
        [`Insert Begin Of Line`,  `${mark}`, () => { commandQuickPick([
          [`All Lines`,         ``,          () => { mainInput(`InsertBeginLineAll`); }],
          [`Text Lines`,        ``,          () => { mainInput(`InsertBeginLineText`); }],
          [`Min Indent Lines`,  ``,          () => { mainInput(`InsertBeginLineMinIndent`); }],
        ], `Begin Of Line | Input | Insert Begin Of Line`); }],
        [`Insert Begin Of Text`,  `${mark}`, () => { commandQuickPick([
          [`All Lines`,         ``,          () => { mainInput(`InsertBeginTextAll`); }],
          [`Text Lines`,        ``,          () => { mainInput(`InsertBeginTextText`); }],
          [`Min Indent Lines`,  ``,          () => { mainInput(`InsertBeginTextMinIndent`); }],
        ], `Begin Of Line | Input | Insert Begin Of Text`); }],
        [`Insert Min Indent`,     `${mark}`, () => { commandQuickPick([
          [`All Lines`,         ``,          () => { mainInput(`InsertMinIndentAll`); }],
          [`Text Lines`,        ``,          () => { mainInput(`InsertMinIndentText`); }],
        ], `Begin Of Line | Input | Insert Min Indent`); }],
        [`Delete Begin Of Text`,  ``,        () => { mainInput(`DeleteBeginText`); }],
      ], `Begin Of Line | Input`); }],
      [`Select Cursor`, `${mark}`,           () => { selectCursor(); }],
    ], `Begin Of Line | Select Function`);

  });

  const selectCursor = () => {
    commandQuickPick([
      [`All Lines`,         ``,            () => { mainSelect(`SelectBeginLineAll`); }],
      [`Text Lines`,        ``,            () => { mainSelect(`SelectBeginLineText`); }],
      [`Min Indent Lines`,  ``,            () => { mainSelect(`SelectBeginLineMinIndent`); }],
    ], `Begin Of Line | Select Cursor`);
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
              if (_trim(line) === ``) { continue; }
              editBuilder.insert(new vscode.Position(i, 0), inputString);
            }
          };
        } break;

        case `InsertBeginLineMinIndent`: {
          const minIndent = getMinIndent(editor);
          for (let { start, end } of editor.selections) {
            for (let i = start.line; i <= end.line; i += 1) {
              const line = editor.document.lineAt(i).text;
              if (_trim(line) === ``) { continue; }
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
              if (_trim(line) === ``) { continue; }
              const indent = getIndent(line);
              editBuilder.insert(new vscode.Position(i, indent), inputString);
            }
          };
        } break;

        case `InsertBeginTextMinIndent`: {
          const minIndent = getMinIndent(editor);
          for (let { start, end } of editor.selections) {
            for (let i = start.line; i <= end.line; i += 1) {
              const line = editor.document.lineAt(i).text;
              if (_trim(line) === ``) { continue; }
              const indent = getIndent(line);
              if (indent !== minIndent) { continue; }
              editBuilder.insert(new vscode.Position(i, indent), inputString);
            }
          };
        } break;

        case `InsertMinIndentAll`: {
          const minIndent = getMinIndent(editor);
          let includeTabFlag = false;
          for (let { start, end } of editor.selections) {
            for (let i = start.line; i <= end.line; i += 1) {
              const line = editor.document.lineAt(i).text;
              if (line.includes(`\t`)) { includeTabFlag = true; }
              if (_trim(line) === ``) {
                editBuilder.insert(
                  new vscode.Position( i, 0),
                  ` `.repeat(minIndent) + inputString,
                );
              } else {
                editBuilder.insert(new vscode.Position(i, minIndent), inputString);
              }
            }
          };
          if (includeTabFlag) {
            vscode.window.showInformationMessage( `This feature of Begin Of Line Extension does not support tabs.`);
          }
        } break;

        case `InsertMinIndentText`: {
          const minIndent = getMinIndent(editor);
          let includeTabFlag = false;
          for (let { start, end } of editor.selections) {
            for (let i = start.line; i <= end.line; i += 1) {
              const line = editor.document.lineAt(i).text;
              if (line.includes(`\t`)) { includeTabFlag = true; }
              if (_trim(line) === ``) {
                continue;
              } else {
                editBuilder.insert(new vscode.Position(i, minIndent), inputString);
              }
            }
          };
          if (includeTabFlag) {
            vscode.window.showInformationMessage( `This feature of Begin Of Line Extension does not support tabs.`);
          }
        } break;

        case `DeleteBeginText`: {
          for (let { start, end } of editor.selections) {
            for (let i = start.line; i <= end.line; i += 1) {
              const line = editor.document.lineAt(i).text;
              const trimLine = _trimFirst(line, [` `, `\t`]);
              const trimFirstInput = _trimFirst(inputString, [` `]);
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

    switch (commandName) {

    case `SelectBeginLineAll`: {
      const runAfterSelections = [];
      for (let { start, end } of editor.selections) {
        for (let i = start.line; i <= end.line; i += 1) {
          runAfterSelections.push(
            new vscode.Selection(i, 0, i, 0)
          );
        }
      };
      editor.selections = runAfterSelections;
    } break;

    case `SelectBeginLineText`: {
      const runAfterSelections = [];
      for (let { start, end } of editor.selections) {
        for (let i = start.line; i <= end.line; i += 1) {
          const line = editor.document.lineAt(i).text;
          if (_trim(line) === ``) { continue; }
          runAfterSelections.push(
            new vscode.Selection(i, 0, i, 0)
          );
        }
      };
      editor.selections = runAfterSelections;
    } break;

    case `SelectBeginLineMinIndent`: {
      const runAfterSelections = [];
      const minIndent = getMinIndent(editor);
      for (let { start, end } of editor.selections) {
        for (let i = start.line; i <= end.line; i += 1) {
          const line = editor.document.lineAt(i).text;
          if (_trim(line) === ``) { continue; }
          const indent = getIndent(line);
          if (indent !== minIndent) { continue; }
          runAfterSelections.push(
            new vscode.Selection(i, 0, i, 0)
          );
        }
      };
      editor.selections = runAfterSelections;
    } break;

    default: {
      throw new Error(`BeginOfLine Select Edit`);
    }
    }

  };

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

  registerCommand(`BeginOfLine.SelectCursor`, () => {
    selectCursor();
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
};
