const { Language, PropertyInfo, ClassSpec, Line } = require("../spec.js");

class Sqlite3 extends Language {

    constructor() {
        super();
    }

    /**
     * @brief to table createment query
     * @param {ClassSpec} spec 
     */
    to__table(spec, level=0) {
        const lines = [new Line(level, `CREATE TABLE IF NOT EXIST "${spec.name}" (`)];
        lines.push(...spec.properties.map(p => new Line(level + 1, `"${p.name}" ${p.type}${p.meta.post ? " " + p.meta.post : ""},`)));
        lines.push(new Line(level + 1, `PRIMARY KEY("id" AUTOINCREMENT)`))
        lines.push(new Line(level, `)`));
        return lines;
    }

    /**
     * @brief to insert query
     * @param {*} spec 
     */
    to__insert(spec) {

    }
}


function __test__() {
    const args = {
        'lang': 'javascript',
        'in': 'sample_object.json',
    };

    const classSpec = new ClassSpec('Post', [
        new PropertyInfo('id', 'INTEGER', null, null, {'post': "NOT NULL"}),
        new PropertyInfo('url', 'TEXT', null, null, {'post': "NOT NULL UNIQUE"}),
        new PropertyInfo('title', 'TEXT', null, null, {}),
        new PropertyInfo('categories', 'TEXT', null, null, {}),
        new PropertyInfo('tags', 'TEXT', null, null, {}),
        new PropertyInfo('modified_at', 'INTEGER', null, null, {}),
        new PropertyInfo('brief', 'TEXT', null, null, {}),
        new PropertyInfo('raw', 'TEXT', null, null, {'post': "NOT NULL"}),
        new PropertyInfo('content', 'TEXT', null, null, {}),
    ]);

    const js = new Sqlite3();
    console.log(js.to__table(classSpec).join("\n"));
}

__test__();

module.exports = { Sqlite3 }