import ModelClass from "../../../core/Model.js";


class Teacher extends ModelClass{
    constructor(){
        super('elearning_teacher', {
            id: Number,
            title: String,
            email: String,
            avatar: {},
            position: String,
            description: String
            // name: {
            //     type: String,
            //     required: true,
            //     // unique: true
            // },
            // avatar: String,
            // introduce: String
        } )

        this.restFulTagName = 'Elearning API'
    }
}

export default new Teacher;