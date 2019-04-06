import vscode = require('vscode');
import parser from './newBeginnings/parser';
export function activate(context) {
    let docType: Array<string> = ["html"];

    docType.forEach(element => {
        registerDocType(element);
    });

    function registerDocType(type) {
        context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(type, {
            provideDocumentFormattingEdits: (document, options, token) => {
                return format(document, null, options, token);
            }
        }));

    }
}

export function format(document: vscode.TextDocument, range: vscode.Range, options: vscode.FormattingOptions, token: any): any {
    const isRange = range;
    if (range === null) {
        let start = new vscode.Position(0, 0);
        let end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
        range = new vscode.Range(start, end);
    }
    let settings = vscode.workspace.getConfiguration("htmlFormatter");
    let indentSize = options.tabSize;
    const indentChar = options.insertSpaces ? ' ' : '\t';
    const selfClose = settings.get('selfClose') as string[];
    let config: HtmlFormater.ISetting = {} as any;
    let indent = '';
    while (indentSize) {
        indent += indentChar;
        indentSize--;
    }
    config.indent = indent;
    config.selfClose = Object.create(null);
    selfClose.forEach((item: string) => {
        config.selfClose[item] = true;
    });

    let content = document.getText(range);
    let result: vscode.TextEdit[] = [];
    config.content = content;
    try {
        const parserObj = parser(config);
        parserObj.parse();
        result.push(new vscode.TextEdit(range, content));

    } catch (err) {
        const fOptions: vscode.TextEditorOptions = {};
        fOptions.insertSpaces = options.insertSpaces;
        fOptions.tabSize = options.tabSize;
        fOptions.cursorStyle = vscode.TextEditorCursorStyle.Line;
        vscode.window.showErrorMessage(err.toString() + ' falling back to normal formatting');
        return vscode.commands.executeCommand('vscode.executeFormatRangeProvider', document.uri, range, fOptions, token);
        // result.push(new vscode.TextEdit(range, content));
    }
    return result;
}

// this method is called when your extension is deactivated
export function deactivate() {

}
