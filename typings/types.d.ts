declare namespace HtmlFormater {
    export interface IRoot {
        getIndex(): number;
        next(): string;
        skip(): void;
        more(): boolean;
        peek(amount?: number): string;
        skip(...characters: string[]): string;
        goTo(index: number): void;
        parse(): any;
        element(): IElement;
        attribute(): IAttribute;
        toString(): string;
        collect(toProperty: string, ...toCheck: string[]): string;
        warn(message?: string, ...args: any[]): void;
        isFollowedBy(value: string): boolean;
        config: ISetting;
        SPACE: string;
        TAG_OPEN: string;
        TAG_CLOSE: string;
        NEW_LINE: string;
        EQUALS: string;
        SINGLE_QUOTE: string;
        DOUBLE_QUOTE: string;
        ESCAPE: string;
        RETURN: string;
    }
    export interface IElement extends IRoot {
        tagName: string;
        start: number;
        end: number;
        attributes: IAttribute[];
        elements: IElement[];
        addNewLine?: boolean;
        parent: IElement;
    }
    export interface IAttribute extends IRoot {
        name: string;
        value: string;
        start: number;
        end: number;
        equals: number
        addNewLine: boolean;
        quoteType: string;
    }

    export interface IText extends IRoot {
        content: string;
    }

    export interface ISetting {
        indent: string;
        space: string;
        selfClose: IDictionary<boolean>;
        content: string;
    }
    export interface IComment extends IText { }

    export interface IDictionary<T> {
        [key: string]: T;
    }
}