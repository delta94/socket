import ModelClass from "../../../core/Model";


class Teacher extends ModelClass {
    constructor() {
        super('elearning_teacher', {
            id: {
                type: Number,
                unique: true
            },
            website: String,
            avatar: {},
            description: String,
            position: String,
            slug: {
                type: String,
                unique: true
            },
            title: String,
            // email: {
            //     type: String,
            //     unique: true
            // },
            // name: {
            //     type: String,
            //     required: true,
            //     // unique: true
            // },
            // avatar: String,rs
            // introduce: String
        })

        this.restFulTagName = 'Elearning API'
    }
}

export default new Teacher;