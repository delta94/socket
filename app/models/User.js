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
            name: {
                type: String,
                required: true,
                // index: true
                // unique: true

            },
            email: {
                type: String,
                required: true,
                index: true,
                unique: true,
                // validate: {
                //     unique: 'Email has exists, please use another email'
                // }
            },
            gender: {
                enum: ['male', 'female'],
                required: true,
            },
            password: {
                Type: TYPE.Hash
            },
            avatar: {
                
            }
        } )
    }
}

export default new User;