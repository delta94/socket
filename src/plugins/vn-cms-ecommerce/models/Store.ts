import ModelClass from "core/Model";
import { TableName } from "..";


class Store extends ModelClass{
    constructor(){
        super(TableName.Store, {
            name: {
                type: String,
                required: true,
                index: true,
                unique: true
            },
            slug: {
                required: true,
                unique: true
            },
            avatar: {
                type: String,
            },
            user: {
                relation: 'user'
            }
        } )
    }
}

export default new Store;