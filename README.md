# VSCode extension - Begin Of Line

[![Version][version-badge]][marketplace]
[![Ratings][ratings-badge]][marketplace-ratings]
[![Installs][installs-badge]][marketplace]
[![License][license-badge]][license]

[version-badge]: https://vsmarketplacebadge.apphb.com/version/SatoshiYamamoto.vscode-begin-of-line.svg
[ratings-badge]: https://vsmarketplacebadge.apphb.com/rating/SatoshiYamamoto.vscode-begin-of-line.svg
[installs-badge]: https://vsmarketplacebadge.apphb.com/installs/SatoshiYamamoto.vscode-begin-of-line.svg
[license-badge]: https://img.shields.io/github/license/standard-software/vscode-begin-of-line.svg

[marketplace]: https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-begin-of-line
[marketplace-ratings]: https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-begin-of-line#review-details
[license]: https://github.com/standard-software/vscode-begin-of-line/blob/master/LICENSE

This extension has the following functions
- Inserts a character at the beginning of a line or at the beginning of a line string.
- Deletes a character at the beginning of a line string.
- Position the cursor at the beginning of a line or at the beginning of a line string.

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

- Begin Of Line | Select Cursor | All Lines
- Begin Of Line | Select Cursor | Text Lines
- Begin Of Line | Select Cursor | Min Indent Lines
```

Or Select Function

```
- Begin Of Line | Select Function
  - Input ???
    - Insert Begin Of Line ???
      - All Lines
      - Text Lines
      - Min Indent Lines
    - Insert Begin Of Text ???
      - All Lines
      - Text Lines
      - Min Indent Lines
    - Insert Min Indent ???
      - All Lines
      - Text Lines
    - Delete Begin of Text
  - Select Cursor ???
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

## Version

### 2.2.0
2022/05/03 Tue
- Update README
- Set title icon
- Remove unnecessary npm packages
- set vscode debug config
- Sub Menu Mark "???"
  - Changeable in the settings
  - show it in the description
- refactoring

### 2.1.0
2021/12/06(Mon)
- refactoring
- delete function (Transfer functionality to the following extensions)
  - Space 2 To 4 / 4 to 2
  - Space 4 To Tab / Tab To 4
  - Trim Begin  
  
vscode-indent-space  
https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-indent-space

### 2.0.0
2021/11/22(Mon)
- add select function
- add space
  - Space 2 To 4 / 4 to 2
  - Space 4 To Tab / Tab To 4
  - Trim Begin

### 1.0.1
2021/11/16(Tue)
- update Readme
- upload github vscode-begin-of-line-1.0.1.vsix

### 1.0.0
2021/11/16(Tue)
- Readme

### 0.3.1
2021/11/16(Tue)
- refactoring

### 0.3.0
2021/11/16(Tue)
- Implemented the cursor selection editing function.

### 0.2.1
2021/11/16(Tue)
- refactoring

### 0.2.0
2021/11/16(Tue)
- Major change in implementation method, from editBuilder.replace to editBuilder.insesrt.

### 0.1.1
2021/11/15(Mon)
- refactoring

### 0.1.0
2021/11/15(Mon)
- Created by migrating from vscode-insert-string-each-line
