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

// export class constants {
//     private static space: string = ' ';
//     private static newLine: string;
//     private static indent: string;
//     private static enforceSelfClosing: any;
//     private static enforceTagClosing: any;
//     public static setIndent(newIndent: string): void {
//         constants.indent = newIndent;
//     }
//     public static setNewLine(newNewLine: string): void {
//         constants.newLine = newNewLine;
//     }
//     public static setEnforceSelfClosing(newEnforceSelfClosing: any): void {
//         constants.enforceSelfClosing = newEnforceSelfClosing;
//     }
//     public static setEnforceTagClosing(newEnforceTagClosing: any): void {
//         constants.enforceTagClosing = newEnforceTagClosing;
//     }
//     public static getSpace(): string {
//         return constants.space;
//     }
//     public static getNewLine(): string {
//         return constants.newLine;
//     }
//     public static getIndent(): string {
//         return constants.indent;
//     }
//     public static getEnforceSelfClosing(): any {
//         return constants.enforceSelfClosing;
//     }
//     public static getEnforceTagClosing(): any {
//         return constants.enforceTagClosing;
//     }
// }


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