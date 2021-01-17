import md5 from 'md5'
import Model from 'core/Model'
import Token from './Token'

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
            avatar: {},
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
                enum: ['github', 'gmail', 'facebook']

            },
            gender: {
                enum: ['male', 'female']
            },
            birthday: {
                type: Number
            },
            confirm: {
                type: Boolean,
                default: false
            },
            // password: {
            //     Type: TYPE.Hash
            // },
        })
    }


    public async login(findObject: { email: string, password: string }): Promise<{ data?: any, error?: any }> {
        let { email, password } = findObject;

        email = email.toLowerCase();

        password = md5(password)
        let { data, error } = await this.findOne({ match: { email, password } })

        if (data) {

            delete data.password;
            data.token = await Token.create(data)

            return { data }
        } else if (error) {
            return { error }
        } else {
            return { error: 'Username hoặc passowrd không đúng' }
        }
    }

    public async register(dataObj: any): Promise<{ data?: any, error?: any }> {
        let { email, password } = dataObj;

        email = email.toLowerCase();

        dataObj.password = md5(password)

        let check = await this.findOne({ match: { email } })
        if (check.data) {
            return { error: 'Email đã tồn tại, vui lòng chọn email khác' }
        }

        let register = await this.insertOne(dataObj);
        if (register.data) {

            let token = await Token.create(register.data)


            delete register.data.password
            return {
                data: {
                    ...register.data,
                    token
                },
            }
        }

        return register

    }


    public async updateInfo(user: any): Promise<{ data?: any, error?: any }> {
        let { name, password, phone, changePassword, gender, birthday, oldPassword } = user;

        let udpateData: any = { name, phone, gender, birthday };

        if (changePassword) {
            password = md5(password)
            udpateData.password = password;

            let result = await this.findOne({ match: { _id: user._id, password: md5(oldPassword) } })
            console.log(result.data)
            if (!result.data) {
                return { error: 'Mật khẩu cũ không đúng.' }
            }

        }

        let result = await this.updateOne({ _id: user._id }, udpateData)

        return result;
    }

}

export default new User;