const { NotSupported } = require("../error.js");
const {  VisibilityType, Document, NodeWithChildren, Language, PropertyInfo, ClassSpec, AbsWrapNode, LineNode, WrapNode, MethodInfo } = require("../spec.js");

class Typescript extends Language
{
    constructor() {
        super();
    }

    /**
     *
     * @param {ClassSpec} spec
     * @returns {[WrapNode]}
     */
    to__interface(spec) {
        if (this.validate(spec) === false) {
            throw new NotSupported();
        }
        let s = spec.name;
        if (Array.isArray(spec.basedOn) && spec.basedOn.length > 0) {
            s += ` extends ${spec.basedOn[0].name}`;
        }
        const n = new WrapNode(`export interface ${s} { `, '}',
            [
                spec.properties.map(p => `${p.name}${p.nullable ? "?":""}: ${p.type};`),
                spec.methods.map(p => this.to__method(p))
            ].flat()
        );
        return n;
    }

    /**
     *
     * @param {MethodInfo} spec
     */
    to__method(spec) {
        return new LineNode(`${spec.name} (${spec.ins.map(p => p.name + ":" + p.type).join(",")}) : ${spec.out.type};`)
    }


    /**
     *
     * @param {ClassSpec} spec
     * @returns {Record<string, WrapNode>}
     */
    to__interface_dict(spec, recursive=true, tree={}) {
        if(!this.validate(spec)) { throw new NotSupported(); }
        if (spec in tree) { return tree[spec.name];}
        if (Array.isArray(spec.basedOn) && spec.basedOn.length > 0) {
            if (recursive === true) {
                for(const c of spec.basedOn) {
                    this.to__interface_dict(c, recursive, tree);
                }
            }
        }
        tree[spec.name] = this.to__interface(spec);
        return tree;
    }
}



module.exports = {Typescript}


function test() {
    const d = new Document();
    const l = new Typescript();

    const c = new ClassSpec('Post', [
        new PropertyInfo('title', 'string', '', null, {}, true),
        new PropertyInfo('excerpt', 'string', '', null, {}, true),
        new PropertyInfo('content', 'string', '', null, {}, true),
        new PropertyInfo('categories', '[string|number]|null', '', null, {}, true),
        new PropertyInfo('tags', '[string|number]|null', '', null, {}, true),
    ]);

    const r = new ClassSpec('RemotePost', [
        new PropertyInfo('url', 'string', '', null, {}, false),
    ], [c]);

    const w = new ClassSpec('WPAPIPost', [
        new PropertyInfo('id', 'string', '', null, {}, false),
    ], [r]);

    const sitetype = new ClassSpec('SiteType',
        [
            // new MethodInfo('pull', [new PropertyInfo('cb', '()')])
            new PropertyInfo('pull_as_property', '(cb: (post: RemotePost) => any, numberThread:number, context:object) => void'),

            // new MethodInfo('pull', []),
        ],
        [],
        VisibilityType.Public,
        [
            new MethodInfo('pull',
            [
                new PropertyInfo('callback', '(post:RemotePost) => void'),
                new PropertyInfo('numberThread', 'number'),
                new PropertyInfo('conext', 'object'),
            ],
            new PropertyInfo('', 'void')
        )
        ]
    );

    for(const s of Object.values(l.to__interface_dict(w, true))) { d.addChild(s); }
    d.addChild(l.to__interface(sitetype));
    console.log(d.toString());
}

test();