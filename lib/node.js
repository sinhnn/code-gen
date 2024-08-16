
const { NotImplemented, NotSupported, InterfaceNotImplemented } = require('./error');


/**
 * @brief class contains `parent` member
 */
class Node {
    constructor(parent) {
        this._parent = parent;
        if (this._parent !== null) {
            this._parent.children.push(this);
        }
    }

    get parent() {
        return this._parent;
    }

    set parent(value) {
        if (this._parent !== null) {
            throw new Error("Parent property already setted");
        }
        this._parent = value;
    }

    get level() {
        return this._parent === null ? 0 : this.parent.level + 1;
    }

    toString(space="    ") {
        throw new InterfaceNotImplemented();
    }
}


/**
 * @brief class contain `parent` & `children`
 */
class NodeWithChildren extends Node {
    constructor(children = [], parent = null) {
        super(parent);
        this._children = [];
        for (const c of children) {
            this.addChild(c);
        }
    }

    /**
     * @returns {[Node]} nodes
     */
    get children() {
        return this._children;
    }

    /**
     *
     * @param {Node} child
     */
    addChild(child) {
        if (typeof(child) === 'string') {
            child = new LineNode(child, this);
        } else {
            child.parent = this;
            this._children.push(child);
        }
    }
}

/**
 * @brief root document
 */
class Document extends NodeWithChildren {
    constructor(children=[]) {
        super(children, null);
    }

    get level() {
        return -1;
    }

    toString(space = '    ') {
        return this._children.map(c => c.toString(space)).join("\n");
    }
}

class TextNode extends Node {
    /**
     *
     * @param {string} value
     * @param {NodeWithChildren} parent
     */
    constructor(value, parent) {
        super(parent);
        this.value = value;
    }

    toString(space="    ") {
        return space.repeat(this.level) + this.value;
    }
}

/**
 * @brief line with relative indent level
 */
class LineNode extends TextNode {
    constructor(value = '', parent = null) {
        super(value, parent);
    }
}

/**
 * @brief node of open, close string and children lines with relative indent level
 */
class WrapNode extends NodeWithChildren {
    /**
     *
     * @param {number} level
     * @param {string} value
     * @param {[string]} children
     */
    constructor(openChar = '', closeChar = '', children = [], parent=null) {
        super(children, parent);
        this.open = openChar;
        this.close = closeChar;
        // children.map(c => this._children.push(new LineNode(c, this)));
    }

    toString(space = "    ") {
        return [
            space.repeat(this.level) + this.open,
            this.children.map(c => c.toString(space)).join('\n'),
            space.repeat(this.level) + this.close
        ].join('\n');
    }
}


/**
 * @brief node of open, close string and children lines with absolute indent level
 */
class AbsWrapNode extends WrapNode {
    constructor(level = 0, openChar = '', closeChar = '', children = []) {
        super(openChar, closeChar, children, null);
        this._level = level;
    }

    get level() {
        return this._level;
    }

    set level(value) {
        this._level = value;
    }
}

/**
 * @brief line and following by children with absolute indent level
 */
class WrapLineNode extends WrapNode {
    /**
     *
     * @param {number} level
     * @param {string} value
     * @param {[string]} children
     */
    constructor(level = 0, value, children = []) {
        super(level, value, '', children);
    }
}

/**
 * @brief line and following by children with absolute indent level
 */
class AbsWrapLineNode extends AbsWrapNode {
    /**
     *
     * @param {number} level
     * @param {string} value
     * @param {[string]} children
     */
    constructor(level = 0, value, children = []) {
        super(level, value, '', children);
    }
}

module.exports = {  NodeWithChildren, Node, Document, LineNode, WrapLineNode, AbsWrapLineNode, WrapNode, AbsWrapNode }