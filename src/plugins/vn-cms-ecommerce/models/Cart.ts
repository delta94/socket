import ModelClass from "core/Model";


class Cart extends ModelClass{
    constructor(){
        super('ecommerce_cart', {
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
                relation: 'ecommerce_product',
                multi: true
            },
            product_number: {},
            subtotal: Number,
            tax: Number,
            shipping: Number
        } )
    }
}

export default new Cart;