const { NotSupported } = require("../error.js");
const {  VisibilityType, Document, NodeWithChildren, Language, PropertyInfo, ClassSpec, AbsWrapNode, LineNode, WrapNode, MethodInfo, AbsLineNode } = require("../spec.js");

class PHP extends Language
{
    /**
 * @returns {string} single line comment
 */
    get singleLineComment() {
        return "//";
    }

    /**
     * @returns {Pair<string, string>} start & close string
     */
    get blockComment() {
        return ["/*", "*/"]
    }

    to_private_member_name(property) {
        return `$_${property.name}`;
    }

    to_private_member_def(property) {
        return `${this.private_key} ${property.type} ${this.to_private_member_name(property)};`;
    }

    to_protected_member_name(property) {
        return `$_${property.name}`;
    }

    to_protected_member_def(property) {
        return `${this.protected_key} ${property.type} ${this.to_protected_member_name(property)};`;
    }

    to_public_member_name(property) {
        return `$${property.name}`;
    }

    to_public_member_def(property) {
        return `${this.public_key} ${property.type} ${this.to_protected_member_name(property)};`;
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
        spec.properties.forEach(property => n.addChild(this.to_private_member_def(property)));
        n.addChild(this.to_private_member_def(new PropertyInfo('modified', 'array')))
        n.addChild(this.to__constructor(properties));
        properties.map(p => {
            this.to__getter(p).map(l => n.addChild(l));
            this.to__setter(p).map(l => n.addChild(l));
        });
        n.addChildren(this.to__to_array(spec));
        n.addChildren(this.to__from_array(spec));
        n.addChildren(this.to__from_stdClass(spec));
        return n;
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
     * @param {[PropertyInfo]} properties
     * @returns {WrapNode}
     */
    to__constructor(properties) {
        const b = new WrapNode(`public function __constructor (${properties.map(p => p.type + " $" + p.name).join(", ")}) {`,
            "}",
            properties.map(p => `$this->_${p.name} = $${p.name};`)
        );
        b.addChild("$this->_modified = array(); // list of modified properties");
        return b;
    }

    /**
     *
     * @param {PropertyInfo} property
     * @returns {[LineNode]}
     */
    to__getter(property) {
        const lines = this.to__doxygen(null, property);
        lines.push(new WrapNode(`function ${this.to__getter_name(property)}() : ${property.type} {`, '}', [
            `return array_key_exists("${property.name}", $this->_modified) ? $this->_modified["${property.name}"] : $this->${this.to_private_member_name(property).replace('$_', '_')};`
        ]));
        return [new AbsLineNode(), lines].flat();
    }

    /**
     *
     * @param {[PropertyInfo]} property
     * @returns {[LineNode]}
     */
    to__setter(property, parent=null) {
        const lines = this.to__doxygen([property]);
        lines.push(new WrapNode(`function ${this.to__setter_name(property)}(${property.type} $${property.name}) {`,
            '}',
            [
                `$this->_modified["${property.name}"] = $${property.name};`,
            ]
        ));
        return [new AbsLineNode(), lines].flat();
    }

    /**
     *
     * @param {ClassSpec} class
     * @returns {WrapNode}
     */
    to__to_array(spec) {
        const properties = spec.properties;
        const lines = this.to__doxygen(null, new PropertyInfo('array', 'array'));
        const n = new WrapNode(`function to_array() : array {`, '}', []);
        const s = new WrapNode("$results = array(", ");", properties.map(p => `"${p.name}" => $this->${this.to__getter_name(p)}(),`), n);
        n.addChild('return $results;')
        return  [new AbsLineNode(), lines, n].flat();
    }

    /**
     *
     * @param {ClassSpec} class
     * @returns {WrapNode}
     */
    to__from_array(spec) {
        const properties = spec.properties;
        const lines = this.to__doxygen(null, new PropertyInfo(spec.name, spec.name));
        const n = new WrapNode(`${this.public_key} static function from_array(array $data) : ${spec.name} {`, '}', [
            `return new ${spec.name}(${properties.map(p => '$data["' + p.name + '"]').join(", ")});`
        ]);
        return  [new AbsLineNode(), lines, n].flat();
    }

    /**
     *
     * @param {ClassSpec} class
     * @returns {WrapNode}
     */
    to__from_stdClass(spec) {
        const properties = spec.properties;
        const lines = this.to__doxygen(null, new PropertyInfo(spec.name, spec.name));
        const n = new WrapNode(`${this.public_key} static function from_stdclass(\\stdClass $data) : ${spec.name} {`, '}', [
            `return new ${spec.name}(${properties.map(p => '$data->' + p.name + '').join(", ")});`
        ]);
        return  [new AbsLineNode(), lines, n].flat();
    }
}

module.exports = {PHP}