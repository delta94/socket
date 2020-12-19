import Model from '../../core/Model'

// const { ObjectID } = mongodb;
class Message extends Model {
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

        super('message', {
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


export default new Message;