
const _ = {};

/**
 * @brief line informartion
 */
class Line {
    constructor(level=0, value='') {
        this.level = level;
        this.value = value;
    }

    toString(space="    "){
        return space.repeat(this.level) + this.value;
    }
}

/**
 * @brief line with following children line
 */
class LineWithChildren extends Line {
    /**
     * 
     * @param {number} level 
     * @param {string} value 
     * @param {[string]} children 
     */
    constructor(level=0, value='', children=[]) {
        super(level, value);
        this.level = level;
        this.value = value;
        this.children = children.map(c => new Line(level + 1, c));
    }

    add(value) {
        this.children.push(new Line(this.level + 1, value));
    }

    toString(space="    "){
        return super.toString(space) + '\n' + this.children.map(c => c.toString(space)).join('\n');
    }
}


/**
 * @brief wrap line with open and close string
 */
class WrapWithChildren {
    /**
     * 
     * @param {number} level 
     * @param {string} value 
     * @param {[string]} children 
     */
    constructor(level=0, openChar='', closeChar='', children=[]) {
        this.open = new Line(level, openChar);
        this.close = new Line(level, closeChar);
        this.children = children.map(c => new Line(level + 1, c));
        this.level = level;
    }

    add(value) {
        this.children.push(new Line(this.level + 1, value));
    }

    toString(space="    "){
        return [this.open.toString(space), this.children.map(c => c.toString(space)).join('\n'), this.close.toString(space)].join('\n');
    }
}



/**
 * @brief language
 */
class Language
{
    constructor() {

    }
}

/**
 * @brief class specification
 */
class ClassSpec {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties.map(p => {p.parent = this; return p;});
    }
}


/**
 * @brief property specification
 */
class PropertyInfo {
    constructor(name, type, defaultValue=null, parent=null, meta={}) {
        this.name = name;
        this.type = type;
        this.defaultValue = defaultValue;
        this.parent = parent;
        this.meta = meta; // contain other information to help non build-in features
    }

    to__doxygen(tag, level=0) {
        return new Line(level, ` * @${tag} {${this.type}} ${this.name}`);
    }

    to__doxygen_param(level=0) {
        return this.to__doxygen('param', level);
    }

    to__doxygen_return(level=0) {
        return this.to__doxygen('returns', level);
    }
}


module.exports = {Line, LineWithChildren, WrapWithChildren, Language, ClassSpec, PropertyInfo}