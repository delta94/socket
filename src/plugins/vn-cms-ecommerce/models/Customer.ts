import ModelClass from "core/Model";
import { TableName } from "..";


class Customer extends ModelClass {
    constructor() {
        super(TableName.Customer, {
            user: {
                relation: 'user',
                required: true
            },
            address: [{
                name: String,
                address: String,
                phone: String
            }],

        })
    }
}

export default new Customer;