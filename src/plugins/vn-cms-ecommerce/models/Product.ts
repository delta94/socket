import ModelClass from "core/Model";
import { TableName } from "..";


class Product extends ModelClass {
    constructor() {
        super(TableName.Product, {
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
                relation: TableName.Store
            },
            brand: {
                relation: TableName.Brand
            },
            category: {
                relation: TableName.Category
            },
            taxonomies: {
                relation: TableName.Taxonomy,
                multi: true
            }

        })
    }
}

export default new Product;