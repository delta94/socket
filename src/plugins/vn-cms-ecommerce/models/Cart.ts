import ModelClass from "core/Model";
import { ObjectID } from "mongodb";
import { TableName } from "..";


class Cart extends ModelClass {
    constructor() {
        super(TableName.Cart, {
            user: {
                required: true,
                relation: 'user'
            },
            amount: Number,
            total: Number,
            shippingFee: Number,
            shippingSelected: {
                enum: ['giao_nhanh', 'giao_thuong']
            },

            vat: Number,
            paymentMethod: {
                enum: ['money', 'creditCard', 'paypal', 'bitcoin'],
                default: 'money'
            },
            // list: [],
            name: String,
            phone: String,
            email: String,
            address: String,
            note: String,
            status: {
                enum: ['cart', 'order', 'confirm', 'finish'],
                default: 'cart'
            }
        })
    }


    public getCartFromUser(user: any) {
        // if(ObjectID.isValid(user)) user = new ObjectID(user)
        return this.findOne({ match: { user: user._id } });
    }
}

export default new Cart;