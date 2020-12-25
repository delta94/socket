import ModelClass from "../../vn-cms-core/Model.js";


class Product extends ModelClass{
    constructor(){
        super('ecommerce_product', {
            name: {
                type: String,
                required: true,
                // unique: true
            },
            image: [
                {
                    type: String
                }
            ],
            price: {
                type: String,
                required: true
            },
            store: {
                relation: 'ecommerce_store'
            },
            brand: {
                relation: 'ecommerce_brand'
            }

        } )
    }
}

export default new Product;