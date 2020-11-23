import ModelClass from "../../vn-cms-core/Model.js";


class Cart extends ModelClass{
    constructor(){
        super('ecommerce_cart', {
            user_id: {
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
                realtion: 'ecommerce_product',
                multi: true
            },
            subtotal: Number,
            tax: Number,
            shipping: Number
        } )

        this.restFulTagName = 'Ecommerce API'
    }
}

export default new Cart;