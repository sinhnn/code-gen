const { Document, Language, PropertyInfo, ClassSpec, Line, WrapNode, LineNode } = require("../spec.js");

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


function __test__() {
    const args = {
        'lang': 'javascript',
        'in': 'sample_object.json',
    };

    const classSpec = new ClassSpec('SyncedPost', [
        new PropertyInfo('id', 'INTEGER'),
        new PropertyInfo('src', 'TEXT'),
        new PropertyInfo('title', 'TEXT'),
        new PropertyInfo('brief', 'TEXT'),
        new PropertyInfo('content', 'TEXT'),
        new PropertyInfo('categories', 'TEXT'),
        new PropertyInfo('tags', 'TEXT'),
        new PropertyInfo('featured_media', 'TEXT'),
    ]);

    const d = new Document();
    const lang = new Sqlite3();

    d.addChild(lang.to__table(classSpec));
    d.addChild(lang.to__insert(classSpec));
    d.addChild(lang.to__insert_dict(classSpec));
    d.addChild(lang.to__insertIgnore(classSpec));
    
    console.log(d.toString());
    
    // console.log(js.to__table(classSpec).join("\n"));
    // console.log(js.to__insert(classSpec).join("\n"));
    // console.log(js.to__insert_2(classSpec).join("\n"));
}

__test__();

module.exports = { Sqlite3 }