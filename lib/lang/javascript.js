const { NodeWithChildren, Language, PropertyInfo, ClassSpec, AbsWrapNode, LineNode, WrapNode } = require("../spec.js");

class Javascript extends Language {

    constructor() {
        super();
    }

    /**
     * @brief value to type of value
     * @param {any} value
     * @return {string}
     */
    toType(value) {
        return null;
    }

    /**
     *
     * @param {ClassSpec} spec
     * @returns  {WrapNode}
     */
    to__class(spec) {
        const name = spec.name;
        const properties = spec.properties;
        const n = new WrapNode(`class ${name} {`, "}", []);
        n.addChild(this.to__constructor(properties));
        properties.map(p => {
            n.addChild('');
            this.to__getter(p).map(l => n.addChild(l));
            n.addChild('');
            this.to__setter(p).map(l => n.addChild(l));
        });
        return n;
    }

    /**
     *
     * @param {[PropertyInfo]} properties
     * @returns {WrapNode}
     */
    to__constructor(properties) {
        const b = new WrapNode(`constructor (${properties.map(p => p.name).join(", ")}) {`,
            "}",
            properties.map(p => `this._${p.name} = ${p.name};`)
        );
        b.addChild("this.__modified = []; // list of modified properties");
        return b;
    }

    /**
     *
     * @param {[PropertyInfo]} ins
     * @param {[PropertyInfo]} out
     * @returns {[LineNode]}
     */
    to__doxygen(ins, out) {
        const lines = [
            new LineNode("/**"),
            new LineNode(" *"),
            new LineNode(" * @brief"),
            new LineNode(" *"),
        ];
        if (ins) ins.map(p => lines.push(p.to__doxygen_param()));
        if (out) lines.push(out.to__doxygen_return());
        lines.push(new LineNode(" */"));
        return lines;
    }

    /**
     *
     * @param {PropertyInfo} property
     * @returns {[LineNode]}
     */
    to__getter(property) {
        const lines = this.to__doxygen(null, property);
        lines.push(new WrapNode(`get ${property.name}() {`, '}', [`return this._${property.name};`]));
        return lines;
    }

    /**
     *
     * @param {[PropertyInfo]} property
     * @returns {[LineNode]}
     */
    to__setter(property) {
        const lines = this.to__doxygen([property], new PropertyInfo(property.parent.name, property.parent.name, null));
        lines.push(new WrapNode(`set ${property.name}(${property.name}) {`,
            '}',
            [
                `this._${property.name} = ${property.name};`,
                `this.__modified.push("${property.name}");`,
                "return this;"
            ]
        ));
        return lines;
    }
}

module.exports = { Javascript };
