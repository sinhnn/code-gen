const {Javascript} = require("../lib/lang/javascript");
const {ClassSpec, PropertyInfo, Document} = require("../lib/spec");
const data = require("./data");


(function __test__() {
    const doc = new Document();
    const lang = new Javascript();
    for(const spec of data.specs) {
        doc.addChild(lang.to__class(spec));
    }
    console.log(doc.toString());
}) ();

