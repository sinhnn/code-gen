const { Javascript } = require("../lib/lang/javascript");
const { ClassSpec, PropertyInfo } = require('../lib/spec.js');

function __test_js__() {
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

__test_js__();