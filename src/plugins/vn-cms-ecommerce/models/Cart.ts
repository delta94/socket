import ModelClass from "core/Model";
import { TableName } from "..";


class Cart extends ModelClass {
    constructor() {
        super(TableName.Cart, {
            user: {
                required: true,
                relation: 'user'
            },
            amount: Number,
            first_name: String,
            last_name: String,
            email: String,
            phone: String,
            address: String,
            products: {
                relation: TableName.Product,
                multi: true
            },
            product_number: {},
            subtotal: Number,
            tax: Number,
            shipping: Number
        })
    }
}

export default new Cart;