import Model from 'core/Model'
class User extends Model {
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
        super('user', {
            // id: Number,
            avatar: String,
            email: {
                type: String,
                required: true,
                index: true,
                unique: true,
                pattern: 'email'
                // validate: {
                //     unique: 'Email has exists, please use another email'
                // }
            },
            phone: String,
            name: {
                type: String,
                required: true,
                // index: true
                // unique: true

            },
            password: String,
            type: {
                enum: ['github', 'gmail', 'facebook', 'normal']
            }
            // password: {
            //     Type: TYPE.Hash
            // },
        })
    }
}

export default new User;