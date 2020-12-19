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
            store_id: {
                relation: 'ecommerce_store'
            },
            brand_id: {
                relation: 'ecommerce_brand'
            }

        } )

        this.restFulTagName = 'Ecommerce API'
    }
}

export default new Product;