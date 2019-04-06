export function makeAttribure(root: HtmlFormater.IRoot) {
    return function (parent: HtmlFormater.IElement) {
        const instance = Object.create(root);
        instance.parse = parse;
        instance.toString = toString;
        instance.parent = parent;
        instance.name = '';
        instance.value = null;
        instance.start = root.getIndex();
        return instance;
    };

    function parse(this: HtmlFormater.IAttribute) {
        this.collect('name', root.SPACE, root.EQUALS, root.TAG_CLOSE, root.SINGLE_QUOTE, root.DOUBLE_QUOTE);
        let cur = this.peek();
        while (this.more()) {
            if (cur === root.EQUALS) {
                if (this.value !== null) {
                    throw 'Invalid token at ' + this.getIndex();
                }
                cur = this.next();
                if (cur !== root.SINGLE_QUOTE && cur !== root.DOUBLE_QUOTE) {
                    this.warn('Missing quotes');
                    this.collect('value', root.SPACE, root.TAG_CLOSE);
                } else {
                    this.quoteType = cur;
                    this.next();
                    cur = collectValue(this);
                }
            } else if (cur === root.NEW_LINE) {
                this.addNewLine = true;
                cur = this.next();
            } else if (cur === root.SPACE || cur === root.RETURN) {
                cur = this.next();
            } else {
                return this;
            }
        }
    }

    function collectValue(that: HtmlFormater.IAttribute) {
        let escaping = false;
        let toSave = [];
        for (let cur = that.peek(); that.more(); cur = that.next()) {
            if (escaping) {
                escaping = false;
                toSave.push(cur);
            } else if (cur === root.ESCAPE) {
                escaping = true;
                toSave.push(cur);
            } else if (cur !== that.quoteType) {
                toSave.push(cur);
            } else {
                that.value = toSave.join('');
                return that.next();
            }
        }
    }

    function toString() {

    }
}
