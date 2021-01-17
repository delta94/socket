import ModelClass from "core/Model";
import { TableName } from "..";


class Seller extends ModelClass {
    constructor() {
        super(TableName.Seller, {
            id: {
                type: Number,
                required: true,
                unique: true
            },
            is_best_store: {
                type: Boolean,
                default: false
            },
            slug: {
                required: true,
                unique: true
            },
            logo: {
                type: String
            },
            name: {
                type: String,
                required: true,
                index: true,
                unique: true
            },
            password: {
                type: String,
                default: '123456789'
            }
        })
    }
}

export default new Seller;