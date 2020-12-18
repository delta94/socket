import ModelClass from "../../../core/Model.js";


class BlogPost extends ModelClass{
    constructor(){
        super('blog_post', {
            // id: {
            //     type: Number,
            //     unique: true
            // },
            author: {
                relation: 'blog_author'
            },
            slug: {
                type: String,
                unique: true
            },
            title: {
                type: String
            },
            description: {
                type: String
            },
            content: {
                type: String
            },
            published_at: {
                type: Date
            },
            cover: {
                type: String
            },
            time_read: {
                type: Number
            },
            tags: {
                relation: 'blog_tag',
                multi: true
            },
            categories: {
                relation: 'blog_category',
                multi: true
            }
        } )

    }
}

export default new BlogPost;