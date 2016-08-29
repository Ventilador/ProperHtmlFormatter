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

export const WHITE_SPACE = /( |\t)/;

export interface ISetting {
    indent: string;
    space: string;
    enforceTagClosing: any;
    enforceSelfClosing: any;
}