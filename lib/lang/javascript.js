const { Language, PropertyInfo, ClassSpec, Line } = require("../spec.js");

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
     * @param {number} level 
     * @returns 
     */
    to__class(spec, level = 0) {
        const name = spec.name;
        const properties = spec.properties;
        const lines = [];
        lines.push(new Line(level, `class ${name}`))
        lines.push(new Line(level, `{`))
        lines.push(...(this.to__constructor(properties, level + 1)));
        properties.map(p => {
            lines.push(new Line());
            lines.push(...(this.to__getter(p, level + 1)));
            lines.push(new Line());
            lines.push(...(this.to__setter(p, level + 1)));
        })
        lines.push(new Line(level, `}`))
        return lines;
    }

    to__sqlite(spec, level = 0) {
        const lines = [];
        return lines;
    }

    to__constructor(properties, level = 1) {
        const lines = [];
        lines.push(new Line(level, `constructor (${properties.map(p => p.name).join(", ")}) {`));
        properties.map(p => lines.push(new Line(level + 1, `this._${p.name} = ${p.name};`)));
        lines.push(new Line(level + 1, `this.__modified = []; // list of modified properties`))
        lines.push(new Line(level, `}`));
        return lines;
    }

    /**
     * 
     * @param {[PropertyInfo]} property 
     * @param {number} level 
     * @returns 
     */
    to__doxygen(ins, out, level = 0) {
        const lines = [];
        lines.push(new Line(level, "/**"));
        lines.push(new Line(level, " * @brief"));
        if (ins) ins.map(p => lines.push(p.to__doxygen_param(level)));
        if (out) lines.push(out.to__doxygen_return(level));
        lines.push(new Line(level, " */"));
        return lines;
    }

    /**
     * 
     * @param {PropertyInfo} property 
     * @param {*} level 
     * @returns 
     */
    to__getter(property, level = 2) {
        const lines = this.to__doxygen(null, property, level);
        lines.push(new Line(level, `get ${property.name}() { return this._${property.name}; }`));
        return lines;
    }

    to__setter(property, level = 2) {
        // const lines = this.to__doxygen([property], null, level);
        const lines = this.to__doxygen([property], new PropertyInfo(property.parent.name, property.parent.name, null), level);
        lines.push(new Line(level, `set ${property.name}(${property.name}) { this._${property.name} = ${property.name}; this.__modified.push("${property.name}"); return this; }`));
        return lines;
    }
}

module.exports = { Javascript };

function __test__() {
    const args = {
        'lang': 'javascript',
        'in': 'sample_object.json',
    };

    const classSpec = new ClassSpec('Post', [
        new PropertyInfo('id', 'integer'),
        new PropertyInfo('url', 'string'),
        new PropertyInfo('title', 'string'),
        new PropertyInfo('categories', 'string'),
        new PropertyInfo('tags', 'string'),
        new PropertyInfo('modified_at', 'integer'),
        new PropertyInfo('brief', 'string'),
        new PropertyInfo('raw', 'string'),
        new PropertyInfo('content', 'string'),
    ]);

    const js = new Javascript();
    console.log(js.to__class(classSpec).join("\n"));
}