import ModelClass from 'core/Model'

class Room extends ModelClass {
    constructor() {

        super('room', {
            name: String,
            slug: {
                type: String,
                unique: true
            },
            people: {
                relation: 'user',
                multi: true
            },
            type: {
                enum: ['post', 'room', 'private'],
                default: 'private'
            },
            creator: {
                relation: 'user',
            }
        });
    }
}


export default new Room;