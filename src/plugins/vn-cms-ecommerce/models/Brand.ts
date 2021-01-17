import ModelClass from "core/Model";
import { TableName } from "..";


class Brand extends ModelClass {
    constructor() {
        super(TableName.Brand, {
            id: {
                type: Number,
                required: true,
                unique: true
            },
            name: {
                type: String,
                required: true,
                // unique: true
            },
            slug: {
                type: String,
                unique: true
            },
            // category: {
            //     relation: TableName.Category,
            //     required: true
            // }
        })
    }
}

export default new Brand;