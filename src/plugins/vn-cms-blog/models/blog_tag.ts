import ModelClass from "core/Model";


class BlogTag extends ModelClass {
    constructor() {
        super('blog_tag', {
            // id: {
            //     type: Number,
            //     unique: true
            // },
            title: {
                type: String,
                required: true
            },
            slug: {
                type: String,
                required: true,
                unique: true
            }
        })

    }
}

export default new BlogTag;