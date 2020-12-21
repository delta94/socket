import ModelClass from "core/Model";


class Message extends ModelClass {
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