import ModelClass from "../../../core/Model.js";


class BlogUser extends ModelClass{
    constructor(){
        super('blog_user', {
            // id: {
            //     type: Number,
            //     unique: true
            // },
            name: {
                type: String
            },
            email: {
                type: String,
                unique: true,
                required: true
            },
            avatar: {
                type: String,
            }
        } )

    }
}

export default new BlogUser;