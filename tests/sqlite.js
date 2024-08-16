
const {Sqlite3} = require("../lib/lang/sqlite3");
const {ClassSpec, PropertyInfo, Document} = require("../lib/spec");
const data = require("./data");


function __test__() {
    const doc = new Document();
    const lang = new Sqlite3();
    for(const spec of data.specs) {
        doc.addChild(lang.to__table(spec));
        doc.addChild(lang.to__insert(spec));
        doc.addChild(lang.to__insert_dict(spec));
        doc.addChild(lang.to__insertIgnore(spec));
    }
    console.log(doc.toString());
}

__test__();