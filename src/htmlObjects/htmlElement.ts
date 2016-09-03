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

    public toArray(): string[] {
        var toReturn = [];
        if (this.tagName === 'i') {
            console.log();
        }
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
                        return trim(text);
                    }).join('');
                });
                toReturn[toReturn.length - 1] += '</' + this.tagName + '>';
            }
        }


        return toReturn;
    }



    private parse(): void {
        for (; this.currentIndex < this.toParse.length; this.currentIndex++) {
            const currentChar = this.toParse[this.currentIndex];
            switch (currentChar) {
                case '<':
                    if (this.closingIndex && !this.isSelfClosing) {
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
                                } else if (WHITE_SPACE.test(currentChar) || '\r' === currentChar) {
                                    this.currentIndex = skipSpaces(this.toParse, this.currentIndex + 1) - 1;
                                    break;
                                } else {
                                    throw new Error('Invalid tag name at ' + position(this.toParse, this.currentIndex));
                                }
                            }
                            if (this.tagName === 'img') {
                                console.log();
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
                            this.closingIndex = this.endIndex = tempIndex;
                            this.isSelfClosing = true;
                            return;
                        }
                        throw new Error('Unexpected char "/" at ' + position(this.toParse, this.currentIndex));
                    }
                default:
                    if (!this.closingIndex) {
                        if (currentChar === ' ') { break; }
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
        const result = this.startText.length > 1 || this.childNodes.length > 1 || this.childNodes.some((child) => child.isMultiline());
        return (this.isMultiline = function () {
            return result;
        })();
    }

    private peek(toSkip: number): string {
        return this.toParse[this.currentIndex + toSkip];
    }
}
