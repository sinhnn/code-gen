const { Document, Language, PropertyInfo, ClassSpec, WrapNode, LineNode } = require("../spec.js");

class Sqlite3 extends Language {

    constructor() {
        super();
    }

    /**
     * @brief to table createment query
     * @param {ClassSpec} spec
     * @returns {WrapNode}
     */
    to__table(spec) {
        const n = new WrapNode(
            `CREATE TABLE IF NOT EXISTS "${spec.name}" (`,
            ');',
            spec.properties.map(p => `"${p.name}" ${p.type}${p.meta.post ? " " + p.meta.post : ""},`)
        );
        return n;
    }

    /**
     * @brief to insert query
     * @param {ClassSpec} spec
     * @returns {LineNode}
     */
    to__insert(spec) {
        const names = spec.properties.map(p => p.name);
        return new LineNode(`INSERT INTO \`${spec.name}\` (${names.map(n => "`" + n + "`").join(",")}) VALUES (${names.map(p => "?").join(",")});`);
    }

    /**
     * @brief to insert query
     * @param {ClassSpec} spec
     * @returns {LineNode}
     */
    to__insert_dict(spec) {
        const names = spec.properties.map(p => p.name);
        return new LineNode(`INSERT INTO \`${spec.name}\` (${names.map(n => "`" + n + "`").join(",")}) VALUES (${names.map(p => "@" + p).join(",")});`);
    }

    /**
     * @brief to insert query
     * @param {ClassSpec} spec
     * @returns {LineNode}
     */
    to__insertIgnore(spec) {
        const names = spec.properties.map(p => p.name);
        return new LineNode(`INSERT IGNORE INTO \`${spec.name}\` (${names.map(n => "`" + n + "`").join(",")}) VALUES (${names.map(p => "@" + p).join(",")});`);
    }
}


module.exports = { Sqlite3 }