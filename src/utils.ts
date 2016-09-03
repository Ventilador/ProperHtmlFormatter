export function getIndent(indentation, settings) {
    if (indentation > 0) {
        var toReturn = [];
        while (indentation--) {
            toReturn.push(settings.indent);
        }
        return toReturn.join('');
    }
    return '';
}

export function trim(line) {
    if (typeof line === 'string') {
        return line.trim();
    }
    return '';
}


export function skipSpaces(content: string, index: number): number {
    while (index < content.length) {
        if (WHITE_SPACE.test(content[index])) {
            index++;
        } else {
            break;
        }
    }
    return index;
};

export function position(text: string, index: number): string {
    const toReturn = { line: 0, col: 0 };
    for (var ii = 0; ii <= index; ii++) {
        if (text[ii] === '\r' && text[ii + 1] === '\n') {
            toReturn.line++;
            toReturn.col = 0;
            ii++;
        } else if (text[ii] === '\n') {
            toReturn.line++;
            toReturn.col = 0;
        } else {
            toReturn.col++;
        }
    }
    return ['(', toReturn.line, ',', toReturn.col, ')'].join('');
}

export const TAG_VALID = /[\-A-Za-z0-9:]/;

export const WHITE_SPACE = /( |\t)/;

export interface ISetting {
    indent: string;
    space: string;
    enforceTagClosing: any;
    enforceSelfClosing: any;
}

export interface IHtmlElement {
    toArray(): string[];
    endIndex: number;
    isMultiline(): boolean;
}