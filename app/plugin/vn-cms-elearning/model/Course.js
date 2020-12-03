import ModelClass, { TYPE } from "../../vn-cms-core/Model.js";
class Course extends ModelClass{
    constructor(){
        super('elearning_course', {
            name: {
                type: String,
                required: true,
                // unique: true
            },
            teacher: {
                relation: 'elearning_teacher',
                required: true
            },
            price: Number,
            description: String,
            open_date: Date,
            cover: String,
            type: {
                enum: ['offline', 'online'],
                default: 'offline'
            },
            content: [
                {
                    name: String,
                    content: String
                }
            ],
            required: [
                {
                    name: String
                }
            ],
            formula: [
                {
                    name: String
                }
            ],
            schedule: {
                struct: {
                    start: Date,
                    time: String
                }
            },
        } )

        this.restFulTagName = 'Elearning API'
    }
}

export default new Course;