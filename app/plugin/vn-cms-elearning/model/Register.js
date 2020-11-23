import ModelClass, { TYPE } from "../../vn-cms-core/Model.js";


class Register extends ModelClass{
    constructor(){
        super('elearnig_register', {
            user: {
                relation: 'user',
                required: true
                // unique: true
            },
            course: {
                relation: 'elearning_course'
            },
            confirm: {
                enum: [true, false],
                default: false
            }
        } )

        this.restFulTagName = 'Elearning API'
    }
}

export default new Register;