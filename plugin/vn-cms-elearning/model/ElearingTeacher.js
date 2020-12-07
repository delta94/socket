import ModelClass from "../../../core/Model.js";


class Teacher extends ModelClass{
    constructor(){
        super('elearning_teacher', {
            id: {
                unique: true,
            },
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