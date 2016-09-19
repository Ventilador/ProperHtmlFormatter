import {
    getIndent,
    WHITE_SPACE,
    skipSpaces,
    ISetting, 
    position
} from './../utils';
export class HtmlAttribute {
    public endIndex: number;
    private key: string;
    private value: string;
    private quoteType: string;
    private currentIndex: number;
    private invalid: boolean;

    public constructor(private settings: ISetting, startIndex: number) {

        this.currentIndex = startIndex;
        this.key = '';
        this.parse();
    }

    public isMultiline(): boolean {
        return this.key === '\r\n';
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
        this.currentIndex = skipSpaces(this.settings.content, this.currentIndex + 1);
        const currentChar = this.settings.content[this.currentIndex];
        if (currentChar === '"' || currentChar === "'") {
            this.quoteType = currentChar;
            this.currentIndex++;
            this.collectUntil(currentChar);
        } else {
            this.quoteType = '"';
            this.collectUntil(' ', '>', '/');
        }
    }

    private collectUntil(...characters: string[]): void {
        var SCAPE_OPEN = false;
        let currentChar: string;
        for (; this.currentIndex < this.settings.content.length; this.currentIndex++) {
            currentChar = this.settings.content[this.currentIndex];
            if (currentChar === '\\') {
                SCAPE_OPEN = !SCAPE_OPEN;
            } else {
                if (~characters.indexOf(currentChar) && !SCAPE_OPEN) {
                    if (characters.length !== 1) {
                        this.currentIndex--;
                    }
                    break;
                }
                SCAPE_OPEN = false;
            }
            this.value += currentChar;
        }

    }

    private parse(): void {
        for (; this.currentIndex < this.settings.content.length; this.currentIndex++) {
            const currentChar = this.settings.content[this.currentIndex];
            if (currentChar === '=') {
                this.collectAttributeValue();
                break;
            } else if (WHITE_SPACE.test(currentChar)) {
                break;
            } else if (currentChar === '>' || currentChar === '/') {
                this.currentIndex--;
                break;
            } else if (currentChar === '"' || currentChar === "'") {
                throw new Error('Missing equals sign at ' + position(this.settings.content, this.currentIndex));
            } else {
                this.key += currentChar;
            }
        }
        this.endIndex = this.currentIndex;
    }
}
