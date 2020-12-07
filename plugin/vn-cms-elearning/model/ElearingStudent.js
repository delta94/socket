import ModelClass, { TYPE } from "../../../core/Model.js";

class ElearingUser extends ModelClass{
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
    constructor(){
        super('elearning_student', {
            id: {
                unique: true,
            },
            total_coin_current: Number,
            student_type: String,
            review: String,
            avatar: {

            },
            skype: String,
            email: String,
            phone: String,
            title: String,
            password: String
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
        } )

        this.restFulTagName = 'Elearning API'
    }

    
}

export default new ElearingUser;