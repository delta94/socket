import ModelClass from "core/Model";


class BlogAuthor extends ModelClass {
    constructor() {
        super('blog_author', {
            // id: {
            //     type: Number,
            //     unique: true
            // },
            title: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true,
                unique: true
            },
            birthday: {
                type: String
            },
            avatar: {
                type: String
            }
        })

    }
}

export default new BlogAuthor;