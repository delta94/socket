import ModelClass from "core/Model";
import { TableName } from "..";


class Category extends ModelClass{
    constructor(){
        super(TableName.Category, {
            name: {
                type: String,
                required: true,
                // unique: true
            },
            slug: {
                required: true,
                unique: true
            },
            parent: {
                relation: TableName.Category
            }
        } )
    }
}

export default new Category;