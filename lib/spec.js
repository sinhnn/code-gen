
const _ = {};

class NotImplemented extends Error {
    constructor() { super("NotImplemented"); }
}

class NotSupported extends Error {
    constructor() { super("NotSupported"); }
}

/**
 * @brief class contains `parent` member
 */
class Node {
    constructor(parent) {
        this._parent = parent;
    }

    get parent() {
        return this._parent;
    }

    set parent(value) {
        this._parent = value;
    }
}


/**
 * @brief class contain `children`
 */
class _Parent
{
    constructor(children=[]) {
        this._children = children;
    }

    get children() {
        return this._children;
    }

    /**
     * 
     * @param {Node} child 
     */
    addChild(child) {
        child.parent = this;
        this._children.push(child);
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

    get children() {
        return this._children;
    }

    /**
     * 
     * @param {Node} child 
     */
    addChild(child) {
        child.parent = this;
        this._children.push(child);
    }
}

/**
 * @brief root document
 */
class Document extends _Parent {
    constructor(children=[]) {
        super(children);
    }

    get level() {
        return -1;
    }

    toString(space = '    ') {
        return this._children.map(c => c.toString(space)).join("\n");
    }
}

class Text {
    constructor(value) {
        this.value = value;
    }

    toString() {
        return this.value;
    }
}

class _BaseLine extends Text {
    constructor(value = '') {
        super(value);
    }

    get level() {
        throw new NotImplemented();
    }

    toString(space = "    ") {
        return space.repeat(this.level) + this.value;
    }
}

/**
 * @brief line with absolute indent level
 */
class Line extends _BaseLine {
    constructor(level = 0, value = '') {
        super(value);
        this._level = level;
    }

    get level() {
        return this._level;
    }
}

/**
 * @brief line with relative indent level
 */
class LineNode extends _BaseLine {
    constructor(value = '', parent = null) {
        super(value);
        this.parent = parent;
    }

    get level() {
        return this.parent.level + 1;
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

    get level() {
        return this.parent.level + 1;
    }

    set level(value) {
        throw new NotImplemented();
        return;
    }

    addChild(value) {
        if (typeof (value) === "string") {
            this.children.push(new LineNode(value, this));
        } else if ('parent' in value) {
            value.parent = this;
            this.children.push(value);
        } else {
            throw NotSupported();
        }
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


/**
 * @brief language
 */
class Language {
    constructor() {

    }
}

/**
 * @brief class specification
 */
class ClassSpec {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties.map(p => { p.parent = this; return p; });
    }
}


/**
 * @brief property specification
 */
class PropertyInfo {
    constructor(name, type, defaultValue = null, parent = null, meta = {}) {
        this.name = name;
        this.type = type;
        this.defaultValue = defaultValue;
        this.parent = parent;
        this.meta = meta; // contain other information to help non build-in features
    }

    to__doxygen(tag, parent = null) {
        return new LineNode(` * @${tag} {${this.type}} ${this.name}`, parent);
    }

    to__doxygen_param(parent = null) {
        return this.to__doxygen('param', parent);
    }

    to__doxygen_return(parent = null) {
        return this.to__doxygen('returns', parent);
    }
}


module.exports = { NodeWithChildren, Node, Document, Line, LineNode, WrapLineNode, AbsWrapLineNode, WrapNode, AbsWrapNode, Language, ClassSpec, PropertyInfo }