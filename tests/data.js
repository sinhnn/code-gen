
const {ClassSpec, PropertyInfo} = require("../lib/spec");

module.exports = {
    'specs':[
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
    ]
}