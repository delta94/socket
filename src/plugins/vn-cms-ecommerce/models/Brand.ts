import ModelClass from "core/Model";
import { TableName } from "..";


class Brand extends ModelClass{
    constructor(){
        super(TableName.Brand, {
            name: {
                type: String,
                required: true,
                // unique: true
            },
            category: {
                relation: TableName.Category
            }
        } )
    }
}

export default new Brand;