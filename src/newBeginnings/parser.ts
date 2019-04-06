import { makeElement } from './element';
import { makeAttribure } from './attribute';
import { makeComment } from './comment';
import { makeText } from './text';
const SPACE = ' ';
const TAG_OPEN = '<'
const TAG_CLOSE = '>';
const NEW_LINE = '\n';
const EQUALS = '=';
const SINGLE_QUOTE = '\'';
const DOUBLE_QUOTE = '"';
const ESCAPE = '\\';
const RETURN = '\r';
ESCAPE
const root = {
    tagName: '#ROOT',
    attributes: null,
    parent: null,
    elements: null,
    textContent: null,
    config: null,
    start: 0,
    end: 0,
    index: 0,
    next: nextFn,
    goTo: goToFn,
    peek: peekFn,
    skip: skipFn,
    more: moreFn,
    collect: collectUntil,
    element: null,
    text: null,
    attribute: null,
    comment: null,
    parse: parseFn,
    toString: toStringFn,
    isFollowedBy: isFollowedByFn,
    SPACE: SPACE,
    TAG_OPEN: TAG_OPEN,
    TAG_CLOSE: TAG_CLOSE,
    NEW_LINE: NEW_LINE,
    EQUALS: EQUALS,
    SINGLE_QUOTE: SINGLE_QUOTE,
    DOUBLE_QUOTE: DOUBLE_QUOTE,
    ESCAPE: ESCAPE,
    RETURN: RETURN,
    warn: console.warn,
    getIndex: getIndex
} as HtmlFormater.IElement & HtmlFormater.IRoot;
const newElement = root.element = makeElement(root);
const newText = root.text = makeText(root);
const newComment = root.comment = makeComment(root);
root.attribute = makeAttribure(root);


export default function makeParser(config: HtmlFormater.ISetting) {
    return Object.assign(root, {
        textContent: config.content,
        config: config,
        end: config.content.length,
        index: 0,
        elements: []
    });
}
function parseFn(this: HtmlFormater.IElement): any {
    let cur = peekFn();
    while (moreFn()) {
        if (cur === TAG_OPEN) {
            if (isFollowedByFn('<!--')) {
                this.elements.push(newComment().parse());
            } else if (isFollowedByFn('</' + this.tagName + TAG_CLOSE)) {
                skipFn('</' + this.tagName + TAG_CLOSE);
                return this;
            } else {
                this.elements.push(newElement(this).parse());
            }

        } else {
            const text = newText(this).parse();
            if (text) {
                this.elements.push(text);
            }
        }
        cur = peekFn();
    }
    return this;
}

function getIndex() {
    return root.index;
}

function isFollowedByFn(value: string) {
    for (let jj = 0; jj < value.length; jj++) {
        if (!moreFn(jj) || peekFn(jj) !== value[jj]) {
            return false;
        }
    }
    return true;
}
function toStringFn(): string {
    return '';
}

function collectUntil(property: string) {
    let length = arguments.length;
    const keys = {};
    while (--length) {
        keys[arguments[length]] = true;
    }
    let result = '';
    for (let cur = peekFn(); moreFn(); cur = nextFn()) {
        if (keys[cur]) {
            this[property] = result;
            return cur;
        }
        result += cur;
    }
}

function moreFn(val?: number) {
    return (root.index + (val || 0)) < root.end;
}
function nextFn() {
    return root.textContent[++root.index];
}
function goToFn(index: number) {
    root.index = index;
}
function peekFn(amount?: number) {
    return root.textContent[root.index + (amount || 0)] || '';
}
function skipFn(...args: string[])
function skipFn() {
    if (!arguments.length) {
        throw 'No arguments in skip';
    }
    let length = arguments.length;
    const keys = {};
    while (length--) {
        keys[arguments[length]] = true;
    }
    for (let cur = peekFn(); moreFn(); cur = nextFn()) {
        if (!keys[cur]) {
            return cur;
        }
    }
    return '';
}