import {trim, IHtmlElement} from './../utils';
import {HtmlElement} from './htmlElement';
export class HtmlText implements IHtmlElement {
    public endIndex: number;


    private isComment: boolean;
    private isCommentClosed: boolean;
    private currentIndex: number;
    private text: string[];
    public constructor(private toParse: string, private startIndex: number, settings: any) {
        this.currentIndex = this.startIndex;
        this.text = [''];
        this.parse();
        this.endIndex = this.currentIndex;
    }

    public toArray(): string[] {
        if (this.isComment) {
            if (!trim(this.text[0])) {
                this.text.shift();
            }
            if (!trim(this.text[this.text.length - 1])) {
                this.text.length--;
            }
            return this.text.map((line: string) => trim(line));
        } else if (this.text.length === 1) {
            return [trim(this.text[0])];
        } else {
            const toReturn = [];
            this.text.forEach((line: string, index: number) => {
                line = trim(line);
                if (line) {
                    toReturn.push(line);
                }
            });
            return toReturn;
        }
    }

    public isMultiline(): boolean {
        if (this.isComment) {
            return !!this.text.length;
        }
        let lines = 0;
        this.text.forEach((line: string) => {
            if (trim(line)) {
                lines++;
            }
        });
        return lines > 1;
    }

    private parse(): void {
        for (; this.currentIndex < this.toParse.length; this.currentIndex++) {
            const currentChar = this.toParse[this.currentIndex];
            if (currentChar === '\r' && this.peek(1) === '\n') {
                this.text.push('');
                this.currentIndex++;
            } else if (currentChar === '<') {
                if (this.peek(1) === '!' && this.peek(2) === '-' && this.peek(3) === '-') {
                    this.currentIndex += 3;
                    this.isComment = true;
                    this.isCommentClosed = false;
                    this.append('<!--');
                } else {
                    break;
                }
            } else if (currentChar === '-' && this.peek(1) === '-' && this.peek(2) === '>') {
                this.append('-->');
                this.currentIndex += 2;
                this.isCommentClosed = true;
            } else {
                this.append(currentChar);
            }
        }
    }

    private append(char: string): void {
        this.text[this.text.length - 1] += char;
    }

    private peek(toSkip: number): string {
        return this.toParse[this.currentIndex + toSkip];
    }
}