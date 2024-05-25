const { Javascript } = require("../lib/lang/javascript");
const { ClassSpec, PropertyInfo } = require('../lib/spec.js');

function __test_js__() {
    const args = {
        'lang': 'javascript',
        'in': 'sample_object.json',
    };

    const specs  = [
        new ClassSpec('Post', [
            new PropertyInfo('id', 'integer'),
            new PropertyInfo('url', 'string'),
            new PropertyInfo('title', 'string'),
            new PropertyInfo('categories', 'string'),
            new PropertyInfo('tags', 'string'),
            new PropertyInfo('modified_at', 'integer'),
            new PropertyInfo('brief', 'string'),
            new PropertyInfo('raw', 'string'),
            new PropertyInfo('content', 'string'),
        ]),
        new ClassSpec('NormalizedPost', [
            new PropertyInfo('url', 'string'),
            new PropertyInfo('content', 'string'),
            new PropertyInfo('title', 'string'),
            new PropertyInfo('categories', 'string'),
            new PropertyInfo('tags', 'string'),
            new PropertyInfo('meta', 'object')
        ]),
    ];
    const js = new Javascript();
    for(const spec of specs) {
        console.log(js.to__class(spec).join("\n"));
    }

}

__test_js__();