import ModelClass from "core/Model";


class BlogComment extends ModelClass {
    constructor() {
        super('blog_comment', {
            // id: {
            // },
            content: {
                type: String,
            },
            user: {
                relation: 'blog_user',
                required: true
            },
            post: {
                relation: 'blog_post',
                required: true

            }
        })

    }
}

export default new BlogComment;