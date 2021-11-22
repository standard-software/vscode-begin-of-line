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
      let select2Space2To4, select2TrimBegin;
      const commands = [
        [`Space 2 to 4`,  '', () => { select2Space2To4(); }],
        [`Trim Begin`,    '', () => { select2TrimBegin(); }],
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

      select2Space2To4 = () => {
        console.log(`select2Space2To4`);
      }

      select2TrimBegin = () => {
        console.log(`select2TrimBegin`);
      }
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
        let select3InsertBeginOfLineAll, select3InsertBeginOfLineText, select3InsertBeginOfLineMinIndent;
        const commands = [
          [`All Lines`,         '', () => { select3InsertBeginOfLineAll() }],
          [`Text Lines`,        '', () => { select3InsertBeginOfLineText() }],
          [`Min Indent Lines`,  '', () => { select3InsertBeginOfLineMinIndent() }],
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

        select3InsertBeginOfLineAll = () => {
          mainInput(`InsertBeginLineAllLines`);
        }

        select3InsertBeginOfLineText = () => {
          mainInput(`InsertBeginLineTextLines`);
        }

        select3InsertBeginOfLineMinIndent = () => {
          mainInput(`InsertBeginLineMinIndent`);
        }
      }

      select2InsertBeginOfText = () => {
        let select3InsertBeginOfTextAll, select3InsertBeginOfTextText, select3InsertBeginOfTextMinIndent;
        const commands = [
          [`All Lines`,         '', () => { select3InsertBeginOfTextAll(); }],
          [`Text Lines`,        '', () => { select3InsertBeginOfTextText(); }],
          [`Min Indent Lines`,  '', () => { select3InsertBeginOfTextMinIndent(); }],
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

        select3InsertBeginOfTextAll = () => {
          mainInput(`InsertBeginTextAllLines`);
        }

        select3InsertBeginOfTextText = () => {
          mainInput(`InsertBeginTextTextLines`);
        }

        select3InsertBeginOfTextMinIndent = () => {
          mainInput(`InsertBeginTextMinIndent`);
        }
      }

      select2InsertMinIndent = () => {
        let select3InsertMinIndentAll, select3InsertMinIndentText;
        const commands = [
          [`All Lines`,   '', () => { select3InsertMinIndentAll(); }],
          [`Text Lines`,  '', () => { select3InsertMinIndentText(); }],
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

        select3InsertMinIndentAll = () => {
          mainInput(`InsertMinIndentAllLines`);
        }

        select3InsertMinIndentText = () => {
          mainInput(`InsertMinIndentTextLines`);
        }
      }

      select2DeleteBeginOfText = () => {
        mainInput(`DeleteBeginText`);
      }
    }

    select1Select = () => {
      let select2SelectAll, select2SelectText, select2SelectMinIndent;
      const commands = [
        [`All Lines`,         '', () => { select2SelectAll(); }],
        [`Text Lines`,        '', () => { select2SelectText(); }],
        [`Min Indent Lines`,  '', () => { select2SelectMinIndent(); }],
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

      select2SelectAll = () => {
        console.log(`select2SelectAll`);
      }

      select2SelectText = () => {
        console.log(`select2SelectText`);
      }

      select2SelectMinIndent = () => {
        console.log(`select2SelectMinIndent`);
      }
    }

  });

  // context.subscriptions.push(vscode.commands.registerCommand(
  //   `BeginOfLine.Input`, () => {

  //     const inputCommands = {
  //       InsertBeginLineAllLines:      { label: `Insert | All Lines`, description: "" },
  //       InsertBeginLineOnlyTextLines: { label: `Insert | Only Text Lines`, description: `` },
  //       InsertBeginLineOnlyMinIndent: { label: `Insert | Only Min Indent Lines`, description: `` },
  //       InsertBeginTextAllLines:      { label: `Insert | All Lines | Begin Of Text`, description: `` },
  //       InsertBeginTextOnlyTextLines: { label: `Insert | Only Text Lines | Begin Of Text`, description: `` },
  //       InsertBeginTextOnlyMinIndent: { label: `Insert | Only Min Indent Lines | Begin Of Text`, description: `` },
  //       InsertMinIndentAllLines:      { label: `Insert | All Lines | Min Indent`, description: `` },
  //       InsertMinIndentOnlyTextLines: { label: `Insert | Only Text Lines | Min Indent`, description: `` },
  //       DeleteBeginText:              { label: `Delete | Begin Of Text`, description: `` },
  //     }

  //     vscode.window.showQuickPick(Object.values(inputCommands), {
  //       canPickMany: false,
  //       placeHolder: "Select Command | Begin Of Line | Input",
  //     }).then((item) => {
  //       if (!item) { return; }

  //       let _commandName = '';
  //       for (let [key, value] of Object.entries(inputCommands)) {
  //         if (item === value) {
  //           _commandName = key;
  //           break;
  //         }
  //       }
  //       if (_commandName === '') { return; }
  //       const commandName = _commandName;

  //       const editor = vscode.window.activeTextEditor;
  //       if (!editor) {
  //         vscode.window.showInformationMessage(`No editor is active`);
  //         return;
  //       }

  //       vscode.window.showInputBox({
  //         ignoreFocusOut: true,
  //         placeHolder: ``,
  //         prompt: `Input String`,
  //         value: vscode.workspace.getConfiguration(`BeginOfLine`).get(`insertString`),
  //       }).then(inputString => {
  //         if (isUndefined(inputString)) {
  //           return;
  //         }
  //         const editor = vscode.window.activeTextEditor;
  //         if (!editor) {
  //           vscode.window.showInformationMessage( `No editor is active` );
  //           return;
  //         }
  //         editor.edit(editBuilder => {

  //           switch (commandName) {

  //           case `InsertBeginLineAllLines`: {
  //             for (let { start, end } of editor.selections) {
  //               for (let i = start.line; i <= end.line; i += 1) {
  //                 editBuilder.insert(new vscode.Position(i, 0), inputString);
  //               }
  //             };
  //           } break;

  //           case `InsertBeginLineOnlyTextLines`: {
  //             for (let { start, end } of editor.selections) {
  //               for (let i = start.line; i <= end.line; i += 1) {
  //                 const line = editor.document.lineAt(i).text;
  //                 if (_trim(line) === '') { continue; }
  //                 editBuilder.insert(new vscode.Position(i, 0), inputString);
  //               }
  //             };
  //           } break;

  //           case `InsertBeginLineOnlyMinIndent`: {
  //             const minIndent = getMinIndent(editor)
  //             for (let { start, end } of editor.selections) {
  //               for (let i = start.line; i <= end.line; i += 1) {
  //                 const line = editor.document.lineAt(i).text;
  //                 if (_trim(line) === '') { continue; }
  //                 const indent = getIndent(line);
  //                 if (indent !== minIndent) { continue; }
  //                 editBuilder.insert(new vscode.Position(i, 0), inputString);
  //               }
  //             };
  //           } break;

  //           case `InsertBeginTextAllLines`: {
  //             for (let { start, end } of editor.selections) {
  //               for (let i = start.line; i <= end.line; i += 1) {
  //                 const line = editor.document.lineAt(i).text;
  //                 const indent = getIndent(line);
  //                 editBuilder.insert(new vscode.Position(i, indent), inputString);
  //               }
  //             };
  //           } break;

  //           case `InsertBeginTextOnlyTextLines`: {
  //             for (let { start, end } of editor.selections) {
  //               for (let i = start.line; i <= end.line; i += 1) {
  //                 const line = editor.document.lineAt(i).text;
  //                 if (_trim(line) === '') { continue; }
  //                 const indent = getIndent(line);
  //                 editBuilder.insert(new vscode.Position(i, indent), inputString);
  //               }
  //             };
  //           } break;

  //           case `InsertBeginTextOnlyMinIndent`: {
  //             const minIndent = getMinIndent(editor)
  //             for (let { start, end } of editor.selections) {
  //               for (let i = start.line; i <= end.line; i += 1) {
  //                 const line = editor.document.lineAt(i).text;
  //                 if (_trim(line) === '') { continue; }
  //                 const indent = getIndent(line);
  //                 if (indent !== minIndent) { continue; }
  //                 editBuilder.insert(new vscode.Position(i, indent), inputString);
  //               }
  //             };
  //           } break;

  //           case `InsertMinIndentAllLines`: {
  //             const minIndent = getMinIndent(editor)
  //             let includeTabFlag = false;
  //             for (let { start, end } of editor.selections) {
  //               for (let i = start.line; i <= end.line; i += 1) {
  //                 const line = editor.document.lineAt(i).text;
  //                 if (line.includes(`\t`)) { includeTabFlag = true }
  //                 if (_trim(line) === '') {
  //                   editBuilder.insert(
  //                     new vscode.Position( i, 0),
  //                     ' '.repeat(minIndent) + inputString,
  //                   );
  //                 } else {
  //                   editBuilder.insert(new vscode.Position(i, minIndent), inputString);
  //                 }
  //               }
  //             };
  //             if (includeTabFlag) {
  //               vscode.window.showInformationMessage( 'This feature of Begin Of Line Extension does not support tabs.');
  //             }
  //           } break;

  //           case `InsertMinIndentOnlyTextLines`: {
  //             const minIndent = getMinIndent(editor)
  //             let includeTabFlag = false;
  //             for (let { start, end } of editor.selections) {
  //               for (let i = start.line; i <= end.line; i += 1) {
  //                 const line = editor.document.lineAt(i).text;
  //                 if (line.includes(`\t`)) { includeTabFlag = true }
  //                 if (_trim(line) === '') {
  //                   continue;
  //                 } else {
  //                   editBuilder.insert(new vscode.Position(i, minIndent), inputString);
  //                 }
  //               }
  //             };
  //             if (includeTabFlag) {
  //               vscode.window.showInformationMessage( 'This feature of Begin Of Line Extension does not support tabs.');
  //             }
  //           } break;

  //           case `DeleteBeginText`: {
  //             for (let { start, end } of editor.selections) {
  //               for (let i = start.line; i <= end.line; i += 1) {
  //                 const line = editor.document.lineAt(i).text;
  //                 const trimLine = _trimFirst(line, [' ', '\t']);
  //                 const trimFirstInput = _trimFirst(inputString, [' ']);
  //                 const indent = line.length - trimLine.length;
  //                 if (_isFirst(trimLine, trimFirstInput)) {
  //                   editBuilder.delete(
  //                     new vscode.Range(
  //                       i, indent,
  //                       i, indent + trimFirstInput.length
  //                     )
  //                   );
  //                 }
  //               }
  //             };
  //           } break;

  //           default: {
  //             throw new Error(`BeginOfLine Input`);
  //           }
  //           }
  //         });
  //       });

  //     });
  //   })
  // );

  // context.subscriptions.push(

  //   vscode.commands.registerCommand(`BeginOfLine.SelectEdit`, () => {
  //     const selectEditCommands = {
  //       BeginLineAllLines:      { label: `Select Edit | All Lines`, description: "" },
  //       BeginLineOnlyTextLines: { label: `Select Edit | Only Text Lines`, description: `` },
  //       BeginLineOnlyMinIndent: { label: `Select Edit | Only Min Indent Lines`, description: `` },
  //       BeginTextAllLines:      { label: `Select Edit | All Lines | Begin Of Text`, description: `` },
  //       BeginTextOnlyTextLines: { label: `Select Edit | Only Text Lines | Begin Of Text`, description: `` },
  //       BeginTextOnlyMinIndent: { label: `Select Edit | Only Min Indent Lines | Begin Of Text`, description: `` },
  //       MinIndentAllLines:      { label: `Select Edit | All Lines | Min Indent`, description: `` },
  //       MinIndentOnlyTextLines: { label: `Select Edit | Only Text Lines | Min Indent`, description: `` },
  //     }

  //     vscode.window.showQuickPick(Object.values(selectEditCommands), {
  //       canPickMany: false,
  //       placeHolder: "Select Command | Begin Of Line | Select Edit",
  //     }).then((item) => {
  //       if (!item) { return; }

  //       let _commandName = '';
  //       for (let [key, value] of Object.entries(selectEditCommands)) {
  //         if (item === value) {
  //           _commandName = key;
  //           break;
  //         }
  //       }
  //       if (_commandName === '') { return; }
  //       const commandName = _commandName;

  //       const editor = vscode.window.activeTextEditor;
  //       if (!editor) {
  //         vscode.window.showInformationMessage(`No editor is active`);
  //         return;
  //       }
  //       editor.edit(editBuilder => {
  //         switch (commandName) {

  //         case `BeginLineAllLines`: {
  //           const runAfterSelections = [];
  //           for (let { start, end } of editor.selections) {
  //             for (let i = start.line; i <= end.line; i += 1) {
  //               runAfterSelections.push(
  //                 new vscode.Selection(i, 0, i, 0)
  //               )
  //             }
  //           };
  //           editor.selections = runAfterSelections;
  //         } break;

  //         case `BeginLineOnlyTextLines`: {
  //           const runAfterSelections = [];
  //           for (let { start, end } of editor.selections) {
  //             for (let i = start.line; i <= end.line; i += 1) {
  //               const line = editor.document.lineAt(i).text;
  //               if (_trim(line) === '') { continue; }
  //               runAfterSelections.push(
  //                 new vscode.Selection(i, 0, i, 0)
  //               )
  //             }
  //           };
  //           editor.selections = runAfterSelections;
  //         } break;

  //         case `BeginLineOnlyMinIndent`: {
  //           const runAfterSelections = [];
  //           const minIndent = getMinIndent(editor)
  //           for (let { start, end } of editor.selections) {
  //             for (let i = start.line; i <= end.line; i += 1) {
  //               const line = editor.document.lineAt(i).text;
  //               if (_trim(line) === '') { continue; }
  //               const indent = getIndent(line);
  //               if (indent !== minIndent) { continue; }
  //               runAfterSelections.push(
  //                 new vscode.Selection(i, 0, i, 0)
  //               )
  //             }
  //           };
  //           editor.selections = runAfterSelections;
  //         } break;

  //         case `BeginTextAllLines`: {
  //           const runAfterSelections = [];
  //           for (let { start, end } of editor.selections) {
  //             for (let i = start.line; i <= end.line; i += 1) {
  //               const line = editor.document.lineAt(i).text;
  //               const indent = getIndent(line);
  //               runAfterSelections.push(
  //                 new vscode.Selection(i, indent, i, indent)
  //               )
  //             }
  //           };
  //           editor.selections = runAfterSelections;
  //         } break;

  //         case `BeginTextOnlyTextLines`: {
  //           const runAfterSelections = [];
  //           for (let { start, end } of editor.selections) {
  //             for (let i = start.line; i <= end.line; i += 1) {
  //               const line = editor.document.lineAt(i).text;
  //               if (_trim(line) === '') { continue; }
  //               const indent = getIndent(line);
  //               runAfterSelections.push(
  //                 new vscode.Selection(i, indent, i, indent)
  //               )
  //             }
  //           };
  //           editor.selections = runAfterSelections;
  //         } break;

  //         case `BeginTextOnlyMinIndent`: {
  //           const runAfterSelections = [];
  //           const minIndent = getMinIndent(editor)
  //           for (let { start, end } of editor.selections) {
  //             for (let i = start.line; i <= end.line; i += 1) {
  //               const line = editor.document.lineAt(i).text;
  //               if (_trim(line) === '') { continue; }
  //               const indent = getIndent(line);
  //               if (indent !== minIndent) { continue; }
  //               runAfterSelections.push(
  //                 new vscode.Selection(i, indent, i, indent)
  //               )
  //             }
  //           };
  //           editor.selections = runAfterSelections;
  //         } break;

  //         case `MinIndentAllLines`: {
  //           const runAfterSelections = [];
  //           const minIndent = getMinIndent(editor)
  //           let includeTabFlag = false;
  //           for (let { start, end } of editor.selections) {
  //             for (let i = start.line; i <= end.line; i += 1) {
  //               const line = editor.document.lineAt(i).text;
  //               if (line.includes(`\t`)) {
  //                 includeTabFlag = true
  //               }
  //               if (_trim(line) === '') {
  //                 editBuilder.insert(
  //                   new vscode.Position( i, 0),
  //                   ' '.repeat(minIndent),
  //                 );
  //               }
  //               runAfterSelections.push(
  //                 new vscode.Selection(i, minIndent, i, minIndent)
  //               )
  //             }
  //           };
  //           editor.selections = runAfterSelections;
  //           if (includeTabFlag) {
  //             vscode.window.showInformationMessage( 'This feature of Begin Of Line Extension does not support tabs.');
  //           }
  //         } break;

  //         case `MinIndentOnlyTextLines`: {
  //           const runAfterSelections = [];
  //           const minIndent = getMinIndent(editor)
  //           let includeTabFlag = false;
  //           for (let { start, end } of editor.selections) {
  //             for (let i = start.line; i <= end.line; i += 1) {
  //               const line = editor.document.lineAt(i).text;
  //               if (line.includes(`\t`)) {
  //                 includeTabFlag = true
  //               }
  //               if (_trim(line) === '') { continue; }
  //               runAfterSelections.push(
  //                 new vscode.Selection(i, minIndent, i, minIndent)
  //               )
  //             }
  //           };
  //           editor.selections = runAfterSelections;
  //           if (includeTabFlag) {
  //             vscode.window.showInformationMessage( 'This feature of Begin Of Line Extension does not support tabs.');
  //           }
  //         } break;

  //         default: {
  //           throw new Error(`BeginOfLine Select Edit`);
  //         }
  //         }
  //       });
  //     });
  //   })
  // );

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
                const indent = getIndent(line);
                editBuilder.insert(new vscode.Position(i, indent), inputString);
              }
            };
          } break;

          case `InsertBeginTextOnlyTextLines`: {
            for (let { start, end } of editor.selections) {
              for (let i = start.line; i <= end.line; i += 1) {
                const line = editor.document.lineAt(i).text;
                if (_trim(line) === '') { continue; }
                const indent = getIndent(line);
                editBuilder.insert(new vscode.Position(i, indent), inputString);
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
                editBuilder.insert(new vscode.Position(i, indent), inputString);
              }
            };
          } break;

          case `InsertMinIndentAllLines`: {
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

          case `InsertMinIndentOnlyTextLines`: {
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

        case `SelectBeginLineAllLines`: {
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

        case `SelectBeginLineOnlyTextLines`: {
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

        case `SelectBeginLineOnlyMinIndent`: {
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

  registerCommand(`BeginOfLine.InsertBeginLineAllLines`, () => {
    mainInput(`InsertBeginLineAllLines`);
  });

  registerCommand(`BeginOfLine.InsertBeginLineTextLines`, () => {
    mainInput(`InsertBeginLineTextLines`);
  });

  registerCommand(`BeginOfLine.InsertBeginLineMinIndent`, () => {
    mainInput(`InsertBeginLineMinIndent`);
  });

  registerCommand(`BeginOfLine.InsertBeginTextAllLines`, () => {
    mainInput(`InsertBeginTextAllLines`);
  });

  registerCommand(`BeginOfLine.InsertBeginTextTextLines`, () => {
    mainInput(`InsertBeginTextTextLines`);
  });

  registerCommand(`BeginOfLine.InsertBeginTextMinIndent`, () => {
    mainInput(`InsertBeginTextMinIndent`);
  });

  registerCommand(`BeginOfLine.InsertMinIndentAllLines`, () => {
    mainInput(`InsertMinIndentAllLines`);
  });

  registerCommand(`BeginOfLine.InsertMinIndentTextLines`, () => {
    mainInput(`InsertMinIndentTextLines`);
  });

  registerCommand(`BeginOfLine.DeleteBeginText`, () => {
    mainInput(`DeleteBeginText`);
  });

  registerCommand(`BeginOfLine.SelectBeginLineAllLines`, () => {
    mainSelect(`SelectBeginLineAllLines`);
  });

  registerCommand(`BeginOfLine.SelectBeginLineTextLines`, () => {
    mainSelect(`SelectBeginLineTextLines`);
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
