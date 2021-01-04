import ModelClass from "core/Model";


class Product extends ModelClass {
    constructor() {
        super('ecommerce_product', {
            sku: {
                type: String,
                unique: true,
                required: true
            },
            stock: Boolean,
            fresh: Number,
            delivery_day: Number,
            name: {
                type: String,
                required: true,
                // unique: true
            },
            image: [],
            star: Number,
            price: {
                type: Number,
                required: true
            },
            currency: {
                enum: ["usd", "vnđ"],
                default: "vnđ"
            },
            short_description: String,
            main_description: String,
            
            reviews: [],
            faq: [],
            store: {
                relation: 'ecommerce_store'
            },
            brand: {
                relation: 'ecommerce_brand'
            },
            category: {
                relation: 'ecommerce_category'
            }

        })
    }
}

export default new Product;