import ModelClass from "core/Model";
import { TableName } from "..";


class Category extends ModelClass {
    constructor() {
        super(TableName.Category, {
            id: {
                type: Number,
                required: true,
                unique: true
            },
            title: {
                type: String,
                required: true,
                // unique: true
            },
            slug: {
                type: String,
                required: true,
                unique: true
            },
            parent: {
                relation: TableName.Category
            }
        })
    }
}

export default new Category;