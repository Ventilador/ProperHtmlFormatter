export function makeComment(root: any) {
    return function () {
        const instance = Object.create(root);
        instance.parse = parse;
        instance.toString = toString;
        return instance;
    };
    function parse(this: HtmlFormater.IComment) {
        let cur = this.peek();
        do {
            this.content += cur;
        } while (cur = this.next(), this.more() && !this.isFollowedBy('-->'))
        return this;
    }
    function toString() {
        return '';
    }
}