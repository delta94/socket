import Model, { TYPE } from '../../core/Model.js'
class User extends Model{
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
        super('user', {
            // id: Number,
            total_coin_current: Number,
            student_type: String,
            review: String,
            avatar:{},
            skype: String,
            email: {
                type: String,
                required: true,
                index: true,
                unique: true,
                // validate: {
                //     unique: 'Email has exists, please use another email'
                // }
            },
            phone: String,
            title: {
                type: String,
                required: true,
                // index: true
                // unique: true

            },
            password: String,
            // password: {
            //     Type: TYPE.Hash
            // },
        } )
    }
}

export default new User;