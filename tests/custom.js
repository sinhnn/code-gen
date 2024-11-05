const {PHP} = require("../lib/lang/php");
const {ClassSpec, PropertyInfo, Document} = require("../lib/spec");
const fs = require('fs');
const data = require("./data");


class CustomPHP extends PHP {
    to__getter_name(property) {
        return `${property.name}`;
    }

    to__setter_name(property) {
        return `set_${property.name}`;
    }
}

(function __test__() {

    const doc = new Document();
    doc.addChild("<?php");
    const lang = new CustomPHP();
    for(const spec of data.specs) {
        doc.addChild(lang.to__class(spec));
    }
    fs.writeFileSync('results/results.custom.php', doc.toString());
}) ();
