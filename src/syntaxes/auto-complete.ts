import {
  TextDocument,
  Position,
  CancellationToken,
  CompletionContext,
  ExtensionContext,
  CompletionItem,
  CompletionItemKind,
  languages,
} from "vscode";
import pathImport from "./pathImport";

type RegExpObj = {
  reg: RegExp;
  text: Array<string>;
};

const provideCompletionItems = (
  document: TextDocument,
  position: Position,
  _token: CancellationToken,
  _context: CompletionContext
) => {
  const line = document.lineAt(position);
  const lineText = line.text.substring(0, position.character);
  let lastExpression: any = lineText.split(/\s+/);
  lastExpression = lastExpression[lastExpression.length - 1];
  const regExpList: Array<RegExpObj> = [
    { reg: /e/, text: ["element://"] },
    { reg: /i/, text: ["image://"] },
    { reg: /o/, text: ["ocr://"] },
    { reg: /^\s*@$/, text: ["noReset", "showProcess"] },
    {
      reg: /\${[sS]/,
      text: [
        "SYSTEM_TIMESTAMP",
        "SYSTEM_YEAR",
        "SYSTEM_MONTH",
        "SYSTEM_DAY",
        "SYSTEM_HOUR",
        "SYSTEM_MINUTE",
        "SYSTEM_SECOND",
      ],
    },
  ];
  const autoCompleteList: Array<string> = [];
  regExpList.map((item) => {
    if (item.reg.test(lastExpression)) {
      autoCompleteList.push(...item.text);
    }
  });
  return autoCompleteList.map((item) => {
    return new CompletionItem(item, CompletionItemKind.Field);
  });
};

const resolveCompletionItem = (_item: any, _token: CancellationToken) => {
  return null;
};

export default function(context: ExtensionContext) {
  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      { scheme: "file", language: "gherkin" },
      { provideCompletionItems: pathImport },
      '/',
    ),
    languages.registerCompletionItemProvider(
      { scheme: "file", language: "gherkin" },
      {
        provideCompletionItems,
        resolveCompletionItem,
      }
    )
  );
}
