const {PHP} = require("../lib/lang/php");
const {ClassSpec, PropertyInfo, Document} = require("../lib/spec");
const fs = require('fs');
const data = require("./data");

(function __test__() {

    const doc = new Document();
    doc.addChild("<?php");
    const lang = new PHP();
    for(const spec of data.specs) {
        doc.addChild(lang.to__class(spec));
    }
    fs.writeFileSync('results/results.php', doc.toString());
}) ();

