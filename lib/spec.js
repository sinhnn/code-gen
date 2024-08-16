
const { NotImplemented, NotSupported } = require('./error');
const {  NodeWithChildren, Node, Document, LineNode, WrapLineNode, AbsWrapLineNode, WrapNode, AbsWrapNode } = require('./node')

const InheritanceType = {
    NoSupport: 0,
    SingleInheritance: 1,
    MultipleInheritance: 2
}

/**
 * @brief language
 */
class Language {
    constructor() {

    }

    /**
     * @returns {string} single line comment
     */
    get singleLineComment() {
        throw NotImplemented();
    }

    /**
     * @returns {Pair<string, string>} start & close string
     */
    get blockComment() {
        throw NotImplemented();
    }

    /**
     * @return {InheritanceType}
     */
    get supportedInheritanceType() {
        throw NotImplemented();
    }

    /**
     * @brief validate the class spec
     * @param {ClassSpec} spec
     * @returns {boolean}
     */
    validate(spec) {
        return true;
    }
}
const VisibilityType = {
    Private: 0,
    Protected: 1,
    Public: 2,
}

const ReadWriteMode = {
    ReadOnly: 0,
    Writeable: 1,
}

/**
 * @brief class specification
 */
class ClassSpec {
    /**
     *
     * @param {string} name
     * @param {[PropertyInfo]} properties
     * @param {[ClassSpec]} basedOn
     * @param {VisibilityType} visibility
     * @param {[MethodInfo]} methods
     */
    constructor(name, properties, basedOn = [], visibility=VisibilityType.Public, methods=[]) {
        this.name = name;
        this._properties = properties.map(p => { p.parent = this; return p; });
        this._basedOn = basedOn;
        this.visibility = visibility;
        this.methods = methods;
    }

    /**
     * @returns {[PropertyInfo]}
     */
    get properties() {
        return this._properties;
    }

    /**
     * @returns {[ClassSpec]}
     */
    get basedOn() {
        return this._basedOn;
    }
}

/**
 *
 */
class ItemInfo
{
    constructor(name, brief, description) {
        this.name = name;
        this.brief = brief;
        this.description = description;
    }
}

/**
 * @brief property specification
 */
class PropertyInfo extends ItemInfo {
    constructor(name, type, defaultValue = null, parent = null, meta = {}, nullable = false,
        visibility = VisibilityType.Public,
        readWriteMode = ReadWriteMode.Writeable,
        brief=null, description=null) {
        super(name, brief, description)
        this.type = type;
        this.defaultValue = defaultValue;
        this.parent = parent;

        this.meta = meta; // contain other information to help non build-in features
        this.nullable = nullable;
        this.visibility = visibility;
        this.readWriteMode = readWriteMode;
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


class MethodInfo extends ItemInfo
{
    /**
     *
     * @param {string} name
     * @param {[PropertyInfo|MethodInfo]} ins
     * @param {PropertyInfo} out
     */
    constructor(name, ins, out, brief=null, description=null) {
        super(name, brief, description);
        this.ins = ins;
        this.out = out;
    }
}

module.exports = { VisibilityType, MethodInfo, NodeWithChildren, Node, Document, LineNode, WrapLineNode, AbsWrapLineNode, WrapNode, AbsWrapNode, Language, ClassSpec, PropertyInfo }