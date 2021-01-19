import { TableName } from "..";
import ModelClass from "../../../core/Model";

class Student extends ModelClass {
    // fields = {
    //     name: {
    //         type: String,
    //         required: true
    //     },
    //     email: {
    //         type: String
    //     },
    //     password: {
    //         Type: TYPE.Hash
    //     },
    //     avatar: {
    //         Type: String
    //     }
    // }
    // name = 'user'
    constructor() {
        super(TableName.Student, {
            id: {
                type: Number,

                unique: true
            }
            // total_coin_current: {
            //     type: Number
            // },
            // student_type: {
            //     type: String
            // },
            // review: {
            //     type: String
            // },
            // skype: {
            //     type: String
            // },
            // email: {
            //     type: String
            // },
            // phone: {
            //     type: String
            // },
            // title: {
            //     type: String
            // },
            // password: {
            //     type: String
            // },
            // user: {
            //     relation: 'user',
            //     required: true
            // }
            // name: {
            //     type: String,
            //     required: true,
            //     // index: true
            //     // unique: true

            // },
            // email: {
            //     type: String,
            //     required: true,
            //     index: true,
            //     unique: true,
            //     // validate: {
            //     //     unique: 'Email has exists, please use another email'
            //     // }
            // },
            // gender: {
            //     enum: ['male', 'female'],
            //     required: true,
            // },
            // password: {
            //     Type: TYPE.Hash
            // },
            // avatar: {
            //     Type: String
            // }
        })

    }


}

export default new Student;