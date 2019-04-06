export function makeElement(root: HtmlFormater.IRoot) {

    return function (parent: HtmlFormater.IElement) {
        const instance = Object.create(root);
        instance.parse = parse;
        instance.toString = toString;
        instance.parent = parent;
        instance.attributes = [];
        instance.elements = [];
        instance.tagName = '';
        instance.start = root.getIndex();
        return instance;
    }
    function parse(this: HtmlFormater.IElement) {
        this.next();
        let cur = this.collect('tagName', root.SPACE, root.NEW_LINE, root.TAG_CLOSE);
        while (this.more()) {
            if (cur !== root.SPACE && cur !== root.RETURN) {
                if (cur === root.NEW_LINE) {
                    this.addNewLine = true;
                } else if (cur === root.TAG_CLOSE) {
                    this.next();
                    if (this.config.selfClose[this.tagName]) {
                        return this;
                    }
                    return root.parse.call(this);
                } else {
                    this.attributes.push(this.attribute().parse());
                    cur = this.peek();
                }
            } else {
                cur = this.next();
            }
        }
    }
    function toString(this: HtmlFormater.IElement) {

    }

}


