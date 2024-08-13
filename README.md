# Begin Of Line (deprecated)

[![](https://vsmarketplacebadges.dev/version-short/SatoshiYamamoto.vscode-begin-of-line.png)](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-begin-of-line)
[![](https://vsmarketplacebadges.dev/installs-short/SatoshiYamamoto.vscode-begin-of-line.png)](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-begin-of-line)
[![](https://vsmarketplacebadges.dev/rating-short/SatoshiYamamoto.vscode-begin-of-line.png)](https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-begin-of-line)
[![](https://img.shields.io/github/license/standard-software/vscode-begin-of-line.png)](https://github.com/standard-software/vscode-begin-of-line/blob/main/LICENSE)

This extension has the following functions
- Inserts a character at the beginning of a line or at the beginning of a line string.
- Deletes a character at the beginning of a line string.
- Position the cursor at the beginning of a line or at the beginning of a line string.

## Attention Information

This extension is deprecated.

The Insert and Delete functions exist in this extension. However, we found that you can insert or delete the string after moving the cursor.

So I created "Select Line Cursor" as a simple function only." Go to "Select Line Cursor".

Select Line Cursor - Visual Studio Marketplace
https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-select-line-cursor

## Install

https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-begin-of-line

## Usage

Processing is performed according to the following command for each line in the selected range.
Enter the character string after selecting the command.

Following commands are available:

```
- Begin Of Line | Insert Begin Of Line | All Lines
- Begin Of Line | Insert Begin Of Line | Text Lines
- Begin Of Line | Insert Begin Of Line | Min Indent Lines
- Begin Of Line | Insert Begin Of Text | All Lines
- Begin Of Line | Insert Begin Of Text | Text Lines
- Begin Of Line | Insert Begin Of Text | Min Indent Lines
- Begin Of Line | Insert Min Indent | All Lines
- Begin Of Line | Insert Min Indent | Text Lines
- Begin Of Line | Delete Begin of Text

- Begin Of Line | Select Cursor
- Begin Of Line | Select Cursor | All Lines
- Begin Of Line | Select Cursor | Text Lines
- Begin Of Line | Select Cursor | Min Indent Lines
```

Or Select Function

```
- Begin Of Line | Select Function
  - Input ▸
    - Insert Begin Of Line ▸
      - All Lines
      - Text Lines
      - Min Indent Lines
    - Insert Begin Of Text ▸
      - All Lines
      - Text Lines
      - Min Indent Lines
    - Insert Min Indent ▸
      - All Lines
      - Text Lines
    - Delete Begin of Text
  - Select Cursor ▸
    - All Lines
    - Text Lines
    - Min Indent Lines
```

Begin Of Text = The beginning of the text on each line.  
Min Indent = Minimum indentation position in the selection.  

## Setting

settings.json

```json
{
  "BeginOfLine.subMenuMark": ">>",
  "BeginOfLine.insertString": "> ",
  :
}
```

## License

Released under the [MIT License][license].

## Veresion / Change log

[./CHANGELOG.md](./CHANGELOG.md)

