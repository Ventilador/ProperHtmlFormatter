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
    private startsAt: number;
    public
    constructor(private startIndex: number, private settings: ISetting) {
        this.attributes = [];
        this.currentIndex = this.startIndex;
        this.tagName = this.endText = '';
        this.startText = [];
        this.childNodes = [];
        const tempValue = this.parse() as any;
        if (tempValue) {
            return tempValue;
        }
    }

    public toArray(): string[] {
        var toReturn = [];
        toReturn.push(['<', this.tagName].join(''));
        let lastWasNewLiner = false;
        this.attributes.forEach((attr: HtmlAttribute, currentIndex: number) => {
            const attrText = attr.toString();
            if (trim(attrText)) {
                toReturn[toReturn.length - 1] += ' ' + attrText;
                lastWasNewLiner = false;
            } else if (!lastWasNewLiner && currentIndex !== this.attributes.length - 1) {
                toReturn.push(getIndent(1, this.settings).toString());
                lastWasNewLiner = true;
            }
        });
        while (!trim(toReturn[toReturn.length - 1])) {
            toReturn.length--;
        }
        if (this.settings.enforceSelfClosing[this.tagName.toLowerCase()] || this.isSelfClosing) {
            toReturn[toReturn.length - 1] += ' />';
        } else {
            toReturn[toReturn.length - 1] += '>';
            if (this.isMultiline()) {
                this.childNodes.forEach((child: IHtmlElement) => {
                    Array.prototype.push.apply(toReturn, child.toArray().map((text: string) => {
                        return getIndent(1, this.settings) + text;
                    }));
                });
                toReturn.push('</' + this.tagName + '>');
            } else {
                this.childNodes.forEach((child: IHtmlElement) => {
                    toReturn[toReturn.length - 1] += child.toArray().map((text: string) => {
                        return text;
                    }).join('');
                });
                toReturn[toReturn.length - 1] += '</' + this.tagName + '>';
            }
        }


        return toReturn;
    }



    private parse(): void {
        for (; this.currentIndex < this.settings.content.length; this.currentIndex++) {
            const currentChar = this.settings.content[this.currentIndex];
            switch (currentChar) {
                case '<':
                    if (this.closingIndex && !this.isSelfClosing) {
                        let tempIndex = skipSpaces(this.settings.content, this.currentIndex + 1);
                        if (this.settings.content[tempIndex] === '/') {
                            tempIndex++;
                            let tempTagName = '';
                            for (; tempIndex < this.settings.content.length; tempIndex++) {
                                if (this.settings.content[tempIndex] === '>') {
                                    break;
                                } if (TAG_VALID.test(this.settings.content[tempIndex])) {
                                    tempTagName += this.settings.content[tempIndex];
                                } else if (WHITE_SPACE.test(this.settings.content[tempIndex])) {
                                    tempIndex = skipSpaces(this.settings.content, this.currentIndex + 1);
                                    if (this.settings.content[tempIndex] === '>') {
                                        break;
                                    }
                                    throw new Error('Wrong closing tag at ' + position(this.settings.content, this.currentIndex));
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
                            this.childNodes.push(new HtmlElement(this.currentIndex, this.settings));
                            this.currentIndex = this.childNodes[this.childNodes.length - 1].endIndex;
                        }
                    } else {
                        if (this.tagName) {
                            throw new Error('Unexpected char "<" at ' + position(this.settings.content, this.currentIndex));
                        } else {
                            this.tagName = '';
                            const tempStart = this.currentIndex = skipSpaces(this.settings.content, this.currentIndex + 1);
                            for (; this.currentIndex < this.settings.content.length; this.currentIndex++) {
                                const currentChar = this.settings.content[this.currentIndex];
                                if (TAG_VALID.test(currentChar)) {
                                    this.tagName += currentChar;
                                } else if (WHITE_SPACE.test(currentChar) || '\r' === currentChar) {
                                    this.currentIndex = skipSpaces(this.settings.content, this.currentIndex + 1) - 1;
                                    this.startsAt = tempStart;
                                    break;
                                } else {
                                    throw new Error('Invalid tag name at ' + position(this.settings.content, this.currentIndex));
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
                        const tempIndex = skipSpaces(this.settings.content, this.currentIndex + 1);
                        if (this.settings.content[tempIndex] === '>') {
                            this.closingIndex = this.endIndex = tempIndex;
                            this.isSelfClosing = true;
                            return;
                        }
                        throw new Error('Unexpected char "/" at ' + position(this.settings.content, this.currentIndex));
                    }
                default:
                    if (!this.startsAt) {
                        const tempTextNode = new HtmlText(this.currentIndex, this.settings);
                        tempTextNode.endIndex--;
                        return tempTextNode as any;
                    } else if (!this.closingIndex) {
                        if (WHITE_SPACE.test(currentChar)) { break; }
                        this.attributes.push(new HtmlAttribute(this.settings, this.currentIndex));
                        this.currentIndex = this.attributes[this.attributes.length - 1].endIndex;
                    } else {
                        this.childNodes.push(new HtmlText(this.currentIndex, this.settings));
                        this.currentIndex = this.childNodes[this.childNodes.length - 1].endIndex - 1;
                    }
                    break;
            }
        }
    }

    public isMultiline(): boolean {
        const result = this.startText.length > 1 || this.childNodes.length > 1 || this.childNodes.some((child) => child.isMultiline());
        return (this.isMultiline = function () {
            return result;
        })();
    }

    private peek(toSkip: number): string {
        return this.settings.content[this.currentIndex + toSkip];
    }
}
