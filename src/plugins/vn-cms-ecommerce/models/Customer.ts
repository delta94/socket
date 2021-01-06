import ModelClass from "core/Model";
import { TableName } from "..";


class Customer extends ModelClass {
    constructor() {
        super(TableName.Customer, {
            id: {
                type: Number,
                required: true,
                unique: true
            },
            avatar_url: String,
            full_name: String,
            
            password: {
                type: String,
                default: '123456789'
            },
            // user: {
            //     relation: 'user',
            //     required: true
            // },
            address: [{
                name: String,
                address: String,
                phone: String
            }],

        })
    }
}

export default new Customer;