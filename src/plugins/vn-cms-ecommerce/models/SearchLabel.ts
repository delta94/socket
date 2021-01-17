import ModelClass from "core/Model";
import { TableName } from "..";


class SearchLabel extends ModelClass {
    constructor() {
        super(TableName.SearchLabel, {
            name: {
                type: String,
                required: true,
                // unique: true
            },
            category: {
                relation: TableName.Category
            },
            attribute: {
                relation: TableName.Attribute,
                multi: true
            },
            order: Number
        })
    }
}

export default new SearchLabel;