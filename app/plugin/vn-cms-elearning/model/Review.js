import ModelClass from "../../vn-cms-core/Model.js";


class Review extends ModelClass{
    constructor(){
        super('elearnig_review', {
            content: {
                type: String,
                required: true,
                // unique: true
            },
            user: {
                relation: 'user',
                required: true
            }
        } )

        this.restFulTagName = 'Elearning API'
    }
}

export default new Review;