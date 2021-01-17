import ModelClass from "core/Model";
import { TableName } from '..';

class Attribute extends ModelClass {
    constructor() {
        super(TableName.Attribute, {
            name: {
                type: String,
                required: true,
                // unique: true
            },
            cateogory: {
                required: true,
                relation: TableName.Category
            },
            search: {
                default: false,
                type: Boolean
            },
        })
    }
}

export default new Attribute;