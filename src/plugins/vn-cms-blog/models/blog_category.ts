import ModelClass from "../../../core/Model";


class BlogCategory extends ModelClass {
    constructor() {
        super('blog_category', {
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

export default new BlogCategory;