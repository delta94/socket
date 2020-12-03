import ModelClass, { TYPE } from "../../../core/Model.js";


class Register extends ModelClass{
    constructor(){
        super('elearning_register', {
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