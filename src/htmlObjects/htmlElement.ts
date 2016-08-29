import {
    WHITE_SPACE,
    trim,
    getIndent,
    skipSpaces,
    ISetting
} from './../utils';
import {HtmlAttribute} from './htmlAttribute';

export interface IHtmlElement {
    toArray(): string[];
    endIndex: number;
    IsClosingTag: boolean;
}

export class HtmlElement implements IHtmlElement {
    public static EMPTY_ELEMENT(): IHtmlElement {
        return {
            toArray: () => { return ['', '']; },
            endIndex: 0,
            IsClosingTag: false
        };
    }
    public endIndex: number;
    public IsClosingTag: boolean;
    private attributes: HtmlAttribute[];
    private childNodes: IHtmlElement[];
    private tagName: string;
    private startText: string[];
    private endText: string;
    private currentIndex: number;
    private isCloseTagMissing: boolean;
    private isSelfClosing: boolean;
    private closingIndex: number;
    public
    constructor(private toParse: string, private startIndex: number, private settings: ISetting) {
        this.attributes = [];
        this.currentIndex = this.startIndex;
        this.tagName = this.endText = '';
        this.startText = [];
        this.childNodes = [];
        this.parse();
        // this.toParse = '';
        // this.settings = undefined;
        // delete this.toParse;
        // delete this.settings;
        // delete this.currentIndex;
        // delete this.isCloseTagMissing;
        // delete this.closingIndex;
        // delete this.isSelfClosing;
    }

    public toArray(): string[] {
        var toReturn = this.startText;
        if (this.tagName && !this.IsClosingTag) {
            if (this.tagName === '!comment') {
                return toReturn;
            } else {
                if (toReturn.length) {
                    toReturn[toReturn.length - 1] += '<' + this.tagName;
                } else {
                    toReturn.push('<' + this.tagName);
                }
                if (this.attributes.length) {
                    let newLine;
                    for (var index = 0; index < this.attributes.length; index++) {
                        const attributeText = this.attributes[index].toString();
                        if (attributeText.startsWith('\r\n')) {
                            newLine = true;
                            toReturn.push(getIndent(1, this.settings).toString() + (trim(attributeText)));
                        } else {
                            toReturn[toReturn.length - 1] += (newLine ? '' : ' ') + attributeText;
                            newLine = false;
                        }
                    }
                }
                if (this.isCloseTagMissing) {
                    if (this.settings.enforceSelfClosing[this.tagName.toLowerCase()]) {
                        toReturn[toReturn.length - 1] += '/>';
                    } else if (this.settings.enforceTagClosing[this.tagName.toLowerCase()]) {
                        toReturn[toReturn.length - 1] += '></' + this.tagName + '>';
                    } else {
                        throw new SyntaxError('Cannot close tag at ' + this.closingIndex);
                    }
                } else if (this.childNodes.length) {
                    const oldLength = toReturn.length;
                    toReturn[toReturn.length - 1] += '>';
                    for (var ii = 0; ii < this.childNodes.length; ii++) {
                        let childTextArray = this.childNodes[ii].toArray();
                        toReturn[toReturn.length - 1] += trim(childTextArray.shift());
                        if (childTextArray.length) {
                            while (childTextArray.length) {
                                let value = childTextArray.shift();
                                if (!this.childNodes[ii].IsClosingTag || (value = trim(value))) {
                                    toReturn.push(getIndent(1, this.settings).toString() + value);
                                }
                            }
                        }
                    }
                    if (this.settings.enforceTagClosing[this.tagName] || !this.isSelfClosing) {
                        if (oldLength !== toReturn.length) {
                            toReturn.push('</' + this.tagName + '>');
                        } else {
                            toReturn[toReturn.length - 1] += '</' + this.tagName + '>';
                        }
                    } else {
                        let tempContent = toReturn[toReturn.length - 1];
                        let tempIndex = tempContent.length;
                        while (tempIndex--) {
                            if (tempContent[tempIndex] === '>') {
                                tempIndex--;
                                const lastPart = tempContent.substr(tempIndex, tempContent.length);
                                tempContent = tempContent.substr(tempIndex) + '/>' + lastPart;
                            }
                        }
                    }
                } else {
                    if (this.settings.enforceSelfClosing[this.tagName.toLowerCase()]) {
                        toReturn[toReturn.length - 1] += '/>';
                    } else if (this.settings.enforceTagClosing[this.tagName.toLowerCase()]) {
                        toReturn[toReturn.length - 1] += '></' + this.tagName + '>';
                    } else if (this.isSelfClosing) {
                        toReturn[toReturn.length - 1] += '/>';
                    } else {
                        toReturn[toReturn.length - 1] += '></' + this.tagName + '>';
                    }
                }
            }
        }
        return toReturn;
    }

    private parse(): void {
        this.collectUntilTag();
        this.collectTagName();
        if (this.tagName === '!comment') {
            this.parseAsComment();
            return;
        }
        if (this.tagName === 'img') {
            console.log(this.tagName);
        }
        for (; this.currentIndex < this.toParse.length; this.currentIndex++) {
            this.currentIndex = skipSpaces(this.toParse, this.currentIndex);
            const currentChar = this.toParse[this.currentIndex];
            switch (currentChar) {
                case '/':
                    if (this.tagName === '') {
                        while (this.currentIndex--) {
                            if (this.toParse[this.currentIndex] === '<') {
                                break;
                            }
                        }
                        this.endIndex = this.currentIndex;
                        return;
                    }
                    this.currentIndex = skipSpaces(this.toParse, this.currentIndex + 1);
                    if (this.toParse[this.currentIndex] === '>') {
                        this.endIndex = this.currentIndex + 1;
                        this.isCloseTagMissing = false;
                        this.isSelfClosing = true;
                        return;
                    }
                    break;
                case '>':
                    if (!this.currentIndex) {
                        throw 'Fuck off';
                    }
                    this.closingIndex = this.currentIndex;
                    if (this.IsClosingTag) {
                        this.endIndex = this.currentIndex + 1;
                        return;
                    }
                    break;
                case '<':
                    this.currentIndex = skipSpaces(this.toParse, this.currentIndex + 1);
                    if (this.toParse[this.currentIndex] === '/') {
                        this.currentIndex++
                        let tempIndex = this.currentIndex;
                        for (var index = 0; index < this.tagName.length; index++) {
                            if (this.toParse[tempIndex++] !== this.tagName[index]) {
                                this.isCloseTagMissing = true;
                            }
                        }
                        if (this.isCloseTagMissing) {
                            this.endIndex = this.closingIndex + 1;
                            this.childNodes.length = 0;
                            // this.startText.length = 0;
                            return;
                        } else {
                            this.currentIndex = tempIndex;
                            this.currentIndex = skipSpaces(this.toParse, this.currentIndex);
                            if (this.toParse[this.currentIndex] === '>') {
                                this.endIndex = this.currentIndex + 1;
                                this.isSelfClosing = false;
                                return;
                            }
                            throw 'Closing tag mismatch';
                        }
                    } else {
                        while (this.currentIndex--) {
                            if (this.toParse[this.currentIndex] === '<') {
                                break;
                            }
                        }
                        this.childNodes.push(new HtmlElement(this.toParse, this.currentIndex, this.settings));
                        this.currentIndex = this.childNodes[this.childNodes.length - 1].endIndex - 1;
                        break;
                    }
                default:
                    if (this.closingIndex) {
                        const newChild = new HtmlElement(this.toParse, this.currentIndex, this.settings);
                        if (newChild.IsClosingTag) {
                            if (newChild.tagName !== this.tagName) {
                                this.endIndex = newChild.startIndex;
                            } else {
                                this.childNodes.push(newChild);
                                this.endIndex = newChild.endIndex;
                            }
                            return;
                        }
                        this.childNodes.push(newChild);
                        this.currentIndex = this.childNodes[this.childNodes.length - 1].endIndex - 1;
                    } else {
                        this.attributes.push(new HtmlAttribute(this.toParse, this.currentIndex));
                        this.currentIndex = Math.max(this.attributes[this.attributes.length - 1].endIndex - 1, 0);
                    }
                    break;
            }
        }
    }

    private collectTagName(): void {
        const skip = /(\r|\n)/;
        let tagPartialName = '';
        this.currentIndex = skipSpaces(this.toParse, this.currentIndex);
        for (; this.currentIndex < this.toParse.length; this.currentIndex++) {
            const currentChar = this.toParse[this.currentIndex];
            if (
                WHITE_SPACE.test(currentChar) ||
                currentChar === '>'
            ) {
                break;
            } else if (currentChar === '/') {
                let tempTagName = '';
                while (this.currentIndex++ < this.toParse.length) {
                    if (this.toParse[this.currentIndex] === '>') {
                        break;
                    }
                    tempTagName += this.toParse[this.currentIndex];
                }
                this.IsClosingTag = true;
                tagPartialName = trim(tempTagName);
                break;
            } else if (currentChar === '!' && this.plusOne() === '-' && this.plusTwo() === '-') {
                this.tagName = '!comment';
                this.currentIndex += 3;
                return;
            } else if (!skip.test(currentChar)) {
                tagPartialName += currentChar;
            }
        }
        this.tagName = tagPartialName;
        // this.currentIndex++;
    }

    private collectUntilTag(): void {
        let line = '';
        for (; this.currentIndex < this.toParse.length; this.currentIndex++) {
            const currentChar = this.toParse[this.currentIndex];
            if (currentChar === '<') {
                break;
            } else if (currentChar === '\r' && this.plusOne() === '\n') {
                this.startText.push(trim(line));
                this.currentIndex++;
                line = '';
            } else {
                line += currentChar;
            }
        }
        if (line) {
            this.startText.push(trim(line));
        }
        this.currentIndex++;
    }

    private plusOne(): string {
        return this.toParse[this.currentIndex + 1];
    }

    private plusTwo(): string {
        return this.toParse[this.currentIndex + 2];
    }

    private parseAsComment(): void {
        this.startText[this.startText.length - 1] += '<!--';
        for (; this.currentIndex < this.toParse.length; this.currentIndex++) {
            const currentChar = this.toParse[this.currentIndex];
            if (currentChar === '-' && this.plusOne() === '-' && this.plusTwo() === '>') {
                this.endIndex = this.currentIndex + 3;
                break;
            } else if (currentChar === '\r' && this.plusOne() === '\n') {
                this.startText.push('');
            } else if (currentChar === '\n') {
                this.startText.push('');
            } else {
                this.startText[this.startText.length - 1] += currentChar;
            }
        }
        this.startText[this.startText.length - 1] += '-->';
    }

    private myStartText(): string {
        return this.startText.join('\r\n');
    }
}

