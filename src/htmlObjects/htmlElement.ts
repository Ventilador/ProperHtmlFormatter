import {
    WHITE_SPACE,
    trim,
    getIndent,
    skipSpaces,
    ISetting,
    TAG_VALID,
    position,
    IHtmlElement
} from './../utils';
import {HtmlAttribute} from './htmlAttribute';
import {HtmlText} from './htmlText';

export class HtmlElement implements IHtmlElement {
    public endIndex: number;
    public isClosingTag: boolean;
    public isComment: boolean;
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
    }

    public toArray2(): string[] {
        var toReturn = [];
        let isMulti: boolean;
        if (isMulti = this.isMultiline()) {
            toReturn.push('');
        }
        toReturn.push(['<', this.tagName].join(''));
        this.childNodes.forEach((child: IHtmlElement) => {
            const array = child.toArray();
        });
        return toReturn;
    }

    public toArray(): string[] {
        var toReturn = this.startText;
        if (this.tagName && !this.isClosingTag) {
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
        for (; this.currentIndex < this.toParse.length; this.currentIndex++) {
            const currentChar = this.toParse[this.currentIndex];
            switch (currentChar) {
                case '<':
                    if (this.closingIndex) {
                        let tempIndex = skipSpaces(this.toParse, this.currentIndex + 1);
                        if (this.toParse[tempIndex] === '/') {
                            tempIndex++;
                            let tempTagName = '';
                            for (; tempIndex < this.toParse.length; tempIndex++) {
                                if (this.toParse[tempIndex] === '>') {
                                    break;
                                } if (TAG_VALID.test(this.toParse[tempIndex])) {
                                    tempTagName += this.toParse[tempIndex];
                                } else if (WHITE_SPACE.test(this.toParse[tempIndex])) {
                                    tempIndex = skipSpaces(this.toParse, this.currentIndex + 1);
                                    if (this.toParse[tempIndex] === '>') {
                                        break;
                                    }
                                    throw new Error('Wrong closing tag at ' + position(this.toParse, this.currentIndex));
                                }
                            }
                            if (tempTagName === this.tagName) {
                                this.endIndex = tempIndex;
                                return;
                            }
                            this.isCloseTagMissing = !this.settings.enforceSelfClosing[this.tagName];
                            this.endIndex = this.startIndex;
                            return;
                        } else {
                            this.childNodes.push(new HtmlElement(this.toParse, this.currentIndex, this.settings));
                            this.currentIndex = this.childNodes[this.childNodes.length - 1].endIndex;
                        }
                    } else {
                        if (this.tagName) {
                            throw new Error('Unexpected char "<" at ' + position(this.toParse, this.currentIndex));
                        } else {
                            this.tagName = '';
                            this.currentIndex = skipSpaces(this.toParse, this.currentIndex + 1);
                            for (; this.currentIndex < this.toParse.length; this.currentIndex++) {
                                const currentChar = this.toParse[this.currentIndex];
                                if (TAG_VALID.test(currentChar)) {
                                    this.tagName += currentChar;
                                } else if (WHITE_SPACE.test(currentChar)) {
                                    this.currentIndex = skipSpaces(this.toParse, this.currentIndex + 1) - 1;
                                    break;
                                } else {
                                    throw new Error('Invalid tag name at ' + position(this.toParse, this.currentIndex));
                                }
                            }
                        }
                    }
                    break;
                case '>':
                    if (!this.closingIndex) {
                        this.closingIndex = this.currentIndex;
                        break;
                    }
                case '/':
                    if (!this.closingIndex) {
                        const tempIndex = skipSpaces(this.toParse, this.currentIndex + 1);
                        if (this.toParse[tempIndex] === '>') {
                            this.closingIndex = tempIndex;
                            this.isSelfClosing = true;
                            this.currentIndex = tempIndex;
                            break;
                        }
                        throw new Error('Unexpected char "/" at ' + position(this.toParse, this.currentIndex));
                    }
                default:
                    if (!this.closingIndex) {
                        this.attributes.push(new HtmlAttribute(this.toParse, this.currentIndex));
                        this.currentIndex = this.attributes[this.attributes.length - 1].endIndex;
                    } else {
                        this.childNodes.push(new HtmlText(this.toParse, this.currentIndex, this.settings));
                        this.currentIndex = this.childNodes[this.childNodes.length - 1].endIndex - 1;
                    }
                    break;
            }
        }
    }

    public isMultiline(): boolean {
        return this.startText.length > 1 || this.childNodes.length > 1 || this.childNodes.some((child) => child.isMultiline());
    }

    private peek(toSkip: number): string {
        return this.toParse[this.currentIndex + toSkip];
    }
}
