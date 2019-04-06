export function makeText(root: HtmlFormater.IRoot) {
    return function (parent: HtmlFormater.IElement) {
        const instance = Object.create(root);
        instance.parse = parse;
        instance.toString = toString;
        instance.start = root.getIndex();
        instance.content = '';
        return instance;
    };
    function parse(this: HtmlFormater.IText) {
        let cur = this.peek();
        let hasSomething = false;
        do {
            if (!hasSomething && (cur !== root.SPACE && cur !== root.NEW_LINE && cur !== root.RETURN)) {
                hasSomething = true;
            }
            this.content += cur;
        } while (cur = this.next(), cur !== root.TAG_OPEN && this.more())
        if (hasSomething) {
            return this;
        }
    }
    function toString() {
        return '';
    }
}