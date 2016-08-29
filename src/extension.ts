import vscode = require('vscode');
import {HtmlElement} from './htmlObjects/htmlElement';
import {ISetting} from './utils';
export function activate(context) {
    let docType: Array<string> = ["html"];

    docType.forEach(element => {
        registerDocType(element);
    });

    function registerDocType(type) {
        context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(type, {
            provideDocumentFormattingEdits: (document, options, token) => {
                return format(document, null, options);
            }
        }));
        context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider(type, {
            provideDocumentRangeFormattingEdits: (document, range, options, token) => {
                let start = new vscode.Position(0, 0);
                let end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
                return format(document, new vscode.Range(start, end), options);
            }
        }));
    }
}

export function format(document: vscode.TextDocument, range: vscode.Range, options: vscode.FormattingOptions) {
    if (range === null) {
        let start = new vscode.Position(0, 0);
        let end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
        range = new vscode.Range(start, end);
    }
    let settings = vscode.workspace.getConfiguration("htmlFormatter");
    let indentSize = settings.get('indentSize') as number;
    const indentChar = settings.get('indentChar') as string;
    const forceSelfClose = settings.get('forceSelfClose') as string[];
    const forceClose = settings.get('forceClose') as string[];
    let config: ISetting = {} as any;
    let indent = '';
    while (indentSize) {
        indent += indentChar;
        indentSize--;
    }
    config.indent = indent;
    config.enforceSelfClosing = Object.create(null);
    forceSelfClose.forEach((item: string) => {
        config.enforceSelfClosing[item] = true;
    });

    config.enforceTagClosing = Object.create(null);
    forceClose.forEach((item: string) => {
        config.enforceTagClosing[item] = true;
    });
    let content = document.getText(range);
    let index = 0;
    let elements: HtmlElement[] = [];
    let result: vscode.TextEdit[] = [];
    try {
        while (index < content.length) {
            elements.push(new HtmlElement(content, index, config));
            index = elements[elements.length - 1].endIndex;
        }
        let newContent = [];
        while (elements.length) {
            Array.prototype.push.apply(newContent, elements.shift().toArray());
        }
        result.push(new vscode.TextEdit(range, newContent.join('\r\n')));

    } catch (err) {
        result.push(new vscode.TextEdit(range, content));
    }
    return result;
}

// this method is called when your extension is deactivated
export function deactivate() {

}
