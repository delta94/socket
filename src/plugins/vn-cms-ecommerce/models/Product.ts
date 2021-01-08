import ModelClass from "core/Model";
import { TableName } from "..";


class Product extends ModelClass {
    constructor() {
        super(TableName.Product, {
            id: {
                type: Number,
                required: true,
                unique: true
            },
            sku: {
                type: String,
                unique: true,
                required: true
            },
            // badges: [],
            brand_name: {
                type: String,
            },
            brand: {
                relation: TableName.Brand
            },
            // categories: {
            //     relation: TableName.Category
            // },
            categories: Number,
            current_seller: {
                relation: TableName.Seller
            },
            description: String,
            discount: Number,
            discount_rate: Number,
            // images: [],
            inventory_status: String,
            name: {
                type: String,
                required: true,
                // unique: true
            },
            other_sellers: {
                relation: TableName.Seller,
                multi: true
            },
            price: Number,
            real_price: Number,
            price_usd: Number,
            rating_average: Number,
            review_count: Number,
            short_description: String,
            // specifications: [],
            stock_item: {},
            thumbnail_url: String,
            // top_features: [],
            type: String,
            slug: {
                type: String,
                unique: true,
                required: true
            }



            // stock: Boolean,
            // fresh: Number,
            // delivery_day: Number,
            
            // image: [],
            // star: Number,
            // // price: {
            // //     type: Number,
            // //     required: true
            // // },
            // currency: {
            //     enum: ["usd", "vnđ"],
            //     default: "vnđ"
            // },
            
            // reviews: [],
            // faq: [],
            
            
            
            // taxonomies: {
            //     relation: TableName.Taxonomy,
            //     multi: true
            // }

        })
    }
}

export default new Product;