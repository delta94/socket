import mongodb from 'mongodb';
import Model from '../plugin/vn-cms-core/Model.js'

// const { ObjectID } = mongodb;

class Chat extends Model {
    // name = 'chat';
    // fields = {
    //     comment: String,
    //     uid: {
    //         relation: 'user'
    //     },
    //     to: {
    //         // type: ObjectID,
    //         relation: 'room',
    //         required: true
    //     }
    // }

    constructor() {

        super('chat', {
            comment: String,
            from: {
                relation: 'user',
                required: true,
                validate: {
                    required: 'uid is required',
                }
            },
            to: {
                // type: ObjectID,
                relation: 'room',
                required: true,
                validate: {
                    required: 'to is required',
                }
            }
        });
    }
}


export default new Chat;