# VSCode extension - Begin Of Line

[![Version][version-badge]][marketplace]
[![Ratings][ratings-badge]][marketplace-ratings]
[![Installs][installs-badge]][marketplace]
[![License][license-badge]][license]

This extension has the following functions
- Inserts a character at the beginning of a line or at the beginning of a line string.
- Deletes a character at the beginning of a line string.
- Position the cursor at the beginning of a line or at the beginning of a line string.

## Install

Search for "Begin Of Line" in the Marketplace  
https://marketplace.visualstudio.com/vscode

or here  
https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-begin-of-line

## Usage

Processing is performed according to the following command for each line in the selected range.
Enter the character string after selecting the command.

Following commands are available:

- `Begin Of Line | Input`
  - `Insert | All Lines`
  - `Insert | Only Text Lines`
  - `Insert | Only Min Indent Lines`
  - `Insert | All Lines | Begin Of Text`
  - `Insert | Only Text Lines | Begin Of Text`
  - `Insert | Only Min Indent Lines | Begin Of Text`
  - `Insert | All Lines | Min Indent`
  - `Insert | Only Text Lines | Min Indent`
  - `Delete | Begin of Text`

- `Begin Of Line | Select Edit`
  - `Select Edit | All Lines`
  - `Select Edit | Only Text Lines`
  - `Select Edit | Only Min Indent Lines`
  - `Select Edit | All Lines | Begin Of Text`
  - `Select Edit | Only Text Lines | Begin Of Text`
  - `Select Edit | Only Min Indent Lines | Begin Of Text`
  - `Select Edit | All Lines | Min Indent`
  - `Select Edit | Only Text Lines | Min Indent`

Begin Of Text = The beginning of the text on each line.  
Min Indent = Minimum indentation position in the selection.  

## License

Released under the [MIT License][license].

[version-badge]: https://vsmarketplacebadge.apphb.com/version/SatoshiYamamoto.vscode-begin-of-line.svg
[ratings-badge]: https://vsmarketplacebadge.apphb.com/rating/SatoshiYamamoto.vscode-begin-of-line.svg
[installs-badge]: https://vsmarketplacebadge.apphb.com/installs/SatoshiYamamoto.vscode-begin-of-line.svg
[license-badge]: https://img.shields.io/github/license/standard-software/vscode-begin-of-line.svg

[marketplace]: https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-begin-of-line
[marketplace-ratings]: https://marketplace.visualstudio.com/items?itemName=SatoshiYamamoto.vscode-begin-of-line#review-details
[license]: https://github.com/standard-software/vscode-begin-of-line/blob/master/LICENSE

## Version

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
2021/11/16(Tue)
- refactoring

### 0.1.0
2021/11/16(Tue)
- Created by migrating from vscode-insert-string-each-line

