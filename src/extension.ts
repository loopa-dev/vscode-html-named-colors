import * as vscode from 'vscode';

const allHtmlColors = [
  'AliceBlue',
  'AntiqueWhite',
  'Aqua',
  'Aquamarine',
  'Azure',
  'Beige',
  'Bisque',
  'Black',
  'BlanchedAlmond',
  'Blue',
  'BlueViolet',
  'Brown',
  'BurlyWood',
  'CadetBlue',
  'Chartreuse',
  'Chocolate',
  'Coral',
  'CornflowerBlue',
  'Cornsilk',
  'Crimson',
  'Cyan',
  'DarkBlue',
  'DarkCyan',
  'DarkGoldenRod',
  'DarkGray',
  'DarkGrey',
  'DarkGreen',
  'DarkKhaki',
  'DarkMagenta',
  'DarkOliveGreen',
  'Darkorange',
  'DarkOrchid',
  'DarkRed',
  'DarkSalmon',
  'DarkSeaGreen',
  'DarkSlateBlue',
  'DarkSlateGray',
  'DarkSlateGrey',
  'DarkTurquoise',
  'DarkViolet',
  'DeepPink',
  'DeepSkyBlue',
  'DimGray',
  'DimGrey',
  'DodgerBlue',
  'FireBrick',
  'FloralWhite',
  'ForestGreen',
  'Fuchsia',
  'Gainsboro',
  'GhostWhite',
  'Gold',
  'GoldenRod',
  'Gray',
  'Grey',
  'Green',
  'GreenYellow',
  'HoneyDew',
  'HotPink',
  'IndianRed',
  'Indigo',
  'Ivory',
  'Khaki',
  'Lavender',
  'LavenderBlush',
  'LawnGreen',
  'LemonChiffon',
  'LightBlue',
  'LightCoral',
  'LightCyan',
  'LightGoldenRodYellow',
  'LightGray',
  'LightGrey',
  'LightGreen',
  'LightPink',
  'LightSalmon',
  'LightSeaGreen',
  'LightSkyBlue',
  'LightSlateGray',
  'LightSlateGrey',
  'LightSteelBlue',
  'LightYellow',
  'Lime',
  'LimeGreen',
  'Linen',
  'Magenta',
  'Maroon',
  'MediumAquaMarine',
  'MediumBlue',
  'MediumOrchid',
  'MediumPurple',
  'MediumSeaGreen',
  'MediumSlateBlue',
  'MediumSpringGreen',
  'MediumTurquoise',
  'MediumVioletRed',
  'MidnightBlue',
  'MintCream',
  'MistyRose',
  'Moccasin',
  'NavajoWhite',
  'Navy',
  'OldLace',
  'Olive',
  'OliveDrab',
  'Orange',
  'OrangeRed',
  'Orchid',
  'PaleGoldenRod',
  'PaleGreen',
  'PaleTurquoise',
  'PaleVioletRed',
  'PapayaWhip',
  'PeachPuff',
  'Peru',
  'Pink',
  'Plum',
  'PowderBlue',
  'Purple',
  'RebeccaPurple',
  'Red',
  'RosyBrown',
  'RoyalBlue',
  'SaddleBrown',
  'Salmon',
  'SandyBrown',
  'SeaGreen',
  'SeaShell',
  'Sienna',
  'Silver',
  'SkyBlue',
  'SlateBlue',
  'SlateGray',
  'SlateGrey',
  'Snow',
  'SpringGreen',
  'SteelBlue',
  'Tan',
  'Teal',
  'Thistle',
  'Tomato',
  'Turquoise',
  'Violet',
  'Wheat',
  'White',
  'WhiteSmoke',
  'Yellow',
  'YellowGreen',
];

let frequentlyUsedColors: string[] = [];

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'html-named-colors.insertColor',
    async () => {
      frequentlyUsedColors = context.globalState.get(
        'frequentlyUsedColors',
        frequentlyUsedColors
      );

      const pick = await vscode.window.showQuickPick(getColorItems(), {
        matchOnDescription: true,
        placeHolder: 'Select a color to insert',
      });

      if (pick) {
        insertColorToEditor(pick.label);
        updateFrequentlyUsedColors(pick.label, context);
      }
    }
  );

  context.subscriptions.push(disposable);
}

function getColorItems() {
  const colorItems: vscode.QuickPickItem[] = [];

  colorItems.push({
    label: 'Frequently used',
    kind: vscode.QuickPickItemKind.Separator,
  });

  const sortedFrequentlyUsedColors = frequentlyUsedColors.sort();
  for (const color of sortedFrequentlyUsedColors) {
    colorItems.push({ label: color });
  }

  colorItems.push({
    label: 'All colors',
    kind: vscode.QuickPickItemKind.Separator,
  });

  const sortedHtmlColors = allHtmlColors.sort();
  for (const color of sortedHtmlColors) {
    colorItems.push({ label: color });
  }

  return colorItems;
}

function insertColorToEditor(color: string) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const selection = editor.selection;
    const range = new vscode.Range(selection.start, selection.end);
    editor.edit(editBuilder => {
      editBuilder.replace(range, color);
    });
  }
}

async function updateFrequentlyUsedColors(
  color: string,
  context: vscode.ExtensionContext
) {
  const index = frequentlyUsedColors.indexOf(color);
  if (index > -1) {
    frequentlyUsedColors.splice(index, 1);
  }

  frequentlyUsedColors.unshift(color);

  if (frequentlyUsedColors.length > 5) {
    frequentlyUsedColors = frequentlyUsedColors.slice(0, 5);
  }

  await context.globalState.update(
    'frequentlyUsedColors',
    frequentlyUsedColors
  );
}
