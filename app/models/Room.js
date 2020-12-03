import Model, { TYPE } from '../../core/Model.js'

class Room extends Model{
    // fields = {
    //     name: String,
    //     people: [
    //         {
    //             relation: 'user',
    //             struct: ['name', '_id', 'avatar']
    //         }
    //     ],
    //     type: {
    //         type: TYPE.Enum('post', 'room', 'private')
    //     },
    //     creator: {
    //         relation: 'user',
    //         struct: ['name', 'avatar']
    //     }
    // }
    // name = 'room'
    constructor(){

        super('room', {
            name: String,
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
                required: true,
                validate: {
                    required: 'User is require'
                }
            }
        });
    }
}


export default new Room;