
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


module.exports = {Line, Language, ClassSpec, PropertyInfo}