import {
    getIndent,
    WHITE_SPACE,
    skipSpaces
} from './../utils';
export class HtmlAttribute {
    public endIndex: number;
    private key: string;
    private value: string;
    private quoteType: string;
    private currentIndex: number;
    public constructor(private toParse, startIndex: number) {
        this.currentIndex = startIndex;
        this.key = '';
        this.parse();
        // this.toParse = '';
        // delete this.toParse;
        // delete this.quoteType;
        // delete this.currentIndex;
    }

    public toString(): string {
        let toReturn = [this.key];
        if (typeof this.value === 'string') {
            toReturn.push('=', this.quoteType, this.value, this.quoteType);
        }
        return toReturn.join('');
    }

    private collectAttributeValue(): void {
        this.value = '';
        this.currentIndex = skipSpaces(this.toParse, this.currentIndex + 1);
        const currentChar = this.toParse[this.currentIndex];
        if (currentChar === '"' || currentChar === "'") {
            this.quoteType = currentChar;
            this.currentIndex++;
            this.collectUntil(currentChar);
            this.currentIndex++
        } else {
            this.quoteType = '"';
            this.collectUntil(' ', '>', '/');
        }
    }

    private collectUntil(...characters: string[]): void {
        var SCAPE_OPEN = false;
        let currentChar: string;
        for (; this.currentIndex < this.toParse.length; this.currentIndex++) {
            currentChar = this.toParse[this.currentIndex];
            if (currentChar === '\\') {
                SCAPE_OPEN = !SCAPE_OPEN;
            } else {
                if (characters.indexOf(currentChar) !== -1 && !SCAPE_OPEN) {
                    break;
                }
                SCAPE_OPEN = false;
            }
            this.value += currentChar;
        }

    }

    private parse(): void {
        for (; this.currentIndex < this.toParse.length; this.currentIndex++) {
            const currentChar = this.toParse[this.currentIndex];
            if (currentChar === '=') {
                this.collectAttributeValue();
                break;
            } else if (currentChar === '"' || currentChar === "'" || WHITE_SPACE.test(currentChar) || currentChar === '>' || currentChar === '/') {
                break;
            } else {
                this.key += currentChar;
            }
        }
        this.endIndex = this.currentIndex;
    }
}
