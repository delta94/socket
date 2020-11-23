import ModelClass from "../../vn-cms-core/Model.js";


class Teacher extends ModelClass{
    constructor(){
        super('elearnig_teacher', {
            name: {
                type: String,
                required: true,
                // unique: true
            },
            avatar: String
        } )

        this.restFulTagName = 'Elearning API'
    }
}

export default new Teacher;